/**
 * Enums / constants shared across layers. Kept here (not scattered as
 * magic strings) so a reviewer can see every fixed vocabulary the app uses
 * in one place.
 */

export const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#F97316', icon: 'utensils' },
  { name: 'Transport', color: '#3B82F6', icon: 'car' },
  { name: 'Shopping', color: '#EC4899', icon: 'shopping-bag' },
  { name: 'Education', color: '#8B5CF6', icon: 'book' },
  { name: 'Health', color: '#10B981', icon: 'heart-pulse' },
  { name: 'Bills', color: '#EF4444', icon: 'file-text' },
] as const;

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  MOBILE_WALLET = 'MOBILE_WALLET',
  OTHER = 'OTHER',
}