'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { createOrder, loading } = useOrder();
  const [paymentDetails, setPaymentDetails] = useState({
    method: 'CREDIT_CARD',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = getCartTotal();

  const handleInputChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!paymentDetails.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Please enter cardholder name';
    }

    if (!paymentDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    }

    if (!paymentDetails.cvv || paymentDetails.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const order = await createOrder(cartItems, total, paymentDetails);
      
      if (order) {
        // Clear cart on successful order
        clearCart();
        // Redirect to orders page
        router.push('/orders');
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const handleCardNumberChange = (value: string) => {
    // Format card number with spaces
    const formatted = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    handleInputChange('cardNumber', formatted);
  };

  const handleExpiryChange = (value: string) => {
    // Format expiry date
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
    handleInputChange('expiryDate', formatted);
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment</h1>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart before proceeding to payment
            </p>
            <Button onClick={() => router.push('/menu')}>
              Browse Menu
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentDetails.method}
                    onChange={(e) => handleInputChange('method', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="PAYPAL">PayPal</option>
                  </select>
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    maxLength={19}
                    error={errors.cardNumber}
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={paymentDetails.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                    error={errors.cardHolderName}
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      maxLength={5}
                      error={errors.expiryDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      maxLength={4}
                      error={errors.cvv}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p>• Your payment information is secure and encrypted</p>
                <p>• You will receive an order confirmation via email</p>
                <p>• Order tracking will be available after payment</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
