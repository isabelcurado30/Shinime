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
    searchAnime (query: string, page: number = 1, genreId?: number): Observable <any[]> {
        const params: any = {
            page: page.toString()
        };
        
        // Sólo Añadir 'q' si Tiene Texto
        if (query.trim() !== '') {
            params.q = query.trim();
        } // Fin Si

        // Sólo Añadir 'genres' si Existe un Género
        if (genreId !== undefined) {
            params.genres = genreId.toString();
        } // Fin Si

        return this.http.get <any> (`${this.BASE_URL}/anime`, { params }).pipe (
            map (response => response.data)
        );
    }

    // Obtener Detalles de un Anime
    getAnimeDetails (id: number): Observable <any> {
        return this.http.get <any> (`${this.BASE_URL}/anime/${id}`).pipe (
            map (response => response.data)
        );
    }

    // Obtener Episodios de un Anime
    getAnimeEpisodes (animeId: number, page: number = 1): Observable <any> {
        return this.http.get <any> (`${this.BASE_URL}/anime/${animeId}/episodes`, {
            params: {
                page: page.toString()
            }
        }).pipe (
            map (response => response.data)
        );
    }

    // Obtener Recomendaciones del Anime
    getAnimeRecommendations (id: number): Observable <any> {
        return this.http.get (`${this.BASE_URL}/anime/${id}/recommendations`);
    }

    getTopAnimes (page: number = 1): Observable <any[]> {
        return this.http.get <any> (`${this.BASE_URL}/top/anime`, {
            params: { page: page.toString() }
        }).pipe (map (res => res.data));
    }

    getGenres(): Observable <any[]> {
        return this.http.get <any> (`${this.BASE_URL}/genres/anime`).pipe (map (res => res.data));
    }
}