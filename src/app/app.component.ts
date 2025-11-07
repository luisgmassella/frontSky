import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', // Asume que tienes un app.component.html
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Título de la aplicación, útil para la pestaña del navegador o encabezados
  title = 'Angular App con Login';

  constructor() {
    // Aquí puedes inicializar servicios o estados globales
  }
}
