import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user: any;
  iconos = {
    attackOnTitan: [
      'assets/img/icons/attack on titan/icon-annie.png',
      'assets/img/icons/attack on titan/icon-armin.png',
      'assets/img/icons/attack on titan/icon-conny.png',
      'assets/img/icons/attack on titan/icon-eren.png',
      'assets/img/icons/attack on titan/icon-hange.png',
      'assets/img/icons/attack on titan/icon-jean.png',
      'assets/img/icons/attack on titan/icon-levi.png',
      'assets/img/icons/attack on titan/icon-mikasa.png',
      'assets/img/icons/attack on titan/icon-reiner.png',
      'assets/img/icons/attack on titan/icon-sasha.png'
    ],
    blackClover: [
      'assets/img/icons/black clover/icon-asta.png',
      'assets/img/icons/black clover/icon-nero.png',
      'assets/img/icons/black clover/icon-noelle.png',
      'assets/img/icons/black clover/icon-yami.png',
      'assets/img/icons/black clover/icon-yuno.png'
    ],
    chainsawMan: [
      'assets/img/icons/chainsawman/icon-aki.jpeg',
      'assets/img/icons/chainsawman/icon-chainsawman.jpeg',
      'assets/img/icons/chainsawman/icon-denji.jpeg',
      'assets/img/icons/chainsawman/icon-himeno.jpeg',
      'assets/img/icons/chainsawman/icon-kishibe.jpeg',
      'assets/img/icons/chainsawman/icon-kobeni.jpeg',
      'assets/img/icons/chainsawman/icon-makima.jpeg',
      'assets/img/icons/chainsawman/icon-pochita.jpeg',
      'assets/img/icons/chainsawman/icon-power.jpeg'
    ],
    jujutsuKaisen: [
      'assets/img/icons/jujutsu kaisen/icon-gojo.png',
      'assets/img/icons/jujutsu kaisen/icon-itadori.png',
      'assets/img/icons/jujutsu kaisen/icon-megumi.png',
      'assets/img/icons/jujutsu kaisen/icon-nobara.png',
      'assets/img/icons/jujutsu kaisen/icon-sukuna.png'
    ]
  };

  iconoSeleccionado: string = '';
  mostrarSelector = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
  this.user = this.authService.obtenerUsuario();

if (!this.user || !this.user.icono || this.user.icono.trim() === '') {
  this.user = this.user || {}; // asegúrate de que no sea null
  this.user.icono = 'assets/img/icons/icon-predeterminado.png';
}

this.iconoSeleccionado = this.user.icono;

}



  logout() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  seleccionarIcono(icono: string): void {
    this.iconoSeleccionado = icono;
  }

  actualizarIcono(): void {
  if (!this.user || !this.iconoSeleccionado) return;

  this.cerrarModal();

  Swal.fire({
    title: '¿Actualizar Icono?',
    text: '¿Estás seguro de que quieres cambiar tu icono de perfil?',
    imageUrl: this.iconoSeleccionado,
    imageWidth: 100,
    confirmButtonText: 'Sí, actualizar',
    cancelButtonText: 'Cancelar',
    showCancelButton: true,
    reverseButtons: true,
    confirmButtonColor: '#82B8A8',
    cancelButtonColor: '#D33'
  }).then((result) => {
    if (result.isConfirmed) {
      const formData = new FormData();
      formData.append('action', 'updateIcono');
      formData.append('userId', this.user.id);
      formData.append('icono', this.iconoSeleccionado);

      this.authService.updateIcono(formData).subscribe({
        next: (res: any) => {
          console.log('💬 Respuesta del backend:', res);
          if (res.success) {
            this.user.icono = this.iconoSeleccionado;
            this.authService.guardarUsuario(this.user);
            Swal.fire('Actualizado', 'Tu icono ha sido cambiado correctamente', 'success');
          } else {
            Swal.fire('Error', 'No se pudo actualizar el icono', 'error');
          }
        },
        error: (err: any) => {
          console.error('Error al actualizar icono:', err);
          Swal.fire('Error del servidor', 'Inténtalo más tarde', 'error');
        }
      });
    }
  });
}


  editarPerfil(): void {
    console.log('Editar perfil aún no implementado');
  }

  cerrarModal(): void {
    this.mostrarSelector = false;
  }
}
