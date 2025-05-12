import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from 'src/app/services/anime.service';
import { ListasService } from 'src/app/services/listas.service';
import { StorageService } from 'src/app/services/storage.service';

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
  listasUsuario: any[] = [];
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private listasService: ListasService,
    private storageService: StorageService
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
    this.loading = true;

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

    this.listasService.getListasByUserId(this.userId).subscribe({
      next: (listas) => {
        this.listasUsuario = listas;
      },
      error: (err) => console.error('❌ Error al obtener listas del usuario:', err)
    });
  }

  getGenres(): string {
    return this.anime?.genres?.map((g: Genre) => g.name).join(', ') || '';
  }

  onListaSeleccionada(event: Event) {
    const select = event.target as HTMLSelectElement;
    const listaId = parseInt(select.value, 10);
    this.agregarAnime(listaId);
  }
  
  agregarAnime(listaId: number) {
    if (!this.anime) return;
  
    this.listasService.addAnimeToLista(listaId, this.anime.mal_id).subscribe({
      next: () => alert('✅ Anime añadido a la lista'),
      error: (err) => console.error('❌ Error al añadir anime:', err)
    });
  }
  
}
