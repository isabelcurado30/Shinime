import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/controller';

  constructor(private http: HttpClient, private storage: StorageService) {}

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
    this.storage.setUser(usuario);
  }

  obtenerUsuario(): { id: number; nombre: string } | null {
    return this.storage.getUser();
  }

  guardarUsuario(usuario: any): void {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}


  cerrarSesion() {
    this.storage.clearUser();
  }

  isLoggedIn(): boolean {
    return this.storage.isLoggedIn();
  }

  getUser() {
    return this.http.get('/api/get-user.php');
  }

  logout() {
    return this.http.get('/api/logout.php');
  }
}
