export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string;
  provider: any;
}

export interface Transaction {
  from: string;
  to: string;
  value: string;
  data?: string;
  gas?: string;
  gasPrice?: string;
}