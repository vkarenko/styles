import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    title: 'My App | Home',
    // canActivate: [ authorizedGuard ],
    component: HomeComponent, pathMatch: 'full'
  },
  {
    path: 'earth', pathMatch: 'full',
    title : 'My App | Erth',
    loadChildren: () => import('./_feature-modules/earth/earth.module').then(mod => mod.EarthModule)
  },
  {
    path: 'form', pathMatch: 'full',
    title : 'My App | Form',
    loadChildren: () => import('./_feature-modules/form/form.module').then(mod => mod.FormModule)
  },

  // this one should be always the last one
  // used for cases when user enters non-existing path which is not handled by any of the above routes
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
