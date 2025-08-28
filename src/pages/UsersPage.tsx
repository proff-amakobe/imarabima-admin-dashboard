import React from 'react';

const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600">Manage system users and their roles</p>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Users Management</h3>
            <p className="text-gray-500">This page will display user management features</p>
            <p className="text-sm text-gray-400 mt-2">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
