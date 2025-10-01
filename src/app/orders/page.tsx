'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Icon from '@/components/ui/Icon';
import { GatewayOrder, OrderItem } from '@/types';

export default function Orders() {
  const [orders, setOrders] = useState<GatewayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [expandedPayment, setExpandedPayment] = useState<Set<string>>(new Set());
  const [expandedAddress, setExpandedAddress] = useState<Set<string>>(new Set());
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Sort orders by creation date (most recent first)
        const sortedOrders = data.data.sort((a: GatewayOrder, b: GatewayOrder) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          console.log(`Order ${a.orderId}: ${a.createdAt} (${dateA})`);
          console.log(`Order ${b.orderId}: ${b.createdAt} (${dateB})`);
          return dateB - dateA; // Most recent first
        });
        console.log('Sorted orders:', sortedOrders.map((o: GatewayOrder) => ({ id: o.orderId, date: o.createdAt })));
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };


  const calculateItemTotal = (item: OrderItem) => {
    return item.quantity * item.price;
  };

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const togglePaymentDetails = (orderId: string) => {
    const newExpanded = new Set(expandedPayment);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedPayment(newExpanded);
  };

  const toggleDeliveryAddress = (orderId: string) => {
    const newExpanded = new Set(expandedAddress);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedAddress(newExpanded);
  };

  const copyOrderId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedOrderId(null), 2000);
    } catch (err) {
      console.error('Failed to copy order ID:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800';
      case 'READY':
        return 'bg-emerald-100 text-emerald-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'pending';
      case 'CONFIRMED':
        return 'confirmed';
      case 'PREPARING':
        return 'preparing';
      case 'READY':
        return 'ready';
      case 'OUT_FOR_DELIVERY':
        return 'out-for-delivery';
      case 'DELIVERED':
        return 'delivered';
      case 'CANCELLED':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b'; // yellow-500
      case 'CONFIRMED':
        return '#3b82f6'; // blue-500
      case 'PREPARING':
        return '#f97316'; // orange-500
      case 'READY':
        return '#10b981'; // emerald-500
      case 'OUT_FOR_DELIVERY':
        return '#3b82f6'; // blue-500
      case 'DELIVERED':
        return '#10b981'; // emerald-500
      case 'CANCELLED':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-full max-w-none">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
              <p className="text-gray-500 text-sm mt-1">Track your current and past orders</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="receipt" size={24} color="#ea580c" />
            </div>
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-3 text-sm">Loading your orders...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="w-full max-w-none">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
              <p className="text-gray-500 text-sm mt-1">Track your current and past orders</p>
            </div>
          </div>
          <Card className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="alert-circle" size={24} color="#ef4444" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <Button onClick={fetchOrders} variant="primary" size="sm">
              <Icon name="refresh-cw" size={14} className="mr-1" />
              Try Again
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="w-full max-w-none">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
              <p className="text-gray-500 text-sm mt-1">Track your current and past orders</p>
            </div>
          </div>
          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="shopping-bag" size={24} color="#ea580c" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6 text-sm">
              You haven&apos;t placed any orders yet. Start by browsing our delicious menu!
            </p>
            <Button 
              onClick={() => window.location.href = '/menu'}
              variant="primary"
              size="sm"
            >
              <Icon name="menu" size={14} className="mr-1" />
              Browse Menu
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-none">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
            <p className="text-gray-500 text-sm mt-1">Track your current and past orders</p>
          </div>
          <Button 
            onClick={fetchOrders} 
            variant="outline"
            size="sm"
          >
            <Icon name="refresh-cw" size={14} className="mr-1" />
            Reload
          </Button>
        </div>
        
        <div className="space-y-4">
          {orders.map((order: GatewayOrder) => (
            <Card key={order.orderId} className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
              {/* Order Header - Clickable */}
              <button
                onClick={() => toggleOrder(order.orderId)}
                className="w-full flex justify-between items-center p-4 hover:bg-gray-50/50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 border border-orange-200 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-all duration-200">
                    <Icon name="shopping-bag" size={20} color="#ea580c" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center mb-1">
                      <p className="text-sm text-gray-500 font-medium mr-2">Order ID:</p>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {order.orderId}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyOrderId(order.orderId);
                        }}
                        className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors duration-200 group/copy"
                        title="Copy Order ID"
                      >
                        <div className="relative w-4 h-4 flex items-center justify-center">
                          <Icon 
                            name="copy" 
                            size={14} 
                            className={`absolute transition-all duration-300 ${
                              copiedOrderId === order.orderId 
                                ? 'opacity-0 scale-75' 
                                : 'opacity-100 scale-100 text-gray-400 group-hover/copy:text-gray-600'
                            }`}
                          />
                          <Icon 
                            name="check" 
                            size={14} 
                            color={copiedOrderId === order.orderId ? '#16a34a' : '#9ca3af'}
                            className={`absolute transition-all duration-300 ${
                              copiedOrderId === order.orderId 
                                ? 'opacity-100 scale-100' 
                                : 'opacity-0 scale-75'
                            }`}
                          />
                        </div>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} mb-2 group-hover:scale-105 transition-transform`}>
                    <Icon 
                      name={getStatusIcon(order.status) as any} 
                      size={12} 
                      color={getStatusIconColor(order.status)}
                      className="mr-1"
                    />
                    {order.status}
                  </div>
                  <p className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-pink-600 transition-all">
                    ${order.totalAmount?.toFixed(2) || calculateOrderTotal(order.items || []).toFixed(2)}
                  </p>
                  <Icon 
                    name={expandedOrders.has(order.orderId) ? 'chevron-up' : 'chevron-down'} 
                    size={16} 
                    className="text-gray-400 group-hover:text-gray-600 transition-colors mt-1"
                  />
                </div>
              </button>
              
              {/* Order Items Section - Collapsible */}
              {expandedOrders.has(order.orderId) && (
                <div className="border-t border-gray-200">
                  {order.items && order.items.length > 0 ? (
                    <div className="px-4 py-3 bg-gray-50/30">
                      <div className="mb-3">
                        <div className="flex items-center mb-3">
                          <Icon name="shopping-bag" size={16} className="text-gray-600 mr-2" />
                          <h4 className="text-sm font-semibold text-gray-900">Items ordered:</h4>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item: OrderItem) => (
                          <div key={item.id} className="flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-gray-900 mb-1">{item.itemName}</h5>
                              <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-center bg-gray-50/30">
                      <p className="text-xs text-gray-500">Order items not available</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Payment Details and Delivery Address Section - Collapsible */}
              {expandedOrders.has(order.orderId) && (
                <div className="border-t border-gray-200">
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Payment Details - Collapsible */}
                      <div className="bg-orange-50 rounded-lg p-3 hover:bg-orange-100 transition-colors duration-200">
                        <button
                          onClick={() => togglePaymentDetails(order.orderId)}
                          className="w-full flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <Icon name="credit-card" size={16} className="text-orange-600 mr-2" />
                            <span className="text-sm font-bold text-gray-900">Payment Details</span>
                          </div>
                          <div className="flex items-center bg-white/50 rounded-full p-1">
                            <Icon 
                              name={expandedPayment.has(order.orderId) ? 'eye-off' : 'eye'} 
                              size={14} 
                              className="text-gray-600 group-hover:text-gray-800 transition-colors"
                            />
                          </div>
                        </button>
                        
                        {expandedPayment.has(order.orderId) && (
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between items-center py-1 border-b border-orange-200">
                              <span className="text-xs font-semibold text-gray-700">Payment ID</span>
                              <span className="font-mono text-xs text-gray-900">{order.paymentId}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-orange-200">
                              <span className="text-xs font-semibold text-gray-700">Transaction ID</span>
                              <span className="font-mono text-xs text-gray-900">{order.transactionId}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-xs font-semibold text-gray-700">Amount</span>
                              <span className="text-xs font-bold text-gray-900">
                                ${order.totalAmount?.toFixed(2) || calculateOrderTotal(order.items || []).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Delivery Address Card - Collapsible */}
                      <div className="bg-blue-50 rounded-lg p-3 hover:bg-blue-100 transition-colors duration-200">
                        <button
                          onClick={() => toggleDeliveryAddress(order.orderId)}
                          className="w-full flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <Icon name="map-pin" size={16} className="text-blue-600 mr-2" />
                            <span className="text-sm font-bold text-gray-900">Delivery Address</span>
                          </div>
                          <div className="flex items-center bg-white/50 rounded-full p-1">
                            <Icon 
                              name={expandedAddress.has(order.orderId) ? 'eye-off' : 'eye'} 
                              size={14} 
                              className="text-gray-600 group-hover:text-gray-800 transition-colors"
                            />
                          </div>
                        </button>
                        
                        {expandedAddress.has(order.orderId) && (
                          <div className="mt-3">
                            <p className="text-sm font-semibold text-gray-900">123 MG Road, Koramangala</p>
                            <p className="text-xs text-gray-600 mt-1">Bangalore, Karnataka 560034</p>
                            <p className="text-xs text-gray-600">India</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
