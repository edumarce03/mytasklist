import { Component, inject, OnInit, signal } from '@angular/core';
import { ListService } from '../../../services/list.service';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskList } from '../../../models/list.model';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule, PickerComponent],
  template: `
    <aside
      class="h-full flex flex-col bg-neutral-800 text-gray-100 transition-all duration-300"
      [class.w-20]="sidebarCollapsed()"
      [class.md:w-80]="!sidebarCollapsed()"
    >
      <!-- Header Section -->
      <div
        class="p-6 flex justify-between items-center border-b border-gray-100/40"
      >
        <h2
          class="text-lg font-semibold text-white"
          [class.hidden]="sidebarCollapsed()"
        >
          Lista de Tareas
        </h2>
        <button
          (click)="toggleSidebar()"
          class="bg-neutral-500/80 text-white w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-neutral-600/80"
          title="{{ sidebarCollapsed() ? 'Expandir menú' : 'Colapsar menú' }}"
        >
          <i
            class="fas text-xs"
            [class.fa-bars]="sidebarCollapsed()"
            [class.fa-chevron-left]="!sidebarCollapsed()"
          ></i>
        </button>
      </div>

      <!-- Lists Header with Create Button -->
      <div class="p-6 flex justify-between items-center">
        @if (!sidebarCollapsed()) {
        <h3 class="text-base font-semibold text-gray-300">Mis listas</h3>
        }
        <button
          (click)="openCreateListModal()"
          class="bg-neutral-500/80 hover:bg-neutral-600/80 text-white w-6 h-6 flex items-center justify-center rounded transition-colors"
          title="Crear nueva lista"
        >
          <i class="fas fa-plus text-xs"></i>
        </button>
      </div>

      <!-- Lists -->
      <div
        class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        <ul class="space-y-1 p-2">
          @for (list of listService.lists(); track list.id) {
          <li class="group">
            <div
              class="flex items-center justify-between px-3 py-3 rounded hover:bg-neutral-600/50 transition-colors hover:rounded-md"
            >
              @if (editingListId === list.id && !sidebarCollapsed()) {
              <div class="flex items-center gap-2 flex-1 max-w-full">
                <button
                  type="button"
                  (click)="showEmojiPickerForEdit = !showEmojiPickerForEdit"
                  class="flex-shrink-0 bg-transparent flex items-center justify-center transition-colors"
                >
                  <span class="text-xl">{{
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
                  maxlength="50"
                  #editInput
                />
              </div>
              } @else {
              <a
                [routerLink]="['/profile/list', list.id]"
                routerLinkActive="text-cyan-400 font-medium"
                class="flex items-center gap-2 flex-1 min-w-0"
                title="{{ list.name }}"
              >
                <span class="text-xl flex-shrink-0">{{
                  list.emoji || '📝'
                }}</span>
                @if (!sidebarCollapsed()) {
                <span class="text-sm truncate">{{ list.name }}</span>
                }
              </a>
              } @if (!sidebarCollapsed()) {
              <div class="flex gap-1 ml-1 flex-shrink-0">
                @if (editingListId === list.id) {
                <div class="flex gap-1">
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
                <div
                  class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
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
              }
            </div>

            @if (editingListId === list.id && showEmojiPickerForEdit &&
            !sidebarCollapsed()) {
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

      <!-- User profile footer -->
      <div class="mt-auto border-t border-gray-100/40 p-3">
        @if (authService.currentUser()) {
        <div
          class="flex items-center justify-between gap-2"
          [class.flex-col]="sidebarCollapsed()"
        >
          <div
            class="flex items-center gap-2"
            [class.flex-col]="sidebarCollapsed()"
          >
            <div class="relative">
              <img
                [src]="
                  authService.currentUser()?.photoURL ||
                  'assets/default-avatar.png'
                "
                alt="Profile"
                class="w-8 h-8 rounded-full border-2 border-cyan-700 object-cover shadow-md"
              />
              <div
                class="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-black"
              ></div>
            </div>
            @if (!sidebarCollapsed()) {
            <div class="flex flex-col">
              <span
                class="text-xs font-medium text-white truncate max-w-[150px]"
              >
                {{ authService.currentUser()?.displayName || 'Usuario' }}
              </span>
              <span class="text-xs text-gray-400 truncate max-w-[150px]">
                {{ authService.currentUser()?.email }}
              </span>
            </div>
            }
          </div>

          <button
            (click)="authService.logout()"
            [class.mt-2]="sidebarCollapsed()"
            class="flex items-center justify-center gap-1 bg-red-700 hover:bg-red-600 text-white rounded transition-all"
            [class.p-2]="sidebarCollapsed()"
            [class.px-3]="!sidebarCollapsed()"
            [class.py-1]="!sidebarCollapsed()"
            title="Cerrar sesión"
          >
            <i class="fas fa-sign-out-alt text-xs"></i>
            @if (!sidebarCollapsed()) {
            <span class="text-xs">Salir</span>
            }
          </button>
        </div>
        }
      </div>
    </aside>
  `,
})
export class SidebarComponent implements OnInit {
  listService = inject(ListService);
  authService = inject(AuthService);
  modalService = inject(ModalService);

  // Sidebar state
  sidebarCollapsed = signal(false);

  // Edición
  editingListId: string | null = null;
  editedListName = '';
  editedEmoji = '';
  showEmojiPickerForEdit = false;

  ngOnInit() {
    // Inicializar sidebar en modo colapsado para dispositivos móviles
    this.sidebarCollapsed.set(window.innerWidth < 768);
  }

  toggleSidebar() {
    this.sidebarCollapsed.update((state) => !state);

    // Si estamos colapsando y hay edición activa, cancelarla
    if (this.sidebarCollapsed()) {
      this.cancelEditing();
    }
  }

  openCreateListModal() {
    this.modalService.openCreateListModal();
  }

  selectEmojiForEdit(event: any) {
    this.editedEmoji = event.emoji.native;
    this.showEmojiPickerForEdit = false;
  }

  startEditing(list: TaskList) {
    // Si el sidebar está colapsado, expandirlo primero
    if (this.sidebarCollapsed()) {
      this.sidebarCollapsed.set(false);
      setTimeout(() => {
        this.setEditingMode(list);
      }, 300); // Esperar a que termine la transición
    } else {
      this.setEditingMode(list);
    }
  }

  private setEditingMode(list: TaskList) {
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
