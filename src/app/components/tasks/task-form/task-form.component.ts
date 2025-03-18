import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskDifficulty, TaskStatus } from '../../../models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, CommonModule],
  template: `
    <div
      class="bg-transparent rounded-xl p-6 shadow-md border border-gray-700/50"
    >
      <form (ngSubmit)="onSubmit()">
        <!-- Título -->
        <div class="mb-3">
          <label class="text-xs text-gray-200 block mb-3 font-medium"
            >Título de la tarea</label
          >
          <input
            type="text"
            [(ngModel)]="task.title"
            name="title"
            placeholder="Ingresa el título"
            class="text-sm w-full bg-transparent text-gray-200 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-200"
            required
            autocomplete="off"
          />
        </div>

        <!-- Descripción -->
        <div class="mb-3">
          <label class="text-xs text-gray-200 block mb-3 font-medium"
            >Descripción</label
          >
          <textarea
            [(ngModel)]="task.description"
            name="description"
            placeholder="Descripción (opcional)"
            class="text-sm resize-none w-full bg-transparent text-gray-200 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-200"
            rows="2"
          ></textarea>
        </div>

        <!-- URL de imagen -->
        <div class="mb-3">
          <label class="text-xs text-gray-200 block mb-3 font-medium"
            >URL de imagen</label
          >
          <div class="flex">
            <div class="flex-grow">
              <input
                type="url"
                [(ngModel)]="task.imageUrl"
                name="imageUrl"
                placeholder="URL de imagen (opcional)"
                class="text-sm w-full bg-transparent text-gray-200 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-gray-200"
                autocomplete="off"
              />
            </div>
          </div>
        </div>

        <!-- Fecha inicio -->
        <div class="mb-3">
          <label class="text-xs text-gray-200 block mb-3 font-medium"
            >Fecha de inicio</label
          >
          <input
            type="date"
            [(ngModel)]="startDateStr"
            name="startDate"
            class="text-sm w-full bg-transparent text-gray-200 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <!-- Fecha fin -->
        <div class="mb-3">
          <label class="text-xs text-gray-200 block mb-3 font-medium"
            >Fecha de finalización</label
          >
          <input
            type="date"
            [(ngModel)]="endDateStr"
            name="endDate"
            class="text-sm w-full bg-transparent text-gray-200 border border-white/20 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <!-- Dificultad -->
        <div class="mb-4">
          <label class="text-xs text-gray-200 block mb-3 font-medium"
            >Dificultad</label
          >
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              class="py-2 px-3 rounded-lg border text-sm font-medium transition-colors"
              [ngClass]="{
                'bg-green-900/20 border-green-700/30 text-green-400':
                  task.difficulty === TaskDifficulty.LOW,
                'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-700/30':
                  task.difficulty !== TaskDifficulty.LOW
              }"
              (click)="task.difficulty = TaskDifficulty.LOW"
            >
              Baja
            </button>
            <button
              type="button"
              class="py-2 px-3 rounded-lg border text-sm font-medium transition-colors"
              [ngClass]="{
                'bg-yellow-900/20 border-yellow-700/30 text-yellow-400':
                  task.difficulty === TaskDifficulty.MEDIUM,
                'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-700/30':
                  task.difficulty !== TaskDifficulty.MEDIUM
              }"
              (click)="task.difficulty = TaskDifficulty.MEDIUM"
            >
              Media
            </button>
            <button
              type="button"
              class="py-2 px-3 rounded-lg border text-sm font-medium transition-colors"
              [ngClass]="{
                'bg-red-900/20 border-red-700/30 text-red-400':
                  task.difficulty === TaskDifficulty.HIGH,
                'bg-transparent border-gray-700 text-gray-400 hover:bg-gray-700/30':
                  task.difficulty !== TaskDifficulty.HIGH
              }"
              (click)="task.difficulty = TaskDifficulty.HIGH"
            >
              Alta
            </button>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 mt-5">
          <button
            type="button"
            class="bg-transparent border border-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700/30 transition-colors text-xs font-medium"
            (click)="onCancel.emit()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-cyan-600 text-white py-2 px-6 rounded-lg hover:bg-cyan-500 transition-colors text-xs font-medium"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  `,
})
export class TaskFormComponent {
  @Input() columnStatus!: TaskStatus;
  @Input() listId!: string;
  @Output() onSave = new EventEmitter<Task>();
  @Output() onCancel = new EventEmitter<void>();

  TaskDifficulty = TaskDifficulty;

  startDateStr: string = '';
  endDateStr: string = '';

  task: Partial<Task> = {
    title: '',
    description: '',
    imageUrl: '',
    difficulty: TaskDifficulty.MEDIUM,
  };

  onSubmit() {
    if (!this.task.title) return;

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: this.task.title,
      description: this.task.description || '',
      imageUrl: this.task.imageUrl || '',
      difficulty: this.task.difficulty || TaskDifficulty.MEDIUM,
      status: this.columnStatus,
      listId: this.listId,
      startDate: this.startDateStr ? new Date(this.startDateStr) : undefined,
      endDate: this.endDateStr ? new Date(this.endDateStr) : undefined,
    };

    this.onSave.emit(newTask as Task);
    this.resetForm();
  }

  resetForm() {
    this.task = {
      title: '',
      description: '',
      imageUrl: '',
      difficulty: TaskDifficulty.MEDIUM,
    };
    this.startDateStr = '';
    this.endDateStr = '';
  }
}
