import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { RestserviceService } from './restservice.service';
import { HttpModule } from '@angular/http';
import { BigvaluePipe } from './bigvalue.pipe';
import { FormsModule} from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import {ToasterModule, ToasterService} from 'angular2-toaster';
//import {BrowserAnimationModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    BigvaluePipe,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ToasterModule.forRoot(),
    FormsModule
    //BrowserAnimationModule
    
  ],
  providers: [RestserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
