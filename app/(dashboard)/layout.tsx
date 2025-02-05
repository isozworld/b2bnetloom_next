'use client';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Home, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push('/');
  }
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function fetchCartItemCount() {
      try {
        const response = await fetch('/api/pages/userroles/shopping?methodname=getCart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
console.log("response",response);
        if (!response.ok) {
          throw new Error(`Error fetching cart count: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("data",data);
        setCartCount(data.count);
      } catch (err: any) {
        console.error(err);
   
      } finally {
 
      }
    }

    fetchCartItemCount();
  }, []);



 

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center">
      <div className="bg-black p-2 inline-flex items-center justify-center">
        <Image src="https://ipekcarpet.com.tr/app/Images/logolight_1661258553.svg" alt="Logo" height={150} width={150} className="text-orange-500" />
      </div>
      <span className="ml-2 text-xl font-semibold text-gray-900">B2B::NetLoom</span>
    </Link>
        <div className="flex items-center space-x-4">
        {user && (
            <div className="relative flex items-center">
              <Link href="/dashboard/orders/shoppingcarts">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
              </Link>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                 {cartCount} {/* Sepet adedi burada dinamik olarak güncellenebilir */}
              </span>
            </div>
          )}
          {user ? (
            
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-9">
                  <AvatarImage alt={user.name || ''} />
                  <AvatarFallback>
                    {user.email
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-1">
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/dashboard" className="flex w-full items-center">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <form action={handleSignOut} className="w-full">
                  <button type="submit" className="flex w-full">
                    <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
            >
              <Link href="/sign-up">Üye Ol</Link>
            </Button>
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
            >
              <Link href="/sign-in">Giriş Yap</Link>
            </Button>
          </div>
            
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
