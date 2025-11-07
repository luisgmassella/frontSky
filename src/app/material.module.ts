import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModulesRoutingModule } from './modules/modules-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, ModulesRoutingModule, HttpClientModule],
  exports: [ReactiveFormsModule, ModulesRoutingModule, CommonModule, HttpClientModule],
})
export class MaterialModule {}
