import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";
import { ChallengeService } from "src/app/services/challenge.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-annual-challenge',
  templateUrl: './annual-challenge.component.html',
  styleUrls: ['./annual-challenge.component.scss']
})
export class AnnualChallengeComponent implements OnInit {
  animeCount = 0;
  retoIniciado = false;
  searchQuery = '';
  resultadosBusqueda: any[] = [];
  animesVistos: any[] = [];
  timeLeft = '';
  userId!: number;
  bloqueado = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private storageService: StorageService,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();

    if (!usuario) {
      this.bloqueado = true;
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'Debes Iniciar Sesión para Usar el Reto Anual',
        customClass: { popup: 'swal2-lexend' }
      });
      return;
    }

    this.userId = usuario.id;

    // Primero intento cargar del localStorage
    const retoLocal = this.storageService.getRetoAnual(this.userId);

    if (retoLocal) {
      this.animeCount = retoLocal.animeCount || 0;
      this.animesVistos = retoLocal.animesVistos || [];
      this.retoIniciado = this.animeCount > 0;
    } 

    // Luego sincronizo con backend para evitar desincronización
    this.challengeService.getChallenge(this.userId).subscribe((reto: any) => {
      if (reto) {
        this.retoIniciado = true;
        this.animeCount = reto.goal || this.animeCount;

        this.challengeService.getWatchedAnimes(this.userId).subscribe((animes: any[]) => {
          this.animesVistos = (animes || []).filter(anime => anime.titulo && anime.imagen);

          // Guardar en localStorage para tener sincronizado
          this.storageService.setRetoAnual(this.userId, {
            animeCount: this.animeCount,
            animesVistos: this.animesVistos
          });
        });
      }
    });

    this.actualizarTiempoRestante();
  }

  iniciarReto(): void {
    if (this.animeCount > 0) {
      this.retoIniciado = true;
      this.guardarEstado();
    }
  }

  restablecerReto(): void {
    Swal.fire({
      title: '¿Estás Seguro/a?',
      text: 'Esto Restablecerá tu Reto y se Perderá el Progreso Actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#76C7B7',
      cancelButtonColor: '#D33',
      confirmButtonText: 'Sí, Restablecer',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal2-lexend' }
    }).then(result => {
      if (result.isConfirmed) {
        // Limpia localStorage
        this.storageService.clearRetoAnual(this.userId);

        // Limpia backend
        this.challengeService.resetChallenge(this.userId).subscribe({
          next: () => {
            this.animeCount = 0;
            this.animesVistos = [];
            this.retoIniciado = false;
            this.searchQuery = '';
            this.resultadosBusqueda = [];

            Swal.fire({
              title: '¡Reiniciado!',
              text: 'Tu Reto Anual ha sido Reiniciado',
              icon: 'success',
              customClass: { popup: 'swal2-lexend' }
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo restablecer el reto en el servidor',
              icon: 'error',
              customClass: { popup: 'swal2-lexend' }
            });
          }
        });
      }
    });
  }

  buscarAnimes(): void {
    if (!this.retoIniciado) {
      Swal.fire({
        icon: 'info',
        title: 'Pulsa ¡Empezar!',
        text: 'Primero Debes Iniciar el Reto Antes de Buscar Animes',
        customClass: { popup: 'swal2-lexend' }
      });
      return;
    }

    if (!this.searchQuery.trim()) return;

    const url = `https://api.jikan.moe/v4/anime?q=${this.searchQuery}`;
    this.http.get<any>(url).subscribe((res) => {
      this.resultadosBusqueda = res.data || [];
    });
  }

  agregarAnime(anime: any): void {
    if (!this.animeCount || this.animesVistos.length >= this.animeCount) return;

    const yaExiste = this.animesVistos.some(a => a.mal_id === anime.mal_id);
    if (yaExiste) {
      Swal.fire({
        icon: 'info',
        title: 'Ya Está en tu Lista',
        text: `El Anime "${anime.title}" ya Está en tu Lista`,
        customClass: { popup: 'swal2-lexend' }
      });
      return;
    }

    const animeBackend = {
      mal_id: anime.mal_id,
      titulo: anime.title,
      imagen: anime.images?.jpg?.image_url || ''
    };

    this.resultadosBusqueda = [];
    this.searchQuery = '';

    this.challengeService.addWatchedAnime(this.userId, animeBackend).subscribe({
      next: res => {
        console.log('✅ Anime Backend que se guarda:', animeBackend);
        console.log('📦 Respuesta del backend:', res);
        this.animesVistos.push(animeBackend);
        this.guardarEstado();
      },
      error: err => console.error('❌ Error al Añadir Anime al Backend:', err)
    });

    Swal.fire({
      icon: 'success',
      title: '¡Añadido!',
      text: `Has Agregado "${anime.title}" a tu Reto Anual`,
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'swal2-lexend' }
    });
  }

  eliminarAnime(anime: any): void {
    this.animesVistos = this.animesVistos.filter(a => a.mal_id !== anime.mal_id);
    this.guardarEstado();

    Swal.fire({
      icon: 'info',
      title: 'Eliminado',
      text: `${anime.titulo} se Ha Eliminado de tu Lista`,
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'swal2-lexend' }
    });
  }

  guardarEstado(): void {
    // Guardar en localStorage
    this.storageService.setRetoAnual(this.userId, {
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    });

    // Guardar en backend
    this.http.post('https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php', {
      action: 'updateProgress',
      user_id: this.userId,
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    }).subscribe({
      next: res => console.log('Progreso Sincronizado con Backend:', res),
      error: err => console.error('Error al Sincronizar con Backend:', err)
    });
  }

  get progreso(): number {
    return this.animeCount > 0
      ? Math.min(100, Math.floor((this.animesVistos.length / this.animeCount) * 100))
      : 0;
  }

  actualizarTiempoRestante(): void {
    const finAnio = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
    setInterval(() => {
      const ahora = new Date();
      const diff = finAnio.getTime() - ahora.getTime();

      if (diff <= 0) {
        this.timeLeft = '¡El Reto Ha Terminado!';
        return;
      }

      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diff / (1000 * 60)) % 60);
      const segundos = Math.floor((diff / 1000) % 60);

      this.timeLeft = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }, 1000);
  }
}
