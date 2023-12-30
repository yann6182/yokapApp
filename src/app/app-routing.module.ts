import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { AddOperationPage } from './add-operation/add-operation.page';
import { HistoriquePage } from './historique/historique.page';
import { SauvegardePage } from './sauvegarde/sauvegarde.page';

const routes: Routes = [
  
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            component: DashboardPage,
          },
        ],
      },
      {
        path: 'add-operation',
        children: [
          {
            path: '',
            component: AddOperationPage,
          },
        ],
      },{
        path: 'historique',
        children: [
          {
            path: '',
            component: HistoriquePage,
          },
        ],
      },{
        path: 'sauvegarde',
        children: [
          {
            path: '',
            component: SauvegardePage,
          },
        ],
      },
      
     

      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'tabs/dashboard',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'tabs/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'tabs/add-operation',
    loadChildren: () => import('./add-operation/add-operation.module').then( m => m.AddOperationPageModule)
  },
  {
    path: 'tabs/historique',
    loadChildren: () => import('./historique/historique.module').then( m => m.HistoriquePageModule)
  },
  {
    path: 'tabs/sauvegarde',
    loadChildren: () => import('./sauvegarde/sauvegarde.module').then( m => m.SauvegardePageModule)
  },
 
  {
    path: 'add-operation',
    loadChildren: () => import('./add-operation/add-operation.module').then( m => m.AddOperationPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'historique',
    loadChildren: () => import('./historique/historique.module').then( m => m.HistoriquePageModule)
  },
  {
    path: 'sauvegarde',
    loadChildren: () => import('./sauvegarde/sauvegarde.module').then( m => m.SauvegardePageModule)
  }
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
