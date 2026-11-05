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
  Package,
  Layers,
  MapPin,
  Lock,
  Unlock,
  Upload,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  ImageIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

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
    deleteDeliveryZone,
    orders,
    formatUSD,
    formatBs,
    exchangeRateBs,
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'finances' | 'rates-banner' | 'add-product' | 'orders'>('inventory');

  // Editing product prices inline
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceValue, setTempPriceValue] = useState<number>(0);

  // Editing product stock units inline
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // New finance record form
  const [finType, setFinType] = useState<'ingreso' | 'gasto'>('ingreso');
  const [finDesc, setFinDesc] = useState('');
  const [finAmount, setFinAmount] = useState<number>(50);
  const [finCategory, setFinCategory] = useState('Venta de Ropa');

  // Rate and banner form
  const [tempRate, setTempRate] = useState<number>(exchangeRateBs);
  const [tempBannerUrl, setTempBannerUrl] = useState<string>(settings.heroBannerImage || '');
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.whatsappNumber);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0] || 'Ropa');
  const [newProdPriceUSD, setNewProdPriceUSD] = useState<number>(35);
  const [newProdStockUnits, setNewProdStockUnits] = useState<number>(20);
  const [newProdImageInput, setNewProdImageInput] = useState('');
  const [newProdImagesList, setNewProdImagesList] = useState<string[]>([]);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSpecs, setNewProdSpecs] = useState('100% Algodón Peinado 260 GSM\nCorte Boxy Streetwear\nCosturas reforzadas');
  const [newProdInStock, setNewProdInStock] = useState(true);

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
          setNewProdImagesList((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (newProdImageInput.trim()) {
      setNewProdImagesList((prev) => [...prev, newProdImageInput.trim()]);
      setNewProdImageInput('');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const specsArray = newProdSpecs.split('\n').map((s) => s.trim()).filter(Boolean);
    const imagesToUse =
      newProdImagesList.length > 0
        ? newProdImagesList
        : ['/src/assets/images/moxie_tshirt_black_1793892891603.jpg'];

    addProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      priceUSD: Number(newProdPriceUSD) || 10,
      stockUnits: Number(newProdStockUnits) || 0,
      images: imagesToUse,
      description: newProdDesc.trim() || 'Prenda esencial de la colección oficial MOXIE.',
      technicalSpecs: specsArray.length > 0 ? specsArray : ['Algodón Premium Streetwear', 'Corte relajado'],
      inStock: newProdInStock,
      variants: [
        { name: 'Talla', options: ['S', 'M', 'L', 'XL'] },
        { name: 'Color', options: ['Verde Moxie', 'Negro Ébano'] },
      ],
      sizeGuide: [
        { size: 'S', chestCm: 56, lengthCm: 70 },
        { size: 'M', chestCm: 59, lengthCm: 73 },
        { size: 'L', chestCm: 62, lengthCm: 76 },
        { size: 'XL', chestCm: 65, lengthCm: 79 },
      ],
    });

    setNewProdName('');
    setNewProdDesc('');
    setNewProdImagesList([]);
    setActiveTab('inventory');
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
                  Inventario, Control de Stock, Precios en USD, Tasa Bs y Registro de Ingresos/Gastos
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
                Inventario & Precios ({products.length})
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
                Tasa Bs & Foto Portada
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('add-product')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'add-product'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Agregar Prenda</span>
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

            {/* TAB 1: Inventory & Stock with Direct Price Editing */}
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
                    Edita el precio en USD, modifica las unidades disponibles o cambia el estado (En Stock / Agotado) con un clic:
                  </span>
                  <button
                    onClick={() => setActiveTab('add-product')}
                    className="px-3 py-1 bg-white text-black font-bold uppercase rounded hover:bg-neutral-200"
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
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <img
                            src={p.images?.[0] || '/src/assets/images/moxie_tshirt_black_1793892891603.jpg'}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded bg-black shrink-0 border border-neutral-800"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-white uppercase text-xs truncate">
                              {p.name}
                            </h4>
                            <span className="text-[11px] text-neutral-400 block">
                              {p.category}
                            </span>
                          </div>
                        </div>

                        {/* Price in USD (Editable) */}
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
                              title="Clic para editar precio"
                            >
                              {formatUSD(p.priceUSD)} <span className="text-[10px] text-neutral-500">({formatBs(p.priceUSD)})</span>
                            </button>
                          )}
                        </div>

                        {/* Inventory Units (Editable) */}
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

                        {/* Availability Toggle Button */}
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            className={`px-3 py-1.5 text-[11px] font-bold uppercase rounded border transition-all cursor-pointer ${
                              p.inStock
                                ? 'bg-[#003314] text-[#4ade80] border-[#005220] hover:bg-neutral-800 hover:text-neutral-300'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-[#003314] hover:text-[#4ade80]'
                            }`}
                            title="Clic para cambiar entre Disponible y Agotado"
                          >
                            {p.inStock ? '✓ DISPONIBLE' : '✕ AGOTADO'}
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

            {/* TAB 2: Finances (Ingresos y Gastos) */}
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
                    <div className="p-2 bg-emerald-950/60 text-emerald-400 rounded border border-emerald-800">
                      <ArrowUpRight className="w-4 h-4" />
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
                    <div className="p-2 bg-red-950/60 text-red-400 rounded border border-red-800">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Balance Neto</span>
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
                    <div className="p-2 bg-[#003314] text-[#4ade80] rounded border border-[#005220]">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* New Transaction Form */}
                <form onSubmit={handleAddFinance} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3">
                  <h4 className="font-bold uppercase text-white text-xs flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-[#4ade80]" />
                    <span>Registrar Nuevo Movimiento (Ingreso o Gasto)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                        Tipo de Movimiento
                      </label>
                      <select
                        value={finType}
                        onChange={(e) => setFinType(e.target.value as 'ingreso' | 'gasto')}
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-white"
                      >
                        <option value="ingreso">🟢 Ingreso (Venta, Abono)</option>
                        <option value="gasto">🔴 Gasto (Tela, Confección, Empaque)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                        Descripción / Concepto *
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Compra de tela French Terry 460 GSM o Venta Drop 01"
                        value={finDesc}
                        onChange={(e) => setFinDesc(e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                        Monto en USD ($) *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={finAmount}
                        onChange={(e) => setFinAmount(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 uppercase">Categoría:</span>
                      <select
                        value={finCategory}
                        onChange={(e) => setFinCategory(e.target.value)}
                        className="px-2 py-1 bg-neutral-950 border border-neutral-700 rounded text-white text-[11px]"
                      >
                        <option value="Ventas de Ropa">Ventas de Ropa</option>
                        <option value="Materia Prima">Materia Prima (Telas / Hilos)</option>
                        <option value="Confección & Taller">Confección & Taller</option>
                        <option value="Empaque & Branding">Empaque & Branding</option>
                        <option value="Marketing & Redes">Marketing & Redes</option>
                        <option value="Logística & Delivery">Logística & Delivery</option>
                        <option value="Otros Gastos">Otros Gastos</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-black font-bold uppercase rounded hover:bg-neutral-200 cursor-pointer"
                    >
                      + Guardar Movimiento
                    </button>
                  </div>
                </form>

                {/* Financial History Table */}
                <div className="space-y-2">
                  <h4 className="font-bold uppercase text-neutral-300 text-xs">
                    Historial de Movimientos ({financialRecords.length})
                  </h4>

                  {financialRecords.length === 0 ? (
                    <p className="text-center py-6 text-neutral-500">
                      Aún no hay movimientos registrados.
                    </p>
                  ) : (
                    <div className="divide-y divide-neutral-900 border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
                      {financialRecords.map((r) => (
                        <div
                          key={r.id}
                          className="p-3 flex items-center justify-between hover:bg-neutral-900 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`p-1.5 rounded text-[10px] font-bold uppercase ${
                                r.type === 'ingreso'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-red-950 text-red-400 border border-red-800'
                              }`}
                            >
                              {r.type === 'ingreso' ? '+ INGRESO' : '- GASTO'}
                            </span>
                            <div>
                              <p className="font-bold text-white text-xs">{r.description}</p>
                              <span className="text-[10px] text-neutral-400">
                                {r.category} · {r.date}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span
                                className={`font-bold tabular-nums text-sm block ${
                                  r.type === 'ingreso' ? 'text-emerald-400' : 'text-red-400'
                                }`}
                              >
                                {r.type === 'ingreso' ? '+' : '-'}${r.amountUSD.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-neutral-500 tabular-nums">
                                ≈ {formatBs(r.amountUSD)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteFinancialRecord(r.id)}
                              className="text-neutral-500 hover:text-red-400 p-1"
                              title="Eliminar movimiento"
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

            {/* TAB 3: Exchange Rate & Main Banner Photo */}
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
                        placeholder="584121234567"
                        required
                      />
                    </div>
                  </div>

                  {/* Main Banner / Photo Changer */}
                  <div className="pt-4 border-t border-neutral-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#4ade80]" />
                      <h4 className="font-bold uppercase text-white">
                        Foto Principal de Portada / Banner (Hero)
                      </h4>
                    </div>

                    <p className="text-[11px] text-neutral-400">
                      Sube la fotografía principal que represente a MOXIE o introduce la URL directa:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div className="p-3 bg-neutral-950 rounded border border-dashed border-neutral-700 text-center">
                        <Upload className="w-4 h-4 mx-auto text-neutral-400 mb-1" />
                        <span className="text-[11px] text-neutral-400 block mb-1">
                          Subir foto desde tu dispositivo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="text-[10px] text-neutral-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-white file:text-black cursor-pointer"
                        />
                      </div>

                      <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
                        <span className="text-[11px] text-neutral-400 block mb-1">
                          O escribe la URL de la imagen:
                        </span>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={tempBannerUrl}
                          onChange={(e) => setTempBannerUrl(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded text-white"
                        />
                      </div>
                    </div>

                    {tempBannerUrl && (
                      <div className="pt-2">
                        <span className="text-[10px] text-neutral-500 uppercase block mb-1">
                          Vista previa del banner actual:
                        </span>
                        <img
                          src={tempBannerUrl}
                          alt="Banner actual"
                          className="w-full max-h-36 object-cover rounded border border-neutral-800"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold uppercase bg-white text-black hover:bg-neutral-200 rounded transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 inline mr-1.5" />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 4: Add New Product */}
            {activeTab === 'add-product' && (
              <form onSubmit={handleCreateProduct} className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 font-mono text-xs">
                <div>
                  <label className="block uppercase text-neutral-400 mb-1 font-bold">
                    Nombre de la Prenda o Accesorio *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. MOXIE Heavyweight Boxy Hoodie"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block uppercase text-neutral-400 mb-1 font-bold">
                      Categoría
                    </label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
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
                      Precio en USD ($) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={newProdPriceUSD}
                      onChange={(e) => setNewProdPriceUSD(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                      required
                    />
                    <span className="text-[10px] text-[#4ade80] mt-0.5 block">
                      ≈ {formatBs(newProdPriceUSD)}
                    </span>
                  </div>

                  <div>
                    <label className="block uppercase text-neutral-400 mb-1 font-bold">
                      Unidades Iniciales en Inventario
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newProdStockUnits}
                      onChange={(e) => setNewProdStockUnits(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="uppercase text-neutral-300 font-bold">
                      Fotografías Oficiales de la Prenda
                    </label>
                    <span className="text-[10px] text-neutral-500">
                      {newProdImagesList.length} fotos cargadas
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
                        O pega la URL directa de la foto:
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://..."
                          value={newProdImageInput}
                          onChange={(e) => setNewProdImageInput(e.target.value)}
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

                  {newProdImagesList.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-2">
                      {newProdImagesList.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-neutral-700 shrink-0">
                          <img src={img} alt="Vista previa" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() =>
                              setNewProdImagesList((prev) => prev.filter((_, idx) => idx !== i))
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

                <div>
                  <label className="block uppercase text-neutral-400 mb-1">
                    Descripción de la Prenda
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detalles del fit, corte y silueta..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProdInStock}
                      onChange={(e) => setNewProdInStock(e.target.checked)}
                      className="accent-[#003314]"
                    />
                    <span className="text-white uppercase font-bold">Publicar inmediatamente En Stock</span>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 rounded transition-colors cursor-pointer"
                  >
                    + Publicar Prenda en MOXIE
                  </button>
                </div>
              </form>
            )}

            {/* TAB 5: Orders Log */}
            {activeTab === 'orders' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h4 className="font-bold uppercase text-white">
                    Historial de Pedidos Generados ({orders.length})
                  </h4>
                  <span className="text-neutral-500 text-[11px]">
                    Registrados automáticamente al enviar pedido por WhatsApp
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
                        Cliente: <strong>{o.customer.name}</strong> ({o.customer.phone})
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
