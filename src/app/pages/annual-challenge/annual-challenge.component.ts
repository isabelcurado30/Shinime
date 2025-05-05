import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import Swal from "sweetalert2";

@Component ({
  selector: 'app-annual-challenge',
  templateUrl: './annual-challenge.component.html',
  styleUrls: ['./annual-challenge.component.scss']
})

export class AnnualChallengeComponent implements OnInit {
  animeCount = 0;
  retoIniciado = false;
  searchQuery = '';
  resultadosBusqueda: any[] = [];
  animesVistos: any[]= [];
  timeLeft = '';

  constructor (private http: HttpClient) {}

  ngOnInit(): void {
    const now = new Date();
    const year = now.getFullYear();
    const retoKey = `retoAnual-${year}`;
    const guardado = localStorage.getItem (retoKey);

    if (guardado) {
      const datos = JSON.parse (guardado);
      this.animeCount = datos.animeCount;
      this.animesVistos = datos.animesVistos || [];
      this.retoIniciado = true;
    } // Fin Si

    this.actualizarTiempoRestante();
  }

  iniciarReto(): void {
    if (this.animeCount > 0) {
      this.retoIniciado = true;
      this.guardarEstado();
    } // Fin Si
  }

  restablecerReto(): void {
    Swal.fire ({
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
    }).then ((result) => {
      if (result.isConfirmed) {
        const year = new Date().getFullYear();
        localStorage.removeItem (`retoAnual-${year}`);
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
    this.http.get <any> (url).subscribe ((res) => {
      this.resultadosBusqueda = res.data || [];
    });
  }

  agregarAnime (anime: any): void {
    if (!this.animesVistos.some (a => a.mal_id === anime.mal_id)) {
      this.animesVistos.push (anime);
      this.resultadosBusqueda = [];
      this.searchQuery = '';
      this.guardarEstado();

      Swal.fire ({
        icon: 'success',
        title: '¡Añadido!',
        text: `"${anime.title}" se ha Añadido a tu Lista de Vistos.`,
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-lexend'
        }
      });
    } // Fin Si
  }

  eliminarAnime (anime: any): void {
    this.animesVistos = this.animesVistos.filter (a => a.mal_id !== anime.mal_id);
    this.guardarEstado();

    Swal.fire ({
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
    const year = new Date().getFullYear();
    localStorage.setItem ('retoAnual', JSON.stringify ({
      animeCount: this.animeCount,
      animesVistos: this.animesVistos
    }));
  }

  get progreso(): number {
    return this.animeCount > 0
      ? Math.min (100, Math.floor ((this.animesVistos.length / this.animeCount) * 100))
      : 0;
  }

  actualizarTiempoRestante(): void {
    const finAnio = new Date (new Date().getFullYear(), 11, 31, 23, 59, 59);
    setInterval(() => {
      const ahora = new Date();
      const diff = finAnio.getTime() - ahora.getTime();

      if (diff <= 0){
        this.timeLeft = '¡El Reto ha Terminado!';
        return;
      } // Fin Si

      const dias = Math.floor (diff / (1000 * 60 * 60 * 24));
      const horas = Math.floor ((diff / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor ((diff / (1000 * 60)) % 60);
      const segundos = Math.floor ((diff / 1000) % 60);

      this.timeLeft = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }, 1000);
  }
}