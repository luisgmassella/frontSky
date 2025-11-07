import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visita } from './visita.model';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitaService {

  private apiUrl = `${environment.apiUrl}/visitas`;

  constructor(private http: HttpClient) {}

  // Obtener todas las visitas
  getVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(this.apiUrl);
  }

  // Obtener una visita por ID
  getVisitaById(id: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva visita
  createVisita(visita: Partial<Visita>): Observable<Visita> {
    return this.http.post<Visita>(this.apiUrl, visita);
  }

  // Actualizar visita completa (PUT)
  updateVisita(id: number, visita: Partial<Visita>): Observable<Visita> {
    return this.http.put<Visita>(`${this.apiUrl}/${id}`, visita);
  }

  // Actualizar solo el estado (PATCH)
  updateEstadoVisita(id: number, nuevoEstado: string): Observable<Visita> {
    return this.http.patch<Visita>(`${this.apiUrl}/${id}/estado?nuevoEstado=${nuevoEstado}`, {});
  }

 // ✅ visita.service.ts
eliminarVisita(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, { observe: 'response' });
}

}
