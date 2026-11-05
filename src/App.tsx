/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AdminModal } from './components/AdminModal';
import { ToastContainer } from './components/ToastContainer';

const StoreContent: React.FC = () => {
  const { settings, setIsAdminModalOpen } = useStore();

  // Support /admin in hash or search
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
      setIsAdminModalOpen(true);
    }
  }, [setIsAdminModalOpen]);

  const whatsappDirectUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola equipo MOXIE! Quiero hacer una consulta sobre la colección.')}`;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white font-sans selection:bg-[#003314] selection:text-[#4ade80]">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar />

      {/* Main Streetwear Content Area */}
      <main className="flex-1">
        <Hero />
        <CatalogSection />
      </main>

      {/* Footer with social channels and admin entrance */}
      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <AdminModal />

      {/* Feedback Toast alerts */}
      <ToastContainer />

      {/* Floating WhatsApp Quick Contact Button (Streetwear Green) */}
      <a
        href={whatsappDirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar a MOXIE por WhatsApp"
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-4 py-3 bg-[#003314] hover:bg-[#005220] text-white rounded-full shadow-2xl border border-[#005220] transition-all cursor-pointer text-xs font-mono font-bold tracking-wider uppercase hover:scale-105 active:scale-95 group"
      >
        <MessageCircle className="w-5 h-5 text-[#4ade80] group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">WhatsApp MOXIE</span>
      </a>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
