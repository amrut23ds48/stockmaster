export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: 'Pieces' | 'Kg' | 'Meter' | 'Bundle';
  quantity: number;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
}

export interface Location {
  id: string;
  name: string;
  warehouseId: string;
  warehouseName: string;
}

export interface Receipt {
  id: string;
  reference: string;
  from_location: string;
  to_location: string;
  contact: string;
  schedule_date: string;
  created_at: string;
  status: "ready" | "not_ready"; // FIXED
}


export interface ReceiptItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  customer: string;
  warehouseId: string;
  warehouseName: string;
  createdDate: string;
  totalQuantity: number;
  status: 'Draft' | 'Pending Validation' | 'Completed';
  items: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  availableStock: number;
  unit: string;
}

export interface MovementHistory {
  id: string;
  date: string;
  activityType: 'Receipt' | 'Delivery' | 'Adjustment';
  warehouse: string;
  product: string;
  qtyIn: number;
  qtyOut: number;
  status: string;
}

export interface StockAvailability {
  id: string;
  productName: string;
  warehouse: string;
  location: string;
  quantity: number;
}

export interface InternalTransfer {
  id: string;
  transferNumber: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  quantity: number;
  unit: string;
  requestedDate: string;
  completedDate?: string;
  requestedBy: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
}