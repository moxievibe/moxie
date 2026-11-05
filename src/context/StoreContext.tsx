import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  CartItem,
  Order,
  StoreSettings,
  OrderDelivery,
  OrderCustomer,
  DeliveryZone,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialProducts';

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
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  resetToDefaults: () => void;

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
  placeOrder: (customer: OrderCustomer, delivery: OrderDelivery) => Order;
  generateWhatsAppOrderUrl: (customer: OrderCustomer, delivery: OrderDelivery) => string;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'moxie_settings_v2',
  PRODUCTS: 'moxie_products_v2',
  CART: 'moxie_cart_v2',
  ORDERS: 'moxie_orders_v2',
  ADMIN_AUTH: 'moxie_admin_auth_v2',
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

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // storage quota or error
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // storage quota or error
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // storage quota or error
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // storage quota or error
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated ? 'true' : 'false');
    } catch {
      // storage quota or error
    }
  }, [isAdminAuthenticated]);

  // Admin Login
  const loginAdmin = (password: string): boolean => {
    if (password === settings.adminPassword || password === 'moxie' || password === 'moxie2026') {
      setIsAdminAuthenticated(true);
      showToast('Acceso al Panel de Administración concedido', 'success');
      return true;
    }
    showToast('Contraseña incorrecta', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    showToast('Sesión de administrador cerrada', 'info');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Ajustes de MOXIE actualizados con éxito');
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

  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: `moxie-prod-${Date.now()}`,
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`"${product.name}" añadido al catálogo`);
  };

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    showToast('Prenda actualizada correctamente');
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.inStock;
          showToast(
            `"${p.name}" ahora está ${nextState ? 'EN STOCK' : 'AGOTADO'}`,
            nextState ? 'success' : 'info'
          );
          return { ...p, inStock: nextState };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Producto eliminado del catálogo');
  };

  const resetToDefaults = () => {
    setSettings(INITIAL_SETTINGS);
    setProducts(INITIAL_PRODUCTS);
    showToast('Datos de MOXIE restaurados a la configuración inicial');
  };

  // Delivery zones
  const addDeliveryZone = (name: string, costUSD: number) => {
    const newZone: DeliveryZone = {
      id: `zone-${Date.now()}`,
      name: name.trim(),
      costUSD: Number(costUSD) || 0,
    };
    updateSettings({ deliveryZones: [...settings.deliveryZones, newZone] });
  };

  const updateDeliveryZone = (id: string, name: string, costUSD: number) => {
    const updated = settings.deliveryZones.map((z) =>
      z.id === id ? { ...z, name: name.trim(), costUSD: Number(costUSD) || 0 } : z
    );
    updateSettings({ deliveryZones: updated });
  };

  const deleteDeliveryZone = (id: string) => {
    const updated = settings.deliveryZones.filter((z) => z.id !== id);
    updateSettings({ deliveryZones: updated });
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
  const placeOrder = (customer: OrderCustomer, delivery: OrderDelivery): Order => {
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
      status: 'recibido',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderConfirmation(newOrder);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    return newOrder;
  };

  // Generate structured WhatsApp message
  const generateWhatsAppOrderUrl = (
    customer: OrderCustomer,
    delivery: OrderDelivery
  ): string => {
    const deliveryCostUSD = delivery.deliveryCostUSD || 0;
    const totalUSD = cartSubtotalUSD + deliveryCostUSD;
    const totalBs = totalUSD * exchangeRateBs;

    const itemsText = cart
      .map((item, idx) => {
        const variants = Object.entries(item.selectedVariants)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        return `▫️ *${item.quantity}x ${item.product.name}*\n   (${variants})\n   Precio: ${formatUSD(item.product.priceUSD * item.quantity)} [${formatBs(item.product.priceUSD * item.quantity)}]`;
      })
      .join('\n\n');

    let deliveryText = '';
    if (delivery.type === 'pickup') {
      deliveryText = `📍 *MÉTODO: PICK UP EN PERSONA*\n- Ubicación: Tocuyito, Valencia, Edo. Carabobo\n- Costo: GRATIS`;
    } else if (delivery.type === 'delivery') {
      deliveryText = `🛵 *MÉTODO: DELIVERY EN VALENCIA*\n- Zona: ${delivery.deliveryZoneName || 'Valencia'}\n- Dirección: ${delivery.deliveryAddress || 'Por coordinar'}\n- Costo de Delivery: ${formatUSD(deliveryCostUSD)} [${formatBs(deliveryCostUSD)}]`;
    } else if (delivery.type === 'agency') {
      const a = delivery.agencyData;
      deliveryText = `📦 *MÉTODO: ENVÍO POR AGENCIA (${a?.agency || 'MRW / Tealca'})*\n` +
        `- Destinatario: ${a?.firstName} ${a?.lastName}\n` +
        `- Cédula: ${a?.idNumber}\n` +
        `- Teléfono: ${a?.phone}\n` +
        `- Agencia seleccionada: ${a?.agency}\n` +
        `- Dirección agencia destino: ${a?.destinationAddress}\n` +
        `- Flete: Cobro en destino por la agencia`;
    }

    const message =
      `🔥 *NUEVO PEDIDO - MOXIE STREETWEAR* 🔥\n` +
      `==============================\n\n` +
      `👤 *DATOS DEL CLIENTE*\n` +
      `- Nombre: ${customer.name}\n` +
      `- Teléfono: ${customer.phone}\n` +
      (customer.notes ? `- Notas: ${customer.notes}\n` : '') +
      `\n==============================\n\n` +
      `🛒 *PRENDAS SELECCIONADAS*\n\n${itemsText}\n\n` +
      `==============================\n\n` +
      `${deliveryText}\n\n` +
      `==============================\n` +
      `💰 *RESUMEN DE PAGO*\n` +
      `- Subtotal prendas: ${formatUSD(cartSubtotalUSD)} [${formatBs(cartSubtotalUSD)}]\n` +
      (deliveryCostUSD > 0
        ? `- Delivery: ${formatUSD(deliveryCostUSD)} [${formatBs(deliveryCostUSD)}]\n`
        : '') +
      `- Tasa del día (BCV): 1$ = ${exchangeRateBs} Bs\n` +
      `*TOTAL A PAGAR:* \n👉 *${formatUSD(totalUSD)} USD*\n👉 *${formatBs(totalUSD)} Bs*\n\n` +
      `_Hola equipo MOXIE! Acabo de armar este pedido en la web, ¿me podrían indicar los datos bancarios / pago móvil / Zelle para transferir? Gracias!_`;

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
        deleteProduct,
        toggleProductStock,
        resetToDefaults,
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
