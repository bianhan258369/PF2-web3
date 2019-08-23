import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FileUploadModule } from 'ng2-file-upload'
import {CommonModule} from '@angular/common'
import { HttpClientModule }    from '@angular/common/http';
import { ServiceService } from './service/service.service';
import { CookieService } from "ngx-cookie-service";
import { AppRoutingModule } from './app-routing.module'
import { Router } from 'backbone';
import { AddconstraintComponent } from './addconstraint/addconstraint.component';
import { ClockdiagramDetailComponent } from './clockdiagram-detail/clockdiagram-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { FormsModule } from '@angular/forms';
import { MainboardComponent } from './mainboard/mainboard.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { DiagramDescriptionComponent } from './diagram-description/diagram-description.component';
import { TextDescriptionComponent } from './text-description/text-description.component';
import { ProjectionComponent } from './projection/projection.component';
import { ProgressionComponent } from './progression/progression.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SecurityComponent } from './security/security.component';

@NgModule({
  declarations: [
    AppComponent,
    AddconstraintComponent,
    ClockdiagramDetailComponent,
    HelpComponent,
    MainboardComponent,
    WorkflowComponent,
    DiagramDescriptionComponent,
    TextDescriptionComponent,
    ProjectionComponent,
    ProgressionComponent,
    PrivacyComponent,
    SecurityComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FileUploadModule,
    HttpClientModule,
    AppRoutingModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
  ],
  providers: [ServiceService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
