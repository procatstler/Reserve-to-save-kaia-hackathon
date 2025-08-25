export interface Campaign {
  id: string;
  address: string;
  title: string;
  description: string;
  imageUrl: string;
  merchant: string;
  basePrice: string; // USDT amount in wei
  minQty: number;
  currentQty: number;
  targetAmount: string;
  currentAmount: string;
  discountRate: number; // basis points (100 = 1%)
  saveFloorBps: number; // 최소 리베이트 보장
  rMaxBps: number; // 최대 리베이트 상한
  startTime: Date;
  endTime: Date;
  settlementDate: Date;
  status: CampaignStatus;
  participants: number;
  progress: number; // 0-100
}

export enum CampaignStatus {
  DRAFT = 'draft',
  RECRUITING = 'recruiting',
  REACHED = 'reached',
  FULFILLMENT = 'fulfillment',
  SETTLED = 'settled',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}