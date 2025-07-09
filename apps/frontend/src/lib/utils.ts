import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency = 'VND'): string {
  if (currency === 'VND') {
    return `${price.toLocaleString('vi-VN')}₫`
  }
  return `$${price.toLocaleString()}`
}
