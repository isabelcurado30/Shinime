import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/controller';

  constructor(private http: HttpClient) {}

  registrar(user: { nombre: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/create.php`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  login(nombre: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login.php`, { nombre, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  guardarSesion(usuario: { id: number; nombre: string }) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario(): { id: number; nombre: string } | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  getUser() {
    return this.http.get('/api/get-user.php');
  }  

  logout() {
    return this.http.get('/api/logout.php');
  }
}
