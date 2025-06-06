import { Component, OnInit } from "@angular/core";
import { ListasService } from "src/app/services/listas.service";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

@Component ({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss'],
})

export class ListasComponent implements OnInit {
  listas: any[] = [];
  userId!: number;

  constructor (
    private listasService: ListasService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.obtenerUsuario();
    this.userId = usuario.id;

    this.listasService.getListasByUserId (this.userId).subscribe ({
      next: (listas) => {
        this.listas = listas;

        for (let lista of this.listas) {
          for (let anime of lista.animes) {
            this.http
              .get (`https://api.jikan.moe/v4/anime/${anime.mal_id}`)
              .subscribe ((res: any) => {
                anime.titulo = res.data.title;
                anime.imagen = res.data.images.jpg.image_url;
              });
          } // Fin Para
        } // Fin Para
      },

      error: (err) => {
        console.error ('Error al Obtener Listas:', err);
        Swal.fire ('Error', 'No se Pudieron Cargar tus Listas', 'error');
      }
    });
  }

  crearLista() {
    Swal.fire ({
      title: 'Crear Nueva Lista',
      input: 'text',
      inputLabel: 'Nombre de la Lista',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes Ingresar un Nombre';
        return null;
      }
    }).then (result => {
      if (result.isConfirmed && result.value) {
        this.listasService.createLista (result.value, this.userId).subscribe ({
          next: () => {
            Swal.fire ('Lista Creada', '', 'success');
            this.ngOnInit();
          },

          error: () => Swal.fire ('Error', 'No se Pudo Creer la Lista', 'error')
        });
      } // Fin Si
    });
  }

  editarLista (lista: any) {
    Swal.fire ({
      title: 'Editar Lista',
      input: 'text',
      inputLabel: 'Nuevo Nombre',
      inputValue: lista.nombre,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'El Nombre NO Puede Estar Vacío';
        return null;
      }
    }).then (result => {
      if (result.isConfirmed && result.value !== lista.nombre) {
        this.listasService.updateLista (lista.id, result.value).subscribe ({
          next: () => {
            Swal.fire ('Lista Actualizada', '', 'success');
            this.ngOnInit();
          },

          error: () => Swal.fire ('Error', 'No se Pudo Actualizar la Lista', 'error')
        });
      } // Fin Si
    });
  }

  borrarLista (listaId: number) {
    Swal.fire ({
      title: '¿Estás Seguro/a?',
      text: 'Esta Acción Eliminará la Lista Permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Borrar',
      cancelButtonText: 'Cancelar'
    }).then (result => {
      if (result.isConfirmed) {
        this.listasService.deleteLista (listaId).subscribe ({
          next: () => {
            Swal.fire ('Lista Eliminada', '', 'success');
            this.ngOnInit();
          },

          error: () => Swal.fire ('Error', 'No se Pudo Eliminar la Lista', 'error')
        });
      } // Fin Si
    });
  }

  eliminarAnime (listaId: number, malId: number, event?: MouseEvent) {
    event?.stopPropagation();

    Swal.fire ({
      title: '¿Eliminar Anime?',
      text: '¿Deseas Quitar este Anime de la Lista?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then (result => {
      if (result.isConfirmed) {
        this.listasService.removeAnimeFromLista (listaId, malId).subscribe ({
          next: () => {
            const lista = this.listas.find (l => l.id === listaId);

            if (lista) {
              lista.animes = lista.animes.filter ((a: any) => a.mal_id !== malId);
            } // Fin Si

            Swal.fire ('Anime Eliminado', '', 'success');
          },

          error: () => Swal.fire ('Error', 'No se Pudo Eliminar el Anime', 'error')
        });
      } // Fin Si
    });
  }
}