import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountsComponent } from './accounts/accounts.component';
import { MainViewPortComponent } from './main-view-port/main-view-port.component';
import { PerformanceComponent } from './performance/performance.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    MainViewPortComponent,
    PerformanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
