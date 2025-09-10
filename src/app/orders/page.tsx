import Layout from '@/components/layout/Layout';

export default function Orders() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h1>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Orders Coming Soon</h2>
          <p className="text-gray-600">
            This feature will be implemented in the next phase.
          </p>
        </div>
      </div>
    </Layout>
  );
}
