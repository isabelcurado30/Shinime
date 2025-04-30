import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

@Injectable ({
    providedIn: 'root'
})

export class AnimeService {

    private BASE_URL = 'https://api.jikan.moe/v4';

    constructor (private http: HttpClient) {}

    // Buscar Animes por Nombre
    searchAnime (query: string, page: number = 1): Observable <any[]> {
        return this.http.get <any> (`${this.BASE_URL}/anime`, {
          params: {
            q: query,
            page: page.toString()
          }
        }).pipe(
          map(response => response.data) 
        );
      }

    // Obtener Detalles de un Anime
    getAnimeDetails (id: number): Observable <any> {
        return this.http.get (`${this.BASE_URL}/anime/${id}`);
    }

    // Obtener Episodios de un Anime
    getAnimeEpisodes (id: number, page: number = 1): Observable <any> {
        return this.http.get (`${this.BASE_URL}/anime/${id}/episodes`, {
            params: {
                page: page.toString()
            }
        });
    }

    // Obtener Recomendaciones del Anime
    getAnimeRecommendations (id: number): Observable <any> {
        return this.http.get (`${this.BASE_URL}/anime/${id}/recommendations`);
    }

    getTopAnimes (page: number = 1): Observable <any[]> {
        return this.http.get <any> (`${this.BASE_URL}/top/anime`, {
            params: {
                page: page.toString()
            }
        }).pipe(
            map(response => response.data) 
        );
    }
}