import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListasService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/listas.php';

  constructor(private http: HttpClient) {}

  getListasByUserId(userId: number) {
    const body = new URLSearchParams();
    body.set('action', 'getByUserId');
    body.set('user_id', userId.toString());

    return this.http.post<any[]>(
      this.apiUrl,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
  }

  createLista(nombre: string, userId: number) {
    const body = new URLSearchParams();
    body.set('action', 'createCustomList');
    body.set('user_id', userId.toString());
    body.set('nombre', nombre);

    return this.http.post(
      this.apiUrl,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
  }

  addAnimeToLista(listaId: number, malId: number, estado?: string, puntuacion?: number) {
    const body = new URLSearchParams();
    body.set('action', 'addAnime');
    body.set('lista_id', listaId.toString());
    body.set('mal_id', malId.toString());
    if (estado) body.set('estado', estado);
    if (puntuacion !== undefined) body.set('puntuacion', puntuacion.toString());

    return this.http.post(
      this.apiUrl,
      body.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
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
