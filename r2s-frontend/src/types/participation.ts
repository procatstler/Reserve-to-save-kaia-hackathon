export interface Participation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  userId: string;
  walletAddress: string;
  depositAmount: string;
  joinedAt: Date;
  status: ParticipationStatus;
  expectedRebate: string;
  actualRebate?: string;
  cancelPending?: string;
  refundedAmount?: string;
  settlementTxHash?: string;
}

export enum ParticipationStatus {
  ACTIVE = 'active',
  PENDING_CANCEL = 'pending_cancel',
  CANCELLED = 'cancelled',
  SETTLED = 'settled',
  REFUNDED = 'refunded'
}