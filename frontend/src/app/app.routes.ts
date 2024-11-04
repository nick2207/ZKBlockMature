import { Routes } from '@angular/router';
import { ResultPageComponent } from './result-page/result-page.component';
import { DatainputformComponent } from './datainputform/datainputform.component';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
    { path: 'result-page', component: ResultPageComponent },
    { path: 'check-your-age', component: DatainputformComponent},
    { path: 'homepage', component: HomepageComponent},
    { path: '**', redirectTo: '/homepage' }
];
