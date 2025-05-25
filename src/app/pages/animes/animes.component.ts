import { Component, OnInit } from "@angular/core";
import { AnimeService } from "src/app/services/anime.service";
import { Router } from "@angular/router";
import { StorageService } from "src/app/services/storage.service";
import { ListasService } from "src/app/services/listas.service";
import Swal from "sweetalert2";

@Component ({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})

export class AnimesComponent implements OnInit {
  query: string = '';
  animes: any[] = [];
  loading = false;
  error = '';

  genres: any[] = [];
  selectedGenre: number | null = null;

  listasUsuario: any[] = [];

  constructor (
    private animeService: AnimeService,
    private router: Router,
    private storageService: StorageService,
    private listasService: ListasService
  ) {}

  ngOnInit(): void {
    this.loadGenres();

    // Recuperar Última Búsqueda y Posición Scroll
    const { query, genero, posY} = this.storageService.getBusqueda();
    this.query = query;
    this.selectedGenre = genero;

    if (query || genero !== null) {
      this.searchAnime();
      setTimeout (() => {
        window.scrollTo ({ top: posY, behavior: 'smooth' });
      }, 100);
    } else {
      this.loadInitialAnimes();
    } // Fin Si

    const user = this.storageService.getUser();
    if (user) {
      this.listasService.getListasByUserId (user.id).subscribe ({
        next: (listas) => this.listasUsuario = listas,
        error: (err) => console.error ('Error al Obtener Listas del Usuario:', err)
      });
    }
  }

  loadGenres() {
    this.animeService.getGenres().subscribe ({
      next: (res) => this.genres = res,
      error: () => this.error = 'No se Pudieron Cargar los Géneros'
    });
  }

  loadInitialAnimes() {
    this.loading = true;
    this.animeService.getTopAnimes().subscribe ({
      next: (res) => {
        this.animes = res;
        this.loading = false;
      },

      error: () => {
        this.error = 'Error al Cargar Animes';
        this.loading = false;
      }
    });
  }

  searchAnime() {
    this.loading = true;
    this.error = '';

    const query = this.query.trim();

    if (!query && !this.selectedGenre) {
      this.loadInitialAnimes();
      return; 
    } // Fin Si

    this.animeService.searchAnime (query, 1, this.selectedGenre !== null ? this.selectedGenre : undefined).subscribe ({
      next: (res) => {
        this.animes = res;
        this.loading = false;
      },

      error: () => {
        this.error = 'Error al Buscar Animes';
        this.loading = false;
      }
    });
  }

  onGenreChange() {
    this.searchAnime();
  }

  goToDetail (id: number) {
    // Guardar Búsqueda y Scroll Antes de Navegar
    this.storageService.setBusqueda (this.query, this.selectedGenre, window.scrollY);
    this.router.navigate (['/animes', id]);
  }

  agregarAnimeLista (anime: any): void {
    if (!this.listasUsuario.length) {
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
        input: 'sweetalert-select',
      }
    }).then (result => {
      if (result.isConfirmed && result.value) {
        const listaId = parseInt (result.value, 10);

        const listaSeleccionada = this.listasUsuario.find (l => l.id === listaId);
        if (listaSeleccionada?.animes?.some ((a: any) => a.mal_id === anime.mal_id)) {
          Swal.fire ({
            icon: 'info',
            title: 'Ya Está en la Lista',
            text: 'Este Anime ya Fue Añadido Previamente a esta Lista',
            confirmButtonColor: '#7ADBC8'
          });

          return;
        }

        const animeParaLista = {
          mal_id: anime.mal_id,
          titulo: anime.title,
          imagen: anime.images.jpg.image_url
        };

        this.listasService.addAnimeToLista (listaId, animeParaLista).subscribe ({
          next: () => {
            Swal.fire ({
              icon: 'success',
              title: 'Añadido con Éxito',
              text: 'El Anime Fue Añadido a la Lista Correctamente',
              confirmButtonColor: '#7ADBC8'
            });

            // Actualizar Localmente
            listaSeleccionada.animes = listaSeleccionada.animes || [];
            listaSeleccionada.animes.push (animeParaLista);
          },

          error: () => {
            Swal.fire ('Error', 'No se Pudo Añadir el Anime a la Lista', 'error');
          }
        });
      }
    });
  }
}