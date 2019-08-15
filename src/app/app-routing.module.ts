import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddconstraintComponent } from './addconstraint/addconstraint.component';
import { ClockdiagramDetailComponent } from './clockdiagram-detail/clockdiagram-detail.component';
import { DrawingboardComponent } from './drawingboard/drawingboard.component';
import { HelpComponent } from './help/help.component';
import { AppComponent } from './app.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { TopbarComponent } from './topbar/topbar.component';

const routes: Routes = [
  //{ path: '', component: AppComponent},
  //{ path: '', redirectTo: '/drawingboard', pathMatch: 'full' },
  { path: 'topbar', component: TopbarComponent},
  { path: 'help', component: HelpComponent},
  { path: 'rightbar', component: RightbarComponent},
  { path: 'drawingboard', component: DrawingboardComponent },
  { path: 'addConstraint/:index', component: AddconstraintComponent },
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
