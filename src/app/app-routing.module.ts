import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes , ExtraOptions} from '@angular/router';
import { AddconstraintComponent } from './addconstraint/addconstraint.component';
import { ClockdiagramDetailComponent } from './clockdiagram-detail/clockdiagram-detail.component';
import { HelpComponent } from './help/help.component';
import { MainboardComponent } from './mainboard/mainboard.component';
import { LoadprojectComponent } from './loadproject/loadproject.component';
import { Z3checkComponent } from './z3check/z3check.component';

const routes: Routes = [

  { path: 'help', component: HelpComponent},
  { path: 'mainboard', component: MainboardComponent},
  { path: 'addConstraint/:index/:projectPath', component: AddconstraintComponent },
  { path: 'detail/:indexAndDomainTextAndColour/:projectPath', component: ClockdiagramDetailComponent },
  { path: 'loadproject', component: LoadprojectComponent},
];

const config: ExtraOptions = {
	useHash: true,
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes,config)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
