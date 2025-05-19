'use client';

import { usePathname } from 'next/navigation';

export function DashboardBanner() {
  const pathname = usePathname();
  
  // Extract the page name from the pathname
  const pageName = pathname.split('/').pop() || '';
  
  // Capitalize the first letter and add spaces between camelCase if needed
  const formattedPageName = pageName.charAt(0).toUpperCase() + 
    pageName.slice(1).replace(/([A-Z])/g, ' $1');

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-sm mb-6">
      <h1 className="text-3xl font-bold mb-2">{formattedPageName} Dashboard</h1>
    </div>
  );
}
