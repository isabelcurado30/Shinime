import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListasService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/listas.php';

  constructor(private http: HttpClient) {}

  getListasByUserId(userId: number) {
    return this.http.post<any[]>(
      this.apiUrl,
      {
        action: 'getByUserId',
        user_id: userId
      }
    );
  }

  createLista(nombre: string, userId: number) {
    return this.http.post(
      this.apiUrl,
      {
        action: 'createCustomList',
        user_id: userId,
        nombre: nombre
      }
    );
  }

  /**
   * Este método ahora acepta un objeto con `mal_id`, `titulo` e `imagen`,
   * y los envía al backend para guardar todo desde el principio.
   */
  addAnimeToLista(listaId: number, anime: { mal_id: number, titulo: string, imagen: string }, estado?: string, puntuacion?: number) {
    const body: any = {
      action: 'addAnime',
      lista_id: listaId,
      mal_id: anime.mal_id,
      titulo: anime.titulo,
      imagen: anime.imagen
    };

    if (estado) body.estado = estado;
    if (puntuacion !== undefined) body.puntuacion = puntuacion;

    return this.http.post(this.apiUrl, body);
  }

  updateLista(listaId: number, nuevoNombre: string) {
    return this.http.post(this.apiUrl, {
      action: 'update',
      lista_id: listaId,
      nombre: nuevoNombre
    });
  }

  deleteLista(listaId: number) {
    return this.http.post(this.apiUrl, {
      action: 'delete',
      lista_id: listaId
    });
  }

  removeAnimeFromLista(listaId: number, malId: number) {
    return this.http.post(this.apiUrl, {
      action: 'removeAnime',
      lista_id: listaId,
      mal_id: malId
    });
  }
}
