'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import MainCategories from '../components/mainCategories';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const navItems = [
    { href: '/dashboard', label: 'Ana Sayfa' },
    { href: '/dashboard/general', label: 'Genel' },
    { href: '/dashboard/activity', label: 'Kullanıcı İşlemleri' },
    { href: '/dashboard/security', label: 'Güvenlik' },
    { href: '/dashboard/orders', label: 'Sipariş' },
    { href: '/dashboard/userrole', label: 'Kullanıcı Rol' },
    { href: '/dashboard/orders/shoppingcarts', label: 'Sepetim' },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleFilterClick = () => {
    const queryParams = new URLSearchParams({
      categories: selectedCategories.join(','),
    }).toString();

    router.push(`/dashboard/orders?${queryParams}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
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
        <aside
          className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${
            isSidebarOpen ? 'block' : 'hidden'
          } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            {pathname === '/dashboard/orders' ? (
              <>
                {navItems
                  .filter(
                    (item) =>
                      item.href === '/dashboard' || item.href === '/dashboard/orders'
                  )
                  .map((item) => (
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

                <div className="mt-4">
                  <button
                    className="flex items-center w-full justify-between text-left px-2 py-2 font-medium bg-gray-100 rounded-md"
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  >
                    Diğer Menüler
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isAccordionOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isAccordionOpen && (
                    <div className="mt-2 ml-4">
                      {navItems
                        .filter(
                          (item) =>
                            item.href !== '/dashboard' &&
                            item.href !== '/dashboard/orders'
                        )
                        .map((item) => (
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
                    </div>
                  )}
                </div>

                <MainCategories
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  onFilterClick={handleFilterClick}
                />
              </>
            ) : (
              navItems.map((item) => (
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
              ))
            )}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
