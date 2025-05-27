import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ListasService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/listas.php';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getListasByUserId(userId: number): Observable<any[]> {
    return this.http.post<any[]>(
      this.apiUrl,
      {
        action: 'getByUserId',
        user_id: userId
      },
      { headers: this.headers }
    );
  }

  createLista(nombre: string, userId: number): Observable<any> {
    return this.http.post(
      this.apiUrl,
      {
        action: 'createCustomList',
        user_id: userId,
        nombre: nombre
      },
      { headers: this.headers }
    );
  }

  addAnimeToLista(
    listaId: number,
    anime: { mal_id: number; titulo: string; imagen: string },
    estado?: string,
    puntuacion?: number
  ): Observable<{ success: boolean; error?: string }> {
    const body: any = {
      action: 'addAnime',
      lista_id: listaId,
      mal_id: anime.mal_id,
      titulo: anime.titulo,
      imagen: anime.imagen
    };

    if (estado) body.estado = estado;
    if (puntuacion !== undefined) body.puntuacion = puntuacion;

    return this.http.post<{ success: boolean; error?: string }>(
      this.apiUrl,
      body,
      { headers: this.headers }
    );
  }

  updateLista(listaId: number, nuevoNombre: string): Observable<any> {
    return this.http.post(
      this.apiUrl,
      {
        action: 'update',
        lista_id: listaId,
        nombre: nuevoNombre
      },
      { headers: this.headers }
    );
  }

  deleteLista(listaId: number): Observable<any> {
    return this.http.post(
      this.apiUrl,
      {
        action: 'delete',
        lista_id: listaId
      },
      { headers: this.headers }
    );
  }

  removeAnimeFromLista(listaId: number, malId: number): Observable<any> {
    return this.http.post(
      this.apiUrl,
      {
        action: 'removeAnime',
        lista_id: listaId,
        mal_id: malId
      },
      { headers: this.headers }
    );
  }
}
