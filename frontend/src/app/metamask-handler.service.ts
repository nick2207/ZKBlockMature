import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class MetaMaskService {
  private provider: ethers.BrowserProvider | undefined;
  private signer: ethers.JsonRpcSigner | undefined;

  constructor() {}

  // Method to connect to MetaMask
  async connectMetaMask(): Promise<boolean> {
    const provider = await detectEthereumProvider();

    if (provider) {
      // Check if MetaMask is installed and use Web3Provider
      this.provider = new ethers.BrowserProvider(provider as any);

      try {
        // Request account access
        await this.provider.send('eth_requestAccounts', []);
        this.signer = await this.provider.getSigner();
        return true;
      } catch (error) {
        console.error('User denied account access', error);
        return false;
      }
    } else {
      console.error('MetaMask not detected');
      return false;
    }
  }

  // Method to get the current connected account
  async getAccount(): Promise<ethers.JsonRpcSigner> {
    if (!this.provider) throw new Error('Provider not initialized');

    const accounts = await this.provider.listAccounts();
    return accounts[0];
  }

  // Method to get the balance of the connected account
  async getBalance(): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');

    const account = await this.getAccount();
    const balance = await this.provider.getBalance(account);
    return ethers.formatEther(balance);
  }
}
