'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Lightbulb, PenTool, Search, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Video Ideas',
    href: '/video-ideas',
    icon: Lightbulb,
  },
  {
    name: 'Script Writer',
    href: '/script-writer',
    icon: PenTool,
  },
  {
    name: 'SEO Generator',
    href: '/seo-generator',
    icon: Search,
  },
  {
    name: 'Prompt Library',
    href: '/prompt-library',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-accent transition-colors"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 border-r border-border bg-card p-6 transition-transform md:translate-x-0 md:relative md:h-screen',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">YC</span>
            </div>
            <h1 className="text-lg font-semibold">Content Studio</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
