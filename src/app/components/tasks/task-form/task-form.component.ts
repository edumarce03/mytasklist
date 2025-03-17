import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskDifficulty, TaskStatus } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  template: `
    <div class="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
      <form (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <input
            type="text"
            [(ngModel)]="task.title"
            name="title"
            placeholder="Título de la tarea"
            class="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            required
          />
        </div>

        <div class="mb-3">
          <textarea
            [(ngModel)]="task.description"
            name="description"
            placeholder="Descripción (opcional)"
            class="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            rows="2"
          ></textarea>
        </div>

        <div class="mb-3">
          <input
            type="url"
            [(ngModel)]="task.imageUrl"
            name="imageUrl"
            placeholder="URL de imagen (opcional)"
            class="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div class="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label class="text-xs text-gray-400 block mb-1">Fecha inicio</label>
            <input
              type="date"
              [(ngModel)]="startDateStr"
              name="startDate"
              class="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label class="text-xs text-gray-400 block mb-1">Fecha fin</label>
            <input
              type="date"
              [(ngModel)]="endDateStr"
              name="endDate"
              class="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
        </div>

        <div class="mb-4">
          <label class="text-xs text-gray-400 block mb-1">Dificultad</label>
          <select
            [(ngModel)]="task.difficulty"
            name="difficulty"
            class="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          >
            <option [value]="TaskDifficulty.LOW">Baja</option>
            <option [value]="TaskDifficulty.MEDIUM">Media</option>
            <option [value]="TaskDifficulty.HIGH">Alta</option>
          </select>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-700 text-gray-300 py-2 px-4 rounded-md mr-2 hover:bg-gray-600"
            (click)="onCancel.emit()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-cyan-700 text-white py-2 px-4 rounded-md hover:bg-cyan-600"
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
