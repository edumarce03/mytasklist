import { Component, inject } from '@angular/core';
import { ListService } from '../../../services/list.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskList } from '../../../models/list.model';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, PickerComponent],
  template: `
    <aside class="h-full flex flex-col bg-black text-gray-100">
      <div class="p-5 flex justify-between items-center ">
        <h2 class="text-lg font-semibold text-white">Lista de Tareas</h2>
        <button
          (click)="toggleCreateForm()"
          class="bg-gray-600 text-white w-6 h-6 flex items-center justify-center rounded-full transition-colors text-xs
          "
        >
          <i
            class="fas"
            [class.fa-plus]="!showCreateForm"
            [class.fa-times]="showCreateForm"
          ></i>
        </button>
      </div>

      <!-- Create form -->
      @if (showCreateForm) {
      <div class="px-6 py-6 border-b border-gray-700 ">
        <form (submit)="createList(); $event.preventDefault()">
          <h2 class="text-lg font-semibold text-white my-3">Crear una Lista</h2>

          <div class="flex items-center gap-2 mb-4">
            <button
              type="button"
              (click)="showEmojiPicker = !showEmojiPicker"
              class="bg-transparent border border-gray-700 focus:outline-none focus:border-cyan-600 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            >
              {{ selectedEmoji || '😀' }}
            </button>
            <input
              type="text"
              [(ngModel)]="newListName"
              name="listName"
              placeholder="Nombre de la lista"
              class="flex-1 px-3 py-2 bg-transparent border border-gray-700 rounded text-sm text-gray-200 focus:outline-none focus:border-cyan-600"
            />
          </div>

          @if (showEmojiPicker) {
          <div class="relative z-10 mb-4">
            <emoji-mart
              [enableSearch]="true"
              [showPreview]="true"
              [darkMode]="true"
              [emojiSize]="20"
              (emojiSelect)="selectEmoji($event)"
              title="Selecciona un emoji"
              class="block rounded-md overflow-hidden"
              [style]="{ width: '100%' }"
            ></emoji-mart>
          </div>
          }

          <div class="flex justify-end">
            <button
              type="submit"
              [disabled]="!newListName.trim()"
              class="px-4 py-2 bg-cyan-800 text-white rounded text-sm hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
      }

      <!-- Lists -->
      <div class="flex-1 overflow-y-auto">
        <ul class="space-y-1 p-2">
          @for (list of listService.lists(); track list.id) {
          <li class="group">
            <div
              class="flex items-center justify-between px-4 py-4 rounded hover:bg-cyan-900/50 transition-colors"
            >
              @if (editingListId === list.id) {
              <div class="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  (click)="showEmojiPickerForEdit = !showEmojiPickerForEdit"
                  class="bg-transparent flex items-center justify-center transition-colors"
                >
                  <span class="text-2xl">{{
                    editedEmoji || list.emoji || '📝'
                  }}</span>
                </button>
                <input
                  type="text"
                  [(ngModel)]="editedListName"
                  name="editName"
                  class="bg-transparent w-full py-1 text-sm text-white focus:outline-none"
                  (keydown.enter)="saveListName(list.id)"
                  (keydown.escape)="cancelEditing()"
                  #editInput
                />
              </div>
              } @else {
              <a
                [routerLink]="['/profile/list', list.id]"
                routerLinkActive="text-cyan-400 font-medium"
                class="flex items-center gap-2 flex-1"
              >
                <span class="text-2xl">{{ list.emoji || '📝' }}</span>
                <span class="text-sm truncate">{{ list.name }}</span>
              </a>
              }

              <div class="flex gap-2">
                @if (editingListId === list.id) {
                <div class="flex gap-2">
                  <button
                    (click)="saveListName(list.id)"
                    class="bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 w-7 h-7 flex items-center justify-center rounded transition-colors text-xs"
                    title="Guardar"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    (click)="cancelEditing()"
                    class="bg-red-600/20 text-red-400 hover:bg-red-600/30 w-7 h-7 flex items-center justify-center rounded transition-colors text-xs"
                    title="Cancelar"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                } @else {
                <div class="flex gap-2">
                  <button
                    (click)="startEditing(list)"
                    class="bg-gray-600/20 text-gray-300 hover:bg-gray-600/30 w-7 h-7 flex items-center justify-center rounded transition-colors text-xs"
                    title="Editar lista"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    (click)="deleteList(list.id)"
                    class="bg-red-600/20 text-red-400 hover:bg-red-600/30 w-7 h-7 flex items-center justify-center rounded transition-colors text-xs"
                    title="Eliminar lista"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                }
              </div>
            </div>

            @if (editingListId === list.id && showEmojiPickerForEdit) {
            <div class="py-1 mt-1 mb-2 relative z-10">
              <emoji-mart
                [enableSearch]="true"
                [showPreview]="true"
                [darkMode]="true"
                [emojiSize]="20"
                (emojiSelect)="selectEmojiForEdit($event)"
                title="Selecciona un emoji"
                class="block rounded-md overflow-hidden"
                [style]="{ width: '100%' }"
              ></emoji-mart>
            </div>
            }
          </li>
          }
        </ul>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  listService = inject(ListService);

  // Nueva lista
  newListName = '';
  selectedEmoji = '';
  showCreateForm = false;
  showEmojiPicker = false;

  // Edición
  editingListId: string | null = null;
  editedListName = '';
  editedEmoji = '';
  showEmojiPickerForEdit = false;

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.showEmojiPicker = false;
      this.newListName = '';
      this.selectedEmoji = '';
    }
  }

  selectEmoji(event: any) {
    this.selectedEmoji = event.emoji.native;
    this.showEmojiPicker = false;
  }

  selectEmojiForEdit(event: any) {
    this.editedEmoji = event.emoji.native;
    this.showEmojiPickerForEdit = false;
  }

  createList() {
    if (this.newListName.trim()) {
      this.listService.createList(this.newListName, this.selectedEmoji);
      this.newListName = '';
      this.selectedEmoji = '';
      this.showEmojiPicker = false;
      this.showCreateForm = false;
    }
  }

  startEditing(list: TaskList) {
    this.editingListId = list.id || null;
    this.editedListName = list.name;
    this.editedEmoji = list.emoji || '';
    this.showEmojiPickerForEdit = false;

    // Focus the input after render
    setTimeout(() => {
      const inputElement = document.querySelector(
        'input[name="editName"]'
      ) as HTMLInputElement;
      inputElement?.focus();
    }, 0);
  }

  cancelEditing() {
    this.editingListId = null;
    this.editedListName = '';
    this.editedEmoji = '';
    this.showEmojiPickerForEdit = false;
  }

  async saveListName(listId: string | undefined) {
    if (listId && this.editedListName.trim()) {
      await this.listService.updateList(
        listId,
        this.editedListName,
        this.editedEmoji
      );
      this.cancelEditing();
    }
  }

  async deleteList(listId: string | undefined) {
    if (
      listId &&
      confirm('¿Estás seguro de que quieres eliminar esta lista?')
    ) {
      await this.listService.deleteList(listId);
    }
  }
}
