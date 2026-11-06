import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  OrderDelivery,
  OrderCustomer,
  DeliveryZone,
  FinancialRecord,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_FINANCIAL_RECORDS } from '../data/initialProducts';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  updateProductPrice: (id: string, newPriceUSD: number) => void;
  updateProductStockUnits: (id: string, units: number) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  resetToDefaults: () => void;

  // Inventory Totals
  totalInventoryUnits: number;
  totalInventoryValuationUSD: number;

  // Finances (Ingresos y Gastos)
  financialRecords: FinancialRecord[];
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  deleteFinancialRecord: (id: string) => void;
  totalIncomeUSD: number;
  totalExpensesUSD: number;
  netProfitUSD: number;

  // Categories
  categories: string[];
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;

  // Navigation & Filtering
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc') => void;

  // Currency
  exchangeRateBs: number;
  formatUSD: (amountUSD: number) => string;
  formatBs: (amountUSD: number) => string;
  formatDual: (amountUSD: number) => string;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariants: Record<string, string>) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedVariants: Record<string, string>) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalUSD: number;
  cartSubtotalBs: number;

  // Delivery Zones
  deliveryZones: DeliveryZone[];
  addDeliveryZone: (name: string, costUSD: number) => void;
  updateDeliveryZone: (id: string, name: string, costUSD: number) => void;
  deleteDeliveryZone: (id: string) => void;

  // Modals & UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (open: boolean) => void;
  activeOrderConfirmation: Order | null;
  setActiveOrderConfirmation: (order: Order | null) => void;

  // Orders
  orders: Order[];
  placeOrder: (customer: OrderCustomer, delivery: OrderDelivery, paymentMethod?: 'bolivares_bcv' | 'divisas_cash') => Order;
  generateWhatsAppOrderUrl: (customer: OrderCustomer, delivery: OrderDelivery, paymentMethod?: 'bolivares_bcv' | 'divisas_cash') => string;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'moxie_settings_v3',
  PRODUCTS: 'moxie_products_v3',
  CART: 'moxie_cart_v3',
  ORDERS: 'moxie_orders_v3',
  FINANCES: 'moxie_finances_v3',
  ADMIN_AUTH: 'moxie_admin_auth_v3',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Financial Records (Ingresos y Gastos)
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FINANCES);
      return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_RECORDS;
    } catch {
      return INITIAL_FINANCIAL_RECORDS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [activeOrderConfirmation, setActiveOrderConfirmation] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Helper to fetch entire store from server
  const fetchStoreFromServer = async () => {
    try {
      const res = await fetch('/api/store');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products)) setProducts(data.products);
        if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
        if (Array.isArray(data.financialRecords)) setFinancialRecords(data.financialRecords);
        if (Array.isArray(data.orders)) setOrders(data.orders);
      }
    } catch {
      // Offline fallback
    }
  };

  // Global Real-Time SSE Sync across all connected devices + polling fallback
  useEffect(() => {
    fetchStoreFromServer();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.store) {
            const { products: p, settings: s, financialRecords: f, orders: o } = payload.store;
            if (Array.isArray(p)) setProducts(p);
            if (s) setSettings((prev) => ({ ...prev, ...s }));
            if (Array.isArray(f)) setFinancialRecords(f);
            if (Array.isArray(o)) setOrders(o);
          }
        } catch {
          // ignore keep-alive
        }
      };
    } catch {
      // EventSource fallback
    }

    // Polling sync every 8 seconds and on window focus
    const interval = setInterval(fetchStoreFromServer, 8000);
    const handleFocus = () => fetchStoreFromServer();
    window.addEventListener('focus', handleFocus);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Sync to localStorage as offline cache backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(financialRecords));
    } catch {
      // ignore
    }
  }, [financialRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isAdminAuthenticated]);

  // Admin Login
  const loginAdmin = (password: string): boolean => {
    if (password === 'mooxiiee19*' || password === settings.adminPassword) {
      setIsAdminAuthenticated(true);
      showToast('Acceso concedido', 'success');
      return true;
    }
    showToast('Contraseña incorrecta', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    showToast('Sesión de administrador cerrada', 'info');
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      showToast('Ajustes actualizados globalmente en tiempo real');
    } catch {
      showToast('Ajustes guardados localmente', 'info');
    }
  };

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (settings.categories.includes(trimmed)) {
      showToast('Esa categoría ya existe', 'error');
      return;
    }
    const updated = [...settings.categories, trimmed];
    updateSettings({ categories: updated });
    showToast(`Categoría "${trimmed}" añadida`);
  };

  const deleteCategory = (name: string) => {
    if (settings.categories.length <= 1) {
      showToast('Debe haber al menos una categoría', 'error');
      return;
    }
    const updated = settings.categories.filter((c) => c !== name);
    updateSettings({ categories: updated });
    if (selectedCategory === name) {
      setSelectedCategory('Todos');
    }
    showToast(`Categoría "${name}" eliminada`);
  };

  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: `moxie-prod-${Date.now()}`,
      stockUnits: newProd.stockUnits !== undefined ? newProd.stockUnits : 20,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`"${product.name}" guardado en el servidor global`);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch (err) {
      console.error('Error saving product to server:', err);
    }
  };

  const updateProduct = async (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    showToast('Prenda actualizada globalmente');
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.error('Error updating product on server:', err);
    }
  };

  const updateProductPrice = async (id: string, newPriceUSD: number) => {
    const price = Number(newPriceUSD) || 1;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priceUSD: price } : p))
    );
    showToast('Precio actualizado globalmente');
    try {
      await fetch(`/api/products/${id}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceUSD: price }),
      });
    } catch (err) {
      console.error('Error updating price on server:', err);
    }
  };

  const updateProductStockUnits = async (id: string, units: number) => {
    const safeUnits = Math.max(0, Math.floor(units));
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockUnits: safeUnits, inStock: safeUnits > 0 ? p.inStock : false } : p
      )
    );
    showToast('Unidades actualizadas globalmente');
    try {
      await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ units: safeUnits }),
      });
    } catch (err) {
      console.error('Error updating stock on server:', err);
    }
  };

  const toggleProductStock = async (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.inStock;
          showToast(
            `"${p.name}" ahora está ${nextState ? 'EN STOCK' : 'AGOTADO'} (Global)`,
            nextState ? 'success' : 'info'
          );
          return { ...p, inStock: nextState };
        }
        return p;
      })
    );
    try {
      await fetch(`/api/products/${id}/toggle-stock`, { method: 'PATCH' });
    } catch (err) {
      console.error('Error toggling stock on server:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Producto eliminado globalmente');
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting product on server:', err);
    }
  };

  // Finances Operations
  const addFinancialRecord = async (rec: Omit<FinancialRecord, 'id'>) => {
    const newRecord: FinancialRecord = {
      ...rec,
      id: `fin-${Date.now()}`,
    };
    setFinancialRecords((prev) => [newRecord, ...prev]);
    showToast(
      `${rec.type === 'ingreso' ? 'Ingreso' : 'Gasto'} de $${rec.amountUSD} registrado globalmente`,
      'success'
    );
    try {
      await fetch('/api/finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch (err) {
      console.error('Error adding finance record on server:', err);
    }
  };

  const deleteFinancialRecord = async (id: string) => {
    setFinancialRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Movimiento financiero eliminado');
    try {
      await fetch(`/api/finances/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting finance record on server:', err);
    }
  };

  const totalIncomeUSD = financialRecords
    .filter((r) => r.type === 'ingreso')
    .reduce((sum, r) => sum + r.amountUSD, 0);

  const totalExpensesUSD = financialRecords
    .filter((r) => r.type === 'gasto')
    .reduce((sum, r) => sum + r.amountUSD, 0);

  const netProfitUSD = totalIncomeUSD - totalExpensesUSD;

  // Inventory stats
  const totalInventoryUnits = products.reduce((sum, p) => sum + (p.stockUnits || 0), 0);
  const totalInventoryValuationUSD = products.reduce(
    (sum, p) => sum + p.priceUSD * (p.stockUnits || 0),
    0
  );

  const resetToDefaults = async () => {
    setSettings(INITIAL_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    setFinancialRecords(INITIAL_FINANCIAL_RECORDS);
    showToast('Restaurando catálogo inicial en el servidor...');
    try {
      await fetch('/api/reset-defaults', { method: 'POST' });
      showToast('Datos de MOXIE restaurados globalmente con éxito');
    } catch (err) {
      console.error('Error resetting defaults on server:', err);
    }
  };

  // Delivery zones
  const addDeliveryZone = async (name: string, costUSD: number) => {
    const newZone: DeliveryZone = {
      id: `zone-${Date.now()}`,
      name: name.trim(),
      costUSD: Number(costUSD) || 0,
    };
    setSettings((prev) => ({
      ...prev,
      deliveryZones: [...prev.deliveryZones, newZone],
    }));
    try {
      await fetch('/api/delivery-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newZone),
      });
      showToast(`Zona "${newZone.name}" guardada globalmente`);
    } catch (err) {
      console.error('Error adding delivery zone on server:', err);
    }
  };

  const updateDeliveryZone = async (id: string, name: string, costUSD: number) => {
    const updated = settings.deliveryZones.map((z) =>
      z.id === id ? { ...z, name: name.trim(), costUSD: Number(costUSD) || 0 } : z
    );
    setSettings((prev) => ({ ...prev, deliveryZones: updated }));
    try {
      await fetch(`/api/delivery-zones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), costUSD: Number(costUSD) || 0 }),
      });
      showToast('Zona de delivery actualizada globalmente');
    } catch (err) {
      console.error('Error updating delivery zone on server:', err);
    }
  };

  const deleteDeliveryZone = async (id: string) => {
    const updated = settings.deliveryZones.filter((z) => z.id !== id);
    setSettings((prev) => ({ ...prev, deliveryZones: updated }));
    try {
      await fetch(`/api/delivery-zones/${id}`, { method: 'DELETE' });
      showToast('Zona de delivery eliminada globalmente');
    } catch (err) {
      console.error('Error deleting delivery zone on server:', err);
    }
  };

  // Currencies formatting
  const exchangeRateBs = settings.exchangeRateBs || 58.5;

  const formatUSD = (amountUSD: number): string => {
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountUSD);
    return `$${formatted}`;
  };

  const formatBs = (amountUSD: number): string => {
    const amountBs = amountUSD * exchangeRateBs;
    const formatted = new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountBs);
    return `Bs. ${formatted}`;
  };

  const formatDual = (amountUSD: number): string => {
    return `${formatUSD(amountUSD)} · ${formatBs(amountUSD)}`;
  };

  const variantKey = (variants?: Record<string, string>) => {
    if (!variants) return '';
    return Object.entries(variants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariants: Record<string, string>
  ) => {
    if (!product.inStock) {
      showToast('Este producto se encuentra agotado actualmente', 'error');
      return;
    }

    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          variantKey(item.selectedVariants) === variantKey(selectedVariants)
      );

      if (matchIndex > -1) {
        const updated = [...prev];
        updated[matchIndex] = {
          ...updated[matchIndex],
          quantity: updated[matchIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedVariants }];
      }
    });

    showToast(`Añadido a la bolsa (${quantity}x ${product.name})`);
  };

  const removeFromCart = (productId: string, selectedVariants: Record<string, string>) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            variantKey(item.selectedVariants) === variantKey(selectedVariants)
          )
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    selectedVariants: Record<string, string>
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariants);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          variantKey(item.selectedVariants) === variantKey(selectedVariants)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);
  const cartSubtotalBs = cartSubtotalUSD * exchangeRateBs;

  // Place order
  const placeOrder = (
    customer: OrderCustomer,
    delivery: OrderDelivery,
    paymentMethod: 'bolivares_bcv' | 'divisas_cash' = 'bolivares_bcv'
  ): Order => {
    const deliveryCostUSD = delivery.deliveryCostUSD || 0;
    const totalUSD = cartSubtotalUSD + deliveryCostUSD;
    const totalBs = totalUSD * exchangeRateBs;

    const newOrder: Order = {
      id: `MOX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-VE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      subtotalUSD: cartSubtotalUSD,
      deliveryCostUSD,
      totalUSD,
      exchangeRateBs,
      totalBs,
      customer,
      delivery,
      paymentMethod,
      status: 'recibido',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Persist order to global backend
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch {
      // offline
    }

    // Automatically record income in store finances
    addFinancialRecord({
      type: 'ingreso',
      description: `Pedido ${newOrder.id} - ${customer.name}`,
      amountUSD: totalUSD,
      category: 'Ventas de Ropa',
      date: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' }),
    });

    clearCart();
    setActiveOrderConfirmation(newOrder);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    return newOrder;
  };

  // Generate structured WhatsApp message strictly following requested schema
  const generateWhatsAppOrderUrl = (
    customer: OrderCustomer,
    delivery: OrderDelivery,
    paymentMethod: 'bolivares_bcv' | 'divisas_cash' = 'bolivares_bcv'
  ): string => {
    const deliveryCostUSD = delivery.deliveryCostUSD || 0;
    const totalUSD = cartSubtotalUSD + deliveryCostUSD;
    const totalBs = totalUSD * exchangeRateBs;

    // Prendas seleccionadas
    const itemsFormatted = cart
      .map((item) => {
        const color = item.selectedVariants['Color'] || '';
        const sizeOrDim = item.selectedVariants['Talla'] || item.selectedVariants['Medidas'] || '';
        const specsList = [
          sizeOrDim ? `Talla/Medidas: ${sizeOrDim}` : '',
          item.product.widthCm && item.product.lengthCm ? `Ancho: ${item.product.widthCm}cm, Largo: ${item.product.lengthCm}cm` : '',
          item.product.technicalSpecs && item.product.technicalSpecs.length > 0 ? item.product.technicalSpecs.join(', ') : '',
        ].filter(Boolean);

        const productNameWithColor = color
          ? `${item.quantity}x ${item.product.name} (Color: ${color})`
          : `${item.quantity}x ${item.product.name}`;

        const specsText = specsList.length > 0 ? specsList.join(' | ') : 'Estándar';

        return `- Producto: ${productNameWithColor}\n- Especificaciones: ${specsText}`;
      })
      .join('\n\n');

    // Método de entrega
    let deliveryMethod = '';
    let deliveryAddress = '';
    let deliveryZone = '';
    let deliveryCost = '';

    if (delivery.type === 'pickup') {
      deliveryMethod = 'Pick Up';
      deliveryAddress = 'Tocuyito, Valencia, Edo. Carabobo (Punto de retiro oficial)';
      deliveryZone = 'Tocuyito';
      deliveryCost = 'Gratis ($0)';
    } else if (delivery.type === 'delivery') {
      deliveryMethod = 'Delivery';
      deliveryAddress = delivery.deliveryAddress || 'Dirección por confirmar en Valencia';
      deliveryZone = delivery.deliveryZoneName || 'Valencia';
      deliveryCost = `${formatUSD(deliveryCostUSD)} (~${formatBs(deliveryCostUSD)}) [Aproximado]`;
    } else if (delivery.type === 'agency') {
      const a = delivery.agencyData;
      deliveryMethod = `Envíos Nacionales (${a?.agency || 'MRW / Tealca'})`;
      deliveryAddress = a?.destinationAddress || 'Dirección de la agencia destino';
      deliveryZone = `${a?.agency} (Destinatario: ${a?.firstName} ${a?.lastName}, CI: ${a?.idNumber}, Telf: ${a?.phone})`;
      deliveryCost = 'Cobro en destino por agencia';
    }

    const paymentLabel =
      paymentMethod === 'divisas_cash'
        ? 'Divisas (Efectivo/Promo)'
        : 'Bolívares (Tasa BCV)';

    const message =
      `*NUEVO PEDIDO MOXIE*\n\n` +
      `*Datos del cliente*\n` +
      `- Nombre: ${customer.name}\n` +
      `- Teléfono: ${customer.phone}\n\n` +
      `*Prendas seleccionadas*\n` +
      `${itemsFormatted}\n\n` +
      `*Método de entrega*\n` +
      `- Método: ${deliveryMethod}\n` +
      `- Dirección: ${deliveryAddress}\n` +
      `- Zona: ${deliveryZone}\n` +
      `- Costo: ${deliveryCost}\n\n` +
      `*Resumen de Pago*\n` +
      `- Método de pago: ${paymentLabel}\n` +
      `- Total de prendas: ${formatUSD(cartSubtotalUSD)} (${formatBs(cartSubtotalUSD)})\n` +
      `- Total de entrega: ${deliveryCostUSD > 0 ? `${formatUSD(deliveryCostUSD)} (${formatBs(deliveryCostUSD)})` : 'Gratis'}\n` +
      `- *TOTAL A PAGAR*: ${formatUSD(totalUSD)} y su equivalente en Bs. ${formatBs(totalUSD)}`;

    const encoded = encodeURIComponent(message);
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encoded}`;
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        updateProductPrice,
        updateProductStockUnits,
        deleteProduct,
        toggleProductStock,
        resetToDefaults,
        totalInventoryUnits,
        totalInventoryValuationUSD,
        financialRecords,
        addFinancialRecord,
        deleteFinancialRecord,
        totalIncomeUSD,
        totalExpensesUSD,
        netProfitUSD,
        categories: settings.categories,
        addCategory,
        deleteCategory,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        exchangeRateBs,
        formatUSD,
        formatBs,
        formatDual,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalUSD,
        cartSubtotalBs,
        deliveryZones: settings.deliveryZones,
        addDeliveryZone,
        updateDeliveryZone,
        deleteDeliveryZone,
        isCartOpen,
        setIsCartOpen,
        activeProductModal,
        setActiveProductModal,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        activeOrderConfirmation,
        setActiveOrderConfirmation,
        orders,
        placeOrder,
        generateWhatsAppOrderUrl,
        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
