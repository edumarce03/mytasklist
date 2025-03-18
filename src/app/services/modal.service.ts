import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showCreateListModal = signal(false);

  openCreateListModal() {
    this.showCreateListModal.set(true);
  }

  closeCreateListModal() {
    this.showCreateListModal.set(false);
  }
}
