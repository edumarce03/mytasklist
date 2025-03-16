import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="bg-black shadow-lg border-b border-gray-800 py-5 px-6 flex justify-between items-center"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3" *ngIf="authService.currentUser()">
          <div class="relative">
            <img
              [src]="
                authService.currentUser()?.photoURL ||
                'assets/default-avatar.png'
              "
              alt="Profile"
              class="w-10 h-10 rounded-full border-2 border-cyan-700 object-cover shadow-md"
            />
            <div
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
            ></div>
          </div>

          <div class="flex flex-col">
            <span class="text-sm font-medium text-white">
              {{ authService.currentUser()?.displayName || 'Usuario' }}
            </span>
            <span class="text-xs text-gray-400">
              {{ authService.currentUser()?.email }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          (click)="authService.logout()"
          class="px-4 py-2 bg-gray-800/70 hover:bg-red-700/80 text-gray-200 rounded-md border border-gray-700 text-sm flex items-center gap-2 transition-colors duration-200 hover:text-white"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
