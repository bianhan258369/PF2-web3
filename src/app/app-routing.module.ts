import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddconstraintComponent } from './addconstraint/addconstraint.component';
import { ClockdiagramDetailComponent } from './clockdiagram-detail/clockdiagram-detail.component';
import { DrawingboardComponent } from './drawingboard/drawingboard.component';
import { HelpComponent } from './help/help.component';

const routes: Routes = [
  { path: 'help', component: HelpComponent},
  { path: 'drawingboard', component: DrawingboardComponent },
  { path: 'addConstraint', component: AddconstraintComponent },
  { path: 'detail/:indexAndDomainTextAndColour', component: ClockdiagramDetailComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
