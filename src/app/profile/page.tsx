import Layout from '@/components/layout/Layout';

export default function Profile() {
  return (
    <Layout>
      <div className="w-full max-w-none">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Coming Soon</h2>
          <p className="text-gray-600">
            This feature will be implemented in the next phase.
          </p>
        </div>
      </div>
    </Layout>
  );
}
