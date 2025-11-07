import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';

declare const google: any; // Necesario para usar Google Maps

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  clienteForm!: FormGroup;
  submitted = false;
  map: any;
  marker: any;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService, // ✅ Ahora sí se inyecta correctamente
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre_empresa: ['', Validators.required],
      persona_contacto: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
    });

    this.initMap();
  }

  // 🗺️ Inicializa Google Maps
  initMap(): void {
    const defaultCoords = { lat: 14.6349, lng: -90.5069 }; // Guatemala City
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: defaultCoords,
      zoom: 13,
    });

    this.marker = new google.maps.Marker({
      position: defaultCoords,
      map: this.map,
      draggable: true,
      title: 'Arrastra o haz clic para seleccionar la ubicación',
    });

    // Evento: cuando el usuario arrastra el marcador
    this.marker.addListener('dragend', () => {
      const pos = this.marker.getPosition();
      this.clienteForm.patchValue({
        latitud: pos.lat(),
        longitud: pos.lng(),
      });
    });

    // Evento: cuando el usuario hace clic en el mapa
    this.map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.marker.setPosition({ lat, lng });
      this.clienteForm.patchValue({
        latitud: lat,
        longitud: lng,
      });
    });
  }

  // 🚀 Enviar formulario
  onSubmit(): void {
    this.submitted = true;

    if (this.clienteForm.invalid) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    this.clienteService.createCliente(this.clienteForm.value).subscribe({
      next: () => {
        alert('✅ Cliente creado con éxito.');
        this.router.navigate(['/dashboard/client-list']);
      },
      error: (err: any) => {
        console.error('Error al crear cliente:', err);
        alert('❌ Ocurrió un error al crear el cliente.');
      }
    });
  }

  // 🔙 Cancelar
  onCancel(): void {
    this.router.navigate(['/dashboard/client-list']);
  }
}
