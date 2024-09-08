import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { groth16, Groth16Proof, PublicSignals } from 'snarkjs';
import ZKBlockMature from '../../../../backend/build/contracts/ZKBlockMature.json';
import Groth16Verifier from '../../../../backend/build/contracts/Groth16Verifier.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { ethers, JsonRpcSigner } from 'ethers';
import { MetaMaskService } from '../metamask-handler.service';
import apth from 'path';
import proofJson from '../../../zkp_circom/proof.json';
import publicJson from '../../../zkp_circom/public.json';
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

  constructor(private metaMaskService: MetaMaskService) {
    this.selectedDate = new Date();
  }

  async onSubmit() {
    let currentDate = new Date();
    let myJs = {
      birthYear: this.selectedDate.getFullYear().toString(),
      birthMonth: (this.selectedDate.getMonth() + 1).toString(),
      birthDay: this.selectedDate.getDate().toString(),
      currentDay: currentDate.getDate().toString(),
      currentMonth: (currentDate.getMonth() + 1).toString(),
      currentYear: currentDate.getFullYear().toString(),
    };
    console.log(myJs);
    groth16
      .fullProve(myJs, 'checkAge.wasm', 'checkAge_001.zkey')
      .then(async (data) => {
        // console.log(data.proof);
        // console.log(data.publicSignals);
        // const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7475');
        // const networkId = await web3.eth.net.getId();
        // console.log(networkId);
        await this.connectToMetaMask();
        // let proof = JSON.stringify(data.proof, null, 1);
        const res = await groth16.verify(vKey, data.publicSignals, data.proof);
        console.log('Snark res: ', res);

        // let a = data.proof.pi_a.slice(0, 2); // pi_a
        // let b = [data.proof.pi_b[0].reverse(), data.proof.pi_b[1].reverse()]; // pi_b
        // let c = data.proof.pi_c.slice(0, 2); // pi_c
        // let newproof: Groth16Proof = {
        //   pi_a: a,
        //   pi_b: b,
        //   pi_c: c,
        //   protocol: 'groth16',
        //   curve: 'b128',
        // };
        // const newres = await groth16.verify(vKey, data.publicSignals, newproof);
        // console.log('Signals: ', data.publicSignals);
        // console.log('Result from verifiy is: ', newres);

        this.sendData(data.proof, data.publicSignals);
      });
  }

  async connectToMetaMask() {
    try {
      // Connect to MetaMask
      await this.metaMaskService.connectMetaMask();
      this.isConnected = true;

      // Get the connected account
      this.account = await this.metaMaskService.getAccount();

      // Get the balance of the connected account
      this.balance = await this.metaMaskService.getBalance();
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      this.isConnected = false;
    }
  }

  async sendData(proof: Groth16Proof, publicSignals: PublicSignals) {
    const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7475');

    console.log('SendData');
    const networkId = await web3.eth.net.getId();
    console.log('Connected to network ID:', networkId);
    // console.log('proof:', proof);
    // console.log('publicSingal:', publicSignals);

    const zkBlockMatureAbi: AbiItem[] = ZKBlockMature.abi as AbiItem[];
    const grothVerifierAbi: AbiItem[] = Groth16Verifier.abi as AbiItem[];

    // const deployedNetwork = ZKBlockMature.networks[networkId];
    const zkBlockMature = new web3.eth.Contract(
      zkBlockMatureAbi,
      '0xFFDD603a68358a7Bdfb2e7ac3C6be2f54973Af22'
    );

    const grothVerifier = new web3.eth.Contract(
      grothVerifierAbi,
      '0x661b4691773dBA5BE56E41f5fB13bFDd7AB230F9'
    );
    // const accounts = await web3.eth.requestAccounts();

    // if (!window.ethereum) {
    //   console.error('MetaMask is not installed.');
    //   return;
    // }

    // const accounts = await web3.eth.getAccounts();
    const account = await this.metaMaskService.getAccount();
    // console.log(account);
    // let a = proof.pi_a.slice(0, 2); // pi_a
    // let b = [proof.pi_b[0], proof.pi_b[1]]; // pi_b
    // let c = proof.pi_c.slice(0, 2); // pi_c
    // let a = proofJson.pi_a.slice(0, 2); // pi_a
    // let b = [proofJson.pi_b[0].reverse(), proof.pi_b[1].reverse()]; // pi_b
    // let c = proofJson.pi_c.slice(0, 2); // pi_c

    // let a = [proof.pi_a[0], proof.pi_a[1]]; // Correctly assigning only 2 elements
    // let b = [
    //   [proof.pi_b[0][0], proof.pi_b[0][1]],
    //   [proof.pi_b[1][0], proof.pi_b[1][1]],
    // ];
    // let c = [proof.pi_c[0], proof.pi_c[1]];

    let foo = await groth16.exportSolidityCallData(proof, publicSignals);
    // console.log(foo);

    const argv = foo
      .replace(/["[\]\s]/g, '')
      .split(',')
      .map((x: string | number | bigint | boolean) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = [];

    for (let i = 8; i < argv.length; i++) {
      Input.push(argv[i]);
    }
    // console.log(a, b, c, Input);

    // let a = proof.pi_a.slice(0, 2); // pi_a
    // let b = [proof.pi_b[0].reverse(), proof.pi_b[1].reverse()]; // pi_b
    // let c = proof.pi_c.slice(0, 2); // pi_c

    // Ensure public signals are properly formatted
    // let publicSignalsFormatted = publicSignals.map((signal) =>
    //   BigInt(signal).toString(10)
    // );

    try {
      console.log('Signals: ', publicSignals);
      var result = await zkBlockMature.methods
        // .verifyProof(a, b, c, publicSignals)
        .submitProof(a, b, c, Input)
        .send({ from: account.address, gas: 30000000 });
      // console.log('Transaction result: ', result);
      const proofVerificationEvent =
        result.events.ProofVerification.returnValues.result;
      console.log('Proof result: ', proofVerificationEvent);
      if (publicSignals[0] == '0') {
        console.log('Sei maggiorenne, vecchio di merda! ', publicSignals[0]);
      } else {
        console.log('Sei minorenne, bimbomnkia del cazzo! ', publicSignals[0]);
      }
      // var result2 = await grothVerifier.methods
      //   // .verifyProof(a, b, c, publicSignals)
      //   .verifyProof(a, b, c, Input)
      //   .call({ from: account.address, gas: 30000000 });
      // console.log('res2', result2);

      // const newProof: Groth16Proof = {
      //   pi_a: [a[0], a[1], '1'], // '1' is added as a placeholder for the third element.
      //   pi_b: [
      //     [b[0][1], b[0][0]],
      //     [b[1][1], b[1][0]],
      //     ['1', '0'],
      //   ], // [b1, b0] because of endianness.
      //   pi_c: [c[0], c[1], '1'],
      //   protocol: 'groth16',
      //   curve: 'b128',
      // };
      // const res = await groth16.verify(vKey, Input, newProof);
      // console.log('proof again', newProof);
      // console.log('resSnark again', res);
      // .verifyProof(proof, publicSignals)
      // const proofVerificationEvent = result.logs.find(
      //   (log: { event: string }) => log.event === 'ProofVerification'
      // );

      // if (proofVerificationEvent) {
      //   const isSuccess = proofVerificationEvent.args.result;
      //   console.log('Verification result:', isSuccess);
      // }

      // const txHash = result.transactionHash;
      // console.log(txHash);
      // const receipt = await web3.eth.getTransactionReceipt(txHash);
      // console.log(receipt);
      // const proofVerificationEventAbi = {
      //   anonymous: false,
      //   inputs: [
      //     {
      //       indexed: false,
      //       internalType: 'bool',
      //       name: 'result',
      //       type: 'bool',
      //     },
      //   ],
      //   name: 'ProofVerification',
      //   type: 'event',
      // };

      // // Decode the logs
      // const decodedLogs = receipt.logs.map((log) =>
      //   web3.eth.abi.decodeLog(
      //     proofVerificationEventAbi.inputs,
      //     log.data,
      //     log.topics.slice(1)
      //   )
      // );

      // console.log('Decoded Logs:', decodedLogs);

      // result.on(
      //   'receipt',
      //   (receipt: { events: { ProofVerification: any } }) => {
      //     console.log('Transaction receipt:', receipt);
      //     const proofVerificationEvent = receipt.events?.ProofVerification;

      //     if (proofVerificationEvent) {
      //       const isSuccess = proofVerificationEvent.returnValues.result;
      //       console.log('Proof verification result:', isSuccess);
      //     } else {
      //       console.log('ProofVerification event not found');
      //     }
      //   }
      // );

      // result.on('error', (error: any) => {
      //   console.error('Transaction error:', error);
      // });
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      return;
    }
    this.selectedDate = event.value;
  }
}
