'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Ana Sayfa' },
    { href: '/dashboard/general', label: 'Genel' },
    { href: '/dashboard/activity', label: 'Kullanıcı İşlemleri' },
    { href: '/dashboard/security', label: 'Güvenlik' },
    { href: '/dashboard/siparis', label: 'Sipariş' },
  ];

  // Kategoriler yalnızca Sipariş sayfasında görünecek
  const categories = [
    { id: 1, label: 'Kategori 1' },
    { id: 2, label: 'Kategori 2' },
    { id: 3, label: 'Kategori 3' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <span className="font-medium">Ayarlar</span>
        </div>
        <Button
          className="-mr-3"
          variant="ghost"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={`shadow-none my-1 w-full justify-start ${
                    pathname === item.href ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Sadece Sipariş sayfası için kategorileri göster */}
            {pathname === '/dashboard/siparis' && (
              <div className="mt-6">
                <h2 className="text-lg font-medium mb-4">Kategoriler</h2>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center mb-2">
                    <input type="checkbox" id={`category-${category.id}`} className="mr-2" />
                    <label htmlFor={`category-${category.id}`}>{category.label}</label>
                  </div>
                ))}
              </div>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
