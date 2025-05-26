import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php';

  constructor(private http: HttpClient) {}

  getChallenge(userId: number): Observable<any> {
    return this.http.post(this.apiUrl, {
      action: 'getByUserId',
      user_id: userId
    });
  }

  resetChallenge(userId: number, goal: number): Observable<any> {
    return this.http.post(this.apiUrl, {
      action: 'reset',
      user_id: userId,
      goal: goal
    });
  }

  updateProgress(userId: number, animeCount: number, animesVistos: any[]): Observable<any> {
    return this.http.post(this.apiUrl, {
      action: 'updateProgress',
      user_id: userId,
      animeCount,
      animesVistos
    });
  }

  addWatchedAnime(userId: number, anime: any): Observable<any> {
    return this.http.post(this.apiUrl, {
      action: 'addWatchedAnime',
      user_id: userId,
      anime
    });
  }

  getWatchedAnimes(userId: number): Observable<any[]> {
    return this.http.post<any[]>(this.apiUrl, {
      action: 'getWatchedAnimes',
      user_id: userId
    });
  }
}
