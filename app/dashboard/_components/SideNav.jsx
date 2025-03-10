'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { db } from '@/configs';
import { JsonForms } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import { HomeIcon, LibraryBig, LineChart, MessageSquare, Shield, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function SideNav() {
    const menuList = [
        { id: 1, name: 'Home', icon: HomeIcon, path: '/' },
        { id: 2, name: 'My Forms', icon: LibraryBig, path: '/dashboard' },
        { id: 3, name: 'Responses', icon: MessageSquare, path: '/dashboard/responses' },
        { id: 4, name: 'Analytics', icon: LineChart, path: '/dashboard/analytics' },
        { id: 5, name: 'Upgrade', icon: Shield, path: '/dashboard/upgrade' }
    ];

    const { user } = useUser();
    const path = usePathname();
    const [formList, setFormList] = useState([]);
    const [PercFileCreated, setPercFileCreated] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (user) GetFormList();
    }, [user]);

    const GetFormList = async () => {
        if (!user) return;
        const result = await db.select().from(JsonForms)
            .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(JsonForms.id));
        setFormList(result);
        setPercFileCreated((result.length / 3) * 100);
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden w-full fixed top-0 left-0 z-50 bg-gray-900 shadow-md p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">FormFlow AI</h1>
                <Button variant="outline" size="icon" onClick={() => setMobileOpen(true)}>
                    <Menu className="w-6 h-6" />
                </Button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="fixed top-0 left-0 h-screen w-64 shadow-md bg-white border-r hidden md:block z-40 text-white">
                <SidebarContent path={path} menuList={menuList} formList={formList} PercFileCreated={PercFileCreated} />
            </aside>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <aside className="w-64 bg-gray-900 shadow-md border-r">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-bold text-white">Menu</h2>
                            <Button size="icon" variant="outline" onClick={() => setMobileOpen(false)}>
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                        <SidebarContent path={path} menuList={menuList} formList={formList} PercFileCreated={PercFileCreated} onLinkClick={() => setMobileOpen(false)} />
                    </aside>
                    <div className="flex-1 bg-gray-900 opacity-50" onClick={() => setMobileOpen(false)} />
                </div>
            )}
        </>
    );
}

const SidebarContent = ({ path, menuList, formList, PercFileCreated, onLinkClick }) => (
    <div className="h-full flex flex-col justify-between bg-gray-900">
        <div className="p-5">
            {menuList.map((menu) => (
                <Link
                    href={menu.path}
                    key={menu.id}
                    className={`flex items-center gap-3 p-4 mb-3 hover:bg-gray-600 hover:text-white rounded-lg cursor-pointer text-white ${path === menu.path ? 'bg-black text-white' : ''}`}
                    onClick={onLinkClick}
                >
                    <menu.icon />
                    {menu.name}
                </Link>
            ))}
        </div>
        <div className="p-6 w-64">
            <Button className="w-full mb-4 bg-gray-600 hover:bg-white hover:text-gray-500" onClick={() => onLinkClick()}>+ Create Form</Button>
            <Progress value={PercFileCreated} />
            <p className="text-sm text-gray-600 mt-2">
                <strong>{formList.length}</strong> out of <strong>3</strong> forms created
            </p>
            <p className="text-sm text-gray-600 mt-3">Upgrade your plan for unlimited AI forms.</p>
        </div>
    </div>
);

export default SideNav;