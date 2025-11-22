import type {
  Product,
  Warehouse,
  Location,
  Receipt,
  Delivery,
  MovementHistory,
  StockAvailability,
} from "./types";

export const mockProducts: Product[] = [
  { id: '1', name: 'Steel Bar 10mm', sku: 'SB-10MM-001', category: 'Steel Bars', unit: 'Pieces', quantity: 1500 },
  { id: '2', name: 'Steel Plate 6mm', sku: 'SP-6MM-002', category: 'Steel Plates', unit: 'Kg', quantity: 2300 },
  { id: '3', name: 'Angle Iron 50x50', sku: 'AI-50X50-003', category: 'Structural Steel', unit: 'Meter', quantity: 850 },
  { id: '4', name: 'Wire Mesh Roll', sku: 'WM-ROLL-004', category: 'Wire Products', unit: 'Bundle', quantity: 120 },
  { id: '5', name: 'Steel Beam I-200', sku: 'SB-I200-005', category: 'Beams', unit: 'Pieces', quantity: 450 },
];

export const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', code: 'WH-MAIN', address: '123 Industrial Park, Steel City, SC 12345' },
  { id: '2', name: 'North Distribution Center', code: 'WH-NORTH', address: '456 Commerce Ave, North District, ND 67890' },
  { id: '3', name: 'South Storage Facility', code: 'WH-SOUTH', address: '789 Logistics Road, South Zone, SZ 11223' },
];

export const mockLocations: Location[] = [
  { id: '1', name: 'Rack A1', warehouseId: '1', warehouseName: 'Main Warehouse' },
  { id: '2', name: 'Floor Section B', warehouseId: '1', warehouseName: 'Main Warehouse' },
  { id: '3', name: 'Bay C-12', warehouseId: '2', warehouseName: 'North Distribution Center' },
  { id: '4', name: 'Outdoor Yard 1', warehouseId: '3', warehouseName: 'South Storage Facility' },
];
export const mockReceipts: Receipt[] = [
  {
    id: "1",
    reference: "REF-2024-001",
    from_location: "Mumbai Central Depot",
    to_location: "Pune Warehouse",
    contact: "Sana Shaikh",
    schedule_date: "2024-11-20 10:30",
    status: "ready",
    created_at: "2024-11-18 09:45"
  },
  {
    id: "2",
    reference: "REF-2024-002",
    from_location: "Delhi Steel Yard",
    to_location: "Noida Storage Unit",
    contact: "Amrut Patil",
    schedule_date: "2024-11-22 14:00",
    status: "not_ready",
    created_at: "2024-11-19 08:20"
  },
  {
    id: "3",
    reference: "REF-2024-003",
    from_location: "Hyderabad Industrial Hub",
    to_location: "Bangalore South Warehouse",
    contact: "Talha Khan",
    schedule_date: "2024-11-25 16:45",
    status: "ready",
    created_at: "2024-11-20 11:10"
  },
  {
    id: "4",
    reference: "REF-2024-004",
    from_location: "Chennai Port Storage",
    to_location: "Coimbatore Logistics Center",
    contact: "Irfan Shaikh",
    schedule_date: "2024-11-26 09:15",
    status: "not_ready",
    created_at: "2024-11-21 15:55"
  }
];

export const mockDeliveries: Delivery[] = [
  {
    id: '1',
    deliveryNumber: 'DEL-2024-001',
    customer: 'BuildRight Construction',
    warehouseId: '1',
    warehouseName: 'Main Warehouse',
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
    customer: 'Mega Projects Ltd.',
    warehouseId: '2',
    warehouseName: 'North Distribution Center',
    createdDate: '2024-11-21',
    totalQuantity: 500,
    status: 'Pending Validation',
    items: [
      { id: '2', productId: '2', productName: 'Steel Plate 6mm', quantity: 500, availableStock: 2300, unit: 'Kg' }
    ]
  },
];

export const mockMovementHistory: MovementHistory[] = [
  {
    id: '1',
    date: '2024-11-20 10:30',
    activityType: 'Receipt',
    warehouse: 'Main Warehouse',
    product: 'Steel Bar 10mm',
    qtyIn: 500,
    qtyOut: 0,
    status: 'Completed'
  },
  {
    id: '2',
    date: '2024-11-19 14:15',
    activityType: 'Delivery',
    warehouse: 'Main Warehouse',
    product: 'Steel Bar 10mm',
    qtyIn: 0,
    qtyOut: 300,
    status: 'Completed'
  },
  {
    id: '3',
    date: '2024-11-21 09:00',
    activityType: 'Receipt',
    warehouse: 'North Distribution Center',
    product: 'Steel Plate 6mm',
    qtyIn: 1200,
    qtyOut: 0,
    status: 'Pending Validation'
  },
  {
    id: '4',
    date: '2024-11-18 16:45',
    activityType: 'Adjustment',
    warehouse: 'Main Warehouse',
    product: 'Wire Mesh Roll',
    qtyIn: 20,
    qtyOut: 0,
    status: 'Completed'
  },
];

export const mockStockAvailability: StockAvailability[] = [
  { id: '1', productName: 'Steel Bar 10mm', warehouse: 'Main Warehouse', location: 'Rack A1', quantity: 1500 },
  { id: '2', productName: 'Steel Plate 6mm', warehouse: 'North Distribution Center', location: 'Bay C-12', quantity: 2300 },
  { id: '3', productName: 'Angle Iron 50x50', warehouse: 'Main Warehouse', location: 'Floor Section B', quantity: 850 },
  { id: '4', productName: 'Wire Mesh Roll', warehouse: 'South Storage Facility', location: 'Outdoor Yard 1', quantity: 120 },
  { id: '5', productName: 'Steel Beam I-200', warehouse: 'Main Warehouse', location: 'Rack A1', quantity: 450 },
];
