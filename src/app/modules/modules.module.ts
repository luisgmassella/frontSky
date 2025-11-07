import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 🔹 Importa tus componentes
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientListComponent } from './dashboard/client-list/client-list.component';
import { ClientFormComponent } from './dashboard/client-form/client-form.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { UserFormComponent } from './dashboard/user-form/user-form.component';
import { VisitaListComponent } from './dashboard/visit-list/visit-list.component';
import { VisitFormComponent } from './dashboard/visit-form/visit-form.component';

// 🔹 Routing del módulo
import { ModulesRoutingModule } from './modules-routing.module';

@NgModule({
  // 🔸 SOLO componentes NO-standalone van aquí:
  declarations: [
    ClientFormComponent,
    UserFormComponent,
    VisitFormComponent,
    UserListComponent  // 👈 este no es standalone
  ],

  // 🔸 Los standalone (tienen `standalone: true`) van aquí:
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModulesRoutingModule,
    DashboardComponent,
    ClientListComponent,
    VisitaListComponent
  ]
})
export class ModulesModule { }
