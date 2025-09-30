'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Icon from '@/components/ui/Icon';
import { GatewayOrder } from '@/types';

export default function Orders() {
  const [orders, setOrders] = useState<GatewayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log('Sorted orders:', sortedOrders.map(o => ({ id: o.orderId, date: o.createdAt })));
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
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-emerald-200 text-emerald-900';
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
        return '#8b5cf6'; // violet-500
      case 'DELIVERED':
        return '#059669'; // emerald-600
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
        <div className="w-full max-w-none">
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
        <div className="w-full max-w-none">
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
      <div className="w-full max-w-none">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
          <Button onClick={fetchOrders} variant="outline">
            Refresh
          </Button>
        </div>
        
        <div className="space-y-6">
          {orders.map((order: GatewayOrder) => (
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
                    <Icon 
                      name={getStatusIcon(order.status) as any} 
                      size={14} 
                      color={getStatusIconColor(order.status)}
                      className="mr-1"
                    />
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
