import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo',
    pathMatch: 'full',
  },

  {
    path: 'todo',
    loadComponent: () =>
      import('./Components/todo/todo.component').then((m) => m.TodoComponent),
  },
];
