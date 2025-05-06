import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  mensaje = '';
  error = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    const nuevoUsuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    };
  
    this.authService.registrar(nuevoUsuario).subscribe({
      next: res => {
        if (res?.message) {
          this.authService.guardarSesion({ id: res.id ?? 0, nombre: this.nombre }); // ← aquí se guarda la sesión
          this.mensaje = res.message;
          this.error = '';
        } else {
          this.error = 'Respuesta inesperada del servidor.';
          this.mensaje = '';
        }
      },
      error: err => {
        this.error = err.error?.message || 'Error desconocido';
        this.mensaje = '';
      }
    });
  }
}
