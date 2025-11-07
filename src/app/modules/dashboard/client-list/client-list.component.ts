import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../services/cliente.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clientes: Cliente[] = [];
  isLoading = true;

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.isLoading = true;
    this.clienteService.getClientes().subscribe({
      next: (resp) => {
        this.clientes = resp;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar los clientes.', 'error');
      }
    });
  }

  createNewClient(): void {
    this.router.navigate(['/dashboard/clientes/nuevo']);
  }

  editClient(id: number): void {
    this.router.navigate(['/dashboard/clientes/editar', id]);
  }

  deleteClient(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'El cliente ha sido eliminado correctamente.', 'success');
          this.cargarClientes();
        },
        error: (err) => {
          console.error('Error al eliminar cliente:', err);
          if (err.status === 204 || err.status === 200) {
            Swal.fire('Eliminado', 'El cliente ha sido eliminado correctamente.', 'success');
            this.cargarClientes();
          } else {
            Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
          }
        }
      });
    }
  });
}
}
