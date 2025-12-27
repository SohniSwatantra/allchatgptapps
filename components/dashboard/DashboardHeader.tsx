'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X, Zap } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { MegaMenu } from './MegaMenu';
import { navItems } from '@/data/dashboard/sampleData';
import { cn } from '@/lib/utils';

export const DashboardHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<'products' | 'more' | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/80 backdrop-blur-md dark:border-secondary-800 dark:bg-secondary-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-secondary-900 dark:text-white">
            allchatGPTapps
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.hasMegaMenu && setActiveMegaMenu(item.menuType ?? null)}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              {item.hasMegaMenu ? (
                <button
                  className={cn(
                    'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    item.isActive
                      ? 'border border-secondary-200 bg-white text-secondary-900 shadow-sm dark:border-secondary-700 dark:bg-secondary-800 dark:text-white'
                      : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white'
                  )}
                >
                  {item.label}
                </Link>
              )}

              {/* Mega Menu */}
              {item.hasMegaMenu && activeMegaMenu === item.menuType && (
                <MegaMenu type={item.menuType} />
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitch />

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/login"
              className="rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 lg:hidden dark:text-secondary-400 dark:hover:bg-secondary-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-secondary-200 bg-white lg:hidden dark:border-secondary-800 dark:bg-secondary-900">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  item.isActive
                    ? 'bg-secondary-100 text-secondary-900 dark:bg-secondary-800 dark:text-white'
                    : 'text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-800'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t border-secondary-200 pt-4 dark:border-secondary-700">
              <Link
                href="/login"
                className="rounded-lg bg-primary-100 px-4 py-3 text-center text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary-500 px-4 py-3 text-center text-sm font-medium text-white"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
