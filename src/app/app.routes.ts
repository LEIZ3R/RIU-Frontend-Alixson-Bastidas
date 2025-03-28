import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/heroes/hero-list/hero-list.component').then(
        (m) => m.HeroListComponent
      ),
  },
];
