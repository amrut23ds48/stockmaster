import type {
  Product,
  Warehouse,
  Location,
  Receipt,
  Delivery,
  MovementHistory,
  StockAvailability,
} from "./types";

// --------------------- PRODUCTS ---------------------
export const mockProducts: Product[] = [
  { id: '1', name: 'Steel Bar 10mm', sku: 'SB-10MM-001', category: 'Steel Bars', unit: 'Pieces', quantity: 1500 },
  { id: '2', name: 'Steel Plate 6mm', sku: 'SP-6MM-002', category: 'Steel Plates', unit: 'Kg', quantity: 2300 },
  { id: '3', name: 'Angle Iron 50x50', sku: 'AI-50X50-003', category: 'Structural Steel', unit: 'Meter', quantity: 850 },
  { id: '4', name: 'Wire Mesh Roll', sku: 'WM-ROLL-004', category: 'Wire Products', unit: 'Bundle', quantity: 120 },
  { id: '5', name: 'Steel Beam I-200', sku: 'SB-I200-005', category: 'Beams', unit: 'Pieces', quantity: 450 },
];

// --------------------- WAREHOUSES ---------------------
export const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Mumbai Central Warehouse', code: 'WH-MUM-01', address: 'Saki Naka, Mumbai, Maharashtra' },
  { id: '2', name: 'Delhi North Logistics Hub', code: 'WH-DEL-02', address: 'Rohini Sector 16, Delhi' },
  { id: '3', name: 'Bangalore South Storage Facility', code: 'WH-BLR-03', address: 'Electronic City, Bangalore' },
];

// --------------------- LOCATIONS ---------------------
export const mockLocations: Location[] = [
  { id: '1', name: 'Rack A1', warehouseId: '1', warehouseName: 'Mumbai Central Warehouse' },
  { id: '2', name: 'Floor Section B', warehouseId: '1', warehouseName: 'Mumbai Central Warehouse' },
  { id: '3', name: 'Bay C-12', warehouseId: '2', warehouseName: 'Delhi North Logistics Hub' },
  { id: '4', name: 'Outdoor Yard 1', warehouseId: '3', warehouseName: 'Bangalore South Storage Facility' },
];

// --------------------- RECEIPTS ---------------------
export const mockReceipts: Receipt[] = [
  {
    id: "1",
    reference: "REF-2024-001",
    from_location: "Mumbai Steel Depot",
    to_location: "Pune Warehouse",
    contact: "Sana",
    schedule_date: "2024-11-20 10:30",
    status: "ready",
    created_at: "2024-11-18 09:45"
  },
  {
    id: "2",
    reference: "REF-2024-002",
    from_location: "Delhi Steel Market",
    to_location: "Noida Storage Center",
    contact: "Amrut",
    schedule_date: "2024-11-22 14:00",
    status: "not_ready",
    created_at: "2024-11-19 08:20"
  },
  {
    id: "3",
    reference: "REF-2024-003",
    from_location: "Hyderabad Industrial Zone",
    to_location: "Bangalore South Warehouse",
    contact: "Talha",
    schedule_date: "2024-11-25 16:45",
    status: "ready",
    created_at: "2024-11-20 11:10"
  },
  {
    id: "4",
    reference: "REF-2024-004",
    from_location: "Chennai Port Storage",
    to_location: "Coimbatore Logistics Center",
    contact: "Irfan",
    schedule_date: "2024-11-26 09:15",
    status: "not_ready",
    created_at: "2024-11-21 15:55"
  }
];

// --------------------- DELIVERIES ---------------------
export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    deliveryNumber: 'DEL-2024-001',
    customer: 'Talha Enterprises',
    warehouseId: '1',
    warehouseName: 'Mumbai Central Warehouse',
    createdDate: '2024-11-19',
    totalQuantity: 300,
    status: 'Completed',
    items: [
      { id: '1', productId: '1', productName: 'Steel Bar 10mm', quantity: 300, availableStock: 1500, unit: 'Pieces' }
    ]
  },
  {
    id: '2',
    deliveryNumber: 'DEL-2024-002',
    customer: 'Sana Constructions',
    warehouseId: '2',
    warehouseName: 'Delhi North Logistics Hub',
    createdDate: '2024-11-21',
    totalQuantity: 500,
    status: 'Pending Validation',
    items: [
      { id: '2', productId: '2', productName: 'Steel Plate 6mm', quantity: 500, availableStock: 2300, unit: 'Kg' }
    ]
  },
];

// --------------------- MOVEMENT HISTORY ---------------------
export const mockMovementHistory: MovementHistory[] = [
  {
    id: '1',
    date: '2024-11-20 10:30',
    activityType: 'Receipt',
    warehouse: 'Mumbai Central Warehouse',
    product: 'Steel Bar 10mm',
    qtyIn: 500,
    qtyOut: 0,
    status: 'Completed'
  },
  {
    id: '2',
    date: '2024-11-19 14:15',
    activityType: 'Delivery',
    warehouse: 'Mumbai Central Warehouse',
    product: 'Steel Bar 10mm',
    qtyIn: 0,
    qtyOut: 300,
    status: 'Completed'
  },
  {
    id: '3',
    date: '2024-11-21 09:00',
    activityType: 'Receipt',
    warehouse: 'Delhi North Logistics Hub',
    product: 'Steel Plate 6mm',
    qtyIn: 1200,
    qtyOut: 0,
    status: 'Pending Validation'
  },
  {
    id: '4',
    date: '2024-11-18 16:45',
    activityType: 'Adjustment',
    warehouse: 'Mumbai Central Warehouse',
    product: 'Wire Mesh Roll',
    qtyIn: 20,
    qtyOut: 0,
    status: 'Completed'
  },
];

// --------------------- STOCK AVAILABILITY ---------------------
export const mockStockAvailability: StockAvailability[] = [
  { id: '1', productName: 'Steel Bar 10mm', warehouse: 'Mumbai Central Warehouse', location: 'Rack A1', quantity: 1500 },
  { id: '2', productName: 'Steel Plate 6mm', warehouse: 'Delhi North Logistics Hub', location: 'Bay C-12', quantity: 2300 },
  { id: '3', productName: 'Angle Iron 50x50', warehouse: 'Mumbai Central Warehouse', location: 'Floor Section B', quantity: 850 },
  { id: '4', productName: 'Wire Mesh Roll', warehouse: 'Bangalore South Storage Facility', location: 'Outdoor Yard 1', quantity: 120 },
  { id: '5', productName: 'Steel Beam I-200', warehouse: 'Mumbai Central Warehouse', location: 'Rack A1', quantity: 450 },
];
