import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const CatalogSection: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    exchangeRateBs,
  } = useStore();

  const allCategories = ['Todos', ...categories];

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Todos' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
    if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
    // Featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 text-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest text-[#4ade80] uppercase mb-1">
            DROP // APPAREL & GEAR
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display tracking-tight text-white">
            Catálogo Oficial MOXIE
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Precios en USD ($) con conversión en tiempo real a Bolívares (Tasa: {exchangeRateBs} Bs/$)
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por prenda, modelo, color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs font-mono bg-neutral-900 border border-neutral-800 rounded-md text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-[#005220] focus:ring-1 focus:ring-[#005220] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs (Interactive Segmented buttons) & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-900">
        {/* Dynamic Category Tabs: 'Todos', 'Ropa', 'Accesorios' + any user-created categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {allCategories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#003314] text-white border border-[#005220] shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between lg:justify-end gap-4 text-xs font-mono text-neutral-400">
          <span className="tabular-nums">
            {sortedProducts.length} {sortedProducts.length === 1 ? 'artículo' : 'artículos'}
          </span>

          <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-md border border-neutral-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              aria-label="Ordenar prendas por"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-mono text-white border-none cursor-pointer focus:ring-0 focus:outline-hidden"
            >
              <option value="featured" className="bg-neutral-900 text-white">Destacados</option>
              <option value="price-asc" className="bg-neutral-900 text-white">Precio: Menor a Mayor</option>
              <option value="price-desc" className="bg-neutral-900 text-white">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Streetwear Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-900/50 rounded-lg border border-dashed border-neutral-800 p-8">
          <p className="text-base font-display font-bold uppercase text-white mb-2">
            No se encontraron prendas
          </p>
          <p className="text-xs text-neutral-400 mb-4 max-w-sm mx-auto font-mono">
            No hay artículos que coincidan con &quot;{searchQuery}&quot; en esta categoría.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Todos');
            }}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white rounded-md hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Ver Todo el Catálogo
          </button>
        </div>
      )}
    </section>
  );
};
