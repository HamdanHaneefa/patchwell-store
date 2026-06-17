'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Check, Ticket, MapPin, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ShiprocketCheckoutMockProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: string;
  currencyCode: string;
}

export default function ShiprocketCheckoutMock({
  isOpen,
  onClose,
  subtotal,
  currencyCode,
}: ShiprocketCheckoutMockProps) {
  const { clearCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1); // 1: Delivery Details, 2: Payment Details
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  // Form values
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculation values
  const subtotalVal = parseFloat(subtotal) || 0.0;
  const discountVal = couponApplied ? Math.round(subtotalVal * 0.15) : 0.0; // 15% discount for testing
  const shippingVal = shippingMethod === 'express' ? 45.0 : 0.0;
  const totalVal = Math.max(0, subtotalVal - discountVal + shippingVal);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'WELLNESS15') {
      setCouponApplied(true);
      alert('Promo code applied successfully! You saved 15%');
    } else {
      alert('Invalid coupon code. Try using "WELLNESS15" for 15% off.');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.replace(/[\s+-]/g, '').slice(-10))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!address.trim()) errors.address = 'Complete address is required';
    if (!pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      errors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!city.trim()) errors.city = 'City is required';
    if (!stateName.trim()) errors.stateName = 'State is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      window.location.href = '/success';
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .sr-checkout-container {
          background: #f8fafc;
          width: 100%;
          max-width: 480px;
          height: 100%;
          max-height: 92vh;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(226, 232, 240, 0.8);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (max-width: 500px) {
          .sr-checkout-container {
            max-height: 100vh;
            border-radius: 0;
          }
        }
        .sr-input-field {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          font-size: 0.9rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .sr-input-field:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .sr-input-group {
          margin-bottom: 12px;
        }
        .sr-input-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sr-shipping-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
        }
        .sr-shipping-card.active {
          border-color: #10b981;
          background-color: #f0fdf4;
        }
      `}</style>

      <div className="sr-checkout-container">
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Patchwell <span style={{ color: '#10b981', fontWeight: 500, fontSize: '0.9rem' }}>Checkout</span>
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          
          {/* Order Summary banner */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>Order summary</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {couponApplied && (
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {currencyCode} {subtotalVal.toFixed(2)}
                  </span>
                )}
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>
                  {currencyCode} {totalVal.toFixed(2)}
                </span>
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f0fdf4',
                color: '#166534',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={14} style={{ strokeWidth: 3 }} />
              {couponApplied ? (
                <span>Yay! You saved {currencyCode} {discountVal.toFixed(2)} on this order! 🎉</span>
              ) : (
                <span>Use coupon code <strong>WELLNESS15</strong> for 15% discount!</span>
              )}
            </div>
          </div>

          {/* Step 1: Delivery details */}
          {step === 1 ? (
            <form onSubmit={handleNextStep}>
              {/* Coupon Section */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>
                  Apply Discount Code
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Enter WELLNESS15"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={couponApplied}
                      className="sr-input-field"
                      style={{ paddingLeft: '34px', textTransform: 'uppercase' }}
                    />
                    <Ticket size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !coupon.trim()}
                    style={{
                      padding: '0 16px',
                      borderRadius: '10px',
                      backgroundColor: couponApplied ? '#10b981' : '#0f172a',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: couponApplied ? 'default' : 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <MapPin size={18} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Delivery details</span>
                </div>

                <div className="sr-input-group">
                  <label className="sr-input-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="sr-input-field"
                  />
                  {formErrors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="sr-input-group">
                    <label className="sr-input-label">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="sr-input-field"
                    />
                    {formErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.phone}</span>}
                  </div>
                  <div className="sr-input-group">
                    <label className="sr-input-label">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="sr-input-field"
                    />
                    {formErrors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.email}</span>}
                  </div>
                </div>

                <div className="sr-input-group">
                  <label className="sr-input-label">Address (Flat, Street, Area)</label>
                  <input
                    type="text"
                    placeholder="House No, Building, Street, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="sr-input-field"
                  />
                  {formErrors.address && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.address}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="sr-input-group">
                    <label className="sr-input-label">Pincode</label>
                    <input
                      type="text"
                      placeholder="6-digit PIN"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="sr-input-field"
                    />
                    {formErrors.pincode && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.pincode}</span>}
                  </div>
                  <div className="sr-input-group">
                    <label className="sr-input-label">City</label>
                    <input
                      type="text"
                      placeholder="City name"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="sr-input-field"
                    />
                    {formErrors.city && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.city}</span>}
                  </div>
                  <div className="sr-input-group">
                    <label className="sr-input-label">State</label>
                    <input
                      type="text"
                      placeholder="State name"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="sr-input-field"
                    />
                    {formErrors.stateName && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{formErrors.stateName}</span>}
                  </div>
                </div>
              </div>

              {/* Delivery options */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>
                  Select Delivery Speed
                </span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div
                    onClick={() => setShippingMethod('standard')}
                    className={`sr-shipping-card${shippingMethod === 'standard' ? ' active' : ''}`}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Standard</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Tuesday, Jun 23</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>FREE</span>
                  </div>

                  <div
                    onClick={() => setShippingMethod('express')}
                    className={`sr-shipping-card${shippingMethod === 'express' ? ' active' : ''}`}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Express</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Monday, Jun 22</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>+₹45.00</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  transition: 'transform 0.1s, opacity 0.2s',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Proceed to Pay • {currencyCode} {totalVal.toFixed(2)}
              </button>
            </form>
          ) : (
            /* Step 2: Payment details */
            <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <ShieldCheck size={18} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Secure UPI Payment</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
                  Scan this QR code using any UPI app (GPay, PhonePe, Paytm) to complete payment.
                </p>

                {/* QR Code Container */}
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    margin: '0 auto 16px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {/* Styled mock QR code image block */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=patchwell@ybl%26pn=Patchwell%26am=${totalVal.toFixed(2)}%26cu=INR`}
                    alt="Payment QR Code"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  Amount to Pay: <strong>{currencyCode} {totalVal.toFixed(2)}</strong>
                </div>

                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  This is a secure Shiprocket Checkout sandboxed transaction.
                </p>
              </div>

              {/* Complete Action */}
              <button
                onClick={handleCompletePayment}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: isProcessing ? 'default' : 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: isProcessing ? 0.8 : 1,
                }}
              >
                {isProcessing ? (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        borderTopColor: '#ffffff',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    Processing Order...
                  </>
                ) : (
                  'Complete & Authorize Order'
                )}
              </button>

              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>🔒 Secured by Shiprocket One-Click Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
