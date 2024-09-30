import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroModule } from './ng-zorro-module';
import { PeoplesComponent } from './pages/peoples/peoples.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { he_IL } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import he from '@angular/common/locales/he';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PeoplesModalComponent } from './components/peoples-modal/peoples-modal.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { DeliveriesModalComponent } from './components/deliveries-modal/deliveries-modal.component';
import { SharedModule } from './shared/shared.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { DistributesComponent } from './pages/distributes/distributes.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SortedComponent } from './pages/sorted/sorted.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PortalModule } from '@angular/cdk/portal';
import { CounterComponent } from './pages/counter/counter.component';
import { PopupModalComponent } from './components/popup-modal/popup-modal.component';
import { DistributesModalComponent } from './components/distributes-modal/distributes-modal.component';
import { LoginComponent } from './pages/login/login.component';
import { StatusTableComponent } from './components/status-table/status-table.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { ScannerComponent } from './pages/scanner/scanner.component';


registerLocaleData(he);

@NgModule({
  declarations: [
    AppComponent,
    PeoplesComponent,
    PeoplesModalComponent,
    DeliveriesComponent,
    DeliveriesModalComponent,
    LayoutComponent,
    DistributesComponent,
    SortedComponent,
    CounterComponent,
    PopupModalComponent,
    DistributesModalComponent,
    LoginComponent,
    StatusTableComponent,
    CommentsComponent,
    ScannerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    ScrollingModule,
    PortalModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: he_IL }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

declare module 'remult' {
  export interface UserInfo {
    pass:string,
    lastLogin:Date
  }
}