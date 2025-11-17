import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

export function generateMemberNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `APL${timestamp}${random}`;
}

export function generateReferenceNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN${timestamp}${random}`;
}

export function generateLoanNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LN${timestamp}${random}`;
}

export function generateAccountNumber(type: string): string {
  const prefix = type === 'shares' ? 'SH' : type === 'savings' ? 'SV' : type === 'emergency' ? 'EM' : 'FD';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

export function calculateCreditScore(memberData: {
  monthlyIncome?: number;
  existingLoans?: number;
  loanRepaymentHistory?: number;
  savingsBalance?: number;
  accountAge?: number;
}): number {
  let score = 500;

  if (memberData.monthlyIncome) {
    if (memberData.monthlyIncome >= 100000) score += 150;
    else if (memberData.monthlyIncome >= 50000) score += 100;
    else if (memberData.monthlyIncome >= 30000) score += 50;
  }

  if (memberData.existingLoans) {
    score -= memberData.existingLoans * 20;
  }

  if (memberData.loanRepaymentHistory !== undefined) {
    score += memberData.loanRepaymentHistory * 2;
  }

  if (memberData.savingsBalance) {
    if (memberData.savingsBalance >= 100000) score += 100;
    else if (memberData.savingsBalance >= 50000) score += 70;
    else if (memberData.savingsBalance >= 20000) score += 40;
  }

  if (memberData.accountAge) {
    score += Math.min(memberData.accountAge * 2, 50);
  }

  return Math.max(300, Math.min(850, score));
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function validateKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '');
  return /^(\+254|254|0)?[17]\d{8}$/.test(cleaned);
}

export function formatKenyanPhone(phone: string): string {
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.startsWith('+254')) return cleaned;
  if (cleaned.startsWith('254')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+254${cleaned.slice(1)}`;
  return `+254${cleaned}`;
}

export function calculateLoanDetails(principal: number, interestRate: number, term: number) {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  const totalAmount = monthlyPayment * term;
  const totalInterest = totalAmount - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}
