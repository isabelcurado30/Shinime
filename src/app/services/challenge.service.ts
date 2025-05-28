import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php';

  constructor(private http: HttpClient) {}

  getChallenge(userId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { action: 'getChallenge', user_id: userId });
  }

  getWatchedAnimes(userId: number): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, { action: 'getWatchedAnimes', user_id: userId });
  }

  addWatchedAnime(userId: number, anime: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      action: 'addWatchedAnime',
      user_id: userId,
      anime: anime
    });
  }

  resetChallenge(userId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      action: 'reset',
      user_id: userId
    });
  }
}
