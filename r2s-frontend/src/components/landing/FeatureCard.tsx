'use client';

import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: string;
  title: string;
  items: string[];
  className?: string;
}

export default function FeatureCard({ 
  icon, 
  title, 
  items,
  className 
}: FeatureCardProps) {
  return (
    <div className={cn(
      'w-full h-full bg-white/15 backdrop-blur-md rounded-[16px] border border-white/25 shadow-lg hover:bg-white/20 transition-all duration-300',
      className
    )}>
      <div className="flex flex-col justify-center h-full px-[20px] py-[16px]">
        <div className="flex items-center mb-[10px]">
          <span className="text-[24px] mr-[12px]">{icon}</span>
          <h3 className="text-white text-[16px] font-bold">
            {title}
          </h3>
        </div>
        <div className="space-y-[4px]">
          {items.map((item, index) => (
            <p key={index} className="text-white/85 text-[12px] pl-[36px] leading-[1.4]">
              • {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}