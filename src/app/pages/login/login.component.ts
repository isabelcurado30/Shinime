import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  nombre = '';
  password = '';
  mensaje = '';
  error = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.nombre, this.password).subscribe({
      next: res => {
        if (res.success) {
          this.authService.guardarSesion({ id: res.id, nombre: res.nombre });
          this.mensaje = `Bienvenido, ${res.nombre}`;
          this.error = '';
          // Puedes navegar a otra página aquí si quieres:
          // this.router.navigate(['/home']);
        } else {
          this.error = res.message || 'Credenciales incorrectas';
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
