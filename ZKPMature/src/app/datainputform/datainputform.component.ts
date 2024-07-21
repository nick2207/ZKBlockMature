import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { exec } from 'child_process';

@Component({
  selector: 'app-datainputform',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datainputform.component.html',
  styleUrl: './datainputform.component.css'
})
export class DatainputformComponent {

  selectedDate: Date;
  command = 'node checkAge_js/generate_witness.js checkAge_js/checkAge.wasm input.json witness.wtns';

  inputJson = {
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    currentYear: "",
    currentMonth: "",
    currentDay: ""
  }

  constructor () {
    this.selectedDate = new Date();
  }

  onSubmit() {
    let currentDate = new Date();
    this.inputJson.birthYear = this.selectedDate.getFullYear().toString();
    this.inputJson.birthMonth = (this.selectedDate.getMonth() + 1).toString();
    this.inputJson.birthDay = this.selectedDate.getDate().toString();
    this.inputJson.currentDay = currentDate.getDate().toString();
    this.inputJson.currentMonth = (currentDate.getMonth() + 1).toString();
    this.inputJson.currentYear = currentDate.getFullYear().toString();

    
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if(event.value === null) { return; }
    this.selectedDate = event.value;
  }

}
