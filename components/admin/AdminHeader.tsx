'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { DbTable } from '@/utils/context/db-context';

interface AdminHeaderProps {
  title: string;
  table?: DbTable;
  onAddNew: () => void;
}

export function AdminHeader({ title, table, onAddNew }: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-2">
        {table && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => table.refresh()}
            disabled={table?.loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${table?.loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        )}
        <Button 
          variant="default" 
          size="sm" 
          onClick={onAddNew}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </div>
    </div>
  );
}