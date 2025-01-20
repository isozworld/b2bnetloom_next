'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface CartItem {
  id: number;
  userId: number;
  productName: string;
  productCode: string;
  catalog: string;
  variant: string;
  size: string;
  quantity: number;
  stockCode: string;
  imageUrl: string;
}

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const response = await fetch('/api/pages/userroles/shopping');
        const data = await response.json();
        setCartItems(data.cart);
      } catch (error) {
        console.error('Sepet ürünleri yüklenirken hata oluştu:', error);
      }
    }

    fetchCartItems();
  }, []);

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 0) return;

    try {
      if (quantity === 0) {
        await fetch(`/api/pages/userroles/shopping`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        await fetch(`/api/pages/userroles/shopping`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, quantity }),
        });
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Miktar güncellenirken hata oluştu:', error);
    }
  };

  const clearCart = async () => {
    try {
      await fetch('/api/pages/userroles/shopping', {
        method: 'DELETE',
      });
      setCartItems([]);
    } catch (error) {
      console.error('Sepet temizlenirken hata oluştu:', error);
    }
  };

  const handleCompleteOrder = () => {
    alert('Siparişiniz tamamlandı!');
    clearCart();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sepetiniz</h1>

      { cartItems && cartItems.length === 0 ? (
        <p className="text-gray-600">Sepetinizde ürün bulunmamaktadır.</p>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-4 text-left text-gray-700">Görsel</th>
                <th className="border border-gray-300 p-4 text-left text-gray-700">Ürün Adı</th>
                <th className="border border-gray-300 p-4 text-left text-gray-700">Tür</th>
                <th className="border border-gray-300 p-4 text-left text-gray-700">Ebat</th>
                <th className="border border-gray-300 p-4 text-center text-gray-700">Adet</th>
                <th className="border border-gray-300 p-4 text-center text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {cartItems && cartItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4">
                    <img
                      src={`http://websiparis.ipekcarpet.com/photos/renkler/${item.catalog}.jpg`}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                      onClick={() => setModalImage(`http://websiparis.ipekcarpet.com/photos/renkler/${item.catalog}.jpg`)}
                    />
                  </td>
                  <td className="border border-gray-300 p-4 text-gray-800">{item.productName}</td>
                  <td className="border border-gray-300 p-4 text-gray-800">{item.variant}</td>
                  <td className="border border-gray-300 p-4 text-gray-800">{item.size}</td>
                  <td className="border border-gray-300 p-4 text-center">
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l hover:bg-gray-400"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border border-gray-300 mx-1"
                      />
                      <button
                        className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r hover:bg-gray-400"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-4 text-center">
                    <button
                      className="text-red-500 hover:text-red-700 flex items-center justify-center"
                      onClick={() => updateQuantity(item.id, 0)}
                    >
                      <TrashIcon className="h-5 w-5 mr-1" /> Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between">
            <Button className="bg-red-500 text-white px-6 py-3 rounded-md flex items-center hover:bg-red-600" onClick={clearCart}>
              <ShoppingCartIcon className="h-5 w-5 mr-2" /> Sepeti Sil
            </Button>
            <Button className="bg-green-500 text-white px-6 py-3 rounded-md flex items-center hover:bg-green-600" onClick={handleCompleteOrder}>
              <CheckCircleIcon className="h-5 w-5 mr-2" /> Siparişi Tamamla
            </Button>
          </div>
        </div>
      )}

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <div className="relative">
            <img
              src={modalImage}
              alt="Ürün Görseli"
              className="max-w-full max-h-screen rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
