import { Component } from '@angular/core';
import { AnimesService } from '../services/animes.service';

@Component ({
  selector: 'app-reto-anual',
  templateUrl: './reto-anual.component.html',
  styleUrls: ['./reto-anual.component.scss']
})

export class RetoAnualComponent {
  animeCount: number = 0;
  animesVistos: any[] = [];
  retoIniciado: boolean = false;

  searchQuery: string = '';
  resultadosBusqueda: any[] = [];
  isLoading: boolean = false;

  constructor (private animesService: AnimesService) {}

  ngOnInit(): void {}

  // Iniciar el Reto con la Cantidad de Animes
  iniciarReto() {
    if (this.animeCount > 0) {
      this.retoIniciado = true;
    }
  }

  // Buscar Animes con la API
  buscarAnimes() {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.animesService.getAnimes (this.searchQuery).subscribe ((data: any) => {
        this.resultadosBusqueda = data.data;
        this.isLoading = false;
      });
    }
  }

  // Agregar un Anime desde la Búsqueda a la Lista de Vistos
  agregarAnime (anime: any) {
    if (!this.animesVistos.find (a => a.mal_id === anime.mal_id)) {
      this.animesVistos.push (anime);
    }
  }

  // Eliminar Anime Visto
  eliminarAnime (anime: any) {
    this.animesVistos = this.animesVistos.filter (a => a.mal_id !== anime.mal_id);
  }
}
