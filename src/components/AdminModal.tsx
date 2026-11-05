import React, { useState } from 'react';
import {
  X,
  Shield,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  TrendingUp,
  Tag,
  Package,
  Layers,
  MapPin,
  Lock,
  Unlock,
  Upload,
  Link as LinkIcon,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, DeliveryZone } from '../types';

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
    deleteProduct,
    toggleProductStock,
    resetToDefaults,
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
  const [activeTab, setActiveTab] = useState<'inventory' | 'rates-delivery' | 'categories' | 'add-product' | 'orders'>('inventory');

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0] || 'Ropa');
  const [newProdPriceUSD, setNewProdPriceUSD] = useState<number>(35);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(40);
  const [newProdImageInput, setNewProdImageInput] = useState('');
  const [newProdImagesList, setNewProdImagesList] = useState<string[]>([]);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdSpecs, setNewProdSpecs] = useState('100% Algodón Peinado 260 GSM\nCorte Boxy Streetwear\nCosturas reforzadas');
  const [newProdInStock, setNewProdInStock] = useState(true);
  const [newProdBadge, setNewProdBadge] = useState('NUEVO DROP');

  // Rate and settings form
  const [tempRate, setTempRate] = useState<number>(exchangeRateBs);
  const [tempWhatsApp, setTempWhatsApp] = useState(settings.whatsappNumber);
  const [tempInstagram, setTempInstagram] = useState(settings.instagramUrl);
  const [tempTikTok, setTempTikTok] = useState(settings.tiktokUrl);
  const [tempAnnouncement, setTempAnnouncement] = useState(settings.announcement);

  // New category form
  const [newCatName, setNewCatName] = useState('');

  // New delivery zone form
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneCost, setNewZoneCost] = useState<number>(3.5);

  if (!isAdminModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(passwordInput);
    setPasswordInput('');
  };

  const handleSaveRateAndBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      exchangeRateBs: Number(tempRate) || 58.5,
      whatsappNumber: tempWhatsApp.trim(),
      instagramUrl: tempInstagram.trim(),
      tiktokUrl: tempTikTok.trim(),
      announcement: tempAnnouncement.trim(),
    });
  };

  // Image Upload helper (FileReader to base64)
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

    const specsArray = newProdSpecs
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const imagesToUse =
      newProdImagesList.length > 0
        ? newProdImagesList
        : ['/src/assets/images/moxie_tshirt_black_1793892891603.jpg'];

    addProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      priceUSD: Number(newProdPriceUSD) || 10,
      originalPriceUSD: Number(newProdOriginalPrice) || undefined,
      images: imagesToUse,
      description: newProdDesc.trim() || 'Prenda esencial de la colección oficial MOXIE.',
      technicalSpecs: specsArray.length > 0 ? specsArray : ['Algodón Premium Streetwear', 'Corte relajado'],
      inStock: newProdInStock,
      badge: newProdBadge.trim() || undefined,
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

    // Reset
    setNewProdName('');
    setNewProdDesc('');
    setNewProdImagesList([]);
    setActiveTab('inventory');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      addCategory(newCatName.trim());
      setNewCatName('');
    }
  };

  const handleCreateDeliveryZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newZoneName.trim()) {
      addDeliveryZone(newZoneName.trim(), newZoneCost);
      setNewZoneName('');
      setNewZoneCost(3.5);
    }
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
        className="relative bg-neutral-950 text-white w-full max-w-4xl rounded-xl shadow-2xl border border-neutral-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#4ade80]" />
            <div>
              <h2 id="admin-title" className="font-display font-extrabold uppercase text-lg sm:text-xl text-white">
                Panel de Administración MOXIE
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Control de Stock, Precios en USD/Bs, Tasa del día, Zonas de Valencia y Catálogo
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            aria-label="Cerrar panel de administración"
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Screen if not authenticated */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#003314] text-[#4ade80] flex items-center justify-center mx-auto mb-4 border border-[#005220]">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-display font-extrabold uppercase text-xl text-white mb-2">
              Acceso Restringido
            </h3>
            <p className="text-xs font-mono text-neutral-400 mb-6">
              Ingresa la contraseña de administrador para gestionar el stock, tasa y catálogo de MOXIE.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña (por defecto: moxie)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded-md text-white text-center tracking-widest focus:outline-hidden focus:border-[#005220]"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-colors rounded-md cursor-pointer"
              >
                Ingresar al Panel
              </button>
              <p className="text-[11px] font-mono text-neutral-500">
                Pista: puedes usar la contraseña <strong>moxie</strong>
              </p>
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
                Stock & Prendas ({products.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rates-delivery')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'rates-delivery'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Tasa Bs & Delivery Valencia
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className={`py-3 px-3 border-b-2 font-bold uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'categories'
                    ? 'border-[#4ade80] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Categorías ({categories.length})
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
                Pedidos Registrados ({orders.length})
              </button>
            </div>

            {/* TAB 1: Stock & Products Table */}
            {activeTab === 'inventory' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                  <p className="text-neutral-400">
                    Haz clic en el botón de estado para cambiar entre <strong className="text-[#4ade80]">EN STOCK</strong> y <strong className="text-neutral-400">AGOTADO</strong> instantáneamente.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('add-product')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase bg-white text-black hover:bg-neutral-200 rounded transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Prenda</span>
                  </button>
                </div>

                <div className="divide-y divide-neutral-900 border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
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
                            {p.category} · {formatUSD(p.priceUSD)} <span className="text-[#4ade80]">({formatBs(p.priceUSD)})</span>
                          </span>
                        </div>
                      </div>

                      {/* Controls: Stock Toggle & Delete */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleProductStock(p.id)}
                          className={`px-3 py-1.5 text-[11px] font-bold uppercase rounded border transition-all cursor-pointer ${
                            p.inStock
                              ? 'bg-[#003314] text-[#4ade80] border-[#005220] hover:bg-red-950/60 hover:text-red-400 hover:border-red-800'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-[#003314] hover:text-[#4ade80] hover:border-[#005220]'
                          }`}
                          title="Clic para cambiar estado"
                        >
                          {p.inStock ? '✓ EN STOCK' : '✕ AGOTADO'}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          title="Eliminar producto"
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Rates & Delivery Settings */}
            {activeTab === 'rates-delivery' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6 font-mono text-xs">
                {/* Exchange Rate Form */}
                <form onSubmit={handleSaveRateAndBrand} className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#4ade80]" />
                      <h4 className="font-bold uppercase text-white">
                        Tasa de Cambio Oficial (Bs por 1 USD $)
                      </h4>
                    </div>
                    <span className="text-[#4ade80] font-bold">
                      Actual: 1$ = {exchangeRateBs} Bs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 mb-1">
                        Tasa del día (Ej. 58.50, 60.00)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={tempRate}
                        onChange={(e) => setTempRate(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        WhatsApp de la Marca (con código de país sin +)
                      </label>
                      <input
                        type="tel"
                        value={tempWhatsApp}
                        onChange={(e) => setTempWhatsApp(e.target.value)}
                        placeholder="584121234567"
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        URL de Instagram de MOXIE
                      </label>
                      <input
                        type="url"
                        value={tempInstagram}
                        onChange={(e) => setTempInstagram(e.target.value)}
                        placeholder="https://instagram.com/moxie"
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1">
                        URL de TikTok de MOXIE
                      </label>
                      <input
                        type="url"
                        value={tempTikTok}
                        onChange={(e) => setTempTikTok(e.target.value)}
                        placeholder="https://tiktok.com/@moxie"
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-400 mb-1">
                        Texto de la barra de anuncios superior
                      </label>
                      <input
                        type="text"
                        value={tempAnnouncement}
                        onChange={(e) => setTempAnnouncement(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase bg-white text-black hover:bg-neutral-200 rounded transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Actualizar Tasa y Redes</span>
                    </button>
                  </div>
                </form>

                {/* Delivery Zones in Valencia */}
                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#4ade80]" />
                      <h4 className="font-bold uppercase text-white">
                        Zonas de Delivery en Valencia y Costos ($)
                      </h4>
                    </div>
                  </div>

                  <p className="text-neutral-400 text-[11px]">
                    El cliente verá estas opciones cuando elija &quot;Delivery en Valencia&quot; y el costo se sumará automáticamente en USD y Bs.
                  </p>

                  {/* Zones list */}
                  <div className="space-y-2">
                    {deliveryZones.map((z) => (
                      <div
                        key={z.id}
                        className="flex items-center justify-between p-2.5 bg-neutral-950 rounded border border-neutral-800"
                      >
                        <span className="font-bold text-white">{z.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#4ade80] font-bold tabular-nums">
                            {formatUSD(z.costUSD)} ({formatBs(z.costUSD)})
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteDeliveryZone(z.id)}
                            className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add zone form */}
                  <form onSubmit={handleCreateDeliveryZone} className="pt-2 border-t border-neutral-800 flex flex-wrap gap-2">
                    <input
                      type="text"
                      placeholder="Nombre de la zona (ej. Trigaleña / El Trigal)"
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      className="flex-1 min-w-[200px] px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-white"
                      required
                    />
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="Costo en $"
                      value={newZoneCost}
                      onChange={(e) => setNewZoneCost(Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-bold uppercase bg-[#003314] text-[#4ade80] border border-[#005220] rounded hover:bg-[#005220] cursor-pointer"
                    >
                      + Añadir Zona
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: Categories Management */}
            {activeTab === 'categories' && (
              <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6 font-mono text-xs">
                <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                    <Layers className="w-4 h-4 text-[#4ade80]" />
                    <h4 className="font-bold uppercase text-white">
                      Categorías del Catálogo MOXIE
                    </h4>
                  </div>

                  <p className="text-neutral-400 text-[11px]">
                    Actualmente tienes las dos principales <strong>Ropa</strong> y <strong>Accesorios</strong>. Puedes agregar cuantas categorías desees (ej: Hoodies, Shorts, Calzado, Ediciones Limitadas):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        className="flex items-center justify-between p-3 bg-neutral-950 rounded border border-neutral-800"
                      >
                        <span className="font-bold uppercase text-white">{cat}</span>
                        <button
                          type="button"
                          onClick={() => deleteCategory(cat)}
                          className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Category Form */}
                  <form onSubmit={handleCreateCategory} className="pt-2 border-t border-neutral-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Nueva categoría (ej. Edición Limitada)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold uppercase bg-white text-black hover:bg-neutral-200 rounded cursor-pointer"
                    >
                      + Crear Categoría
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 4: Add New Product Form */}
            {activeTab === 'add-product' && (
              <form onSubmit={handleCreateProduct} className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 font-mono text-xs">
                <div>
                  <label className="block uppercase text-neutral-400 mb-1 font-bold">
                    Nombre de la Prenda o Accesorio *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. MOXIE Oversized Heavyweight Hoodie"
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
                    <label className="block uppercase text-neutral-400 mb-1">
                      Badge / Etiqueta
                    </label>
                    <input
                      type="text"
                      placeholder="DROP 01, HEAVYWEIGHT..."
                      value={newProdBadge}
                      onChange={(e) => setNewProdBadge(e.target.value)}
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

                  <p className="text-[11px] text-neutral-400">
                    Puedes cargar tus fotos oficiales desde tu equipo o ingresar la URL de la imagen:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option A: Local file upload */}
                    <div className="p-3 bg-neutral-950 rounded border border-dashed border-neutral-700 text-center">
                      <Upload className="w-5 h-5 mx-auto text-neutral-500 mb-1" />
                      <span className="text-[11px] text-neutral-400 block mb-2">
                        Subir foto desde tu dispositivo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLocalImageUpload}
                        className="text-[10px] text-neutral-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-mono file:bg-white file:text-black hover:file:bg-neutral-200 cursor-pointer"
                      />
                    </div>

                    {/* Option B: Direct URL */}
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

                  {/* Previews of loaded photos */}
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
                    placeholder="Detalles del fit, tacto y silueta..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-400 mb-1">
                    Especificaciones Técnicas (una por línea)
                  </label>
                  <textarea
                    rows={3}
                    value={newProdSpecs}
                    onChange={(e) => setNewProdSpecs(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white font-mono text-[11px]"
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
                    Registrados automáticamente al tramitar
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
