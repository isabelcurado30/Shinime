import { Component } from '@angular/core';
import { AnimeService } from 'src/app/services/anime.service';

@Component ({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})

export class AnimesComponent {
  query: string = '';
  animes: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor (private animeService: AnimeService) {}

  searchAnime() {
    if (!this.query.trim()) {
      this.error = 'Introduce un Anime para Buscar';
      return;
    } // Fin Si

    this.loading = true;
    this.error = '';

    this.animeService.searchAnime (this.query).subscribe ({
      next: (response) => {
        this.animes = response;
        this.loading = false;
      },

      error: (err) => {
        this.error = 'Error al Buscar el Anime';
        this.loading = false;
      }
    });
  }
}
