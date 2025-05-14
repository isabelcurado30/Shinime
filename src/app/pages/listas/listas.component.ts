import { Component, OnInit } from '@angular/core';
import { ListasService } from 'src/app/services/listas.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss']
})
export class ListasComponent implements OnInit {
  listas: any[] = [];
  userId!: number;
  bloqueado = false;

  constructor(
    private listasService: ListasService,
    private http: HttpClient,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();
    if (!usuario) {
      this.bloqueado = true;
      Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'Debes iniciar sesión para ver tus listas.',
        customClass: { popup: 'swal2-lexend' }
      });
      return;
    }

    this.userId = usuario.id;

    this.listasService.getListasByUserId(this.userId).subscribe({
      next: (listas) => {
        this.listas = listas;

        for (let lista of this.listas) {
          for (let anime of lista.animes) {
            this.http
              .get(`https://api.jikan.moe/v4/anime/${anime.mal_id}`)
              .subscribe((res: any) => {
                anime.titulo = res.data.title;
                anime.imagen = res.data.images.jpg.image_url;
              });
          }
        }
      },
      error: (err) => console.error('❌ Error al obtener listas:', err)
    });
  }

  crearLista() {
    Swal.fire({
      title: 'Crear nueva lista',
      input: 'text',
      inputLabel: 'Nombre de la lista',
      inputPlaceholder: 'Escribe un nombre...',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal2-lexend' }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.listasService.createLista(result.value, this.userId).subscribe(() => {
          this.ngOnInit();
          Swal.fire({
            icon: 'success',
            title: '¡Lista creada!',
            text: `La lista "${result.value}" fue añadida correctamente.`,
            customClass: { popup: 'swal2-lexend' }
          });
        });
      }
    });
  }

  editarLista(lista: any) {
    Swal.fire({
      title: 'Editar nombre de la lista',
      input: 'text',
      inputLabel: 'Nuevo nombre',
      inputValue: lista.nombre,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal2-lexend' }
    }).then(result => {
      if (result.isConfirmed && result.value && result.value !== lista.nombre) {
        this.listasService.updateLista(lista.id, result.value).subscribe(() => {
          this.ngOnInit();
          Swal.fire({
            icon: 'success',
            title: '¡Lista actualizada!',
            text: `El nuevo nombre es "${result.value}".`,
            customClass: { popup: 'swal2-lexend' }
          });
        });
      }
    });
  }

  borrarLista(listaId: number) {
    Swal.fire({
      title: '¿Borrar esta lista?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal2-lexend' }
    }).then(result => {
      if (result.isConfirmed) {
        this.listasService.deleteLista(listaId).subscribe(() => {
          this.ngOnInit();
          Swal.fire({
            icon: 'success',
            title: 'Lista eliminada',
            text: 'La lista se eliminó correctamente.',
            customClass: { popup: 'swal2-lexend' }
          });
        });
      }
    });
  }

  eliminarAnime(listaId: number, malId: number) {
    this.listasService.removeAnimeFromLista(listaId, malId).subscribe({
      next: () => {
        const lista = this.listas.find(l => l.id === listaId);
        if (lista) {
          lista.animes = lista.animes.filter((a: any) => a.mal_id !== malId);
        }
        Swal.fire({
          icon: 'success',
          title: 'Anime eliminado',
          text: 'El anime ha sido eliminado de la lista.',
          customClass: { popup: 'swal2-lexend' }
        });
      },
      error: (err) => console.error('❌ Error al eliminar anime:', err)
    });
  }
}
