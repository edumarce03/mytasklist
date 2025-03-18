// Archivo: components/create-list-modal/create-list-modal.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ModalService } from '../../services/modal.service';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-create-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerComponent],
  template: `
    @if (modalService.showCreateListModal()) {
    <div
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-neutral-800 rounded-lg shadow-xl w-full max-w-xs md:max-w-md border border-gray-700 animate-fadeIn"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex justify-between items-center p-4 border-b border-gray-700"
        >
          <h2 class="text-lg font-semibold text-white">Crear nueva lista</h2>
          <button
            (click)="closeModal()"
            class="bg-neutral-700 hover:bg-neutral-600 text-white w-7 h-7 flex items-center justify-center rounded-full transition-colors"
          >
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <!-- Form -->
        <div class="p-5">
          <form (submit)="createList(); $event.preventDefault()">
            <div class="flex items-center gap-3 mb-4">
              <button
                type="button"
                (click)="showEmojiPicker = !showEmojiPicker"
                class=" border border-gray-600 hover:border-cyan-600 focus:outline-none focus:border-cyan-600 w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              >
                {{ selectedEmoji || '😀' }}
              </button>
              <div class="flex-1">
                <label class="block text-xs text-gray-400 mb-1 ml-1"
                  >Nombre de la lista</label
                >
                <input
                  type="text"
                  [(ngModel)]="newListName"
                  name="listName"
                  placeholder="Ej: Tareas diarias"
                  maxlength="50"
                  class="w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded text-sm text-gray-200 focus:outline-none focus:border-cyan-600"
                />
              </div>
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

            <div class="flex justify-end gap-2 mt-6">
              <button
                type="button"
                (click)="closeModal()"
                class="px-4 py-2 bg-neutral-700 text-gray-300 rounded text-sm hover:bg-neutral-600 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="!newListName.trim()"
                class="px-4 py-2 bg-cyan-700 text-white rounded text-sm hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Crear lista
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class CreateListModalComponent {
  modalService = inject(ModalService);
  listService = inject(ListService);

  newListName = '';
  selectedEmoji = '';
  showEmojiPicker = false;

  closeModal() {
    this.modalService.closeCreateListModal();
    this.resetForm();
  }

  selectEmoji(event: any) {
    this.selectedEmoji = event.emoji.native;
    this.showEmojiPicker = false;
  }

  createList() {
    if (this.newListName.trim()) {
      this.listService.createList(this.newListName, this.selectedEmoji);
      this.resetForm();
      this.closeModal();
    }
  }

  private resetForm() {
    this.newListName = '';
    this.selectedEmoji = '';
    this.showEmojiPicker = false;
  }
}
