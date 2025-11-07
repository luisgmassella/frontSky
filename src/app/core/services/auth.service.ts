import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
import { Router } from '@angular/router';
import { AuthResponse, LoginPayload } from 'src/app/models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de tu backend Spring Boot
  private apiAuth = `${environment.apiUrl}/auth/`;

  // Señal para gestionar el estado de autenticación (si hay un token)
  isAuthenticated = signal<boolean>(false);
  // Señal para almacenar el token
  token = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializa el estado leyendo el token de localStorage al cargar la aplicación
    this.loadToken();
  }

  /**
   * Intenta cargar el token de localStorage al inicio.
   */
  private loadToken(): void {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      this.token.set(storedToken);
      this.isAuthenticated.set(true);
    }
  }

  /**
   * Llama a la API de login en el backend de Java.
   * @param payload Objeto con username/email y password.
   * @returns Observable con el token de autenticación.
   */
  login(payload: LoginPayload): Observable<AuthResponse> {
    const loginUrl = this.apiAuth + 'login';

    return this.http.post<AuthResponse>(loginUrl, payload).pipe(
      tap(response => {
        // Almacenar el token y actualizar el estado
        this.saveToken(response.token);

        this.router.navigate(['/dashboard']);
      })
    );
  }

  /**
   * Almacena el token recibido y actualiza las señales de estado.
   * @param jwtToken El token JWT recibido del backend.
   */
  private saveToken(jwtToken: string): void {
    localStorage.setItem('jwt_token', jwtToken);
    this.token.set(jwtToken);
    this.isAuthenticated.set(true);
  }

  /**
   * Cierra la sesión, elimina el token y actualiza el estado.
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene el token JWT actual.
   * @returns El token o null.
   */
  getToken(): string | null {
    return this.token();
  }
}
