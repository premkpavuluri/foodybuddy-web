'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Order } from '@/types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/gateway/orders');
      const data = await response.json();
      
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
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
        return 'bg-green-100 text-green-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳';
      case 'CONFIRMED':
        return '✅';
      case 'PREPARING':
        return '👨‍🍳';
      case 'READY':
        return '🍽️';
      case 'OUT_FOR_DELIVERY':
        return '🚚';
      case 'DELIVERED':
        return '📦';
      case 'CANCELLED':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h1>
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h1>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchOrders}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h1>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet. Start by browsing our menu!
            </p>
            <Button onClick={() => window.location.href = '/menu'}>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
          <Button onClick={fetchOrders} variant="outline">
            Refresh
          </Button>
        </div>
        
        <div className="space-y-6">
          {orders.map((order: any) => (
            <Card key={order.orderId}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    <span className="mr-1">{getStatusIcon(order.status)}</span>
                    {order.status}
                  </span>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-2">Order Details:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="font-mono">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment ID:</span>
                    <span className="font-mono">{order.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{order.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
