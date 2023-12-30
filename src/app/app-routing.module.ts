import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { AddOperationPage } from './add-operation/add-operation.page';

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
  }
  
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
