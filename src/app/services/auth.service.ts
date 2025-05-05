import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable ({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = 'http://ruizgijon.ddns.net/sancheza/isaberu/api';

  constructor (private http: HttpClient) {}

  registrar (usuario: { nombre: string; email: string; password: string }) {
    return this.http.post (`${this.baseUrl}/registro.php`, usuario);
  }

  login (credentials: { email: string; password: string }) {
    return this.http.post (`${this.baseUrl}/login.php`, credentials);
  }
}
