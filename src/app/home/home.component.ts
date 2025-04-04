import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  searchQuery: string = '';
  currentSlide: number = 0;

  ngOnInit() {
    setInterval(() => {
      this.nextSlide();
    }, 4000); // Cambia Cada 4 Segundos
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.animesDestacados.length;
  }

  animesDestacados = [
    { title: 'One Piece', image: 'assets/img/OnePieceEgghead.jpg' },
    { title: 'Jujutsu Kaisen', image: 'assets/img/JujutsuKaisenIncidenteShibuya.jpg' },
    { title: 'Attack on Titan', image: 'assets/img/AttackOnTitan.jpg' },
    { title: 'Demon Slayer', image: 'assets/img/DemonSlayer.jpg' }
  ];

  topAnimes = [
    { rank: 1, title: 'Fullmetal Alchemist Brotherhood', score: 9.1 },
    { rank: 2, title: 'Steins;Gate', score: 9.0 },
    { rank: 3, title: 'Gintama', score: 8.9 }
  ];

  buscarAnime() {
    if (this.searchQuery.trim()) {
      console.log (`Buscando: ${this.searchQuery}`);
      // Aquí Podemos Integrar la API de Jikan para Buscar Animes
    }
  }
}
