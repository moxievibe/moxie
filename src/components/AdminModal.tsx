import React, { useState } from 'react';
import {
  X,
  Shield,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
  TrendingUp,
  MapPin,
  Lock,
  Unlock,
  Upload,
  DollarSign,
  Wallet,
  ImageIcon,
  Pencil,
  Tag,
  Ruler,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const AdminModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
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
    categories,
    addCategory,
    deleteCategory,
    deliveryZones,
    addDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone,
    orders,
    formatUSD,
    formatBs,
    exchangeRateBs,
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'product-form' | 'delivery-zones' | 'finances' | 'rates-banner' | 'orders'>('inventory');

  // Editing product prices inline
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<number>(0);

  // Editing product stock units inline
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Editing delivery zones inline
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [tempZoneName, setTempZoneName] = useState<string>('');
  const [tempZoneCost, setTempZoneCost] = useState<number>(0);

  // New delivery zone form
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCostUSD, setNewZoneCostUSD] = useState<number>(3);

  // New / Edit product form state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0] || 'Ropa');
  const [prodPriceUSD, setProdPriceUSD] = useState<number>(35);
  const [prodPromoCashUSD, setProdPromoCashUSD] = useState<string>('');
  const [prodStockUnits, setProdStockUnits] = useState<number>(20);
  const [prodInStock, setProdInStock] = useState<boolean>(true);
  const [prodColors, setProdColors] = useState<string>('Negro, Blanco, Verde Moxie');
  const [prodSizingType, setProdSizingType] = useState<'clothing' | 'accessory_dimensions'>('clothing');
  const [prodSelectedSizes, setProdSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [prodWidthCm, setProdWidthCm] = useState<string>('');
  const [prodLengthCm, setProdLengthCm] = useState<string>('');
  const [prodSpecs, setProdSpecs] = useState<string>('100% Algodón Peinado 260 GSM\nCorte Boxy Streetwear\nCosturas reforzadas');
  const [prodImagesList, setProdImagesList] = useState<string[]>([]);
  const [prodImageInput, setProdImageInput] = useState('');

  // New finance record form
  const [finType, setFinType] = useState<'ingreso' | 'gasto'>('ingreso');
  const [finDesc, setFinDesc] = useState('');
  const [finAmount, setFinAmount] = useState<number>(50);
  const [finCategory, setFinCategory] = useState('Venta de Ropa');

  // Rate and banner form
  const [tempRate, setTempRate] = useState<number>(exchangeRateBs);
  const [tempBannerUrl, setTempBannerUrl] = useState<string>(settings.heroBannerImage || '');
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.whatsappNumber);

  if (!isAdminModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(passwordInput);
    setPasswordInput('');
  };

  const handleSavePrice = (id: string) => {
    updateProductPrice(id, tempPriceValue);
    setEditingPriceId(null);
  };

  const handleSaveStockUnits = (id: string) => {
    updateProductStockUnits(id, tempStockValue);
    setEditingStockId(null);
  };

  // Open Product Form in Edit Mode
  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPriceUSD(p.priceUSD);
    setProdPromoCashUSD(p.promoCashUSD ? String(p.promoCashUSD) : '');
    setProdStockUnits(p.stockUnits ?? 0);
    setProdInStock(p.inStock);

    // Extract colors
    if (p.colors && p.colors.length > 0) {
      setProdColors(p.colors.join(', '));
    } else {
      const colorVar = p.variants?.find((v) => v.name.toLowerCase() === 'color');
      setProdColors(colorVar ? colorVar.options.join(', ') : 'Negro, Blanco');
    }

    // Sizing type & dimensions
    const isAccessory = p.sizingType === 'accessory_dimensions' || (p.widthCm !== undefined && p.lengthCm !== undefined);
    setProdSizingType(isAccessory ? 'accessory_dimensions' : 'clothing');
    setProdWidthCm(p.widthCm ? String(p.widthCm) : '');
    setProdLengthCm(p.lengthCm ? String(p.lengthCm) : '');

    // Sizes
    const tallaVar = p.variants?.find((v) => v.name.toLowerCase() === 'talla');
    setProdSelectedSizes(tallaVar ? tallaVar.options : ['S', 'M', 'L', 'XL']);

    // Technical specs (manual)
    setProdSpecs(p.technicalSpecs ? p.technicalSpecs.join('\n') : '');

    // Images
    setProdImagesList(p.images || []);
    setProdImageInput('');

    setActiveTab('product-form');
  };

  // Open Product Form in Create Mode
  const startCreateProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory(categories[0] || 'Ropa');
    setProdPriceUSD(35);
    setProdPromoCashUSD('');
    setProdStockUnits(20);
    setProdInStock(true);
    setProdColors('Negro, Blanco, Verde Moxie');
    setProdSizingType('clothing');
    setProdSelectedSizes(['S', 'M', 'L', 'XL']);
    setProdWidthCm('');
    setProdLengthCm('');
    setProdSpecs('100% Algodón Peinado 260 GSM\nCorte Boxy Streetwear\nCosturas reforzadas');
    setProdImagesList([]);
    setProdImageInput('');
    setActiveTab('product-form');
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const specsArray = prodSpecs
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const colorsArray = prodColors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const promoCashNum = prodPromoCashUSD.trim() ? Number(prodPromoCashUSD) : undefined;
    const widthNum = prodWidthCm.trim() ? Number(prodWidthCm) : undefined;
    const lengthNum = prodLengthCm.trim() ? Number(prodLengthCm) : undefined;

    const imagesToUse =
      prodImagesList.length > 0
        ? prodImagesList
        : ['/assets/aistudio/logo_aad0827b.jpg'];

    // Construct variants array
    const variantsList = [];
    if (prodSizingType === 'clothing' && prodSelectedSizes.length > 0) {
      variantsList.push({ name: 'Talla', options: prodSelectedSizes });
    }
    if (colorsArray.length > 0) {
      variantsList.push({ name: 'Color', options: colorsArray });
    }

    if (editingProductId) {
      // Update existing product
      updateProduct(editingProductId, {
        name: prodName.trim(),
        category: prodCategory,
        priceUSD: Number(prodPriceUSD) || 1,
        promoCashUSD: promoCashNum,
        stockUnits: Number(prodStockUnits) || 0,
        inStock: prodInStock,
        images: imagesToUse,
        technicalSpecs: specsArray,
        colors: colorsArray,
        sizingType: prodSizingType,
        widthCm: widthNum,
        lengthCm: lengthNum,
        variants: variantsList,
      });
    } else {
      // Add new product
      addProduct({
        name: prodName.trim(),
        category: prodCategory,
        priceUSD: Number(prodPriceUSD) || 1,
        promoCashUSD: promoCashNum,
        stockUnits: Number(prodStockUnits) || 0,
        inStock: prodInStock,
        images: imagesToUse,
        technicalSpecs: specsArray,
        colors: colorsArray,
        sizingType: prodSizingType,
        widthCm: widthNum,
        lengthCm: lengthNum,
        variants: variantsList,
      });
    }

    setActiveTab('inventory');
  };

  const handleAddDeliveryZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName.trim()) return;
    addDeliveryZone(newZoneName.trim(), Number(newZoneCostUSD) || 0);
    setNewZoneName('');
    setNewZoneCostUSD(3);
  };

  const handleSaveDeliveryZone = (id: string) => {
    updateDeliveryZone(id, tempZoneName, tempZoneCost);
    setEditingZoneId(null);
  };

  const handleAddFinance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finDesc.trim() || finAmount <= 0) return;

    addFinancialRecord({
      type: finType,
      description: finDesc.trim(),
      amountUSD: Number(finAmount),
      category: finCategory,
      date: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' }),
    });

    setFinDesc('');
    setFinAmount(50);
  };

  const handleSaveRateAndBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      exchangeRateBs: Number(tempRate) || 58.5,
      heroBannerImage: tempBannerUrl.trim(),
      whatsappNumber: tempWhatsApp.trim(),
    });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setTempBannerUrl(reader.result);
          updateSettings({ heroBannerImage: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProdImagesList((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (prodImageInput.trim()) {
      setProdImagesList((prev) => [...prev, prodImageInput.trim()]);
      setProdImageInput('');
    }
  };

  const toggleSizeSelection = (size: string) => {
    setProdSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsAdminModalOpen(false)}
    >
      <div
        className="relative bg-neutral-950 text-white w-full max-w-5xl rounded-xl shadow-2xl border border-neutral-800 overflow-hidden my-4 sm:my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#4ade80]" />
            <div>
              <h2 id="admin-title" className="font-display font-extrabold uppercase text-lg sm:text-xl text-white">
                {isAdminAuthenticated ? 'Panel de Control MOXIE' : 'MOXIE'}
              </h2>
              {isAdminAuthenticated && (
                <p className="text-xs text-neutral-400">
                  Inventario, Edición de Prendas, Zonas de Delivery, Tasa Bs y Finanzas
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            aria-label="Cerrar"
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Screen if not authenticated */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-14 text-center max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#003314] text-[#4ade80] flex items-center justify-center mx-auto mb-6 border border-[#005220]">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-display font-black uppercase text-xl text-white mb-6 tracking-wide">
              Acceso Restringido
            </h3>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder=""
                aria-label="Contraseña"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-neutral-900 border border-neutral-800 rounded-md text-white text-center tracking-[0.3em] focus:outline-hidden focus:border-[#005220] transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 active:scale-98 transition-all rounded-md cursor-pointer"
              >
                Entrar
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Authenticated Navigation Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-900/60 px-4 sm:px-6 gap-2 text-xs font-mono overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Inventario ({products.length})
              </button>

              <button
                type="button"
                onClick={startCreateProduct}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'product-form'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {editingProductId ? <Pencil className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-3.5 h-3.5 text-[#4ade80]" />}
                <span>{editingProductId ? 'Editar Prenda' : 'Nueva Prenda'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('delivery-zones')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'delivery-zones'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Zonas de Delivery ({deliveryZones.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('finances')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'finances'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Ingresos & Gastos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rates-banner')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'rates-banner'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Tasa Bs & Ajustes
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Pedidos ({orders.length})
              </button>
            </div>

            {/* TAB 1: Inventory & Stock with Direct Edit Actions */}
            {activeTab === 'inventory' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5 font-mono text-xs">
                {/* Inventory KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase block">Total Unidades en Stock</span>
                    <span className="text-xl font-bold text-white tabular-nums">{totalInventoryUnits} prendas</span>
                  </div>

                  <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase block">Valoración de Inventario</span>
                    <span className="text-xl font-bold text-[#4ade80] tabular-nums">
                      {formatUSD(totalInventoryValuationUSD)}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">≈ {formatBs(totalInventoryValuationUSD)}</span>
                  </div>

                  <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 uppercase block">Prendas Activas en Catálogo</span>
                    <span className="text-xl font-bold text-white tabular-nums">{products.length} modelos</span>
                  </div>
                </div>

                <div className="text-neutral-400 text-[11px] flex items-center justify-between">
                  <span>
                    Edita precios, unidades, disponibilidad o presiona <strong>Editar</strong> para modificar todos los datos de la prenda:
                  </span>
                  <button
                    onClick={startCreateProduct}
                    className="px-3 py-1 bg-white text-black font-bold uppercase rounded hover:bg-neutral-200 cursor-pointer"
                  >
                    + Nueva Prenda
                  </button>
                </div>

                {/* Table of Products */}
                <div className="divide-y divide-neutral-900 border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
                  {products.map((p) => {
                    const isEditingPrice = editingPriceId === p.id;
                    const isEditingStock = editingStockId === p.id;

                    return (
                      <div
                        key={p.id}
                        className="p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 hover:bg-neutral-900 transition-colors"
                      >
                        {/* Thumbnail & Name */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <img
                            src={p.images?.[0] || '/assets/aistudio/logo_aad0827b.jpg'}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded bg-black shrink-0 border border-neutral-800"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-white uppercase text-xs truncate">
                              {p.name}
                            </h4>
                            <span className="text-[11px] text-neutral-400 block">
                              {p.category} {p.promoCashUSD ? `· Promo: $${p.promoCashUSD}` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Price in USD (Editable inline) */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-500 uppercase">Precio:</span>
                          {isEditingPrice ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="0.5"
                                min="1"
                                value={tempPriceValue}
                                onChange={(e) => setTempPriceValue(Number(e.target.value))}
                                className="w-16 px-1.5 py-1 text-xs bg-neutral-950 border border-[#005220] rounded text-white tabular-nums"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSavePrice(p.id)}
                                className="p-1 bg-[#003314] text-[#4ade80] rounded hover:bg-[#005220]"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPriceId(p.id);
                                setTempPriceValue(p.priceUSD);
                              }}
                              className="font-bold text-white hover:text-[#4ade80] hover:underline cursor-pointer tabular-nums text-xs"
                              title="Clic para editar precio rápido"
                            >
                              {formatUSD(p.priceUSD)} <span className="text-[10px] text-neutral-500">({formatBs(p.priceUSD)})</span>
                            </button>
                          )}
                        </div>

                        {/* Inventory Units (Editable inline) */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-neutral-500 uppercase">Unidades:</span>
                          {isEditingStock ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                value={tempStockValue}
                                onChange={(e) => setTempStockValue(Number(e.target.value))}
                                className="w-14 px-1.5 py-1 text-xs bg-neutral-950 border border-[#005220] rounded text-white tabular-nums"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveStockUnits(p.id)}
                                className="p-1 bg-[#003314] text-[#4ade80] rounded hover:bg-[#005220]"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingStockId(p.id);
                                setTempStockValue(p.stockUnits || 0);
                              }}
                              className="font-bold text-neutral-300 hover:text-white hover:underline cursor-pointer tabular-nums text-xs"
                              title="Clic para editar unidades"
                            >
                              {p.stockUnits ?? 0} u.
                            </button>
                          )}
                        </div>

                        {/* Actions: Stock Toggle, Full Edit, Delete */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded border transition-all cursor-pointer ${
                              p.inStock
                                ? 'bg-[#003314] text-[#4ade80] border-[#005220] hover:bg-neutral-800 hover:text-neutral-300'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-[#003314] hover:text-[#4ade80]'
                            }`}
                            title="Cambiar disponibilidad"
                          >
                            {p.inStock ? '✓ EN STOCK' : '✕ AGOTADO'}
                          </button>

                          <button
                            type="button"
                            onClick={() => startEditProduct(p)}
                            title="Editar prenda completa"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase bg-neutral-800 hover:bg-[#003314] hover:text-[#4ade80] text-neutral-200 border border-neutral-700 rounded transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            title="Eliminar prenda"
                            className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Complete Product Create / Edit Form */}
            {activeTab === 'product-form' && (
              <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#4ade80]" />
                    <h4 className="font-bold uppercase text-white text-sm">
                      {editingProductId ? `Editar Prenda: ${prodName}` : 'Agregar Nueva Prenda a MOXIE'}
                    </h4>
                  </div>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('inventory')}
                      className="text-neutral-400 hover:text-white text-xs underline cursor-pointer"
                    >
                      Cancelar Edición
                    </button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block uppercase text-neutral-400 mb-1 font-bold">
                    Nombre de la Prenda o Accesorio *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. MOXIE Puffer Bag Black / Heavyweight Hoodie"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                    required
                  />
                </div>

                {/* Category, Prices & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block uppercase text-neutral-400 mb-1 font-bold">
                      Categoría
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-400 mb-1 font-bold">
                      Precio Regular USD ($) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={prodPriceUSD}
                      onChange={(e) => setProdPriceUSD(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                      required
                    />
                    <span className="text-[10px] text-[#4ade80] mt-0.5 block">
                      ≈ {formatBs(prodPriceUSD)}
                    </span>
                  </div>

                  <div>
                    <label className="block uppercase text-amber-400 mb-1 font-bold">
                      Promo Divisas USD (Opcional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      placeholder="Ej. 25"
                      value={prodPromoCashUSD}
                      onChange={(e) => setProdPromoCashUSD(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-amber-500/30 rounded text-amber-300 placeholder:text-neutral-600"
                    />
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Efectivo en divisas (se muestra en pequeño)
                    </span>
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-400 mb-1 font-bold">
                      Unidades Inventario
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={prodStockUnits}
                      onChange={(e) => setProdStockUnits(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                    />
                  </div>
                </div>

                {/* Colors Field */}
                <div>
                  <label className="block uppercase text-neutral-400 mb-1 font-bold">
                    Colores Disponibles (separados por coma) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Negro, Blanco, Verde Bosque (#003314)"
                    value={prodColors}
                    onChange={(e) => setProdColors(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white placeholder:text-neutral-600"
                    required
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    El cliente podrá seleccionar estos colores al ordenar la prenda o accesorio.
                  </span>
                </div>

                {/* Sizing Type Selector (Clothing vs Accessory Dimensions) */}
                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3">
                  <label className="block uppercase text-neutral-300 font-bold">
                    Tipo de Medida del Producto *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setProdSizingType('clothing')}
                      className={`p-3 rounded border text-left cursor-pointer transition-all ${
                        prodSizingType === 'clothing'
                          ? 'border-[#4ade80] bg-[#003314] text-white'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      <div className="font-bold uppercase text-xs text-white">Prenda de Vestir (Tallas)</div>
                      <div className="text-[11px] text-neutral-300 mt-0.5">
                        Para hoodies, franelas, pantalones y chaquetas (S, M, L, XL).
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProdSizingType('accessory_dimensions')}
                      className={`p-3 rounded border text-left cursor-pointer transition-all ${
                        prodSizingType === 'accessory_dimensions'
                          ? 'border-[#4ade80] bg-[#003314] text-white'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      <div className="font-bold uppercase text-xs text-white">Accesorio / Bolso (Puffer Bags)</div>
                      <div className="text-[11px] text-neutral-300 mt-0.5">
                        Para bolsos, carteras y accesorios con medidas específicas en cm.
                      </div>
                    </button>
                  </div>

                  {/* If Clothing: Choose Sizes */}
                  {prodSizingType === 'clothing' ? (
                    <div className="pt-2">
                      <label className="block text-[11px] uppercase text-neutral-400 mb-2">
                        Tallas Habilitadas:
                      </label>
                      <div className="flex gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                          const isSel = prodSelectedSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => toggleSizeSelection(sz)}
                              className={`px-3 py-1.5 text-xs font-bold rounded border cursor-pointer ${
                                isSel
                                  ? 'bg-white text-black border-white'
                                  : 'bg-neutral-950 text-neutral-400 border-neutral-700 hover:border-neutral-500'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* If Accessory: Width and Length in cm */
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase text-neutral-400 mb-1 font-bold">
                          Ancho en centímetros (cm) *
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          placeholder="Ej. 38"
                          value={prodWidthCm}
                          onChange={(e) => setProdWidthCm(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                          required={prodSizingType === 'accessory_dimensions'}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase text-neutral-400 mb-1 font-bold">
                          Largo en centímetros (cm) *
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          placeholder="Ej. 30"
                          value={prodLengthCm}
                          onChange={(e) => setProdLengthCm(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                          required={prodSizingType === 'accessory_dimensions'}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Product Specifications (tela, compartimentos, etc.) */}
                <div>
                  <label className="block uppercase text-neutral-400 mb-1 font-bold">
                    Especificaciones del Producto (1 por línea)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ejemplo:&#10;Tela: French Terry pesado 460 GSM&#10;Compartimento interno acolchado&#10;Cremallera impermeable YKK&#10;Bordado frontal en relieve MOXIE"
                    value={prodSpecs}
                    onChange={(e) => setProdSpecs(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white font-mono text-xs"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    Ingresa manualmente los detalles técnicos que desees mostrar a los clientes.
                  </span>
                </div>

                {/* Photo Upload Section */}
                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="uppercase text-neutral-300 font-bold">
                      Fotografías del Producto
                    </label>
                    <span className="text-[10px] text-neutral-500">
                      {prodImagesList.length} fotos cargadas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-neutral-950 rounded border border-dashed border-neutral-700 text-center">
                      <Upload className="w-4 h-4 mx-auto text-neutral-500 mb-1" />
                      <span className="text-[11px] text-neutral-400 block mb-2">
                        Subir foto desde tu dispositivo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload}
                        className="text-[10px] text-neutral-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-white file:text-black cursor-pointer"
                      />
                    </div>

                    <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
                      <span className="text-[11px] text-neutral-400 block mb-1">
                        O introduce la URL directa de la foto:
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={prodImageInput}
                          onChange={(e) => setProdImageInput(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3 py-1 text-xs font-bold uppercase bg-[#003314] text-[#4ade80] border border-[#005220] rounded hover:bg-[#005220] cursor-pointer"
                        >
                          + Añadir
                        </button>
                      </div>
                    </div>
                  </div>

                  {prodImagesList.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-2">
                      {prodImagesList.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-neutral-700 shrink-0">
                          <img src={img} alt="Vista previa" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              setProdImagesList((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded p-0.5 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodInStock}
                      onChange={(e) => setProdInStock(e.target.checked)}
                      className="accent-[#003314]"
                    />
                    <span className="text-white uppercase font-bold">Estado: En Stock (Disponible)</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('inventory')}
                      className="px-4 py-2 text-xs font-bold uppercase text-neutral-400 hover:text-white"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 active:scale-98 rounded transition-all cursor-pointer shadow-md"
                    >
                      {editingProductId ? 'Guardar Cambios de la Prenda' : '+ Publicar Prenda en MOXIE'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 3: Delivery Zones Configuration */}
            {activeTab === 'delivery-zones' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#4ade80]" />
                    <h4 className="font-bold uppercase text-white">
                      Configuración de Zonas de Delivery en Valencia
                    </h4>
                  </div>
                  <span className="text-neutral-500 text-[11px]">
                    {deliveryZones.length} zonas activas
                  </span>
                </div>

                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Configura libremente las zonas de Valencia y el costo aproximado en USD ($) para cada área. Los clientes verán estos montos al momento de hacer el pedido.
                </p>

                {/* Form to add a new delivery zone */}
                <form onSubmit={handleAddDeliveryZone} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3">
                  <span className="font-bold text-white uppercase block text-[11px]">
                    + Agregar Nueva Zona de Delivery
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 mb-1 text-[10px] uppercase font-bold">
                        Nombre de la Zona / Sectores
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Valencia Sur (Plaza de Toros, Santa Inés, Bella Florida)"
                        value={newZoneName}
                        onChange={(e) => setNewZoneName(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 text-[10px] uppercase font-bold">
                        Costo USD ($)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={newZoneCostUSD}
                        onChange={(e) => setNewZoneCostUSD(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                        required
                      />
                      <span className="text-[10px] text-[#4ade80] mt-0.5 block">
                        ≈ {formatBs(newZoneCostUSD)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-neutral-200 cursor-pointer"
                    >
                      + Guardar Zona
                    </button>
                  </div>
                </form>

                {/* List of existing zones with editable costs */}
                <div className="space-y-2">
                  <span className="font-bold text-white uppercase text-[11px] block">
                    Zonas Configuradas Actualmente:
                  </span>

                  <div className="divide-y divide-neutral-900 border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
                    {deliveryZones.map((z) => {
                      const isEditing = editingZoneId === z.id;
                      return (
                        <div key={z.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-neutral-900 transition-colors">
                          <div className="flex-1">
                            {isEditing ? (
                              <input
                                type="text"
                                value={tempZoneName}
                                onChange={(e) => setTempZoneName(e.target.value)}
                                className="w-full px-2 py-1 bg-neutral-950 border border-[#005220] rounded text-white text-xs"
                              />
                            ) : (
                              <div className="font-bold text-white text-xs">{z.name}</div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={tempZoneCost}
                                  onChange={(e) => setTempZoneCost(Number(e.target.value))}
                                  className="w-16 px-1.5 py-1 bg-neutral-950 border border-[#005220] rounded text-white text-xs tabular-nums"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveDeliveryZone(z.id)}
                                  className="p-1 bg-[#003314] text-[#4ade80] rounded hover:bg-[#005220]"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="text-right">
                                <span className="font-bold text-[#4ade80] text-xs tabular-nums">
                                  {formatUSD(z.costUSD)}
                                </span>
                                <span className="text-[10px] text-neutral-500 block tabular-nums">
                                  ≈ {formatBs(z.costUSD)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {!isEditing ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingZoneId(z.id);
                                  setTempZoneName(z.name);
                                  setTempZoneCost(z.costUSD);
                                }}
                                className="p-1 text-neutral-400 hover:text-white"
                                title="Editar nombre o costo"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingZoneId(null)}
                                className="p-1 text-neutral-500 hover:text-white text-[10px]"
                              >
                                Cancelar
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteDeliveryZone(z.id)}
                              className="p-1 text-neutral-500 hover:text-red-400"
                              title="Eliminar zona"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Finances (Ingresos y Gastos) */}
            {activeTab === 'finances' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6 font-mono text-xs">
                {/* Financial KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Total Ingresos</span>
                      <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                        +{formatUSD(totalIncomeUSD)}
                      </span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">
                        ≈ {formatBs(totalIncomeUSD)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Total Gastos</span>
                      <span className="text-2xl font-bold text-red-400 tabular-nums">
                        -{formatUSD(totalExpensesUSD)}
                      </span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">
                        ≈ {formatBs(totalExpensesUSD)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Balance Neto (Ganancia)</span>
                      <span
                        className={`text-2xl font-bold tabular-nums ${
                          netProfitUSD >= 0 ? 'text-[#4ade80]' : 'text-red-400'
                        }`}
                      >
                        {formatUSD(netProfitUSD)}
                      </span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">
                        ≈ {formatBs(netProfitUSD)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* New Financial Record Form */}
                <form
                  onSubmit={handleAddFinance}
                  className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3"
                >
                  <span className="font-bold text-white uppercase block text-xs">
                    + Registrar Nuevo Movimiento (Ingreso / Gasto)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1 text-[10px] uppercase font-bold">
                        Tipo de Movimiento
                      </label>
                      <select
                        value={finType}
                        onChange={(e) => setFinType(e.target.value as 'ingreso' | 'gasto')}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                      >
                        <option value="ingreso">Ingreso (+)</option>
                        <option value="gasto">Gasto (-)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 mb-1 text-[10px] uppercase font-bold">
                        Concepto o Descripción
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Venta 2x Hoodie / Tela French Terry / Envíos"
                        value={finDesc}
                        onChange={(e) => setFinDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 text-[10px] uppercase font-bold">
                        Monto en USD ($)
                      </label>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={finAmount}
                        onChange={(e) => setFinAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-neutral-200 cursor-pointer"
                    >
                      Guardar Movimiento
                    </button>
                  </div>
                </form>

                {/* Financial History List */}
                <div className="space-y-2">
                  <span className="font-bold text-white uppercase text-xs block">
                    Historial de Movimientos ({financialRecords.length}):
                  </span>

                  {financialRecords.length === 0 ? (
                    <p className="text-neutral-500 py-4 text-center">No hay registros financieros aún.</p>
                  ) : (
                    <div className="divide-y divide-neutral-900 border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
                      {financialRecords.map((r) => (
                        <div key={r.id} className="p-3 flex items-center justify-between hover:bg-neutral-900">
                          <div>
                            <span className="text-white font-bold block">{r.description}</span>
                            <span className="text-[10px] text-neutral-500">{r.date} · {r.category}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`font-bold tabular-nums text-sm ${
                                r.type === 'ingreso' ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {r.type === 'ingreso' ? '+' : '-'}${r.amountUSD.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteFinancialRecord(r.id)}
                              className="text-neutral-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: Exchange Rate & Main Banner Photo */}
            {activeTab === 'rates-banner' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6 font-mono text-xs">
                <form onSubmit={handleSaveRateAndBanner} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#4ade80]" />
                      <h4 className="font-bold uppercase text-white">
                        Tasa de Cambio en Bolívares (Bs por 1 USD)
                      </h4>
                    </div>
                    <span className="text-[#4ade80] font-bold">
                      Actual: 1$ = {exchangeRateBs} Bs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 mb-1 font-bold">
                        Tasa Oficial / BCV del día (Bs)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={tempRate}
                        onChange={(e) => setTempRate(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                        required
                      />
                      <span className="text-[10px] text-neutral-500 mt-1 block">
                        Al guardar, todos los precios en la web se recalcularán automáticamente en Bolívares.
                      </span>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-bold">
                        WhatsApp de Contacto y Pedidos
                      </label>
                      <input
                        type="tel"
                        value={tempWhatsApp}
                        onChange={(e) => setTempWhatsApp(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                        placeholder="584244578410"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-right pt-3 border-t border-neutral-800">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold uppercase bg-white text-black hover:bg-neutral-200 rounded cursor-pointer"
                    >
                      Guardar Ajustes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 6: Orders Log */}
            {activeTab === 'orders' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h4 className="font-bold uppercase text-white">
                    Historial de Pedidos ({orders.length})
                  </h4>
                  <span className="text-neutral-500 text-[11px]">
                    Registrados al despachar pedido por WhatsApp
                  </span>
                </div>

                {orders.length === 0 ? (
                  <p className="text-center py-8 text-neutral-500">
                    Aún no se han recibido pedidos en la plataforma.
                  </p>
                ) : (
                  orders.map((o) => (
                    <div key={o.id} className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#4ade80]">{o.id} · {o.date}</span>
                        <span className="font-bold text-white tabular-nums">
                          {formatUSD(o.totalUSD)} ({formatBs(o.totalUSD)})
                        </span>
                      </div>
                      <p className="text-neutral-300">
                        Cliente: <strong>{o.customer.name}</strong> ({o.customer.phone}) · Pago: {o.paymentMethod === 'divisas_cash' ? 'Divisas (Efectivo/Promo)' : 'Bolívares (Tasa BCV)'}
                      </p>
                      <p className="text-neutral-400 text-[11px]">
                        Método: {o.delivery.type.toUpperCase()} ·{' '}
                        {o.delivery.type === 'delivery'
                          ? `Zona: ${o.delivery.deliveryZoneName} (${o.delivery.deliveryAddress})`
                          : o.delivery.type === 'pickup'
                          ? 'Pick Up en Tocuyito'
                          : `Agencia ${o.delivery.agencyData?.agency} - Cédula: ${o.delivery.agencyData?.idNumber}`}
                      </p>
                      <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/60">
                        {o.items.map((it, i) => (
                          <span key={i} className="mr-3">
                            {it.quantity}x {it.product.name} ({Object.values(it.selectedVariants).join(', ')})
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Bottom Admin Bar */}
            <div className="p-4 bg-neutral-900/80 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
              <button
                type="button"
                onClick={resetToDefaults}
                className="text-neutral-500 hover:text-red-400 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar catálogo inicial MOXIE</span>
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                className="text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Cerrar Sesión Admin</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
