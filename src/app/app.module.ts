import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { FileUploadModule } from 'ng2-file-upload'
import {CommonModule} from '@angular/common'
import { HttpClientModule }    from '@angular/common/http';
import { ServiceService } from './service/service.service';
import { CookieService } from "ngx-cookie-service";
import { AppRoutingModule } from './app-routing.module'
import { AddconstraintComponent } from './addconstraint/addconstraint.component';
import { ClockdiagramDetailComponent } from './clockdiagram-detail/clockdiagram-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { FormsModule } from '@angular/forms';
import { MainboardComponent } from './mainboard/mainboard.component';
import { LoadprojectComponent } from './loadproject/loadproject.component';
import { Z3checkComponent } from './z3check/z3check.component';

@NgModule({
  declarations: [
    AppComponent,
    AddconstraintComponent,
    ClockdiagramDetailComponent,
    HelpComponent,
    MainboardComponent,
    LoadprojectComponent,
    Z3checkComponent,
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
