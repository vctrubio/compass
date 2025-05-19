'use client'
import React from 'react';
import AdminProvider from "@/rails/provider/admin-context-provider";
import AdminHeader from "@/components/admin/AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProvider>
      <div className="flex h-screen w-full">
        <main className="w-full p-4">
          <AdminHeader />
          <div className="mt-8">
            {children}
          </div>
        </main>
      </div>
    </AdminProvider>
  );
}