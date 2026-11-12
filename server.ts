import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_FINANCIAL_RECORDS } from './src/data/initialProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'moxie_db.json');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface MoxieDatabase {
  products: any[];
  settings: any;
  financialRecords: any[];
  orders: any[];
  updatedAt: string;
}

function getInitialDatabase(): MoxieDatabase {
  return {
    products: INITIAL_PRODUCTS,
    settings: INITIAL_SETTINGS,
    financialRecords: INITIAL_FINANCIAL_RECORDS,
    orders: [],
    updatedAt: new Date().toISOString(),
  };
}

function readDb(): MoxieDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      writeDb(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const db: MoxieDatabase = {
      products: Array.isArray(parsed.products) ? parsed.products : INITIAL_PRODUCTS,
      settings: parsed.settings ? { ...INITIAL_SETTINGS, ...parsed.settings } : INITIAL_SETTINGS,
      financialRecords: Array.isArray(parsed.financialRecords) ? parsed.financialRecords : INITIAL_FINANCIAL_RECORDS,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };

    // Auto-migrate if exchange rate was outdated (< 200 Bs/$)
    if (!db.settings.exchangeRateBs || db.settings.exchangeRateBs < 200) {
      db.settings.exchangeRateBs = 904.45;
      db.settings.bcvSource = 'Banco Central de Venezuela (bcv.org.ve)';
      db.settings.bcvLastUpdated = new Date().toISOString();
      writeDb(db);
    }

    // Ensure products have variantStock and promoCashUSD if not present
    let productsMigrated = false;
    db.products = db.products.map((prod) => {
      const defaultProd = INITIAL_PRODUCTS.find((ip) => ip.id === prod.id);
      let updatedProd = { ...prod };
      if (!prod.variantStock && defaultProd?.variantStock) {
        updatedProd.variantStock = defaultProd.variantStock;
        productsMigrated = true;
      }
      if (prod.promoCashUSD === undefined && defaultProd?.promoCashUSD !== undefined) {
        updatedProd.promoCashUSD = defaultProd.promoCashUSD;
        productsMigrated = true;
      }
      return updatedProd;
    });
    if (productsMigrated) {
      writeDb(db);
    }

    return db;
  } catch (err) {
    console.error('Error reading database file, returning defaults:', err);
    return getInitialDatabase();
  }
}

