'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getCategories } from '@/app/api/netsis/getCategories';
import { getEbatTurleri } from '@/app/api/netsis/getEbatTurleri';
import { getEbatByCategoriesTur } from '@/app/api/netsis/getEbatByCategoriesTur';
import { useRouter } from 'next/navigation';

interface MainCategoriesProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onFilterClick: () => void;
}

interface Ebat {
  Ebat: string;
  StokKodu: string;
  Bakiye: string;
}

export default function MainCategories({
  selectedCategories,
  onCategoryChange,
}: MainCategoriesProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [ebatTurleri, setEbatTurleri] = useState<string[]>(['STANDART']);
  const [selectedEbatTurleri, setSelectedEbatTurleri] = useState<string[]>(['STANDART']);
  const [ebatlar, setEbatlar] = useState<Ebat[]>([]);
  const [selectedEbatlar, setSelectedEbatlar] = useState<Ebat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || 'Kategoriler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function onCategoryChange() {
      setSelectedEbatTurleri([]);
      setSelectedEbatlar([]);
    }
    onCategoryChange();
  }, [selectedCategories]);


  // Fetch ebat türleri when categories change
  useEffect(() => {
    async function fetchEbatTurleri() {
      if (selectedCategories.length > 0) {
        try {
          const ebatData = await getEbatTurleri(selectedCategories);
          const uniqueEbatTurleri = ['STANDART', ...ebatData.filter((ebat) => ebat !== 'STANDART')];
          setEbatTurleri(uniqueEbatTurleri);
        } catch (error: any) {
          console.error('Ebat türleri yüklenirken hata:', error.message || error);
        }
      } else {
        setEbatTurleri(['STANDART']);
      }
    }

    fetchEbatTurleri();
  }, [selectedCategories]);

  useEffect(() => {
    async function fetchEbatlar() {
      const ebatlar = await getEbatByCategoriesTur(selectedCategories, selectedEbatTurleri);
      setEbatlar(ebatlar);
    }
    fetchEbatlar();
  }, [selectedCategories, selectedEbatTurleri]);
  const handleEbatTurChange = (ebatTuru: string) => {
    setSelectedEbatlar([]);
    setSelectedEbatTurleri((prev) =>
      prev.includes(ebatTuru) ? prev.filter((item) => item !== ebatTuru) : [...prev, ebatTuru]
    );
  };

  const handleEbatChange = (ebat: Ebat) => {
    setSelectedEbatlar((prev) =>
      prev.includes(ebat) ? prev.filter((item) => item !== ebat) : [...prev, ebat]
    );
  };

  const handleFilterClick = () => {
    const queryParams = new URLSearchParams();

    if (selectedCategories.length > 0) {
      queryParams.append('categories', selectedCategories.join(','));
    }

    if (selectedEbatTurleri.length > 0) {
      queryParams.append('sizetypes', selectedEbatTurleri.join(','));
    }
    if (selectedEbatlar.length > 0) {
      queryParams.append('sizes', selectedEbatlar.map((ebat) => ebat.Ebat).join(','));
    } else {
      queryParams.append('sizes', '');
    }

    router.push(`/dashboard/orders?${queryParams.toString()}`);
  };

  if (loading) {
    return <p>Kategoriler yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6">
      {/* Categories */}
      <h2 className="text-lg font-medium mb-4">Kategoriler</h2>
      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`category-${category}`}
              className="mr-2"
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
            />
            <label htmlFor={`category-${category}`}>{category}</label>
          </div>
        ))}
      </div>

      {/* Ebat Türleri */}
      <h2 className="text-lg font-medium mt-6 mb-4">Ebat Türleri</h2>
      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
        {ebatTurleri.map((ebat) => (
          <div key={ebat} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`ebat-${ebat}`}
              className="mr-2"
              checked={selectedEbatTurleri.includes(ebat)}
              onChange={() => handleEbatTurChange(ebat)}
            />
            <label htmlFor={`ebat-${ebat}`}>{ebat}</label>
          </div>
        ))}
      </div>
      {/* Ebatlar */}
      <h2 className="text-lg font-medium mt-6 mb-4">Ebatlar</h2>
      <div className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
        {ebatlar.map((ebat) => (
          <div key={ebat.Ebat} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`ebat-${ebat.Ebat}`}
              className="mr-2"
              checked={selectedEbatlar.includes(ebat)}
              onChange={() => handleEbatChange(ebat)}
            />
            <label htmlFor={`ebat-${ebat.Ebat}`}>{ebat.Ebat}</label>
          </div>
        ))}
      </div>
      <Button
        className="mt-4 bg-blue-500 text-white"
        onClick={handleFilterClick}
        disabled={selectedCategories.length === 0}
      >
        Filtrele
      </Button>
    </div>
  );
}
