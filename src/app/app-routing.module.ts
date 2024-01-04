import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IonicNativePlugin } from '@ionic-native/core';
import { DashboardPage } from './page/dashboard/dashboard.page';
import { HomePage } from './home/home.page';
import { HistoriquesPage } from './page/historiques/historiques.page';
import { ReglagesPage } from './page/reglages/reglages.page';
import { SauvegardePage } from './page/sauvegarde/sauvegarde.page';


const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
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
        path: 'historiques',
        children: [
          {
            path: '',
            component: HistoriquesPage,
          },
        ],
      },
      {
        path: 'reglages',
        children: [
          {
            path: '',
            component: ReglagesPage,
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
      }, {
        path: 'profil/reglages',
        children: [
          {
            path: '',
            component: ReglagesPage,
          },
        ],
      },


      {
        path: '',
        redirectTo: '/home/dashboard',
        pathMatch: 'full',
      },
    ],
  },
 
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./page/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'dashboard/historiques',
    loadChildren: () => import('./page/historiques/historiques.module').then( m => m.HistoriquesPageModule)
  },
  {
    path: 'dashboard/reglages',
    loadChildren: () => import('./page/reglages/reglages.module').then( m => m.ReglagesPageModule)
  },
  {
    path: 'dashboard/profil/reglages',
    loadChildren: () => import('./page/reglages/reglages.module').then( m => m.ReglagesPageModule)
  },
  {
    path: 'dashboard/operations',
    loadChildren: () => import('./page/operations/operations.module').then( m => m.OperationsPageModule)
  },
  {
    path: 'dashboard/sauvegarde',
    loadChildren: () => import('./page/sauvegarde/sauvegarde.module').then( m => m.SauvegardePageModule)
  },
  {
    path: 'operation-modal',
    loadChildren: () => import('./page/operation-modal/operation-modal.module').then( m => m.OperationModalPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./page/profil/profil.module').then( m => m.ProfilPageModule)
  },
  
  {
    path: 'slides',
    loadChildren: () => import('./page/slides/slides.module').then( m => m.SlidesPageModule)
  },
  {
    path: 'sauvegarde',
    loadChildren: () => import('./page/sauvegarde/sauvegarde.module').then( m => m.SauvegardePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
