// Global type declarations for the Rails context system
import { User } from '@supabase/supabase-js';

export interface TableField {
  name: string;
  type: string;
  required: boolean;
  isPrimaryKey: boolean;
}

export interface TableEntity {
  name: string;
  fields: TableField[];
  api: {
    get: () => Promise<any>;
    getId: (id: string | number) => Promise<any>;
    put: (data: any) => Promise<any>;
    updateId: (id: string | number, data: any) => Promise<any>;
    deleteId: (id: string | number) => Promise<any>;
  };
  relationship: string[];
  desc: string;
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
