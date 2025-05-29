import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import { ChallengeService } from "src/app/services/challenge.service";
import Swal from "sweetalert2";

@Component ({
  selector: 'app-annual-challenge',
  templateUrl: './annual-challenge.component.html',
  styleUrls: ['./annual-challenge.component.scss']
})

export class AnnualChallengeComponent implements OnInit, OnDestroy {
  animeCount = 0;
  retoIniciado = false;
  searchQuery = '';
  resultadosBusqueda: any[] = [];
  animesVistos: any[] = [];
  timeLeft = '';
  userId!: number;
  bloqueado = false;

  private readonly STORAGE_KEY = 'reto_anual';
  private timerId?: any;

  constructor (
    private http: HttpClient,
    private authService: AuthService,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();

    if (!usuario) {
      this.bloqueado = true;
      Swal.fire ({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'Debes Iniciar Sesión para Usar el Reto Anual',
        customClass: { popup: 'swal2-lexend' }
      });

      return;
    }

    this.userId = usuario.id;
    this.iniciarTemporizador();

    // Obtener Reto y Animes Vistos del Backend
    this.challengeService.getChallenge (this.userId).subscribe ({
      next: (reto: any) => {
        if (reto && reto.goal && reto.goal > 0) {
          this.retoIniciado = true;
          this.animeCount = reto.goal;

          this.challengeService.getWatchedAnimes (this.userId).subscribe ({
            next: (animes: any[]) => {
              this.animesVistos = (animes || []).filter (a => a.titulo && a.imagen);
              this.guardarEstadoLocal();
            },

            error: err => {
              console.log ('Error al Obtener Animes Vistos:', err);
              this.animesVistos = [];
            }
          });
        } else {
          this.retoIniciado = false;
          this.animeCount = 0;
          this.animesVistos = [];
          localStorage.removeItem (this.STORAGE_KEY);
        } // Fin Si
      },

      error: err => {
        console.error ('Error al Obtener Reto:', err);
        this.retoIniciado = false;
        this.animeCount = 0;
        this.animesVistos = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval (this.timerId);
    } // Fin Si
  }

  iniciarTemporizador(): void {
    const finAnio = new Date (new Date().getFullYear(), 11, 31, 23, 59, 59);
    this.timerId = setInterval (() => {
      const ahora = new Date();
      const diff = finAnio.getTime() - ahora.getTime();

      if (diff <= 0) {
        this.timeLeft = '¡El Reto Ha Terminado!';
        clearInterval (this.timerId);
        return;
      } // Fin Si

      const dias = Math.floor (diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor ((diff / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor ((diff / (1000 * 60)) % 60);
      const segundos = Math.floor ((diff / 1000) % 60);

      this.timeLeft = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }, 1000);
  }

  iniciarReto(): void {
    if (this.animeCount <= 0) {
      Swal.fire ({
        icon: 'warning',
        title: 'Número Inválido',
        text: 'Debes Establecer un Número Válido para Iniciar el Reto',
        customClass: { popup: 'swal2-lexend' }
      });

      return;
    } // Fin Si

    this.retoIniciado = true;
    this.guardarEstadoLocal();

    this.challengeService.resetChallenge (this.userId, this.animeCount).subscribe ({
      next: res => {
        console.log ('Reto Guardado en el Backend:', res);
        Swal.fire ({
          icon: 'success',
          title: 'Reto Iniciado',
          text: `Tu Reto Anual se Ha Fijado en ${this.animeCount} Animes`,
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'swal2-lexend' }
        });
      },

      error: err => {
        console.error ('Error Guardando Reto en Backend:', err);
        Swal.fire ({
          icon: 'error',
          title: 'Error',
          text: 'No se Pudo Iniciar el Reto. Inténtalo de Nuevo',
          customClass: { popup: 'swal2-lexend' }
        });
      }
    });
  }

  restablecerReto(): void {
    Swal.fire ({
      title: '¿Quieres Reiniciar el Reto Anual?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Reiniciar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal2-lexend' }
    }).then (result => {
      if (result.isConfirmed) {
        this.challengeService.resetChallenge (this.userId, 0).subscribe ({
          next: () => {
            localStorage.removeItem (this.STORAGE_KEY);
            this.animeCount = 0;
            this.animesVistos = [];
            this.retoIniciado = false;
            Swal.fire ({
              icon: 'success',
              title: '¡Reiniciado!',
              text: 'Tu Reto Anual Ha Sido Reiniciado',
              customClass: { popup: 'swal2-lexend' }
            });
          },

          error: err => {
            console.error ('Error Restableciendo Reto:', err);
            Swal.fire ({
              icon: 'error',
              title: 'Error',
              text: 'No se Pudo Reiniciar el Reto. Inténtalo de Nuevo',
              customClass: { popup: 'swal2-lexend' }
            });
          }
        });
      }
    });
  }

  agregarAnime (anime: any): void {
    if (!this.retoIniciado || !this.animeCount) return;

    if (this.animesVistos.length >= this.animeCount) {
      Swal.fire ({
        icon: 'info',
        title: 'Límite Alcanzado',
        text: `Ya Has Alcanzado tu Objetivo de ${this.animeCount} Animes`,
        customClass: { popup: 'swal2-lexend' }
      });

      return;
    } // Fin Si

    const existe = this.animesVistos.some (a => a.mal_id === anime.mal_id);

    if (existe) {
      Swal.fire ({
        icon: 'info',
        title: 'Ya Está en tu Lista',
        text: `El Anime "${anime.title}" ya Está en tu Lista`,
        customClass: { popup: 'swal2-lexend' }
      });

      return;
    } // Fin Si

    const animeParaBackend = {
      mal_id: anime.mal_id,
      titulo: anime.title,
      imagen: anime.images?.jpg?.image_url || ''
    };

    this.challengeService.addWatchedAnime (this.userId, animeParaBackend).subscribe ({
      next: () => {
        this.animesVistos.push (animeParaBackend);
        this.guardarEstadoLocal();
        this.guardarEstadoBackend();
        Swal.fire ({
          icon: 'success',
          title: '¡Añadido!',
          text: `Has Agregado "${anime.title}" a tu Reto Anual`,
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'swal2-lexend' }
        });
      },

      error: err => {
        console.error ('Error Añadiendo Anime:', err);
        Swal.fire ({
          icon: 'error',
          title: 'Error',
          text: 'No se Pudo Agregar el Anime. Inténtalo de Nuevo',
          customClass: { popup: 'swal2-lexend' }
        });
      }
    });

    // Limpiamos Búsqueda
    this.resultadosBusqueda = [];
    this.searchQuery = '';
  }

  eliminarAnime (anime: any): void {
    this.animesVistos = this.animesVistos.filter (a => a.mal_id !== anime.mal_id);

    this.challengeService.updateProgress (this.userId, this.animeCount, this.animesVistos).subscribe ({
      next: () => {
        this.guardarEstadoLocal();
        Swal.fire ({
          icon: 'info',
          title: 'Eliminado',
          text: `"${anime.titulo}" se Ha Eliminado de tu Lista`,
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'swal2-lexend' }
        });
      },

      error: err => {
        console.error ('Error Actualizando Progreso:', err);
        Swal.fire ({
          icon: 'error',
          title: 'Error',
          text: 'No se Pudo Eliminar el Anime. Inténtalo de Nuevo',
          customClass: { popup: 'swal2-lexend' }
        });
      }
    });
  }

  buscarAnimes(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      Swal.fire ({
        icon: 'warning',
        title: 'Busca Algo Primero',
        text: 'Por Favor, Escribe un Término para Buscar Animes',
        customClass: { popup: 'swal2-lexend' }
      });

      return;
    } // Fin Si

    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;

    this.http.get <any> (url).subscribe ({
      next: data => {
        this.resultadosBusqueda = data.data || [];
      },

      error: err => {
        console.error ('Error Buscando Animes:', err);
        Swal.fire ({
          icon: 'error',
          title: 'Error en la Búsqueda',
          text: 'No se Pudieron Obtener Resultados. Inténtalo más Tarde',
          customClass: { popup: 'swal2-lexend' }
        });
      }
    });
  }

  // Guardar Estado Localmente (localStorage)
  private guardarEstadoLocal(): void {
    const retoParaGuardar = {
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    };

    localStorage.setItem (this.STORAGE_KEY, JSON.stringify (retoParaGuardar));
  }

  // Actualiza el Progreso en Backend (sincroniza)
  private guardarEstadoBackend(): void {
    this.challengeService.updateProgress (this.userId, this.animeCount, this.animesVistos).subscribe ({
      next: res => console.log ('Progreso Sincronizado con Backend:', res),
      error: err => console.error ('Error Sincronizando con Backend:', err)
    });
  }

  get progreso(): number {
    return this.animeCount > 0
      ? Math.min (100, Math.floor ((this.animesVistos.length / this.animeCount) * 100))
      : 0;
  }
}