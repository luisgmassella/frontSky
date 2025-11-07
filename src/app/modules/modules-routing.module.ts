import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { ClientListComponent } from './dashboard/client-list/client-list.component';
import { UserFormComponent } from './dashboard/user-form/user-form.component';
import { ClientFormComponent } from './dashboard/client-form/client-form.component';
import { VisitaListComponent } from './dashboard/visit-list/visit-list.component';
import { VisitFormComponent } from './dashboard/visit-form/visit-form.component';
import { AuthGuard } from 'src/app/guards/auth.guard'; // ✅ Importación del guard

const routes: Routes = [
  // 🔹 Ruta del login (sin protección)
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },

  // 🔹 Rutas del panel principal (Dashboard protegido)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // ✅ Aplica la protección aquí
    children: [
      // 🔸 Usuarios
      { path: 'usuarios', component: UserListComponent },
      { path: 'usuarios/crear', component: UserFormComponent },
      { path: 'usuarios/editar/:id', component: UserFormComponent },

      // 🔸 Clientes
      { path: 'clientes', component: ClientListComponent },
      { path: 'clientes/nuevo', component: ClientFormComponent },
      { path: 'clientes/editar/:id', component: ClientFormComponent },

      // 🔸 Visitas
      { path: 'visitas', redirectTo: 'visitas/listado', pathMatch: 'full' },
      { path: 'visitas/listado', component: VisitaListComponent },
      { path: 'visitas/registrar', component: VisitFormComponent },
      { path: 'visitas/ver/:id', component: VisitFormComponent },

      // 🔸 Redirección por defecto dentro del dashboard
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },

  // 🔹 Redirección raíz (inicio)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔹 Ruta comodín (404)
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule {}
