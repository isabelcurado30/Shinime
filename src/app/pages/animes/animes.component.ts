import { Component, OnInit } from "@angular/core";
import { AnimeService } from "src/app/services/anime.service";
import { Router } from "@angular/router";
import { StorageService } from "src/app/services/storage.service";

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

  constructor (
    private animeService: AnimeService,
    private router: Router,
    private storageService: StorageService
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
}