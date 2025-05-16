import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpisodiosService {

  private BACKEND_URL = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/episodios.php'; // ⚠️ Ajusta la ruta

  constructor(private http: HttpClient) {}

  getWatchedEpisodes(userId: number, animeId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.BACKEND_URL}?action=getWatchedEpisodes&user_id=${userId}&anime_id=${animeId}`);
  }

  markEpisode(userId: number, animeId: number, episodeId: number): Observable<any> {
    return this.http.post<any>(this.BACKEND_URL, {
      action: 'markEpisode',
      user_id: userId,
      anime_id: animeId,
      episode_id: episodeId
    });
  }

  unmarkEpisode(userId: number, animeId: number, episodeId: number): Observable<any> {
    return this.http.post<any>(this.BACKEND_URL, {
      action: 'unmarkEpisode',
      user_id: userId,
      anime_id: animeId,
      episode_id: episodeId
    });
  }
}
