import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../dashboard/services/auth.service';
import { UsuarioService } from '../dashboard/services/usuario.service';
import { ClienteService } from '../dashboard/services/cliente.service';
import { VisitaService } from '../dashboard/services/visita.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, RouterOutlet, RouterLink],
})
export class DashboardComponent implements OnInit {
  userEmail = '';
  userRol = '';

  totalUsuarios = 0;
  totalClientes = 0;
  visitasPendientes = 0;
  visitasFinalizadas = 0;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private visitaService: VisitaService
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getEmail() || '';
    this.userRol = this.authService.getRol() || 'SIN_ROL';
    this.cargarResumen();
  }

  cargarResumen(): void {
    // Admin ve conteos completos
    if (this.userRol === 'ADMINISTRADOR') {
      this.usuarioService.getUsuarios().subscribe((u) => (this.totalUsuarios = u.length));
      this.clienteService.getClientes().subscribe((c) => (this.totalClientes = c.length));
    }

    this.visitaService.getVisitas().subscribe((v) => {
      this.visitasPendientes = v.filter((x) => x.estado === 'PENDIENTE').length;
      this.visitasFinalizadas = v.filter((x) => x.estado === 'FINALIZADA').length;
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}
