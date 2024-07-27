import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

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
  snarkJSScript: HTMLScriptElement;

  inputJson = {
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    currentYear: '',
    currentMonth: '',
    currentDay: '',
  };

  constructor() {
    this.selectedDate = new Date();
    this.snarkJSScript = document.createElement('script');
    this.snarkJSScript.src = 'snarkjs.min.js';
    document.body.appendChild(this.snarkJSScript);
  }

  onSubmit() {
    let currentDate = new Date();
    this.inputJson.birthYear = this.selectedDate.getFullYear().toString();
    this.inputJson.birthMonth = (this.selectedDate.getMonth() + 1).toString();
    this.inputJson.birthDay = this.selectedDate.getDate().toString();
    this.inputJson.currentDay = currentDate.getDate().toString();
    this.inputJson.currentMonth = (currentDate.getMonth() + 1).toString();
    this.inputJson.currentYear = currentDate.getFullYear().toString();
    let foo = (window as any).snarkjs.groth16.fullProve();
    console.log(foo);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      return;
    }
    this.selectedDate = event.value;
  }

  // async calculateProof() {
  //   const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
  //     { a: 3, b: 11 },
  //     'circuit.wasm',
  //     'circuit_final.zkey'
  //   );

  // proofComponent.innerHTML = JSON.stringify(proof, null, 1);

  // const vkey = await fetch('verification_key.json').then(function (res) {
  //   return res.json();
  // });

  // const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);

  // resultComponent.innerHTML = res;
  // }
}
