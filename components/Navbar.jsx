"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton, UserButton, useUser  } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Sun, Menu, Home, LayoutDashboard, User, X, History } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from './Themecontext';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useUser ();
  const path = usePathname();
  const router = useRouter();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const items = [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'My Account', href: '/my-account', icon: User },
      { name: 'Your History', href: '/dashboard/responses', icon: History },
    ];

    if (searchLower === '') {
      setSuggestions([]);
    } else {
      setSuggestions(
        items.filter(item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.href.toLowerCase().includes(searchLower)
        )
      );
    }
  }, [search]);

  if (path.includes('aiform')) return null;

  return (
    <div className='p-3 px-5 border-b shadow-sm bg-gray-900 text-white'>
      <div className='flex items-center justify-between gap-4'>
        <Image src={'/logo.png'} width={50} height={50} alt='logo' />

        <div className='relative flex-1 max-w-md'>
          <Input
            type="text"
            placeholder="Search for pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-400"
          />
          {search && (
            <Button
              className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white"
              onClick={() => {
                setSearch('');
                setSuggestions([]);
              }}
            >
              <X className="h-5 w-5 text-gray-300" />
            </Button>
          )}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 border rounded-md shadow-md z-50">
              {suggestions.map((item) => (
                <div
                  key={item.href}
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => {
                    router.push(item.href);
                    setSearch('');
                    setSuggestions([]);
                  }}
                >
                  <item.icon size={18} className="text-white" />
                  <span className="text-white">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button  onClick={toggleTheme} variant="outline" size="icon" className="bg-gray-800 text-white">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 text-white">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='hidden md:flex items-center gap-5'>
          <Link href="/" className="flex items-center gap-1 text-gray-300 hover:text-white transition">
            <Home size={18} /> Homepage
          </Link>
          <Link href="/history" className="flex items-center gap-1 text-gray-300 hover:text-white transition">
            <History size={18} /> Your History
          </Link>
          {isSignedIn ? (
            <>
              <Link href={'/dashboard'}>
                <Button variant="outline" className="bg-gray-800 text-white">Dashboard</Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <SignInButton>
              <Button className="bg-gray-800 text-white">Get Started</Button>
            </SignInButton>
          )}
        </div>

        {/* Mobile Menu - Revamped */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTitle></SheetTitle>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-gray-800 text-white">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-5 bg-gray-900 text-white">
              <h2 className="text-2xl font-bold text-gray-600 mb-5">Formflow-AI</h2>
              <nav className="flex flex-col gap-3">
                <Link href="/" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
                  <Home size={22} className="text-white" /> <span className="text-lg font-medium">Homepage</span>
                </Link>
                <Link href="/history" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
                  <History size={22} className="text-white" /> <span className="text-lg font-medium">Your History</span>
                </Link>
                {isSignedIn ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
                      <LayoutDashboard size={22} className="text-white" /> <span className="text-lg font-medium">Dashboard</span>
                    </Link>
                    <div className="mt-3">
                      <UserButton />
                    </div>
                  </>
                ) : (
                  <SignInButton>
                    <Button className="mt-3 bg-gray-800 text-white">Get Started</Button>
                  </SignInButton>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;