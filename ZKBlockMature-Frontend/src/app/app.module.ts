// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Import your routes
import { AgeVerificationComponent } from './age-verification/age-verification.component'; // Adjust path as per your project

@NgModule({
  declarations: [
    AppComponent,
    AgeVerificationComponent,
    // Add other components here
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // Register routes using RouterModule.forRoot()
    // Add other modules your app needs (e.g., HttpClientModule, FormsModule)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
