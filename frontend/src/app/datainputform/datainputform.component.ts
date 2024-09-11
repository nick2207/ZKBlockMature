import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CircuitSignals, groth16, Groth16Proof, PublicSignals } from 'snarkjs';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { JsonRpcSigner } from 'ethers';
import { MetaMaskService } from '../metamask-handler.service';

import ZKBlockMature from '../../../../backend/build/contracts/ZKBlockMature.json';
import vKey from '../../../zkp_circom/verification_key.json';

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
  account: JsonRpcSigner | null = null;
  balance: string | null = null;
  isConnected: boolean = false;

  private wasmFilePath: string = 'checkAge.wasm';
  private zkeyFilePath: string = 'checkAge_001.zkey';
  private zkBlockMatureAddress: string =
    '0x5a5ABF4f951517918dCEb1887089320e9f01f8F9';

  constructor(private metaMaskService: MetaMaskService) {
    this.selectedDate = new Date();
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      return;
    }
    this.selectedDate = event.value;
  }

  async onSubmit() {
    let currentDate = new Date();
    let inputSignals = {
      birthYear: this.selectedDate.getFullYear().toString(),
      birthMonth: (this.selectedDate.getMonth() + 1).toString(),
      birthDay: this.selectedDate.getDate().toString(),
      currentDay: currentDate.getDate().toString(),
      currentMonth: (currentDate.getMonth() + 1).toString(),
      currentYear: currentDate.getFullYear().toString(),
    };

    const { proof, publicSignals } = await this.generateProof(inputSignals);
    await this.connectToMetaMask();
    await this.sendData(proof, publicSignals);
  }

  async generateProof(inputSignals: CircuitSignals) {
    try {
      console.log('Generating proof...');

      const data = await groth16.fullProve(
        inputSignals,
        this.wasmFilePath,
        this.zkeyFilePath
      );

      const isValid = await groth16.verify(
        vKey,
        data.publicSignals,
        data.proof
      );
      console.log('Proof validity: ', isValid);
      if (!isValid) {
        throw 'Proof is not valid';
      }

      return { proof: data.proof, publicSignals: data.publicSignals };
    } catch (error) {
      console.error('Error generating proof:', error);
      throw error;
    }
  }

  async connectToMetaMask() {
    try {
      await this.metaMaskService.connectMetaMask();
      this.isConnected = true;
      this.account = await this.metaMaskService.getAccount();
      this.balance = await this.metaMaskService.getBalance();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async parsingCallData(proof: Groth16Proof, publicSignals: PublicSignals) {
    let callData = await groth16.exportSolidityCallData(proof, publicSignals);

    const argv = callData
      .replace(/["[\]\s]/g, '')
      .split(',')
      .map((x: string | number | bigint | boolean) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const inputSignals = [];

    for (let i = 8; i < argv.length; i++) {
      inputSignals.push(argv[i]);
    }

    return { a, b, c, inputSignals };
  }

  async sendData(proof: Groth16Proof, publicSignals: PublicSignals) {
    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7475');

    const networkId = await web3.eth.net.getId();
    console.log('Connected to network ID:', networkId);

    const zkBlockMatureAbi: AbiItem[] = ZKBlockMature.abi as AbiItem[];

    const zkBlockMature = new web3.eth.Contract(
      zkBlockMatureAbi,
      this.zkBlockMatureAddress
    );

    const account = await this.metaMaskService.getAccount();

    try {
      console.log('Sending data...');
      const { a, b, c, inputSignals } = await this.parsingCallData(
        proof,
        publicSignals
      );
      var result = await zkBlockMature.methods
        .submitProof(a, b, c, inputSignals)
        .send({ from: account.address, gas: 30000000 });

      const proofVerification =
        result.events.ProofVerification.returnValues.result;
      console.log('Proof verification result: ', proofVerification);
      // publicSignals[0] == constrain satisfied
      if (publicSignals[0] == '0') {
        console.log('Sei maggiorenne, vecchio di merda! ', publicSignals[0]);
      } else {
        console.log('Sei minorenne, bimbomnkia del cazzo! ', publicSignals[0]);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }
}
