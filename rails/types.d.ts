// Global type declarations for the Rails context system
import { User } from '@supabase/supabase-js';

export interface TableField {
  name: string;
  type: string;
  required: boolean;
  isPrimaryKey: boolean;
}

export interface FilterOption {
  field: string;
  label: string;
  options?: Array<{value: string | number, label: string}>;
}

export interface SortOption {
  field: string;
  label: string;
  direction?: 'asc' | 'desc';
}

export interface TableEntity {
  name: string;
  fields: TableField[];
  data: any[];
  api: {
    get: () => Promise<any>;
    getId: (id: string | number) => Promise<any>;
    put: (data: any) => Promise<any>;
    updateId: (id: string | number, data: any) => Promise<any>;
    deleteId: (id: string | number) => Promise<any>;
  };
  relationship: string[];
  desc: string;
  filterBy?: FilterOption[];
  sortBy?: SortOption[];
}

declare global {
  interface Window {
    test1: string;
    isadmin: boolean;
    user: User | null;
    isLoading: boolean;
    tableData: Record<string, any[]>;
    tss: string[];
  }
}

export {};
