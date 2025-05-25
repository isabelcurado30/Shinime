import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from 'src/app/services/anime.service';
import { ListasService } from 'src/app/services/listas.service';
import { StorageService } from 'src/app/services/storage.service';
import { EpisodiosService } from 'src/app/services/episodios.service';
import Swal from 'sweetalert2';

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
}

@Component({
  selector: 'app-anime-detail',
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.scss']
})
export class AnimeDetailComponent implements OnInit {
  animeId!: number;
  anime: Anime | null = null;
  loading = true;
  error = '';
  episodes: any[] = [];
  episodiosVistos: Set<number> = new Set();
  listasUsuario: any[] = [];
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private listasService: ListasService,
    private storageService: StorageService,
    private episodiosService: EpisodiosService
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();

    if (user) {
      this.userId = user.id;
    } else {
      console.warn('⚠️ No hay usuario logueado');
      return;
    }

    this.animeId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEpisodiosVistos();
    this.loading = true;

    // Cargar detalles, episodios y temporadas relacionadas
    this.loadAnime();

    // Cargar listas del usuario
    this.listasService.getListasByUserId(this.userId).subscribe({
      next: (listas) => {
        this.listasUsuario = listas;
      },
      error: (err) => console.error('❌ Error al obtener listas del usuario:', err)
    });
  }

  loadEpisodiosVistos(): void {
  this.episodiosService.getWatchedEpisodes(this.userId, this.animeId).subscribe({
    next: (ids) => {
      if (Array.isArray(ids)) {
        this.episodiosVistos = new Set(ids);
      } else {
        console.warn('⚠️ Respuesta inesperada:', ids);
      }
    },
    error: (err) => {
      console.error('❌ Error al obtener episodios vistos:', err);
    }
  });
}


  toggleVisto(episodeId: number): void {
  if (this.episodiosVistos.has(episodeId)) {
    this.episodiosService.unmarkEpisode(this.userId, this.animeId, episodeId).subscribe(() => {
      this.episodiosVistos.delete(episodeId);
    });
  } else {
    this.episodiosService.markEpisode(this.userId, this.animeId, episodeId).subscribe(() => {
      this.episodiosVistos.add(episodeId);
    });
  }
}



  // ========================
  // Cargar detalles + episodios
  // ========================
  loadAnime(): void {
    this.animeService.getAnimeDetails(this.animeId).subscribe({
      next: (data) => {
        this.anime = data;

        this.animeService.getAllEpisodes(this.animeId)
          .then((episodes) => {
            this.episodes = episodes;
            this.loading = false;
          })
          .catch(() => {
            this.error = 'No se pudieron cargar los episodios';
            this.loading = false;
          });
      },
      error: () => {
        this.error = 'No se pudo cargar la información del anime';
        this.loading = false;
      }
    });
  }

  // ========================
  // Obtener géneros
  // ========================
  getGenres(): string {
    return this.anime?.genres?.map((g: Genre) => g.name).join(', ') || '';
  }

  // ========================
  // Selector de lista + añadir
  // ========================
  onListaSeleccionada(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const listaId = parseInt(select.value, 10);
    this.agregarAnime(listaId);
  }

  agregarAnime(listaId: number): void {
  if (!this.anime) return; // Salimos si no hay anime cargado

  // Buscar la Lista Seleccionada
  const listaSeleccionada = this.listasUsuario.find(lista => lista.id === listaId);

  if (!listaSeleccionada) {
    Swal.fire('Error', 'No se encontró la lista seleccionada', 'error');
    return;
  }

  // Comprobar si el Anime ya está en la Lista
  const yaExiste = listaSeleccionada.animes?.some((anime: any) => anime.mal_id === this.anime!.mal_id);

  if (yaExiste) {
    Swal.fire({
      icon: 'info',
      title: 'Ya está en la lista',
      text: 'Este Anime ya Fue Añadido Previamente a Esta Lista',
      confirmButtonColor: '#7ADBC8'
    });
    return;
  }

  // Crear un Objeto a Añadir
  const animeParaLista = {
    mal_id: this.anime.mal_id,
    titulo: this.anime.title,
    imagen: this.anime.images.jpg?.image_url
  };

  // Añadir al Backend
  this.listasService.addAnimeToLista(listaId, animeParaLista).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Añadido con éxito',
        text: 'El anime fue Añadido a la Lista Correctamente',
        confirmButtonColor: '#7ADBC8'
      });

      // Añadir al Array Local también para evitar recarga
      listaSeleccionada.animes = listaSeleccionada.animes || [];
      listaSeleccionada.animes.push(animeParaLista);
    },
    error: (err) => {
      console.error('Error al añadir anime:', err);
      Swal.fire('Error', 'No se Pudo Añadir el Anime a la Lista', 'error');
    }
  });
}


  abrirSelectorDeLista(): void {
    if (!this.listasUsuario || this.listasUsuario.length === 0) {
      Swal.fire('No tienes listas Creadas Aún', '', 'info');
      return;
    }

    const inputOptions = this.listasUsuario.reduce((acc, lista) => {
      acc[lista.id] = lista.nombre;
      return acc;
    }, {} as Record<string, string>);

    Swal.fire({
      title: 'Añadir a una de tus listas',
      input: 'select',
      inputOptions,
      inputPlaceholder: 'Selecciona una lista',
      showCancelButton: true,
      confirmButtonColor: '#7ADBC8',
      cancelButtonColor: '#D6C6F2',
      confirmButtonText: 'Añadir',
      customClass: {
        popup: 'sweetalert-popup',
        input: 'sweetalert-select'
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const listaId = parseInt(result.value, 10);
        this.agregarAnime(listaId);
      }
    });
  }
}
