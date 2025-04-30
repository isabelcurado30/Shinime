import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from 'src/app/services/anime.service';

interface Genre {
  mal_id: number,
  name: string,
  type: string
}

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  score: number;
  status: string;
  episodes: number;
  images: {
    jpg: {
      image_url: string;
    }

    webp: {
      image_url: string;
    };
  };

  genres: Genre[];
}

@Component ({
  selector: 'app-anime-detail',
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.scss']
})

export class AnimeDetailComponent implements OnInit {

  animeId!: number;
  anime: Anime | null = null;
  loading = true;
  error = '';

  constructor (private route: ActivatedRoute, private animeService: AnimeService) {}

  ngOnInit(): void {
    this.animeId = Number (this.route.snapshot.paramMap.get ('id'));

    this.animeService.getAnimeDetails (this.animeId).subscribe ({
      next: (data) => {
        this.anime = data;
        this.loading = false;
      },

      error: () => {
        this.error = 'No se Pudo Cargar la Información del Anime';
        this.loading = false;
      }
    });
  }

  getGenres(): string {
    return this.anime?.genres?.map ((g: Genre) => g.name).join (', ') || '';
  }

}
