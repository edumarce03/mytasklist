import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-transparent rounded-lg p-4 shadow-md border border-gray-700/50 mb-3 cursor-grab hover:shadow-lg transition-all duration-200"
      [attr.draggable]="true"
      (dragstart)="handleDragStart($event)"
    >
      <!-- Header con título y botón de eliminar -->
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-medium text-gray-200 break-words text-lg">
          {{ task.title }}
        </h3>

        <button
          class="text-gray-400 hover:text-red-400 p-1"
          (click)="onDelete.emit(task.id)"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>

      <!-- Descripción -->
      <p *ngIf="task.description" class="text-sm text-gray-400 mb-3">
        {{ task.description }}
      </p>

      <!-- Imagen -->
      <div *ngIf="task.imageUrl" class="mb-3">
        <img
          [src]="task.imageUrl"
          class="w-full h-36 object-cover rounded-md"
          alt="Imagen de tarea"
        />
      </div>

      <!-- Footer con fechas y etiqueta de dificultad -->
      <div class="flex justify-between items-center mt-2">
        <!-- Fechas con flecha -->
        <div
          *ngIf="task.startDate || task.endDate"
          class="text-xs text-gray-400 flex items-center"
        >
          <span *ngIf="task.startDate">{{
            task.startDate | date : 'dd/MM/yy'
          }}</span>
          <i
            *ngIf="task.startDate && task.endDate"
            class="fas fa-arrow-right mx-2 text-gray-500"
          ></i>
          <span *ngIf="task.endDate">{{
            task.endDate | date : 'dd/MM/yy'
          }}</span>
        </div>

        <!-- Etiqueta de dificultad -->
        <span
          class="px-2.5 py-1 text-xs rounded-full flex items-center"
          [ngClass]="{
            'bg-green-900/70 text-green-300 border border-green-700/50':
              task.difficulty === 'low',
            'bg-yellow-900/70 text-yellow-300 border border-yellow-700/50':
              task.difficulty === 'medium',
            'bg-red-900/70 text-red-300 border border-red-700/50':
              task.difficulty === 'high'
          }"
        >
          {{ task.difficulty }}
        </span>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() onDelete = new EventEmitter<string>();
  @Output() onDragStart = new EventEmitter<{ task: Task; event: DragEvent }>();

  handleDragStart(event: DragEvent) {
    if (this.task.id) {
      event.dataTransfer?.setData('text/plain', this.task.id);
      this.onDragStart.emit({ task: this.task, event });
    }
  }
}
