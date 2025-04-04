import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchQuery: string = '';

  constructor (private router: Router) {}

  // Método para Buscar Animes
  searchAnimes(): void {
    if (this.searchQuery.length > 2) {
      this.router.navigate (['/search', { query: this.searchQuery}]);
    }
  }
}
