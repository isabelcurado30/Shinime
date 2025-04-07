import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable ({
  providedIn: 'root'
})

export class AnimesService {
  private baseUrl = 'https://api.jikan.moe/v4';

  constructor (private http: HttpClient) {}

  // Obtener los Animes más Populares
  getTopAnimes() {
    return this.http.get <any> (`${this.baseUrl}/top/anime?type=tv&limit=5`);
  }

  // Obtener las Películas más Populares
  getTopMovies() {
    return this.http.get <any> (`${this.baseUrl}/top/anime?type=movie&limit=5`);
  }

  // Obtener Animes por Búsqueda
  getAnimes (query: string): Observable <any> {
    if (query === '') {
      return this.http.get <any> (`${this.baseUrl}/top/anime?type=tv&limit=10`);
    } else {
      return this.http.get <any> (`${this.baseUrl}/anime?q=${query}&sfw=true&type=tv&limit=10`);
    }
  }

  // Obtener Películas por Búsqueda
  getMovies (query: string): Observable <any> {
    if (query === '') {
      return this.http.get <any> (`${this.baseUrl}/top/anime?type=movie&limit=10`);
    } else {
      return this.http.get <any> (`${this.baseUrl}/anime?q=${query}&sfw=true&type=movie&limit=10`);
    }
  }

  // Obtener Detalles de un Anime por ID
  getAnimeById (id: number): Observable <any> {
    return this.http.get <any> (`${this.baseUrl}/anime/${id}`);
  }
}