import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().subscribe(data => {
      this.user = data;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = '/login'; // redirige tras logout
    });
  }
}
