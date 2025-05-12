import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  setUser(usuario: { id: number, nombre: string }): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUser(): { id: number, nombre: string } | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  clearUser(): void {
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  // 🔹 Reto Anual por usuario + año
  setRetoAnual(userId: number, data: { animeCount: number; animesVistos: any[] }): void {
    const year = new Date().getFullYear();
    const key = `retoAnual-${userId}-${year}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  getRetoAnual(userId: number): { animeCount: number; animesVistos: any[] } | null {
    const year = new Date().getFullYear();
    const key = `retoAnual-${userId}-${year}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  clearRetoAnual(userId: number): void {
    const year = new Date().getFullYear();
    const key = `retoAnual-${userId}-${year}`;
    localStorage.removeItem(key);
  }
}
