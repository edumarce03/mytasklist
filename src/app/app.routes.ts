import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard, publicOnlyGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TaskHomeComponent } from './components/tasks/task-home/task-home.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicOnlyGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicOnlyGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: TaskHomeComponent,
      },
      {
        path: 'list/:id',
        component: TaskListComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
