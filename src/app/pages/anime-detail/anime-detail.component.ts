import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnimeService } from "src/app/services/anime.service";
import { ListasService } from "src/app/services/listas.service";
import { StorageService } from "src/app/services/storage.service";
import { EpisodiosService } from "src/app/services/episodios.service";
import { DomSanitizer } from "@angular/platform-browser";
import Swal from "sweetalert2";

interface Genre {
  mal_id: number;
  name: string;
  type: string;
}

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  status: string;
  rating: string;
  episodes: number;
  images: {
    jpg: {
      image_url: string;
    };

    webp: {
      image_url: string;
    };
  };

  genres: Genre[];
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
}

@Component ({
  selector: "app-anime-detail",
  templateUrl: "./anime-detail.component.html",
  styleUrls: ["./anime-detail.component.scss"],
})

export class AnimeDetailComponent implements OnInit {
  animeId!: number;
  anime: Anime | null = null;
  loading = true;
  error = '';
  episodes: any[] = [];
  episodiosVistos: Set <number> = new Set();
  listasUsuario: any[] = [];
  userId: number = 0;
  trailerUrl: any = null;

  constructor (
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private listasService: ListasService,
    private storageService: StorageService,
    private episodiosService: EpisodiosService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    
    if (user) {
      this.userId = user.id;
    } else {
      Swal.fire ('Usuario No Logueado', 'Por Favor, Inicia Sesión para Ver Esta Página', 'warning');
      return;
    } // Fin Si

    this.animeId = Number (this.route.snapshot.paramMap.get ('id'));
    this.loadEpisodiosVistos();
    this.loading = true;
    this.loadAnime();

    this.listasService.getListasByUserId (this.userId).subscribe ({
      next: (listas) => {
        this.listasUsuario = listas;
      },

      error: () => {
        Swal.fire ('Error', 'No se Pudieron Obtener las Listas del Usuario', 'error');
      }
    });
  }

  loadEpisodiosVistos(): void {
    this.episodiosService.getWatchedEpisodes (this.userId, this.animeId).subscribe ({
      next: (ids) => {
        if (Array.isArray (ids)) {
          this.episodiosVistos = new Set (ids);
        } else {
          Swal.fire ('Advertencia', 'Respuesta Inesperada al Cargar Episodios Vistos', 'warning');
        } // Fin Si
      },

      error: () => {
        Swal.fire ('Error', 'No se Pudieron Obtener los Episodios Vistos', 'error');
      }
    });
  }

  toggleVisto (episodeId: number): void {
    if (this.episodiosVistos.has (episodeId)) {
      this.episodiosService.unmarkEpisode (this.userId, this.animeId, episodeId).subscribe (() => {
        this.episodiosVistos.delete (episodeId);
        Swal.fire ('Actualizado', 'Episodio Desmarcado como Visto', 'success');
      });
    } else {
      this.episodiosService.markEpisode (this.userId, this.animeId, episodeId).subscribe (() => {
        this.episodiosVistos.add (episodeId);
        Swal.fire ('Actualizado', 'Episodio Marcado como Visto', 'success');
      });
    } // Fin Si
  }

  loadAnime(): void {
    this.animeService.getAnimeDetails (this.animeId).subscribe ({
      next: (data) => {
        this.anime = data;

        if (data.trailer?.embed_url) {
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl (data.trailer.embed_url);
        } // Fin Si

        this.animeService.getAllEpisodes (this.animeId)
          .then ((episodes) => {
            this.episodes = episodes;
            this.loading = false;
          })

          .catch (() => {
            this.error = 'No se Pudieron Cargar los Episodios';
            this.loading = false;
            Swal.fire ('Error', 'No se Pudieron Cargar los Episodios', 'error');
          });
      },

      error: () => {
        this.error = 'No se Pudo Cargar la Información del Anime';
        this.loading = false;
        Swal.fire ('Error', 'No se Pudo Cargar la Información del Anime', 'error');
      }
    });
  }

  getGenres(): string {
    return this.anime?.genres?.map ((g: Genre) => g.name).join (', ') || '';
  }

  onListaSeleccionada (event: Event): void {
    const select = event.target as HTMLSelectElement;
    const listaId = parseInt (select.value, 10);
    this.agregarAnime (listaId);
  }

  agregarAnime (listaId: number): void {
    if (!this.anime) return;

    const listaSeleccionada = this.listasUsuario.find (lista => lista.id === listaId);

    if (!listaSeleccionada) {
      Swal.fire ('Error', 'No se Encontró la Lista Seleccionada', 'error');
      return;
    } // Fin Si

    const yaExiste = listaSeleccionada.animes?.some ((anime: any) => anime.mal_id === this.anime!.mal_id);

    if (yaExiste) {
      Swal.fire ({
        icon: 'info',
        title: 'Ya Está en la Lista',
        text: 'Este Anime ya Fue Añadido Previamente a esta Lista',
        confirmButtonColor: '#7ADBC8'
      });

      return;
    } // Fin Si

    const animeParaLista = {
      mal_id: this.anime.mal_id,
      titulo: this.anime.title,
      imagen: this.anime.images.jpg?.image_url
    };

    this.listasService.addAnimeToLista (listaId, animeParaLista).subscribe ({
      next: () => {
        Swal.fire ({
          icon: 'success',
          title: 'Añadido con Éxito',
          text: `El Anime Fue Añadido a la Lista Correctamente`,
          confirmButtonColor: '#7ADBC8'
        });

        listaSeleccionada.animes = listaSeleccionada.animes || [];
        listaSeleccionada.animes.push (animeParaLista);
      },

      error: () => {
        Swal.fire ('Error', 'No se Pudo Añadir el Anime a la Lista', 'error');
      }
    });
  }

  abrirSelectorDeLista(): void {
    if (!this.listasUsuario || this.listasUsuario.length === 0) {
      Swal.fire ('No Tienes Listas Creadas Aún', '', 'info');
      return;
    } // Fin Si

    const inputOptions = this.listasUsuario.reduce ((acc, lista) => {
      acc [lista.id] = lista.nombre;
      return acc;
    }, {} as Record <string, string>);

    Swal.fire ({
      title: 'Añadir a Una de tus Listas',
      input: 'select',
      inputOptions,
      inputPlaceholder: 'Selecciona una Lista',
      showCancelButton: true,
      confirmButtonColor: '#7ADBC8',
      cancelButtonColor: '#D6C6F2',
      confirmButtonText: 'Añadir',
      customClass: {
        popup: 'sweetalert-popup',
        input: 'sweetalert-select'
      }
    }).then (result => {
      if (result.isConfirmed && result.value) {
        const listaId = parseInt (result.value, 10);
        this.agregarAnime (listaId);
      }
    });
  }
}