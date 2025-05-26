import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  nombre = '';
  password = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Si vino redirigido desde el AuthGuard, muestra alerta
    if (this.route.snapshot.queryParams['returnUrl']) {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para acceder a esta sección.',
        customClass: { popup: 'swal2-lexend' }
      });
    }
  }

  onSubmit() {
    this.authService.login(this.nombre, this.password).subscribe({
      next: res => {
        if (res.success) {
          this.authService.guardarSesion({
            id: res.id,
            nombre: res.nombre,
            icono: res.icono
          });

          Swal.fire({
            title: `¡Bienvenido/a, ${res.nombre}!`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });

          this.router.navigateByUrl(this.returnUrl);
        } else {
          Swal.fire('Error', res.message || 'Credenciales incorrectas', 'error');
        }
      },
      error: err => {
        Swal.fire('Error', err.error?.message || 'Error desconocido', 'error');
      }
    });
  }
}
