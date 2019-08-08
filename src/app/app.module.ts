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
import { ServiceService } from './service.service'

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    LeftbarComponent,
    RightbarComponent,
    DrawingboardComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FileUploadModule,
    HttpClientModule,
  ],
  providers: [ServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
