import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [],
  template: `
    <div class=" mx-auto p-4">
      <div class="mb-6">
        <p class="text-5xl mb-2">{{ currentListEmoji }}</p>

        <h2 class="text-2xl font-semibold text-gray-300">
          {{ currentListName }}
        </h2>
        <p class="text-sm text-gray-500">Lista de tareas</p>
      </div>

      <!-- Aquí irán las tareas de la lista cuando las implementemos -->
      <div class="bg-gray-900 shadow rounded-lg p-6 border border-gray-800">
        <div class="text-center py-8">
          <i
            class="fas fa-clipboard-list text-4xl text-cyan-700 opacity-30 mb-4"
          ></i>
          <p class="text-gray-500">
            Pronto implementaremos la funcionalidad para agregar tareas a esta
            lista.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  listService = inject(ListService);

  currentListId: string | null = null;
  currentListName: string = '';
  currentListEmoji: string = '';
  isEditing: boolean = false;
  editedListName: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.currentListId = params.get('id');

      if (this.currentListId) {
        const list = this.listService
          .lists()
          .find((l) => l.id === this.currentListId);
        if (list) {
          this.currentListName = list.name;
          this.currentListEmoji = list.emoji || '';
        } else {
          // Lista no encontrada, redirigir a home
          this.router.navigate(['/profile']);
        }
      }
    });
  }
}
