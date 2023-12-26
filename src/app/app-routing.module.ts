import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'add-operation',
    loadChildren: () => import('./add-operation/add-operation.module').then( m => m.AddOperationPageModule)
  },
  {
    path: '',
    redirectTo: 'add-operation',
    pathMatch: 'full'
  },
  {
    path: 'add-operation',
    loadChildren: () => import('./add-operation/add-operation.module').then( m => m.AddOperationPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