function writeDb(data: MoxieDatabase): void {
  try {
    data.updatedAt = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// Ensure database is initialized on boot
if (!fs.existsSync(DB_FILE)) {
  writeDb(getInitialDatabase());
}

/**
 * Fetch official daily BCV exchange rate taking bcv.org.ve as primary authority
 */
async function fetchBcvOfficialRate(): Promise<{ rate: number; source: string; date: string } | null> {
  // Strategy 1: Public DolarApi mirror for BCV daily official rate
  try {
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      headers: { 'User-Agent': 'MOXIE-Store-BCV-Service/1.0' },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.promedio === 'number' && data.promedio > 0) {
        return {
          rate: Math.round(data.promedio * 100) / 100,
          source: 'Banco Central de Venezuela (bcv.org.ve)',
          date: data.fechaActualizacion || new Date().toISOString(),
        };
      }
    }
  } catch (e) {
    console.warn('Strategy 1 for BCV failed, trying direct bcv.org.ve scrape:', e);
  }

  // Strategy 2: Direct scrape of official https://www.bcv.org.ve
  try {
    const res = await fetch('https://www.bcv.org.ve', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const html = await res.text();
      // Match USD block: <div ...> USD</span> ... <strong class="strong-tb">904,44850000</strong>
      const match =
        html.match(/USD[\s\S]*?<strong[^>]*class="strong-tb"[^>]*>\s*([\d,.]+)\s*<\/strong>/i) ||
        html.match(/<div id="dolar"[\s\S]*?<strong[^>]*>\s*([\d,.]+)\s*<\/strong>/i);
      if (match && match[1]) {
        const rawNum = match[1].replace(/\./g, '').replace(',', '.');
        const num = parseFloat(rawNum);
        if (!isNaN(num) && num > 0) {
          return {
            rate: Math.round(num * 100) / 100,
            source: 'bcv.org.ve directo',
            date: new Date().toISOString(),
          };
        }
      }
    }
  } catch (e) {
    console.warn('Strategy 2 for BCV scrape failed:', e);
  }

  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // SSE client pool for real-time live sync
  const sseClients = new Set<express.Response>();

  const broadcast = (eventPayload: { type: string; store: MoxieDatabase }) => {
    const message = `data: ${JSON.stringify(eventPayload)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(message);
      } catch (e) {
        sseClients.delete(client);
      }
    }
  };

  // Automated BCV Daily Sync Function
  const syncBcvDaily = async () => {
    try {
      const bcvData = await fetchBcvOfficialRate();
      if (bcvData && bcvData.rate > 0) {
        const db = readDb();
        if (db.settings.exchangeRateBs !== bcvData.rate) {
          console.log(`[BCV SYNC] Updating exchange rate: ${db.settings.exchangeRateBs} -> ${bcvData.rate} Bs/$`);
          db.settings.exchangeRateBs = bcvData.rate;
          db.settings.bcvLastUpdated = bcvData.date;
          db.settings.bcvSource = bcvData.source;
          writeDb(db);
          broadcast({ type: 'bcv_rate_updated', store: db });
        }
      }
    } catch (err) {
      console.warn('Daily BCV sync check failed:', err);
    }
  };

  // Run BCV sync on boot and every 30 minutes
  syncBcvDaily();
  setInterval(syncBcvDaily, 30 * 60 * 1000);

  // Heartbeat ping every 25 seconds to keep SSE alive
  setInterval(() => {
    for (const client of sseClients) {
      try {
        client.write(': ping\n\n');
      } catch {
        sseClients.delete(client);
      }
    }
  }, 25000);

  // SSE stream endpoint
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const currentStore = readDb();
    res.write(`data: ${JSON.stringify({ type: 'initial', store: currentStore })}\n\n`);

    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // REST API: Trigger on-demand BCV Sync from bcv.org.ve
  app.post('/api/bcv/sync', async (_req, res) => {
    const bcvData = await fetchBcvOfficialRate();
    if (bcvData && bcvData.rate > 0) {
      const db = readDb();
      db.settings.exchangeRateBs = bcvData.rate;
      db.settings.bcvLastUpdated = bcvData.date;
      db.settings.bcvSource = bcvData.source;
      writeDb(db);
      broadcast({ type: 'bcv_rate_updated', store: db });
      return res.json({
        success: true,
        rate: bcvData.rate,
        source: bcvData.source,
        date: bcvData.date,
      });
    }
    // Return existing rate if network was unavailable
    const current = readDb();
    res.json({
      success: true,
      rate: current.settings.exchangeRateBs,
      source: current.settings.bcvSource || 'bcv.org.ve',
      date: current.settings.bcvLastUpdated || new Date().toISOString(),
    });
  });

  // REST API: Get Full Store (Products, Settings, Finances, Orders)
  app.get('/api/store', (_req, res) => {
    const store = readDb();
    res.json(store);
  });

  // Helper to calculate overall inStock based on variantStock
  const resolveInStock = (prod: any): boolean => {
    if (prod.variantStock && typeof prod.variantStock === 'object') {
      const values = Object.values(prod.variantStock);
      if (values.length > 0) {
        return values.some((v) => v === true);
      }
    }
    return prod.inStock ?? true;
  };

  // REST API: Create Product
  app.post('/api/products', (req, res) => {
    const db = readDb();
    const newProduct = {
      ...req.body,
      id: req.body.id || `moxie-prod-${Date.now()}`,
      inStock: resolveInStock(req.body),
    };
    db.products = [newProduct, ...db.products];
    writeDb(db);
    broadcast({ type: 'product_created', store: db });
    res.status(201).json({ success: true, product: newProduct });
  });

  // REST API: Update Existing Product
  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const updatedProd = {
      ...db.products[index],
      ...req.body,
      id, // Preserve ID
    };
    updatedProd.inStock = resolveInStock(updatedProd);

    db.products[index] = updatedProd;
    writeDb(db);
    broadcast({ type: 'product_updated', store: db });
    res.json({ success: true, product: db.products[index] });
  });

  // REST API: Toggle Stock
  app.patch('/api/products/:id/toggle-stock', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const nextState = !db.products[index].inStock;
    db.products[index].inStock = nextState;

    // If toggled on/off, sync all variantStock items as well
    if (db.products[index].variantStock) {
      const updatedVariantStock: Record<string, boolean> = {};
      for (const k of Object.keys(db.products[index].variantStock)) {
        updatedVariantStock[k] = nextState;
      }
      db.products[index].variantStock = updatedVariantStock;
    }

    writeDb(db);
    broadcast({ type: 'stock_toggled', store: db });
    res.json({ success: true, inStock: db.products[index].inStock });
  });

  // REST API: Update Product Price
  app.patch('/api/products/:id/price', (req, res) => {
    const { id } = req.params;
    const { priceUSD, promoCashUSD } = req.body;
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (priceUSD !== undefined) {
      db.products[index].priceUSD = Number(priceUSD) || db.products[index].priceUSD;
    }
    if (promoCashUSD !== undefined) {
      db.products[index].promoCashUSD = promoCashUSD ? Number(promoCashUSD) : undefined;
    }
    writeDb(db);
    broadcast({ type: 'price_updated', store: db });
    res.json({ success: true, product: db.products[index] });
  });

  // REST API: Update Product Stock Units
  app.patch('/api/products/:id/stock', (req, res) => {
    const { id } = req.params;
    const { units } = req.body;
    const db = readDb();
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const parsedUnits = Math.max(0, Number(units) || 0);
    db.products[index].stockUnits = parsedUnits;
    if (parsedUnits === 0) {
      db.products[index].inStock = false;
    }
    writeDb(db);
    broadcast({ type: 'stock_units_updated', store: db });
    res.json({ success: true, product: db.products[index] });
  });

  // REST API: Delete Product
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    if (db.products.length === initialLen) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    writeDb(db);
    broadcast({ type: 'product_deleted', store: db });
    res.json({ success: true, id });
  });

  // REST API: Update Settings (exchange rate, categories, banner, etc.)
  app.put('/api/settings', (req, res) => {
    const db = readDb();
    db.settings = {
      ...db.settings,
      ...req.body,
    };
    writeDb(db);
    broadcast({ type: 'settings_updated', store: db });
    res.json({ success: true, settings: db.settings });
  });

  // REST API: Add Delivery Zone
  app.post('/api/delivery-zones', (req, res) => {
    const db = readDb();
    const newZone = {
      id: req.body.id || `zone-${Date.now()}`,
      name: req.body.name,
      costUSD: Number(req.body.costUSD) || 0,
    };
    const currentZones = db.settings.deliveryZones || [];
    db.settings.deliveryZones = [...currentZones, newZone];
    writeDb(db);
    broadcast({ type: 'delivery_zone_added', store: db });
    res.status(201).json({ success: true, zone: newZone });
  });

  // REST API: Update Delivery Zone
  app.put('/api/delivery-zones/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const currentZones = db.settings.deliveryZones || [];
    const index = currentZones.findIndex((z: any) => z.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }
    currentZones[index] = {
      ...currentZones[index],
      name: req.body.name !== undefined ? req.body.name : currentZones[index].name,
      costUSD: req.body.costUSD !== undefined ? Number(req.body.costUSD) : currentZones[index].costUSD,
    };
    db.settings.deliveryZones = currentZones;
    writeDb(db);
    broadcast({ type: 'delivery_zone_updated', store: db });
    res.json({ success: true, zone: currentZones[index] });
  });

  // REST API: Delete Delivery Zone
  app.delete('/api/delivery-zones/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const currentZones = db.settings.deliveryZones || [];
    db.settings.deliveryZones = currentZones.filter((z: any) => z.id !== id);
    writeDb(db);
    broadcast({ type: 'delivery_zone_deleted', store: db });
    res.json({ success: true, id });
  });

  // REST API: Add Finance Record
  app.post('/api/finances', (req, res) => {
    const db = readDb();
    const newRecord = {
      ...req.body,
      id: req.body.id || `fin-${Date.now()}`,
      date: req.body.date || new Date().toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    db.financialRecords = [newRecord, ...db.financialRecords];
    writeDb(db);
    broadcast({ type: 'finance_added', store: db });
    res.status(201).json({ success: true, record: newRecord });
  });

  // REST API: Delete Finance Record
  app.delete('/api/finances/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.financialRecords = db.financialRecords.filter((f) => f.id !== id);
    writeDb(db);
    broadcast({ type: 'finance_deleted', store: db });
    res.json({ success: true, id });
  });

  // REST API: Register Customer Order
  app.post('/api/orders', (req, res) => {
    const db = readDb();
    const newOrder = {
      ...req.body,
      id: req.body.id || `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'recibido',
    };
    db.orders = [newOrder, ...db.orders];
    writeDb(db);
    broadcast({ type: 'order_created', store: db });
    res.status(201).json({ success: true, order: newOrder });
  });

  // REST API: Reset to Defaults
  app.post('/api/reset-defaults', (_req, res) => {
    const defaultData = getInitialDatabase();
    writeDb(defaultData);
    broadcast({ type: 'reset_to_defaults', store: defaultData });
    res.json({ success: true, store: defaultData });
  });

  // Mount Vite or serve static files
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MOXIE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
