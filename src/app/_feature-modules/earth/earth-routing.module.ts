import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EarthComponent } from './earth.component';

const routes: Routes = [
  { path: '', component: EarthComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarthRoutingModule { }
