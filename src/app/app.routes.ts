import { Routes } from '@angular/router';
import { LoadComponent } from './pages/load/load.component';
import { AllweatherComponent } from './pages/allweather/allweather.component';
import { MenuComponent } from './components/menu/menu.component';

export const routes: Routes = [
  {
    path: 'loadData',
    component: LoadComponent,
  },
  {
    path: 'allData',
    component: AllweatherComponent,
  },
  { path: '', pathMatch: 'full', component: MenuComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];
