import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";
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

  constructor (
    private http: HttpClient,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();
    if (!usuario) {
      this.bloqueado = true;
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'Debes iniciar sesión para usar el reto anual.',
        customClass: { popup: 'swal2-lexend' }
      });
      return;
    }

    this.userId = usuario.id;

    const reto = this.storageService.getRetoAnual(this.userId);
    if (reto) {
      this.animeCount = reto.animeCount;
      this.animesVistos = reto.animesVistos || [];
      this.retoIniciado = true;
    }

    this.actualizarTiempoRestante();

    // --- Si quieres cargar desde el backend también ---
    // this.http.post('https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php', {
    //   action: 'getByUserId',
    //   user_id: this.userId
    // }).subscribe(res => {
    //   this.animeCount = res.goal;
    //   this.retoIniciado = true;
    // });
  }

  iniciarReto(): void {
    if (this.animeCount > 0) {
      this.retoIniciado = true;
      this.guardarEstado();

      this.http.post('https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php', {
        action: 'reset',
        user_id: this.userId,
        goal: this.animeCount
      }).subscribe({
        next: res => console.log('✅ Reto guardado en backend:', res),
        error: err => console.error('❌ Error al guardar reto en backend:', err)
      });
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
      customClass: {
        popup: 'swal2-lexend'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.storageService.clearRetoAnual(this.userId);
        this.animeCount = 0;
        this.animesVistos = [];
        this.retoIniciado = false;
        this.searchQuery = '';
        this.resultadosBusqueda = [];

        Swal.fire({
          title: '¡Reiniciado!',
          text: 'Tu Reto ha Sido Establecido',
          icon: 'success',
          customClass: {
            popup: 'swal2-lexend'
          }
        });
      }
    });
  }

  buscarAnimes(): void {
    if (!this.searchQuery.trim()) return;
    const url = `https://api.jikan.moe/v4/anime?q=${this.searchQuery}`;
    this.http.get<any>(url).subscribe((res) => {
      this.resultadosBusqueda = res.data || [];
    });
  }

  agregarAnime(anime: any): void {
    if (!this.animesVistos.some(a => a.mal_id === anime.mal_id)) {
      this.animesVistos.push(anime);
      this.resultadosBusqueda = [];
      this.searchQuery = '';
      this.guardarEstado();

      Swal.fire({
        icon: 'success',
        title: '¡Añadido!',
        text: `"${anime.title}" se ha Añadido a tu Lista de Vistos.`,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-lexend'
        }
      });
    }
  }

  eliminarAnime(anime: any): void {
    this.animesVistos = this.animesVistos.filter(a => a.mal_id !== anime.mal_id);
    this.guardarEstado();

    Swal.fire({
      icon: 'info',
      title: 'Eliminado',
      text: `"${anime.title}" se ha Eliminado de tu Lista.`,
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'swal2-lexend'
      }
    });
  }

  guardarEstado(): void {
    this.storageService.setRetoAnual(this.userId, {
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    });

    this.http.post('https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php', {
      action: 'updateProgress',
      user_id: this.userId,
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    }).subscribe({
      next: res => console.log('✅ Progreso sincronizado con backend:', res),
      error: err => console.error('❌ Error al sincronizar con backend:', err)
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
        this.timeLeft = '¡El Reto ha Terminado!';
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
