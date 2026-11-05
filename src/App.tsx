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

// Declare window types for direct console admin access
declare global {
  interface Window {
    moxieAdmin?: () => void;
    admin?: () => void;
  }
}

const StoreContent: React.FC = () => {
  const { settings, setIsAdminModalOpen } = useStore();

  // Hidden and Secret Access Mechanisms for Admin Panel
  useEffect(() => {
    // 1. Direct console function access
    window.moxieAdmin = () => {
      setIsAdminModalOpen(true);
      return 'Abriendo panel de administración MOXIE...';
    };
    window.admin = window.moxieAdmin;

    // 2. URL Hash check (#admin or /admin)
    const checkHash = () => {
      if (window.location.hash.toLowerCase() === '#admin' || window.location.pathname === '/admin') {
        setIsAdminModalOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    // 3. Secret keyboard shortcuts:
    // - Ctrl + Shift + A (Windows/Linux)
    // - Cmd + Shift + A (Mac)
    // - Alt + A
    // - Typing the word "moxie" or "admin" on the keyboard
    let typedBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut combo: Ctrl+Shift+A or Cmd+Shift+A or Alt+A
      if (
        (e.shiftKey && (e.ctrlKey || e.metaKey) && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        setIsAdminModalOpen(true);
        return;
      }

      // Typing secret sequence: if user is not in an input/textarea
      const activeElement = document.activeElement;
      const isInput = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
      if (!isInput && e.key.length === 1) {
        typedBuffer = (typedBuffer + e.key.toLowerCase()).slice(-8);
        if (typedBuffer.endsWith('moxie') || typedBuffer.endsWith('admin')) {
          setIsAdminModalOpen(true);
          typedBuffer = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
      delete window.moxieAdmin;
      delete window.admin;
    };
  }, [setIsAdminModalOpen]);

  const whatsappDirectUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hola equipo MOXIE! Quiero hacer una consulta sobre la colección.')}`;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-white font-sans selection:bg-[#003314] selection:text-[#4ade80]">
      {/* Top Navbar without public admin button */}
      <Navbar />

      {/* Main Streetwear Content Area */}
      <main className="flex-1">
        <Hero />
        <CatalogSection />
      </main>

      {/* Footer without public admin button */}
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
