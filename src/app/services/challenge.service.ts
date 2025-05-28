import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php';

  constructor(private http: HttpClient) {}

  getChallenge(userId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      action: 'getByUserId',
      user_id: userId,
    });
  }

  getWatchedAnimes(userId: number): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, {
      action: 'getWatchedAnimes',
      user_id: userId,
    });
  }

  addWatchedAnime(userId: number, anime: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      action: 'addWatchedAnime',
      user_id: userId,
      anime: anime,
    });
  }

  resetChallenge(userId: number): Observable<any> {
    console.log('[ChallengeService] resetChallenge llamado para userId:', userId);
    return this.http.post<any>(`${this.apiUrl}/reset`, { user_id: userId });
  }

  updateProgress(userId: number, animeCount: number, animesVistos: any[]): Observable<any> {
    const body = {
      action: 'updateProgress',      // <<-- IMPORTANTE
      user_id: userId,
      animeCount,
      animesVistos,
    };
    console.log('[ChallengeService] updateProgress llamado:', body);
    return this.http.post<any>(`${this.apiUrl}/updateProgress`, body);
  }
}
