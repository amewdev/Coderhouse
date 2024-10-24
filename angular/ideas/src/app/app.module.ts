import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './components/home/home.component';
import { provideNativeDateAdapter } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
