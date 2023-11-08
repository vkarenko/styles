import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EarthRoutingModule } from './earth-routing.module';
import { EarthComponent } from './earth.component';


@NgModule({
  declarations: [
    EarthComponent
  ],
  imports: [
    CommonModule,
    EarthRoutingModule
  ]
})
export class EarthModule { }
