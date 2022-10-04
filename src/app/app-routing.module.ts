import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'meekolony',
    pathMatch: 'full',
  },
  {
    path: 'meekolony',
    loadChildren: () =>
      import('./modules/meekolony/meekolony.module').then(
        (m) => m.MeekolonyModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
