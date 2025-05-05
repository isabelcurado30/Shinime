import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component ({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit{

  trendingAnimes: any[] = [];
  newReleases: any[] = [];
  recommendedAnimes: any[] = [];
  topAnimes: any[] = [];

  constructor (private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTrending();
    this.loadNewReleases();
    this.loadRecommendations();
  }

  loadTrending() {
    this.http.get <any> ('https://api.jikan.moe/v4/top/anime').subscribe (response => {
      this.trendingAnimes = response.data.slice (0, 6);
    });
  }

  loadNewReleases() {
    this.http.get <any> ('https://api.jikan.moe/v4/seasons/now').subscribe (response => {
      this.newReleases = response.data.slice (0, 6);
    });
  }

  loadRecommendations() {
    this.http.get <any> ('https://api.jikan.moe/v4/recommendations/anime').subscribe (response => {
      this.recommendedAnimes = response.data.slice (0, 6).map ((rec: any) => rec.entry [0]);
    });
  }
}
