'use client';

import { useEffect, useState } from 'react';
import { getStokByCategories } from '@/app/api/netsis/getStokByCategories';
import { getEbatByDesenKodu } from '@/app/api/netsis/getEbatByDesenKodu';
import { getEbatTurleriByDesenKodu } from '@/app/api/netsis/getEbatTurleriByDesenKodu';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface StokItem {
  DesenAdi: string;
  Desen: string;
  DesenKod: string;
}

interface TurOptions {
  DesenKod: string;
  EBATTURU: string;
}

interface EbatOption {
  DesenKod: string;
  Ebat: string;
  StokKodu: string;
  Bakiye: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [stokItems, setStokItems] = useState<StokItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const [turOptions, setTurOptions] = useState<Record<string, TurOptions[]>>({});
  const [ebatOptions, setEbatOptions] = useState<Record<string, EbatOption[]>>({});

  const [categories, setCategories] = useState<string[]>([]);
  const [sizetypes, setSizetypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    setCategories([]);
    setSizes([]);
    setSizetypes([]);

    const categories = searchParams.get('categories');
    const sizetypes = searchParams.get('sizetypes');
    const sizes = searchParams.get('sizes');
    if (sizes) {
      console.log("sizes güncellendi:",sizes);
      setSizes(sizes.split(','));
    }  
    if (sizetypes) {
      setSizetypes(sizetypes.split(','));
    }
    if (categories) {
      setCategories(categories.split(','));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchStokItems() {
      try {
        setLoading(true);
        setStokItems([]);
        const data = await getStokByCategories(categories, sizetypes, sizes);
        setStokItems(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Ürünler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    }

    fetchStokItems();
  }, [categories, sizetypes, sizes, searchParams]);

  const fetchEbatTurleri = async (desenKodu: string) => {
    if (!turOptions[`${desenKodu}`]) {
      try {
        const turData = await getEbatTurleriByDesenKodu(desenKodu);
        setTurOptions((prev) => ({
          ...prev,
          [`${desenKodu}`]: turData.map((e) => ({
            DesenKod: e.DesenKodu,
            EBATTURU: e.EBATTURU,
          })),
        }));
      } catch (error) {
        console.error(`Ebat türleri alınamadı: ${desenKodu}`, error);
      }
    }
  };

  const fetchEbatByDesenKodu = async (desenAdi: string, desenKodu: string, ebatTuru: string) => {
    if (ebatTuru && !ebatOptions[`${desenKodu}-${ebatTuru}`]) {
      try {
        const ebatData = await getEbatByDesenKodu(desenAdi, desenKodu, ebatTuru);
        setEbatOptions((prev) => ({
          ...prev,
          [`${desenKodu}`]: ebatData.map((e) => ({
            DesenKod: desenKodu,
            StokKodu: e.StokKodu,
            Ebat: e.Ebat,
            Bakiye: e.Bakiye,
          })),
        }));
      } catch (error) {
        console.error(`Ebat bilgileri alınamadı: ${desenAdi}`, error);
      }
    }
  };

  const handleAddToCart = async (item: StokItem) => {
    const turSelect = document.getElementById(`tur-${item.DesenKod}`) as HTMLSelectElement;
    const ebatSelect = document.getElementById(`ebat-${item.DesenKod}`) as HTMLSelectElement;
    const adetInput = document.getElementById(`adet-${item.DesenKod}`) as HTMLInputElement;

    if (!turSelect || !turSelect.value || !ebatSelect || !ebatSelect.value || !adetInput || !adetInput.value) {
      alert('Lütfen tüm seçimleri yapınız.');
      return;
    }

    const payload = {

      productCode: item.DesenKod,
      productName: item.DesenAdi,
      catalog: item.Desen,
      variant: turSelect.value,
      size: ebatSelect.value,
      quantity: parseInt(adetInput.value),
      stockCode: ebatOptions[item.DesenKod]?.find((e) => e.Ebat === ebatSelect.value)?.StokKodu || '',
    };

    try {
      const response = await fetch('/api/pages/userroles/shopping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Sepete ekleme başarısız.');
      }

      alert(`${item.DesenAdi} sepete eklendi!`);
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      alert('Bir hata oluştu, lütfen tekrar deneyiniz.');
    }
  };

  if (loading) {
    return <p>Ürünler yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-6">Sipariş Ver</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stokItems.map((item) => (
          <div
            key={item.DesenKod}
            className="relative border border-silver rounded-lg p-4 shadow hover:shadow-md transition-shadow group"
          >
            {/* Ürün Görseli */}
            <img
              src={`http://websiparis.ipekcarpet.com/photos/renkler/${item.Desen}.jpg`}
              alt={item.DesenAdi}
              className="rounded-lg w-full h-40 object-cover mb-4 cursor-pointer"
              onClick={() =>
                router.push(
                  `/dashboard/orders/details?desen=${item.DesenKod}&image=${item.Desen}&desenAdi=${encodeURIComponent(item.DesenAdi)}`
                )
              }
            />

            {/* Ürün Bilgisi */}
            <h2 className="text-md font-medium mb-1">{item.DesenAdi}</h2>
            <p className="text-gray-500 text-sm mb-4">{item.DesenKod}</p>

            {/* Tür Combo */}
            <div>
              <label htmlFor={`tur-${item.DesenKod}`} className="block text-sm font-medium text-gray-700">
                Tür
              </label>
              <select
                id={`tur-${item.DesenKod}`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onFocus={() => fetchEbatTurleri(item.DesenKod)}
                onChange={(e) =>
                  fetchEbatByDesenKodu(item.DesenAdi, item.DesenKod, e.target.value)
                }
                defaultValue=""
              >
                <option value="" disabled>
                  Seçiniz
                </option>
                {(turOptions[item.DesenKod] || []).map((tur: TurOptions) => (
                  <option key={tur.EBATTURU} value={tur.EBATTURU}>
                    {tur.EBATTURU}
                  </option>
                ))}
              </select>
            </div>

            {/* Ebat Combo */}
            <div className="mt-4">
              <label htmlFor={`ebat-${item.DesenKod}`} className="block text-sm font-medium text-gray-700">
                Ebat
              </label>
              <select
                id={`ebat-${item.DesenKod}`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Seçiniz
                </option>
                {(ebatOptions[item.DesenKod] || []).map((ebat: EbatOption) => (
                  <option key={ebat.Ebat} value={ebat.Ebat}>
                    {ebat.Ebat} ({ebat.Bakiye})
                  </option>
                ))}
              </select>
            </div>

            {/* Adet Input */}
            <div className="mt-4">
              <label htmlFor={`adet-${item.DesenKod}`} className="block text-sm font-medium text-gray-700">
                Adet
              </label>
              <div className="flex items-center mt-1">
                <button
                  className="bg-gray-200 rounded-l px-2 py-1 text-sm font-medium hover:bg-gray-300"
                  onClick={() => {
                    const input = document.getElementById(`adet-${item.DesenKod}`) as HTMLInputElement;
                    if (input && parseInt(input.value) > 0) input.value = (parseInt(input.value) - 1).toString();
                  }}
                >
                  -
                </button>
                <input
                  id={`adet-${item.DesenKod}`}
                  type="number"
                  min="0"
                  defaultValue="1"
                  className="border border-gray-300 w-16 text-center"
                />
                <button
                  className="bg-gray-200 rounded-r px-2 py-1 text-sm font-medium hover:bg-gray-300"
                  onClick={() => {
                    const input = document.getElementById(`adet-${item.DesenKod}`) as HTMLInputElement;
                    if (input) input.value = (parseInt(input.value) + 1).toString();
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Sepete Ekle Butonu */}
            <button
              className="absolute bottom-4 right-4 bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md shadow hidden group-hover:block lg:group-hover:block lg:hidden"
              onClick={() => handleAddToCart(item)}
            >
              Sepete Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
