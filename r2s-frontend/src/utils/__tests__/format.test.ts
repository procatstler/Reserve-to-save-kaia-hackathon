import {
  shortenAddress,
  formatKaia,
  formatUSDT,
  formatNumber,
  formatPercent,
  formatDate,
  getTimeLeft,
  calculateProgress,
  calculateExpectedRebate
} from '../format';

describe('Format Utils', () => {
  describe('shortenAddress', () => {
    it('should shorten ethereum address', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(shortenAddress(address)).toBe('0x1234...7890');
      expect(shortenAddress(address, 6)).toBe('0x123456...567890');
    });

    it('should handle empty address', () => {
      expect(shortenAddress('')).toBe('');
    });
  });

  describe('formatKaia', () => {
    it('should format wei to KAIA', () => {
      expect(formatKaia('1000000000000000000')).toBe('1.0000');
      expect(formatKaia('123456789000000000')).toBe('0.1235');
    });

    it('should handle invalid values', () => {
      expect(formatKaia('invalid')).toBe('0.0000');
    });
  });

  describe('formatUSDT', () => {
    it('should format USDT with 6 decimals', () => {
      expect(formatUSDT('1000000')).toBe('1.00');
      expect(formatUSDT('123456789')).toBe('123.46');
    });

    it('should handle invalid values', () => {
      expect(formatUSDT('invalid')).toBe('0.00');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });
  });

  describe('formatPercent', () => {
    it('should format basis points to percentage', () => {
      expect(formatPercent(100)).toBe('1.0%');
      expect(formatPercent(1550)).toBe('15.5%');
      expect(formatPercent(250, 2)).toBe('2.50%');
    });
  });

  describe('formatDate', () => {
    it('should format date to Korean format', () => {
      const date = new Date('2024-12-31T15:30:00');
      const formatted = formatDate(date);
      expect(formatted).toContain('12');
      expect(formatted).toContain('31');
    });

    it('should handle string dates', () => {
      const formatted = formatDate('2024-12-31T15:30:00');
      expect(formatted).toContain('12');
      expect(formatted).toContain('31');
    });
  });

  describe('getTimeLeft', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T00:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate time left in days', () => {
      const endTime = new Date('2024-01-03T12:00:00');
      expect(getTimeLeft(endTime)).toBe('2일 12시간');
    });

    it('should calculate time left in hours', () => {
      const endTime = new Date('2024-01-01T05:30:00');
      expect(getTimeLeft(endTime)).toBe('5시간 30분');
    });

    it('should calculate time left in minutes', () => {
      const endTime = new Date('2024-01-01T00:45:00');
      expect(getTimeLeft(endTime)).toBe('45분');
    });

    it('should return 종료됨 for past dates', () => {
      const endTime = new Date('2023-12-31T00:00:00');
      expect(getTimeLeft(endTime)).toBe('종료됨');
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress percentage', () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(75, 100)).toBe(75);
      expect(calculateProgress(150, 100)).toBe(100);
    });

    it('should handle zero target', () => {
      expect(calculateProgress(50, 0)).toBe(0);
    });

    it('should clamp between 0 and 100', () => {
      expect(calculateProgress(-10, 100)).toBe(0);
      expect(calculateProgress(200, 100)).toBe(100);
    });
  });

  describe('calculateExpectedRebate', () => {
    it('should calculate min and max rebate', () => {
      const amount = '10000000'; // 10 USDT in 6 decimals
      const result = calculateExpectedRebate(amount, 1000, 100, 2000);
      
      expect(result.min).toBe('0.10'); // 1% of 10 USDT
      expect(result.max).toBe('2.00'); // 20% of 10 USDT
    });

    it('should handle small amounts', () => {
      const amount = '1000000'; // 1 USDT
      const result = calculateExpectedRebate(amount, 500, 50, 1000);
      
      expect(result.min).toBe('0.01'); // 0.5% of 1 USDT
      expect(result.max).toBe('0.10'); // 10% of 1 USDT
    });
  });
});