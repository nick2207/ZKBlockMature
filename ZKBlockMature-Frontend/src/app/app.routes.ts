// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AgeVerificationComponent } from './age-verification/age-verification.component'; // Adjust path as per your project

export const routes: Routes = [
  //   { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home' route
  //   { path: 'home', component: AppComponent }, // Route to AppComponent (if needed)
  { path: 'verify-age', component: AgeVerificationComponent }, // Route to AgeVerificationComponent
  //   { path: '', pathMatch: 'full', redirectTo: 'verify-age' },
  // Add more routes as needed
];
