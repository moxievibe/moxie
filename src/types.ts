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
  promoCashUSD?: number; // Precio especial en divisas (efectivo/promo), ej. 25$
  originalPriceUSD?: number;
  images: string[]; // Gallery of photos
  description?: string;
  technicalSpecs: string[]; // Especificaciones manuales (tela, compartimentos, etc.)
  sizingType?: 'clothing' | 'accessory_dimensions'; // Prenda con tallas o accesorio con dimensiones
  widthCm?: number; // Ancho en cm para bolsos/accesorios
  lengthCm?: number; // Largo en cm para bolsos/accesorios
  colors?: string[]; // Colores disponibles
  sizeGuide?: SizeGuideItem[];
  stockUnits?: number; // Total units in stock
  inStock: boolean; // "En Stock" | "Agotado"
  variants: ProductVariant[];
  variantStock?: Record<string, boolean>; // e.g. { "verde moxie__m": true, "verde moxie__s": false }
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
  paymentMethod: 'bolivares_bcv' | 'divisas_cash'; // 'Bolívares (Tasa BCV)' | 'Divisas (Efectivo/Promo)'
  status: 'recibido' | 'en_proceso' | 'enviado' | 'entregado';
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  heroBannerImage?: string; // Customizable main photo
  whatsappNumber: string; // International format without + (e.g., 584121234567)
  instagramUrl: string;
  tiktokUrl: string;
  exchangeRateBs: number; // e.g., 904.45 Bs per 1 USD (bcv.org.ve)
  bcvAutoSync?: boolean; // Sincronización diaria automática con BCV
  bcvLastUpdated?: string; // Fecha de actualización de la tasa BCV
  bcvSource?: string; // Fuente de la tasa oficial
  categories: string[]; // Default ['Ropa', 'Accesorios']
  deliveryZones: DeliveryZone[];
  adminPassword: string; // default "mooxiiee19*"
  announcement: string;
  showAnnouncement: boolean;
}
