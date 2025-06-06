import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component ({
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

  estadisticas = {
    listasCreadas: 0,
    progresoReto: 0,
  };

  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.obtenerUsuario();

    if (!this.user) {
      Swal.fire ({
        icon: 'warning',
        title: 'Acceso No Autorizado',
        text: 'Debes Iniciar Sesión para Acceder al Perfil',
        confirmButtonColor: '#82B8A8'
      }).then (() => {
        this.router.navigate (['/login']);
      });

      return;
    } // Fin Si

    if (!this.user.icono || this.user.icono.trim() === '') {
      this.user.icono = 'assets/img/icons/icon-predeterminado.png';
    } // Fin Si

    this.iconoSeleccionado = this.user.icono;

    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
  this.authService.getEstadisticas(this.user.id).subscribe({
    next: (res) => {
      console.log('Respuesta:', res); // ✅ te mostrará si llega null
      if (res && res.success) {
        this.estadisticas = res.data;
      } else {
        Swal.fire('Error', 'No se pudieron cargar tus estadísticas', 'error');
      }
    },
    error: (err) => {
      console.error('Error al conectar:', err);
      Swal.fire('Error', 'Error al conectar con el servidor', 'error');
    }
  });
}


  logout() {
    this.authService.cerrarSesion();
    this.router.navigate (['/login']);
  }

  seleccionarIcono (icono: string): void {
    this.iconoSeleccionado = icono;
  }

  actualizarIcono(): void {
    if (!this.user || !this.iconoSeleccionado) return;

    this.cerrarModal();

    Swal.fire ({
      title: '¿Actualizar Icono?',
      text: '¿Estás Seguro/a de que Quieres Cambiar tu Icono de Perfil?',
      imageUrl: this.iconoSeleccionado,
      imageWidth: 100,
      confirmButtonText: 'Sí, Actualizar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#82D8A8',
      cancelButtonColor: '#D33'
    }).then ((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append ('action', 'updateIcono');
        formData.append ('userId', this.user.id);
        formData.append ('icono', this.iconoSeleccionado);

        this.authService.updateIcono (formData).subscribe ({
          next: (res: any) => {
            console.log ('Respuesta del Backend:', res);
            if (res.success) {
              this.user.icono = this.iconoSeleccionado;
              this.authService.guardarUsuario (this.user);
              Swal.fire ('Actualizado', 'Tu Icono Ha Sido Cambiado Correctamente', 'success');
            } else {
              Swal.fire ('Error', 'No se Pudo Actualizar el Icono', 'error');
            } // Fin Si
          },

          error: (err: any) => {
            console.error ('Error al Actualizar Icono:', err);
            Swal.fire ('Error del Servidor', 'Inténtalo más Tarde', 'error');
          }
        });
      }
    });
  }

  cerrarModal(): void {
    this.mostrarSelector = false;
  }
}
