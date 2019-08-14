import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { DrawingboardComponent } from './drawingboard/drawingboard.component';
import { FileUploadModule } from 'ng2-file-upload'
import {CommonModule} from '@angular/common'
import { HttpClientModule }    from '@angular/common/http';
import { ServiceService } from './service/service.service';
import { AppRoutingModule } from './app-routing.module'
import { Router } from 'backbone';
import { AddconstraintComponent } from './addconstraint/addconstraint.component';
import { ClockdiagramDetailComponent } from './clockdiagram-detail/clockdiagram-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';


@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    LeftbarComponent,
    RightbarComponent,
    DrawingboardComponent,
    AddconstraintComponent,
    ClockdiagramDetailComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FileUploadModule,
    HttpClientModule,
    AppRoutingModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [ServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
