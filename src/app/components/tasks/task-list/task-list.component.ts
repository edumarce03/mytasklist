import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { Task, TaskStatus } from '../../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CommonModule, DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [TaskCardComponent, TaskFormComponent, CommonModule],
  template: `
    <div class="mx-auto p-4">
      <div class="mb-6">
        <p class="text-5xl mb-2">{{ currentListEmoji }}</p>

        <h2 class="text-2xl font-semibold text-gray-300">
          {{ currentListName }}
        </h2>
        <p class="text-sm text-gray-500">
          {{ taskService.tasks().length }} tarea(s)
        </p>
      </div>

      <!-- Task Columns -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Pending Column -->
        <div class="bg-gray-900 shadow rounded-lg p-4 border border-gray-800">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-300">Pendientes</h3>
            <span
              class="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
            >
              {{ getPendingTasks().length }}
            </span>
          </div>

          <div
            class="min-h-[200px] task-column"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event, TaskStatus.PENDING)"
          >
            <!-- Task Cards -->
            <app-task-card
              *ngFor="let task of getPendingTasks()"
              [task]="task"
              (onDelete)="deleteTask($event)"
              (onDragStart)="currentDraggedTask = task"
            >
            </app-task-card>

            <!-- Add Task Form -->
            <div *ngIf="addingColumn === TaskStatus.PENDING; else addButton">
              <app-task-form
                [columnStatus]="TaskStatus.PENDING"
                [listId]="currentListId!"
                (onSave)="saveTask($event)"
                (onCancel)="addingColumn = null"
              >
              </app-task-form>
            </div>

            <ng-template #addButton>
              <button
                (click)="addingColumn = TaskStatus.PENDING"
                class="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-md flex items-center justify-center transition-colors"
              >
                <i class="fas fa-plus mr-2"></i> Añadir tarea
              </button>
            </ng-template>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="bg-gray-900 shadow rounded-lg p-4 border border-gray-800">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-300">En Progreso</h3>
            <span
              class="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
            >
              {{ getInProgressTasks().length }}
            </span>
          </div>

          <div
            class="min-h-[200px] task-column"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event, TaskStatus.IN_PROGRESS)"
          >
            <!-- Task Cards -->
            <app-task-card
              *ngFor="let task of getInProgressTasks()"
              [task]="task"
              (onDelete)="deleteTask($event)"
              (onDragStart)="currentDraggedTask = task"
            >
            </app-task-card>

            <!-- Add Task Form -->
            <div
              *ngIf="
                addingColumn === TaskStatus.IN_PROGRESS;
                else addButtonProgress
              "
            >
              <app-task-form
                [columnStatus]="TaskStatus.IN_PROGRESS"
                [listId]="currentListId!"
                (onSave)="saveTask($event)"
                (onCancel)="addingColumn = null"
              >
              </app-task-form>
            </div>

            <ng-template #addButtonProgress>
              <button
                (click)="addingColumn = TaskStatus.IN_PROGRESS"
                class="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-md flex items-center justify-center transition-colors"
              >
                <i class="fas fa-plus mr-2"></i> Añadir tarea
              </button>
            </ng-template>
          </div>
        </div>

        <!-- Completed Column -->
        <div class="bg-gray-900 shadow rounded-lg p-4 border border-gray-800">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-300">Completadas</h3>
            <span
              class="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
            >
              {{ getCompletedTasks().length }}
            </span>
          </div>

          <div
            class="min-h-[200px] task-column"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event, TaskStatus.COMPLETED)"
          >
            <!-- Task Cards -->
            <app-task-card
              *ngFor="let task of getCompletedTasks()"
              [task]="task"
              (onDelete)="deleteTask($event)"
              (onDragStart)="currentDraggedTask = task"
            >
            </app-task-card>

            <!-- Add Task Form -->
            <div
              *ngIf="
                addingColumn === TaskStatus.COMPLETED;
                else addButtonCompleted
              "
            >
              <app-task-form
                [columnStatus]="TaskStatus.COMPLETED"
                [listId]="currentListId!"
                (onSave)="saveTask($event)"
                (onCancel)="addingColumn = null"
              >
              </app-task-form>
            </div>

            <ng-template #addButtonCompleted>
              <button
                (click)="addingColumn = TaskStatus.COMPLETED"
                class="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-md flex items-center justify-center transition-colors"
              >
                <i class="fas fa-plus mr-2"></i> Añadir tarea
              </button>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .task-column {
        min-height: 250px;
        transition: background-color 0.2s;
      }
      .task-column.drag-over {
        background-color: rgba(14, 165, 233, 0.1);
        border: 2px dashed rgb(14, 165, 233);
      }
    `,
  ],
})
export class TaskListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  listService = inject(ListService);
  taskService = inject(TaskService);

  currentListId: string | null = null;
  currentListName: string = '';
  currentListEmoji: string = '';

  TaskStatus = TaskStatus;
  addingColumn: TaskStatus | null = null;
  currentDraggedTask: Task | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.currentListId = params.get('id');

      if (this.currentListId) {
        const list = this.listService
          .lists()
          .find((l) => l.id === this.currentListId);
        if (list) {
          this.currentListName = list.name;
          this.currentListEmoji = list.emoji || '📝';
          this.taskService.loadTasksByList(this.currentListId);
        } else {
          // Lista no encontrada, redirigir a home
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  getPendingTasks(): Task[] {
    return this.taskService
      .tasks()
      .filter((task) => task.status === TaskStatus.PENDING);
  }

  getInProgressTasks(): Task[] {
    return this.taskService
      .tasks()
      .filter((task) => task.status === TaskStatus.IN_PROGRESS);
  }

  getCompletedTasks(): Task[] {
    return this.taskService
      .tasks()
      .filter((task) => task.status === TaskStatus.COMPLETED);
  }

  saveTask(task: Task): void {
    this.taskService.createTask(task);
    this.addingColumn = null;
  }

  deleteTask(taskId: string | undefined): void {
    if (taskId) {
      this.taskService.deleteTask(taskId);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    // Añadir clase visual para indicar zona de drop
    if (event.currentTarget) {
      (event.currentTarget as HTMLElement).classList.add('drag-over');
    }
  }

  onDragLeave(event: DragEvent): void {
    if (event.currentTarget) {
      (event.currentTarget as HTMLElement).classList.remove('drag-over');
    }
  }

  onDrop(event: DragEvent, newStatus: TaskStatus): void {
    event.preventDefault();

    if (event.currentTarget) {
      (event.currentTarget as HTMLElement).classList.remove('drag-over');
    }

    const taskId = event.dataTransfer?.getData('text/plain');

    if (
      taskId &&
      this.currentDraggedTask &&
      this.currentDraggedTask.status !== newStatus
    ) {
      this.taskService.updateTaskStatus(taskId, newStatus);
    }

    this.currentDraggedTask = null;
  }
}
