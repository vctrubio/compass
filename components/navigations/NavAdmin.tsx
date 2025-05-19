'use client';

import * as React from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function NavAdmin() {
    const pathname = usePathname();

    const routes = [
        { name: 'Bookings', href: '/bookings' },
        { name: 'Equipment', href: '/equipment' },
        { name: 'Lessons', href: '/lessons' },
        { name: 'Packages', href: '/packages' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'Students', href: '/students' },
        { name: 'Teachers', href: '/teachers' }
    ];

    return (
        <NavigationMenuPrimitive.Root className="relative flex w-full justify-center">
            <NavigationMenuPrimitive.List className="flex flex-row items-center space-x-2 p-2">
                {routes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                        <NavigationMenuPrimitive.Item key={route.href}>
                            <NavigationMenuPrimitive.Link asChild>
                                <Link
                                    href={route.href}
                                    className={`block px-4 py-2 text-sm font-medium hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 rounded-md transition-all ${
                                        isActive ? "border-b-2 border-primary text-primary" : ""
                                    }`}
                                >
                                    {route.name}
                                </Link>
                            </NavigationMenuPrimitive.Link>
                        </NavigationMenuPrimitive.Item>
                    );
                })}
            </NavigationMenuPrimitive.List>
        </NavigationMenuPrimitive.Root>
    );
}
