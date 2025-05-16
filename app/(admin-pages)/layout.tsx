import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// New AdminHeader component
const AdminHeader = () => {
  const totalGetNumber = 42;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-8">
          <input
            type="text"
            id="filter-input"
            placeholder="Model Name"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="col-span-4">
          <div className="border p-2 rounded text-center">Status ({totalGetNumber})</div>
        </div>
        <div className="col-span-3">
          <div className="border p-2 rounded">Filter</div>
        </div>
        <div className="col-span-3">
          <div className="border p-2 rounded">Sort</div>
        </div>
        <div className="col-span-2">
          <div className="border p-2 rounded">Action</div>
        </div>
        <div className="col-span-4" id="target">
          <button className="border p-2 w-full rounded">
            Add Now 
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full border">
      <main className="w-full">
        <AdminHeader />
        {children}
      </main>
    </div>
  );
}