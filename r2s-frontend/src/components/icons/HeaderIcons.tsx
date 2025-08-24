'use client';

interface IconProps {
  color?: string;
  size?: number;
}

export const BackIcon = ({ color = '#212529', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M15 18L9 12L15 6" 
      stroke={color}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseIcon = ({ color = '#212529', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M18 6L6 18M6 6L18 18" 
      stroke={color}
      strokeWidth="2" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MenuIcon = ({ color = '#212529', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M3 12H21M3 6H21M3 18H21" 
      stroke={color}
      strokeWidth="2" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NotificationIcon = ({ color = '#212529', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path 
      d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" 
      stroke={color}
      strokeWidth="2" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path 
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" 
      stroke={color}
      strokeWidth="2" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);