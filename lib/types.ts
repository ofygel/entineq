export type Role = 'CLIENT' | 'EXECUTOR' | 'ADMIN';
export type OrderType = 'TAXI' | 'DELIVERY';
export type OrderStatus = 'NEW' | 'CLAIMED' | 'CLOSED';

export interface Order {
  id: string;
  type: OrderType;
  from: string;
  to: string;
  distanceKm?: number;
  packageSize?: 'S'|'M'|'L';
  comment?: string;
  priceEstimate: number;
  status: OrderStatus;
  claimedBy?: string;
  createdAt: number;
}

export interface Verification {
  id: string;
  userId: string;
  photos: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: number;
}

export interface ExecutorProfile {
  id: string;
  name: string;
  carModel?: string;
  vehicleType?: 'CAR' | 'BIKE' | 'FOOT' | 'SCOOTER';
  verified: boolean;
  subscriptionActive: boolean;
}

/** Чат один-на-один по заказу */
export interface Chat {
  id: string;
  orderId: string;
  clientId: string;
  executorId: string;
  createdAt: number;
}

export interface Message {
  id: string;
  chatId: string;
  sender: 'CLIENT'|'EXECUTOR';
  body: string;
  createdAt: number;
}
