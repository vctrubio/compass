'use client'
import React from 'react';
import AdminProvider from "@/rails/provider/admin-context-provider";
import AdminHeader from "@/components/admin/AdminHeader";
import { NavAdmin } from '@/components/navigations/NavAdmin';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProvider>
      <div className="flex h-screen w-full">
        <main className="w-full p-4">
          {/* <AdminHeader /> */}
          <NavAdmin />
          <div className="mt-8">
            <div className="mt-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AdminProvider>
  );
}