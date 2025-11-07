import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';

export interface AuthResponse {
  token: string;
  type: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Inicia sesión y guarda token + rol (simulado en el front por email)
  login(credentials: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        // Guardar token
        localStorage.setItem('token', res.token);

        // 👇 Asignación de rol en el FRONT según email (sin tocar back)
        const email = credentials.usernameOrEmail.toLowerCase();
        let rol = 'SIN_ROL';

        if (email === 'luis@gmail.com') rol = 'ADMINISTRADOR';
        else if (email === 'julio@gmail.com') rol = 'SUPERVISOR';
        else if (email === 'juan@gmail.com') rol = 'TECNICO';
        else if (email === 'byron@gmail.com') rol = 'ADMINISTRADOR';

        localStorage.setItem('rol', rol);
        localStorage.setItem('email', email);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getEmail(): string | null {
    // Preferimos el guardado directo; si no, decodificamos el JWT
    const direct = localStorage.getItem('email');
    if (direct) return direct;

    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.email || null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
