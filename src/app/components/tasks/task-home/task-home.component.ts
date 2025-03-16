import { Component } from '@angular/core';

@Component({
  selector: 'app-task-home',
  imports: [],
  template: `
    <div class="text-center p-10">
      <div class="mb-6">
        <i class="fas fa-list-check text-6xl text-white opacity-30"></i>
      </div>
      <h2 class="text-2xl font-semibold text-gray-300 mb-4">
        Bienvenido a MyTaskList
      </h2>
      <p class="text-gray-500">
        Selecciona una lista de tareas desde el panel lateral o crea una nueva.
      </p>
    </div>
  `,
})
export class TaskHomeComponent {}
