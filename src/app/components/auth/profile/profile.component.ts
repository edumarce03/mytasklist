import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
