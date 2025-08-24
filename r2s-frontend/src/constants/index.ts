// App Constants
export const APP_NAME = 'R2S - Reserve to Save';
export const APP_DESCRIPTION = '기다림을 할인으로 바꾸는 혁신';

// Colors
export const COLORS = {
  primary: '#00C73C',
  secondary: '#1AA34A',
  danger: '#DC3545',
  warning: '#FFC107',
  info: '#4169E1',
  success: '#28A745',
  gray: '#6C757D',
  lightGray: '#F8F9FA',
  darkGray: '#212529',
  border: '#E9ECEF',
} as const;

// Gradients
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #00C73C 0%, #00A332 100%)',
  landing: 'linear-gradient(135deg, #1DB954 0%, #1AA34A 100%)',
  header: 'linear-gradient(to right, #1DB954 0%, #1AA34A 100%)',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

// Animation
export const TRANSITIONS = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
} as const;

// Routes
export const ROUTES = {
  home: '/',
  campaigns: '/campaigns',
  campaignDetail: (id: string) => `/campaign/${id}`,
  myParticipation: '/my-participation',
  paymentConfirmation: '/payment-confirmation',
  settlementComplete: '/settlement-complete',
} as const;

// Tabs
export const CAMPAIGN_TABS = ['전체', '진행중', '마감임박', '할인율↓'] as const;

// Mobile Container Settings
export const MOBILE_CONTAINER = {
  // 기본 디자인 크기 (Figma 기준)
  baseWidth: 375,
  baseHeight: 812,
  
  // 최소 크기 제약 (iPhone SE 기준)
  minWidth: 320,
  minHeight: 568,
  
  // 최대 크기 제약 (iPhone 14 Pro Max 기준)
  maxWidth: 430,
  maxHeight: 926,
  
  // 패딩 및 마진
  padding: 16,
  borderRadius: 40,
} as const;