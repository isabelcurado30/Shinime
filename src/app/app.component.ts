import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { every } from 'rxjs';

@Component ({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  isIntroPage: boolean = false;

  constructor (private router: Router) {}

  ngOnInit() {
    // Detectar las Rutas y verificar si Estamos en la Intro
    this.router.events.subscribe (event => {
      if (event instanceof NavigationStart) {
        // Comprobar si la Ruta Es la de la Intro
        this.isIntroPage = event.url === '/';
      }
    });
  }
}
