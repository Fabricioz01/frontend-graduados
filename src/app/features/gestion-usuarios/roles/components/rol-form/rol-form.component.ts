import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rol-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Formulario de Rol</h4>
              <p class="card-text">
                Este es un componente de ejemplo para el formulario de rol.
              </p>
              <!-- Aquí irá el formulario de rol -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RolFormComponent {}
