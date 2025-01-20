'use client';

import { useEffect, useState } from 'react';
import { getEbatTurleri } from '@/app/api/netsis/getEbatTurleri';
import { useSearchParams } from 'next/navigation';

interface StokItem {
  DesenAdi: string;
  Desen: string;
  DesenKod: string;
  DesenImage: string;
}

export default function OrderDetailsPage() {
  const searchParams = useSearchParams();
  const [stokItem, setStokItem] = useState<StokItem | null>(null);
  const [turOptions, setTurOptions] = useState<string[]>(['STANDART']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchEbatTurleri = async (desenAdi: string) => {
    try {
      const ebatTurleri = await getEbatTurleri([desenAdi]);
      setTurOptions(['STANDART', ...ebatTurleri.filter((tur) => tur !== 'STANDART')]);
    } catch (err) {
      console.error(`Ebat türleri alınamadı: ${desenAdi}`, err);
    }
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const desenKod = searchParams.get('desen');
    const desenImage = searchParams.get('image');
    const desenAdi = searchParams.get('desenAdi');

    if (desenKod && desenImage && desenAdi) {
      setStokItem({
        DesenAdi: desenAdi,
        DesenKod: desenKod,
        Desen: desenImage,
        DesenImage: `http://websiparis.ipekcarpet.com/photos/renkler/${desenImage}.jpg`,
      });
      fetchEbatTurleri(desenAdi);
      setLoading(false);
    } else {
      setError('Gerekli parametreler eksik');
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Image Section */}
      <div className="relative group">
        <img
          src={stokItem?.DesenImage || 'https://via.placeholder.com/300x300.png?text=No+Image'}
          alt={stokItem?.DesenAdi}
          className="rounded-lg w-full h-96 object-cover cursor-pointer"
          onClick={handleImageClick}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative bg-white rounded-lg p-6">
            <button
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-1"
              onClick={closeModal}
            >
              ×
            </button>
            <img
              src={stokItem?.DesenImage || 'https://via.placeholder.com/300x300.png?text=No+Image'}
              alt={stokItem?.DesenAdi}
              className="rounded-lg max-w-full max-h-screen"
            />
          </div>
        </div>
      )}

      {/* Details Section */}
      <div>
        <h1 className="text-2xl font-bold mb-4">{stokItem?.DesenAdi}</h1>
        <p className="text-gray-500 text-sm mb-6">Kod: {stokItem?.DesenKod}</p>

        {/* Tür Combo */}
        <div>
          <label htmlFor="tur" className="block text-sm font-medium text-gray-700">
            Tür
          </label>
          <select
            id="tur"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            defaultValue="STANDART"
          >
            {turOptions.map((tur) => (
              <option key={tur} value={tur}>
                {tur}
              </option>
            ))}
          </select>
        </div>

        {/* Ebat Combo */}
        <div className="mt-4">
          <label htmlFor="ebat" className="block text-sm font-medium text-gray-700">
            Ebat
          </label>
          <select
            id="ebat"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option>100x100</option>
            <option>10x50</option>
            <option>25x60</option>
          </select>
        </div>

        {/* Adet Input */}
        <div className="mt-4">
          <label htmlFor="adet" className="block text-sm font-medium text-gray-700">
            Adet
          </label>
          <div className="flex items-center mt-1">
            <button
              className="bg-gray-200 rounded-l px-2 py-1 text-sm font-medium hover:bg-gray-300"
              onClick={() => {
                const input = document.getElementById('adet') as HTMLInputElement;
                if (input && parseInt(input.value) > 0) input.value = (parseInt(input.value) - 1).toString();
              }}
            >
              -
            </button>
            <input
              id="adet"
              type="number"
              min="0"
              defaultValue="1"
              className="border border-gray-300 w-16 text-center"
            />
            <button
              className="bg-gray-200 rounded-r px-2 py-1 text-sm font-medium hover:bg-gray-300"
              onClick={() => {
                const input = document.getElementById('adet') as HTMLInputElement;
                if (input) input.value = (parseInt(input.value) + 1).toString();
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Sepete Ekle Butonu */}
        <button
          className="mt-6 w-full bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow hover:bg-blue-600"
          onClick={() => alert(`${stokItem?.DesenAdi} sepete eklendi!`)}
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
