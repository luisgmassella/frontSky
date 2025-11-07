import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from './cliente.model';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // ✅ Usamos la URL del backend configurada en environment
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

  /**
   * 1️⃣ Obtener todos los clientes
   */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * 2️⃣ Obtener cliente por ID
   */
  getClienteById(id: number): Observable<Cliente> {
    const endpointUrl = `${this.apiUrl}/${id}`;
    return this.http.get<Cliente>(endpointUrl);
  }

  /**
   * 3️⃣ Crear un nuevo cliente
   */
  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  /**
   * 4️⃣ Actualizar un cliente existente
   */
  updateCliente(id: number, cliente: Cliente): Observable<Cliente> {
    const endpointUrl = `${this.apiUrl}/${id}`;
    return this.http.put<Cliente>(endpointUrl, cliente);
  }

  /**
   * 5️⃣ Eliminar cliente por ID
   */
  deleteCliente(id: number): Observable<void> {
    const endpointUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(endpointUrl);
  }
}
