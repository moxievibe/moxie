export interface SizeGuideItem {
  size: string;
  chestCm: number; // Pecho / Contorno
  lengthCm: number; // Largo
  sleeveCm?: number; // Manga
  waistCm?: number; // Cintura (para pantalones)
}

export interface ProductVariant {
  name: string; // e.g. 'Talla', 'Color'
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string; // Default: 'Ropa' o 'Accesorios', expandable
  priceUSD: number;
  originalPriceUSD?: number;
  images: string[]; // Gallery of photos
  description: string;
  technicalSpecs: string[];
  sizeGuide?: SizeGuideItem[];
  stockUnits?: number; // Total units in stock
  inStock: boolean; // "En Stock" | "Agotado"
  variants: ProductVariant[];
  badge?: string;
  featured?: boolean;
}

export interface FinancialRecord {
  id: string;
  type: 'ingreso' | 'gasto';
  description: string;
  amountUSD: number;
  category: string; // ej: 'Venta de Ropa', 'Compra de Tela', 'Confección', 'Empaque', 'Marketing', 'Logística'
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>; // e.g. { Talla: 'L', Color: 'Verde Moxie' }
}

export type DeliveryType = 'pickup' | 'delivery' | 'agency';

export interface AgencyShippingData {
  firstName: string;
  lastName: string;
  idNumber: string; // Cédula V- / E-
  phone: string;
  agency: 'MRW' | 'Tealca';
  destinationAddress: string; // Dirección exacta oficina / agencia destino
}

export interface DeliveryZone {
  id: string;
  name: string;
  costUSD: number;
}

export interface OrderDelivery {
  type: DeliveryType;
  // Pick up details
  pickupLocation?: string;
  // Delivery details
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  deliveryCostUSD: number;
  deliveryAddress?: string;
  // Agency shipping details
  agencyData?: AgencyShippingData;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotalUSD: number;
  deliveryCostUSD: number;
  totalUSD: number;
  exchangeRateBs: number;
  totalBs: number;
  customer: OrderCustomer;
  delivery: OrderDelivery;
  status: 'recibido' | 'en_proceso' | 'enviado' | 'entregado';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  heroBannerImage?: string; // Customizable main photo
  whatsappNumber: string; // International format without + (e.g., 584121234567)
  instagramUrl: string;
  tiktokUrl: string;
  exchangeRateBs: number; // e.g., 58.50 Bs per 1 USD
  categories: string[]; // Default ['Ropa', 'Accesorios']
  deliveryZones: DeliveryZone[];
  adminPassword: string; // default "moxie"
  announcement: string;
  showAnnouncement: boolean;
}
