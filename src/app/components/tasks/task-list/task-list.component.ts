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
    <div class="mx-auto">
      <!-- Header Section -->
      <div class="my-6 pb-4 flex items-center gap-4">
        <p class="text-5xl leading-none">{{ currentListEmoji }}</p>
        <div class="flex flex-col">
          <h2 class="text-2xl font-semibold text-gray-200">
            {{ currentListName }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ taskService.tasks().length }} tarea(s)
          </p>
        </div>
      </div>

      <!-- Task Columns Container -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        <!-- Divisor Lines (visible solo en md y superior) -->
        <div
          class="hidden lg:block absolute h-full w-px bg-gray-700/50 left-1/3"
        ></div>
        <div
          class="hidden lg:block absolute h-full w-px bg-gray-700/50 left-2/3"
        ></div>

        <!-- Pending Column -->
        <div class="px-4">
          <!-- Column Header -->
          <div class="flex justify-between items-center mb-5">
            <div class="flex items-center">
              <div
                class="flex items-center rounded-full bg-yellow-900/20 px-3 py-1.5"
              >
                <span
                  class="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2"
                ></span>
                <span class="text-yellow-200 font-medium text-xs">Pending</span>
              </div>
              <span
                class="ml-1 px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded-full"
              >
                {{ getPendingTasks().length }}
              </span>
            </div>

            <button
              *ngIf="addingColumn !== TaskStatus.PENDING"
              (click)="addingColumn = TaskStatus.PENDING"
              class="text-gray-300 transition-colors text-xs font-medium flex items-center"
            >
              <i class="fas fa-plus mr-1.5"></i> Añadir
            </button>
          </div>

          <!-- Add Task Form -->
          <div *ngIf="addingColumn === TaskStatus.PENDING" class="mb-4">
            <app-task-form
              [columnStatus]="TaskStatus.PENDING"
              [listId]="currentListId!"
              (onSave)="saveTask($event)"
              (onCancel)="addingColumn = null"
            >
            </app-task-form>
          </div>

          <!-- Tasks Container -->
          <div
            class="min-h-[200px] transition-all duration-200"
            [ngClass]="{
              'bg-gray-800/20 rounded-lg p-2': dropTarget === TaskStatus.PENDING
            }"
            (dragover)="onDragOver($event, TaskStatus.PENDING)"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event, TaskStatus.PENDING)"
          >
            <!-- Task Cards -->
            <div class="space-y-3">
              <app-task-card
                *ngFor="let task of getPendingTasks()"
                [task]="task"
                (onDelete)="deleteTask($event)"
                (onDragStart)="startDrag($event)"
              >
              </app-task-card>
            </div>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="px-4">
          <!-- Column Header -->
          <div class="flex justify-between items-center mb-5">
            <div class="flex items-center">
              <div
                class="flex items-center rounded-full bg-blue-900/20 px-3 py-1.5"
              >
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>
                <span class="text-blue-200 font-medium text-xs"
                  >In Progress</span
                >
              </div>
              <span
                class="ml-1 px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded-full"
              >
                {{ getInProgressTasks().length }}
              </span>
            </div>

            <button
              *ngIf="addingColumn !== TaskStatus.IN_PROGRESS"
              (click)="addingColumn = TaskStatus.IN_PROGRESS"
              class="text-gray-300 hover:text-gray-400 transition-colors text-xs font-medium flex items-center"
            >
              <i class="fas fa-plus mr-1.5"></i> Añadir
            </button>
          </div>

          <!-- Add Task Form -->
          <div *ngIf="addingColumn === TaskStatus.IN_PROGRESS" class="mb-4">
            <app-task-form
              [columnStatus]="TaskStatus.IN_PROGRESS"
              [listId]="currentListId!"
              (onSave)="saveTask($event)"
              (onCancel)="addingColumn = null"
            >
            </app-task-form>
          </div>

          <!-- Tasks Container -->
          <div
            class="min-h-[200px] transition-all duration-200"
            [ngClass]="{
              'bg-gray-800/20 rounded-lg p-2':
                dropTarget === TaskStatus.IN_PROGRESS
            }"
            (dragover)="onDragOver($event, TaskStatus.IN_PROGRESS)"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event, TaskStatus.IN_PROGRESS)"
          >
            <!-- Task Cards -->
            <div class="space-y-3">
              <app-task-card
                *ngFor="let task of getInProgressTasks()"
                [task]="task"
                (onDelete)="deleteTask($event)"
                (onDragStart)="startDrag($event)"
              >
              </app-task-card>
            </div>
          </div>
        </div>

        <!-- Completed Column -->
        <div class="px-4">
          <!-- Column Header -->
          <div class="flex justify-between items-center mb-5">
            <div class="flex items-center">
              <div
                class="flex items-center rounded-full bg-green-900/20 px-3 py-1.5"
              >
                <span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                <span class="text-green-200 font-medium text-xs"
                  >Completed</span
                >
              </div>
              <span
                class="ml-1 px-2 py-0.5 bg-gray-800 text-gray-400 text-[10px] rounded-full"
              >
                {{ getCompletedTasks().length }}
              </span>
            </div>

            <button
              *ngIf="addingColumn !== TaskStatus.COMPLETED"
              (click)="addingColumn = TaskStatus.COMPLETED"
              class="text-gray-300 hover:text-gray-400 transition-colors text-xs font-medium flex items-center"
            >
              <i class="fas fa-plus mr-1.5"></i> Añadir
            </button>
          </div>

          <!-- Add Task Form -->
          <div *ngIf="addingColumn === TaskStatus.COMPLETED" class="mb-4">
            <app-task-form
              [columnStatus]="TaskStatus.COMPLETED"
              [listId]="currentListId!"
              (onSave)="saveTask($event)"
              (onCancel)="addingColumn = null"
            >
            </app-task-form>
          </div>

          <!-- Tasks Container -->
          <div
            class="min-h-[200px] transition-all duration-200"
            [ngClass]="{
              'bg-gray-800/20 rounded-lg p-2':
                dropTarget === TaskStatus.COMPLETED
            }"
            (dragover)="onDragOver($event, TaskStatus.COMPLETED)"
            (dragleave)="onDragLeave()"
            (drop)="onDrop($event, TaskStatus.COMPLETED)"
          >
            <!-- Task Cards -->
            <div class="space-y-3">
              <app-task-card
                *ngFor="let task of getCompletedTasks()"
                [task]="task"
                (onDelete)="deleteTask($event)"
                (onDragStart)="startDrag($event)"
              >
              </app-task-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
  dropTarget: TaskStatus | null = null;

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

  startDrag(event: { task: Task; event: DragEvent }): void {
    this.currentDraggedTask = event.task;
  }

  onDragOver(event: DragEvent, status: TaskStatus): void {
    event.preventDefault();
    this.dropTarget = status;
  }

  onDragLeave(): void {
    this.dropTarget = null;
  }

  onDrop(event: DragEvent, newStatus: TaskStatus): void {
    event.preventDefault();
    this.dropTarget = null;

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
