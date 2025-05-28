import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
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

  private readonly STORAGE_KEY = 'reto_anual';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
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

    this.challengeService.getChallenge(this.userId).subscribe((reto: any) => {
      if (reto && reto.goal && reto.goal > 0) {
        this.retoIniciado = true;
        this.animeCount = reto.goal;

        this.challengeService.getWatchedAnimes(this.userId).subscribe((animes: any[]) => {
          this.animesVistos = (animes || []).filter(anime => anime.titulo && anime.imagen);
          this.guardarEstado();  // sincronizamos localStorage con datos backend
        });
      } else {
        // No hay reto o reto reseteado
        this.retoIniciado = false;
        this.animeCount = 0;
        this.animesVistos = [];
        localStorage.removeItem(this.STORAGE_KEY);
      }
    });
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
        next: res => console.log('Reto guardado en backend:', res),
        error: err => console.error('Error guardando reto en backend:', err)
      });
    }
  }

  restablecerReto(): void {
    Swal.fire({
      title: '¿Quieres reiniciar el reto anual?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post('https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php', {
          action: 'reset',
          user_id: this.userId,
          goal: 0
        }).subscribe({
          next: (res) => {
            console.log('Reto restablecido en backend:', res);

            // Solo tras confirmar backend limpiamos localStorage y reseteamos estado
            localStorage.removeItem(this.STORAGE_KEY);
            this.animeCount = 0;
            this.animesVistos = [];
            this.retoIniciado = false;

            Swal.fire({
              title: '¡Reiniciado!',
              text: 'Tu Reto Anual ha sido Reiniciado',
              icon: 'success',
              customClass: { popup: 'swal2-lexend' }
            });
          },
          error: (err) => {
            console.error('Error restableciendo reto en backend:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo reiniciar el reto. Inténtalo de nuevo.',
              icon: 'error'
            });
          }
        });
      }
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
        console.log('Anime añadido al backend:', animeBackend);
        this.animesVistos.push(animeBackend);
        this.guardarEstado();  // guardar estado actualizado
      },
      error: err => console.error('Error añadiendo anime al backend:', err)
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
    const retoParaGuardar = {
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    };

    // Guardar en localStorage para persistencia local
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(retoParaGuardar));

    // Guardar en backend para persistencia remota y sincronización
    this.http.post('https://ruizgijon.ddns.net/sancheza/isaberu/api/challenge.php', {
      action: 'updateProgress',
      user_id: this.userId,
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    }).subscribe({
      next: res => console.log('Progreso sincronizado con backend:', res),
      error: err => console.error('Error sincronizando con backend:', err)
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

  buscarAnimes(): void {
    if (!this.searchQuery.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Busca algo primero',
        text: 'Por favor, escribe un término para buscar animes.',
        customClass: { popup: 'swal2-lexend' }
      });
      return;
    }

    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(this.searchQuery)}&limit=10`;

    this.http.get<any>(url).subscribe({
      next: data => {
        this.resultadosBusqueda = data.data || [];
      },
      error: err => {
        console.error('Error buscando animes:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error en la búsqueda',
          text: 'No se pudieron obtener resultados. Intenta más tarde.',
          customClass: { popup: 'swal2-lexend' }
        });
      }
    });
  }
}
