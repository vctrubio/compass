'use client'
import React from 'react';
import { useAdminContext } from "@/rails/provider/admin-context-provider";
import { ControllerContent } from '@/rails/controller/ControllerContent';
import { dbTableDictionary } from '@/rails/typesDictionary';
import { Package4AdminForm } from "@/rails/view/form/package4AdminForm";
import { Package } from "@/rails/model/package";

export default function PackagesPage() {
  const { tables } = useAdminContext();
  const packagesTable = tables.packages;
  
  if (!packagesTable) {
    return <div>No table found</div>;
  }
  
  return (
    <ControllerContent 
      title="Packages"
      tableName="packages"
      tableData={packagesTable}
      searchFields={['description']}
      addForm={Package4AdminForm}
    />
  );
}