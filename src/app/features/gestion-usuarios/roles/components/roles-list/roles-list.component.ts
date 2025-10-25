import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Listado de Roles</h4>
              <p class="card-text">
                Este es un componente de ejemplo para el listado de roles.
              </p>
              <!-- Aquí irá la tabla de roles -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RolesListComponent {}
