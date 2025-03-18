import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CreateListModalComponent } from '../../create-list-modal/create-list-modal.component';

@Component({
  selector: 'app-profile',
  imports: [RouterOutlet, SidebarComponent, CreateListModalComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
