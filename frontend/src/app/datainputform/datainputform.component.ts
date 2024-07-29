import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { groth16 } from 'snarkjs';

@Component({
  selector: 'app-datainputform',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datainputform.component.html',
  styleUrl: './datainputform.component.css',
})
export class DatainputformComponent {
  selectedDate: Date;

  constructor() {
    this.selectedDate = new Date();
  }

  onSubmit() {
    let currentDate = new Date();
    groth16
      .fullProve(
        {
          birthYear: this.selectedDate.getFullYear().toString(),
          birthMonth: (this.selectedDate.getMonth() + 1).toString(),
          birthDay: this.selectedDate.getDate().toString(),
          currentDay: currentDate.getDate().toString(),
          currentMonth: (currentDate.getMonth() + 1).toString(),
          currentYear: currentDate.getFullYear().toString(),
        },
        'checkAge.wasm',
        'checkAge_0001.zkey'
      )
      .then((data) => {
        console.log(data.proof);
        console.log(data.publicSignals);
      });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      return;
    }
    this.selectedDate = event.value;
  }
}
