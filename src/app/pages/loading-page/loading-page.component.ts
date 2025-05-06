import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss']
})
export class LoadingPageComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/home']); // Cambia '/home' a tu ruta real
    }, 5000); // 5 segundos
  }
}
