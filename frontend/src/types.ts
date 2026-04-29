/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  sku: string;
  available: boolean;
}

export interface Transaction {
  id: string;
  customerName: string;
  customerContact?: string;
  date: string;
  time: string;
  amount: number;
  method: 'UPI' | 'Cash' | 'Card';
  itemsCount: number;
  status: 'Completed' | 'Refunded';
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export type Screen = 'Dashboard' | 'NewBill' | 'Inventory' | 'AddItem' | 'History' | 'Analyzer' | 'TransactionDetail' | 'Profile';
