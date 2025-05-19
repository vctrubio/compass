'use client'
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Search, Filter, SortDesc, Plus, ChevronDown } from "lucide-react";
import AdminProvider, { useAdminContext } from "@/rails/provider/admin-context-provider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Generic filter and sort option interfaces
interface FilterOption {
  label: string;
  action: () => void;
}

interface FilterStruct {
  label: string;
  options: FilterOption[];
}

// Sample filter and sort structures
const filterOptions: FilterStruct = {
  label: "Filter By",
  options: [
    { label: "Status", action: () => console.log("Filter by status") },
    { label: "Category", action: () => console.log("Filter by category") },
    { label: "Date", action: () => console.log("Filter by date") }
  ]
};

const sortOptions: FilterStruct = {
  label: "Sort By",
  options: [
    { label: "Newest", action: () => console.log("Sort by newest") },
    { label: "Oldest", action: () => console.log("Sort by oldest") },
    { label: "Name (A-Z)", action: () => console.log("Sort by name") }
  ]
};

// Generic dropdown component for filters and sorting
const FilterDropdown = ({ struct, icon }: { struct: FilterStruct, icon: React.ReactNode }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-10 border-muted/30 px-4 gap-2">
          {icon}
          <span>{struct.label.split(" ")[0]}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{struct.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {struct.options.map((option, index) => (
          <DropdownMenuItem key={index} onClick={option.action}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Enhanced AdminHeader component with a double-line approach
const AdminHeader = () => {
  const totalGetNumber = 42;
  const { isAdmin, currentUser, signOut } = useAdminContext();

  return (
    <div className="max-w-5xl mx-auto pt-6">
      <div className="flex flex-col space-y-6">
        {/* First row - Search and Status */}
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search admin dashboard..."
                className="pl-12 py-6 text-base rounded-lg shadow-sm border-muted/30 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="border border-muted/30 bg-secondary/10 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center whitespace-nowrap shadow-sm">
              {totalGetNumber} items
            </div>
            <div className="border border-green-200 bg-green-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center whitespace-nowrap shadow-sm text-green-700">
              Admin: {isAdmin ? "Yes" : "No"} | User: {currentUser}
            </div>
            <Button 
              variant="outline" 
              className="border-red-200 hover:bg-red-50 text-red-700"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Second row - Filters, Sort, Add */}
        <div className="flex flex-wrap gap-3">
          <FilterDropdown 
            struct={filterOptions} 
            icon={<Filter className="h-4 w-4" />} 
          />
          
          <FilterDropdown 
            struct={sortOptions} 
            icon={<SortDesc className="h-4 w-4" />} 
          />
          
          <div className="ml-auto">
            <Button className="h-10 px-4 gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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