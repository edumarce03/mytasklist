import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700 mb-3 cursor-grab hover:shadow-lg transition-all duration-200"
      [attr.draggable]="true"
      (dragstart)="handleDragStart($event)"
    >
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-medium text-gray-200 break-words">{{ task.title }}</h3>

        <div class="flex space-x-1">
          <span
            class="px-2 py-1 text-xs rounded-full"
            [ngClass]="{
              'bg-green-900 text-green-200': task.difficulty === 'low',
              'bg-yellow-900 text-yellow-200': task.difficulty === 'medium',
              'bg-red-900 text-red-200': task.difficulty === 'high'
            }"
          >
            {{ task.difficulty }}
          </span>

          <button
            class="text-gray-400 hover:text-red-400 text-sm"
            (click)="onDelete.emit(task.id)"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <p *ngIf="task.description" class="text-sm text-gray-400 mb-2">
        {{ task.description }}
      </p>

      <img
        *ngIf="task.imageUrl"
        [src]="task.imageUrl"
        class="w-full h-32 object-cover rounded mb-2"
      />

      <div class="flex justify-between text-xs text-gray-500 mt-2">
        <div *ngIf="task.startDate">
          <span>Inicio: {{ task.startDate | date : 'shortDate' }}</span>
        </div>
        <div *ngIf="task.endDate">
          <span>Fin: {{ task.endDate | date : 'shortDate' }}</span>
        </div>
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
