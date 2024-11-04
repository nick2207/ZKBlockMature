import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DatainputformComponent } from './datainputform/datainputform.component';
import { ResultPageComponent } from './result-page/result-page.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToolbarComponent, DatainputformComponent, ResultPageComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
}
