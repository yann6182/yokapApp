import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
     
      {
        path: 'add-operation',
        loadChildren: () => import('../add-operation/add-operation.module').then( m => m.AddOperationPageModule)
      },
      {
        path: 'historique',
        loadChildren: () => import('../historique/historique.module').then( m => m.HistoriquePageModule)
      },
      {
        path: 'sauvegarde',
        loadChildren: () => import('../sauvegarde/sauvegarde.module').then( m => m.SauvegardePageModule)
      },
      
      
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
