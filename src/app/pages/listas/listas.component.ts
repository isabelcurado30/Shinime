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
      Swal.fire ({
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
    const nombre = prompt('Nombre de la nueva lista:');
    if (nombre) {
      this.listasService.createLista(nombre, this.userId).subscribe(() => this.ngOnInit());
    }
  }

  editarLista(lista: any) {
    const nuevoNombre = prompt('Nuevo nombre para la lista:', lista.nombre);
    if (nuevoNombre && nuevoNombre !== lista.nombre) {
      this.listasService.updateLista(lista.id, nuevoNombre).subscribe(() => this.ngOnInit());
    }
  }

  borrarLista(listaId: number) {
    if (confirm('¿Estás seguro de que quieres borrar esta lista?')) {
      this.listasService.deleteLista(listaId).subscribe(() => this.ngOnInit());
    }
  }

  eliminarAnime(listaId: number, malId: number) {
    this.listasService.removeAnimeFromLista(listaId, malId).subscribe({
      next: () => {
        const lista = this.listas.find(l => l.id === listaId);
        if (lista) {
          lista.animes = lista.animes.filter((a: any) => a.mal_id !== malId);
        }
      },
      error: (err) => console.error('❌ Error al eliminar anime:', err)
    });
  }
}