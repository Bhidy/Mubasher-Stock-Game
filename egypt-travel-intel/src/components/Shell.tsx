'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {!isLoginPage && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                !isLoginPage ? (collapsed ? "pl-20" : "pl-72") : "pl-0"
            )}>
                {children}
            </div>
        </>
    );
}
