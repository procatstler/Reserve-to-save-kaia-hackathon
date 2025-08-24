// Campaign Types
export interface Campaign {
  id: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  badge?: 'HOT' | null;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  currentParticipants: number;
  minParticipants: number;
  timeRemaining?: string;
  daysRemaining?: string;
  progress: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  discountRate: number;
  targetDiscount: number;
  quantity: string;
  participantAlert?: string;
  completedAt?: string;
}

export interface UserParticipation {
  campaignId: string;
  depositAmount: number;
  participatedAt: string;
  currentSavings: number;
  expectedFinalPrice: number;
}

// UI Types
export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface FeatureItem {
  icon: string;
  title: string;
  items: string[];
}

// Payment Types
export interface PaymentDetails {
  campaignId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
}

// Common Props Types
export interface PageProps {
  params?: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}