'use client';

import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ProductDeliveryInfoProps {
  product: {
    category: string;
    categoryIcon: string;
    categoryColor?: string;
    title: string;
    quantity: string;
    deliveryStatus: string;
    expectedDelivery: string;
  };
}

export default function ProductDeliveryInfo({ product }: ProductDeliveryInfoProps) {
  return (
    <Card variant="outlined" className="h-full p-[12px]">
        <div className="flex items-center gap-[12px]">
          <div className={`w-[50px] h-[50px] ${product.categoryColor || 'bg-[#8B4513]'} rounded-[10px] flex flex-col items-center justify-center`}>
            <span className="text-[12px] mb-[2px]">{product.categoryIcon}</span>
            <span className="text-white text-[8px]">{product.category}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#212529] text-[16px] font-bold">{product.title}</h3>
                <p className="text-[#6C757D] text-[13px]">{product.quantity}</p>
              </div>
              <Badge variant="warning" size="sm">
                {product.deliveryStatus}
              </Badge>
            </div>
            <p className="text-[#6C757D] text-[12px] mt-[6px]">
              예상 배송일: {product.expectedDelivery}
            </p>
          </div>
        </div>
    </Card>
  );
}