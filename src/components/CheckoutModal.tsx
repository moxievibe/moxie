import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  MapPin,
  Truck,
  Package,
  Check,
  AlertCircle,
  Building2,
  Phone,
  User,
  CreditCard,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DeliveryType, OrderDelivery, OrderCustomer, AgencyShippingData } from '../types';
import { MoxieLogo } from './MoxieLogo';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotalUSD,
    formatUSD,
    formatBs,
    deliveryZones,
    placeOrder,
    generateWhatsAppOrderUrl,
    exchangeRateBs,
  } = useStore();

  // Customer contact info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bolivares_bcv' | 'divisas_cash'>('bolivares_bcv');

  // Delivery method: exactly 3 choices
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');

  // Delivery zone state (for Valencia)
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    deliveryZones[0]?.id || ''
  );
  const [deliveryStreetAddress, setDeliveryStreetAddress] = useState('');

  // Agency shipping data (for MRW / Tealca)
  const [agencyData, setAgencyData] = useState<AgencyShippingData>({
    firstName: '',
    lastName: '',
    idNumber: '',
    phone: '',
    agency: 'MRW',
    destinationAddress: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  // Selected delivery zone object
  const currentZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];

  // Delivery cost calculation
  const deliveryCostUSD = deliveryType === 'delivery' ? (currentZone?.costUSD || 0) : 0;
  const totalUSD = cartSubtotalUSD + deliveryCostUSD;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'Por favor ingresa tu nombre completo';
    }
    if (!customerPhone.trim()) {
      errs.customerPhone = 'Por favor ingresa tu teléfono o WhatsApp';
    }

    if (deliveryType === 'delivery') {
      if (!deliveryStreetAddress.trim()) {
        errs.deliveryAddress = 'Indica tu dirección exacta en Valencia (calle, edificio o punto de referencia)';
      }
    }

    if (deliveryType === 'agency') {
      if (!agencyData.firstName.trim()) errs.agencyFirstName = 'Nombre obligatorio';
      if (!agencyData.lastName.trim()) errs.agencyLastName = 'Apellido obligatorio';
      if (!agencyData.idNumber.trim()) errs.agencyId = 'Cédula obligatoria para la agencia';
      if (!agencyData.phone.trim()) errs.agencyPhone = 'Teléfono obligatorio';
      if (!agencyData.destinationAddress.trim()) {
        errs.agencyAddress = 'Indica la dirección o nombre de la oficina destino (ej: Oficina MRW Los Sauces, Valencia)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinishAndSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const customer: OrderCustomer = {
      name: customerName.trim(),
      phone: customerPhone.trim(),
    };

    let delivery: OrderDelivery;

    if (deliveryType === 'pickup') {
      delivery = {
        type: 'pickup',
        pickupLocation: 'Tocuyito, Valencia, Edo. Carabobo',
        deliveryCostUSD: 0,
      };
    } else if (deliveryType === 'delivery') {
      delivery = {
        type: 'delivery',
        deliveryZoneId: currentZone?.id,
        deliveryZoneName: currentZone?.name,
        deliveryCostUSD: currentZone?.costUSD || 0,
        deliveryAddress: deliveryStreetAddress.trim(),
      };
    } else {
      delivery = {
        type: 'agency',
        deliveryCostUSD: 0,
        agencyData: {
          ...agencyData,
          phone: agencyData.phone || customerPhone,
        },
      };
    }

    // 1. Save order to app state & order history
    placeOrder(customer, delivery, paymentMethod);

    // 2. Open structured WhatsApp chat
    const waUrl = generateWhatsAppOrderUrl(customer, delivery, paymentMethod);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        className="relative bg-neutral-950 text-white w-full max-w-2xl rounded-xl shadow-2xl border border-neutral-800 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with official MOXIE badge */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MoxieLogo variant="badge" className="w-10 h-10" />
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#4ade80] uppercase">
                CHECKOUT DIRECTO VÍA WHATSAPP
              </div>
              <h2 id="checkout-title" className="font-display font-extrabold uppercase text-xl sm:text-2xl text-white">
                Finalizar Pedido MOXIE
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Cerrar modal de pago"
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFinishAndSendWhatsApp} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Order Summary Strip */}
          <div className="p-3.5 bg-neutral-900 rounded-lg border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="font-bold text-white uppercase">
                {cart.length} {cart.length === 1 ? 'modelo' : 'modelos'} en tu bolsa
              </span>
              <p className="text-neutral-400 text-[11px] mt-0.5">
                Tasa del día: 1$ = {exchangeRateBs} Bs
              </p>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 text-[10px] block">TOTAL PRENDAS</span>
              <span className="text-base font-bold text-white tabular-nums">
                {formatUSD(cartSubtotalUSD)} <span className="text-[#4ade80]">({formatBs(cartSubtotalUSD)})</span>
              </span>
            </div>
          </div>

          {/* Section 1: Customer Contact Info */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#4ade80]" />
              <span>1. Tus Datos de Contacto</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Mendoza"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono bg-neutral-900 border rounded-md text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-[#005220] ${
                    errors.customerName ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.customerName && (
                  <span className="text-[10px] text-red-400 mt-1 block font-mono">
                    {errors.customerName}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="Ej. 0412-1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full px-3 py-2 text-xs font-mono bg-neutral-900 border rounded-md text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-[#005220] ${
                    errors.customerPhone ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.customerPhone && (
                  <span className="text-[10px] text-red-400 mt-1 block font-mono">
                    {errors.customerPhone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Method (Exact 3 Options) */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#4ade80]" />
              <span>2. Selecciona tu Método de Entrega</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Pick up */}
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  deliveryType === 'pickup'
                    ? 'border-[#4ade80] bg-[#003314]/50 ring-1 ring-[#005220]'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="w-4 h-4 text-[#4ade80]" />
                    {deliveryType === 'pickup' && <Check className="w-4 h-4 text-[#4ade80]" />}
                  </div>
                  <p className="text-xs font-bold uppercase font-display text-white">
                    Pick Up
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-1">
                    Solo en Tocuyito, Valencia.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-mono font-bold text-[#4ade80]">
                  GRATIS ($0)
                </span>
              </button>

              {/* Option 2: Delivery */}
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  deliveryType === 'delivery'
                    ? 'border-[#4ade80] bg-[#003314]/50 ring-1 ring-[#005220]'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Truck className="w-4 h-4 text-[#4ade80]" />
                    {deliveryType === 'delivery' && <Check className="w-4 h-4 text-[#4ade80]" />}
                  </div>
                  <p className="text-xs font-bold uppercase font-display text-white">
                    Delivery Valencia
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-1">
                    Costo según zona seleccionada.
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-mono font-bold text-white tabular-nums">
                  {currentZone ? formatUSD(currentZone.costUSD) : 'Desde $2.50'}
                </span>
              </button>

              {/* Option 3: Agency (MRW / Tealca) */}
              <button
                type="button"
                onClick={() => setDeliveryType('agency')}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  deliveryType === 'agency'
                    ? 'border-[#4ade80] bg-[#003314]/50 ring-1 ring-[#005220]'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="w-4 h-4 text-[#4ade80]" />
                    {deliveryType === 'agency' && <Check className="w-4 h-4 text-[#4ade80]" />}
                  </div>
                  <p className="text-xs font-bold uppercase font-display text-white">
                    Envíos por Agencia
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-1">
                    MRW o Tealca a nivel nacional.
                  </p>
                </div>
                <span className="mt-3 text-[10px] font-mono font-semibold text-neutral-300">
                  Cobro en Destino
                </span>
              </button>
            </div>

            {/* Sub-form 1: Pick up details */}
            {deliveryType === 'pickup' && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold uppercase">
                      Punto de Retiro: Tocuyito, Valencia, Venezuela
                    </strong>
                    <p className="text-neutral-400 mt-1 text-[11px] leading-relaxed">
                      Al enviar tu pedido por WhatsApp, te compartiremos la ubicación exacta y coordinaremos el horario que más te convenga para retirar tu prenda sin costo adicional.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-form 2: Delivery in Valencia details */}
            {deliveryType === 'delivery' && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-3.5 text-xs font-mono">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1 font-bold">
                    Selecciona tu Zona en Valencia *
                  </label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-950 border border-neutral-700 rounded-md text-white focus:outline-hidden focus:border-[#005220]"
                  >
                    {deliveryZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} — Costo: {formatUSD(z.costUSD)} ({formatBs(z.costUSD)})
                      </option>
                    ))}
                  </select>
                </div>

                {currentZone && (
                  <div className="p-3 bg-neutral-950 rounded border border-[#005220] flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-300">Costo aproximado para {currentZone.name}:</span>
                    <span className="font-bold text-[#4ade80] tabular-nums">
                      ~{formatUSD(currentZone.costUSD)} (~{formatBs(currentZone.costUSD)})
                    </span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1">
                    Dirección exacta de entrega en Valencia *
                  </label>
                  <input
                    type="text"
                    placeholder="Urbanización, calle, número de casa/edificio, piso y punto de referencia"
                    value={deliveryStreetAddress}
                    onChange={(e) => setDeliveryStreetAddress(e.target.value)}
                    className={`w-full px-3 py-2 text-xs font-mono bg-neutral-950 border rounded-md text-white placeholder:text-neutral-600 focus:outline-hidden focus:border-[#005220] ${
                      errors.deliveryAddress ? 'border-red-500' : 'border-neutral-700'
                    }`}
                  />
                  {errors.deliveryAddress && (
                    <span className="text-[10px] text-red-400 mt-1 block font-mono">
                      {errors.deliveryAddress}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sub-form 3: Agency Shipping (MRW o Tealca) */}
            {deliveryType === 'agency' && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-4 text-xs font-mono">
                <div className="p-2.5 bg-[#003314]/40 border border-[#005220] rounded text-[11px] text-neutral-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#4ade80] shrink-0" />
                  <span>
                    El envío nacional se realiza con cobro en destino a la agencia Tealca o MRW que elijas.
                  </span>
                </div>

                {/* Agency Selection */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-300 mb-1 font-bold">
                    Agencia de tu preferencia *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAgencyData({ ...agencyData, agency: 'MRW' })}
                      className={`py-2 px-3 rounded-md border text-center font-bold text-xs uppercase cursor-pointer transition-all ${
                        agencyData.agency === 'MRW'
                          ? 'border-[#4ade80] bg-[#003314] text-white'
                          : 'border-neutral-700 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      MRW
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgencyData({ ...agencyData, agency: 'Tealca' })}
                      className={`py-2 px-3 rounded-md border text-center font-bold text-xs uppercase cursor-pointer transition-all ${
                        agencyData.agency === 'Tealca'
                          ? 'border-[#4ade80] bg-[#003314] text-white'
                          : 'border-neutral-700 bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      Tealca
                    </button>
                  </div>
                </div>

                {/* Receiver Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                      Nombre del Receptor *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Juan"
                      value={agencyData.firstName}
                      onChange={(e) => setAgencyData({ ...agencyData, firstName: e.target.value })}
                      className={`w-full px-3 py-1.5 text-xs bg-neutral-950 border rounded text-white ${
                        errors.agencyFirstName ? 'border-red-500' : 'border-neutral-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                      Apellido del Receptor *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Pérez"
                      value={agencyData.lastName}
                      onChange={(e) => setAgencyData({ ...agencyData, lastName: e.target.value })}
                      className={`w-full px-3 py-1.5 text-xs bg-neutral-950 border rounded text-white ${
                        errors.agencyLastName ? 'border-red-500' : 'border-neutral-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                      Cédula de Identidad *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. V-18.456.789"
                      value={agencyData.idNumber}
                      onChange={(e) => setAgencyData({ ...agencyData, idNumber: e.target.value })}
                      className={`w-full px-3 py-1.5 text-xs bg-neutral-950 border rounded text-white ${
                        errors.agencyId ? 'border-red-500' : 'border-neutral-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 0414-9876543"
                      value={agencyData.phone || customerPhone}
                      onChange={(e) => setAgencyData({ ...agencyData, phone: e.target.value })}
                      className={`w-full px-3 py-1.5 text-xs bg-neutral-950 border rounded text-white ${
                        errors.agencyPhone ? 'border-red-500' : 'border-neutral-700'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-neutral-400 mb-1 font-bold">
                    Dirección exacta de la agencia destino (Estado, Ciudad, Oficina) *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. Oficina Tealca San Cristóbal Centro, Av. Libertador #12-40, Edo. Táchira"
                    value={agencyData.destinationAddress}
                    onChange={(e) =>
                      setAgencyData({ ...agencyData, destinationAddress: e.target.value })
                    }
                    className={`w-full px-3 py-1.5 text-xs bg-neutral-950 border rounded text-white ${
                      errors.agencyAddress ? 'border-red-500' : 'border-neutral-700'
                    }`}
                  />
                  {errors.agencyAddress && (
                    <span className="text-[10px] text-red-400 mt-1 block">
                      {errors.agencyAddress}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Método de Pago (Obligatorio) */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase font-bold text-neutral-300">
              Método de Pago *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('bolivares_bcv')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  paymentMethod === 'bolivares_bcv'
                    ? 'bg-[#003314] border-[#4ade80] text-white shadow-sm'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase text-white">Bolívares (Tasa BCV)</span>
                  {paymentMethod === 'bolivares_bcv' && (
                    <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                  Pago Móvil o transferencia nacional a la tasa oficial del día ({exchangeRateBs} Bs/$).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('divisas_cash')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  paymentMethod === 'divisas_cash'
                    ? 'bg-[#003314] border-[#4ade80] text-white shadow-sm'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase text-white">Divisas (Efectivo/Promo)</span>
                  {paymentMethod === 'divisas_cash' && (
                    <span className="w-2 h-2 rounded-full bg-[#4ade80]" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                  Dólares en efectivo contra entrega o Zelle. Válido para promociones en divisas.
                </p>
              </button>
            </div>
          </div>

          {/* Section 4: Final Summary of Payment (USD & Bs) */}
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal Prendas:</span>
              <span className="font-bold text-white tabular-nums">{formatUSD(cartSubtotalUSD)} ({formatBs(cartSubtotalUSD)})</span>
            </div>

            <div className="flex justify-between text-neutral-400">
              <span>Costo de Entrega:</span>
              <span className="font-bold text-white tabular-nums">
                {deliveryType === 'pickup'
                  ? 'GRATIS ($0.00)'
                  : deliveryType === 'delivery'
                  ? `${formatUSD(deliveryCostUSD)} (${formatBs(deliveryCostUSD)})`
                  : 'Cobro en Destino'}
              </span>
            </div>

            <div className="flex justify-between text-neutral-500 text-[10px] pt-1">
              <span>Tasa del día (BCV):</span>
              <span>1 USD = {exchangeRateBs} Bs</span>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-between items-baseline">
              <span className="font-bold uppercase text-white">TOTAL A PAGAR:</span>
              <div className="text-right">
                <span className="text-xl font-extrabold text-white font-mono tabular-nums block">
                  {formatUSD(totalUSD)}
                </span>
                <span className="text-xs font-bold text-[#4ade80] font-mono tabular-nums">
                  ≈ {formatBs(totalUSD)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-md text-xs font-extrabold uppercase tracking-widest text-black bg-white hover:bg-neutral-200 active:scale-98 transition-all cursor-pointer shadow-lg"
            >
              <MessageCircle className="w-5 h-5 text-[#003314]" />
              <span>Finalizar y Enviar Pedido a WhatsApp</span>
            </button>

            <p className="text-[10px] font-mono text-neutral-500 text-center mt-2.5">
              Se abrirá WhatsApp con el mensaje estructurado para coordinar el pago (Zelle, Pago Móvil, Efectivo) y la entrega.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
