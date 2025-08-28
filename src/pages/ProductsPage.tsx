import React from 'react';

const ProductsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <p className="text-gray-600">Manage insurance products and their configurations</p>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Products Management</h3>
            <p className="text-gray-500">This page will display product management features</p>
            <p className="text-sm text-gray-400 mt-2">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
