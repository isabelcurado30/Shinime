import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/user.php';

  constructor(private http: HttpClient) {}

  login(nombre: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('nombre', nombre);
    formData.append('password', password);
    return this.http.post<any>(this.apiUrl, formData);
  }

  registrar(usuario: { nombre: string; email: string; password: string }): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'register');
    formData.append('nombre', usuario.nombre);
    formData.append('email', usuario.email);
    formData.append('password', usuario.password);
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateIcono(userId: string, icono: string): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'updateIcono');
    formData.append('userId', userId);
    formData.append('icono', icono);
    return this.http.post<any>(this.apiUrl, formData);
  }

  guardarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuario(): any {
    const datos = localStorage.getItem('usuario');
    return datos ? JSON.parse(datos) : null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
  }

  guardarSesion(usuario: any): void {
    this.guardarUsuario(usuario);
  }
}
