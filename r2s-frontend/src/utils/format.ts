import { ethers } from 'ethers';

// 주소 축약
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// KAIA 포맷팅
export function formatKaia(value: string | number): string {
  try {
    const formatted = ethers.formatEther(String(value));
    return parseFloat(formatted).toFixed(4);
  } catch {
    return '0.0000';
  }
}

// USDT 포맷팅 (6 decimals)
export function formatUSDT(value: string | number): string {
  try {
    const formatted = ethers.formatUnits(String(value), 6);
    return parseFloat(formatted).toFixed(2);
  } catch {
    return '0.00';
  }
}

// 숫자 포맷팅 (천 단위 구분)
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

// 퍼센트 포맷팅
export function formatPercent(value: number, decimals = 1): string {
  return `${(value / 100).toFixed(decimals)}%`;
}

// 날짜 포맷팅
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
}

// 남은 시간 계산
export function getTimeLeft(endTime: Date | string): string {
  const end = new Date(endTime).getTime();
  const now = Date.now();
  const diff = end - now;
  
  if (diff <= 0) return '종료됨';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}일 ${hours}시간`;
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
}

// 진행률 계산
export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(100, Math.max(0, progress));
}

// 예상 리베이트 계산
export function calculateExpectedRebate(
  amount: string,
  discountRate: number,
  saveFloorBps: number,
  rMaxBps: number
): { min: string; max: string } {
  const amountNum = parseFloat(formatUSDT(amount));
  
  // 최소 리베이트 (SaveFloor)
  const minRebate = (amountNum * saveFloorBps) / 10000;
  
  // 최대 리베이트 (rMax)
  const maxRebate = (amountNum * rMaxBps) / 10000;
  
  return {
    min: minRebate.toFixed(2),
    max: maxRebate.toFixed(2)
  };
}