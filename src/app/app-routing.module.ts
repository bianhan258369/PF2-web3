import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddconstraintComponent } from './addconstraint/addconstraint.component';
import { ClockdiagramDetailComponent } from './clockdiagram-detail/clockdiagram-detail.component';
import { HelpComponent } from './help/help.component';
import { MainboardComponent } from './mainboard/mainboard.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { TextDescriptionComponent } from './text-description/text-description.component';
import { DiagramDescriptionComponent } from './diagram-description/diagram-description.component';
import { ProjectionComponent } from './projection/projection.component';
import { ProgressionComponent } from './progression/progression.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SecurityComponent } from './security/security.component';

const routes: Routes = [

  { path: 'help', component: HelpComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'security', component: SecurityComponent},
  { path: 'textdescription', component: TextDescriptionComponent},
  { path: 'diagramdescription', component: DiagramDescriptionComponent},
  { path: 'projection', component: ProjectionComponent},
  { path: 'progression', component: ProgressionComponent},
  { path: 'workflow', component: WorkflowComponent},
  { path: 'mainboard', component: MainboardComponent},
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
