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
