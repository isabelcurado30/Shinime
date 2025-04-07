import { Component, OnInit } from "@angular/core";
import { AnimesService } from "../services/animes.service";

@Component ({
  selector: 'app-animes',
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss']
})

export class AnimesComponent implements OnInit {
  animes: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  isLoading: boolean = false;

  constructor (private animesService: AnimesService) {}

  ngOnInit(): void {
    this.loadAnimes();
  }

  // Cargar los Animes
  loadAnimes(): void {
    this.isLoading = true;
    this.animesService.getAnimes (this.searchQuery).subscribe ((data: any) => {
      this.animes = [...this.animes, ...data.data];
      this.isLoading = false;
    });
  }

  // Buscar Animes por Consulta
  searchAnimes(): void {
    if (this.searchQuery.trim()) {
      this.animesService.getAnimes (this.searchQuery).subscribe ((data: any) => {
        this.animes = data.data;
      });
    }
  }

  // Ver Detalles del Anime
  verDetalles (anime: any): void {
    console.log ('Detalles del Anime', anime);
  }
}