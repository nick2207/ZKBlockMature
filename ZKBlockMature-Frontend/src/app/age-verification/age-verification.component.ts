import { Component } from '@angular/core';

@Component({
  selector: 'app-age-verification',
  templateUrl: './age-verification.component.html',
  styleUrls: ['./age-verification.component.css'],
})
export class AgeVerificationComponent {
  age: number;
  verificationResult: string;

  constructor() {
    this.age = 0; // Initialize age to 0 or any default value
    this.verificationResult = ''; // Initialize verificationResult to an empty string
  }

  verifyAge() {
    if (this.age >= 18) {
      this.verificationResult = 'You are old enough.';
    } else {
      this.verificationResult = 'You are not old enough.';
    }
  }
}
