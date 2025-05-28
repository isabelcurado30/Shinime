import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ruizgijon.ddns.net/sancheza/isaberu/api/user.php';
  private usuarioSubject = new BehaviorSubject<any>(this.obtenerUsuario());
  usuario$ = this.usuarioSubject.asObservable();

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

  updateIcono(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  getEstadisticas(userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'getEstadisticas');
    formData.append('userId', userId.toString());
    return this.http.post<any>(this.apiUrl, formData);
  }

  guardarUsuario(usuario: any): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  obtenerUsuario(): any {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  guardarSesion(usuario: any): void {
    this.guardarUsuario(usuario);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

}
