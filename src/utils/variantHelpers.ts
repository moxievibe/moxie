import { Product } from '../types';

export const normalizeVariantName = (val = ''): string => {
  return val.trim().toLowerCase();
};

export const getVariantStockKey = (color = '', size = ''): string => {
  const c = normalizeVariantName(color);
  const s = normalizeVariantName(size);
  if (c && s) return `${c}__${s}`;
  if (c) return c;
  if (s) return s;
  return 'default';
};

/**
 * Returns true if the product has at least one variant in stock.
 * Prevents showing the entire product as out of stock when some sizes/colors remain available.
 */
export const isProductAvailable = (product: Product): boolean => {
  if (product.variantStock && Object.keys(product.variantStock).length > 0) {
    return Object.values(product.variantStock).some((inStock) => inStock === true);
  }
  return product.inStock;
};

/**
 * Checks if a specific combination of color and/or size is in stock.
 */
export const isVariantAvailable = (
  product: Product,
  color = '',
  size = ''
): boolean => {
  if (!product.variantStock || Object.keys(product.variantStock).length === 0) {
    return product.inStock;
  }

  const c = normalizeVariantName(color);
  const s = normalizeVariantName(size);

  // Exact 2-dimensional match (Color + Talla)
  if (c && s) {
    const key = `${c}__${s}`;
    if (key in product.variantStock) {
      return product.variantStock[key];
    }
  }

  // 1-dimensional match when only Color is specified
  if (c && !s) {
    if (c in product.variantStock) return product.variantStock[c];
    // Check if any size exists for this color
    const matchingEntries = Object.entries(product.variantStock).filter(([k]) =>
      k.startsWith(`${c}__`)
    );
    if (matchingEntries.length > 0) {
      return matchingEntries.some(([, inStock]) => inStock === true);
    }
  }

  // 1-dimensional match when only Size is specified
  if (!c && s) {
    if (s in product.variantStock) return product.variantStock[s];
    // Check if any color exists for this size
    const matchingEntries = Object.entries(product.variantStock).filter(([k]) =>
      k.endsWith(`__${s}`)
    );
    if (matchingEntries.length > 0) {
      return matchingEntries.some(([, inStock]) => inStock === true);
    }
  }

  // Fallback to general product stock
  return product.inStock;
};
