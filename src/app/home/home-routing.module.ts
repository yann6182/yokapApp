import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      {
        path: 'dashboard',
        loadChildren: () => import('../page/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },


      {
        path: 'historiques',
        loadChildren: () => import('../page/historiques/historiques.module').then( m => m.HistoriquesPageModule)
      },
      {
        path: 'reglages',
        loadChildren: () => import('../page/reglages/reglages.module').then( m => m.ReglagesPageModule)
      },
      {
        path: 'operations',
        loadChildren: () => import('../page/operations/operations.module').then( m => m.OperationsPageModule)
      },
      {
        path: 'operation-modal',
        loadChildren: () => import('../page/operation-modal/operation-modal.module').then( m => m.OperationModalPageModule)
      },
      {
        path: 'profil',
        loadChildren: () => import('../page/profil/profil.module').then( m => m.ProfilPageModule)
      },
        {
        path: '',
        redirectTo: '/home/dashboard',
        pathMatch: 'full'
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
