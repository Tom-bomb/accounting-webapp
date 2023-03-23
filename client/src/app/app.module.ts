import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountsComponent } from './accounts/accounts.component';
import { MainViewPortComponent } from './main-view-port/main-view-port.component';
import { PerformanceComponent } from './performance/performance.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { AccountTableComponent } from './accounts/account-table/account-table.component';
import { AccountRowComponent } from './accounts/account-row/account-row.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    MainViewPortComponent,
    PerformanceComponent,
    AccountTableComponent,
    AccountRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatTreeModule,
    MatIconModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
