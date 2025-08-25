export interface Payment {
  id: string;
  paymentId: string;
  campaignId: string;
  userId: string;
  amount: string;
  currency: 'USDT' | 'KAIA';
  mode: 'crypto' | 'stripe';
  status: PaymentStatus;
  transactionHash?: string;
  createdAt: Date;
  completedAt?: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}