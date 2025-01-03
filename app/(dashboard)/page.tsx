import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, SwatchBook,Drill } from 'lucide-react';
import { Terminal } from './terminal';

export default function HomePage() {
  return (
<main>
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
            Türkiye'nin Halı Sanatındaki
            <span className="block text-orange-500">Öncü Gücü</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
            Modern teknolojiler ve yılların deneyimiyle halı üretiminde fark yaratan çözümler sunuyoruz. 
            Estetik ve kaliteyi bir araya getirerek yaşam alanlarınıza değer katıyoruz.
          </p>
          <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
            <a
              href="/sign-up"
              
            >
              <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                Hemen Üye Olun
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>            
            </a>
            <a
              href="/sign-in"
              
            >
              <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
                Zaten Üye misiniz?
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>            
            </a>            
          </div>
        </div>
        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
        <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
  <img
    src="https://ipekcarpet.com.tr/app/Images/minyatur-1703157147_1704371979.jpg"
    alt="Halı görseli"
    className="rounded-lg shadow-lg"
    style={{ maxWidth: "100%", borderRadius: "12px" }}
  />
</div>
        </div>
      </div>
    </div>
  </section>

  <section className="py-16 bg-white w-full">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div>
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
            <SwatchBook className="h-6 w-6" />
          </div>
          <div className="mt-5">
            <h2 className="text-lg font-medium text-gray-900">
              Yaratıcı Tasarımlar
            </h2>
            <p className="mt-2 text-base text-gray-500">
              Hayalinizdeki halıyı tasarlamanız için size modern araçlar ve sınırsız seçenekler sunuyoruz.
            </p>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
            <Drill className="h-6 w-6" />
          </div>
          <div className="mt-5">
            <h2 className="text-lg font-medium text-gray-900">
              Güçlü Altyapı
            </h2>
            <p className="mt-2 text-base text-gray-500">
              Üretimden teslimata kadar her adımda kusursuz bir süreç yönetimi sağlıyoruz.
            </p>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="mt-5">
            <h2 className="text-lg font-medium text-gray-900">
              Hızlı ve Güvenli Ödeme
            </h2>
            <p className="mt-2 text-base text-gray-500">
              Güvenli ödeme sistemlerimizle alışverişlerinizde huzuru yakalayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Yeni Nesil Halı Tasarımı
          </h2>
          <p className="mt-3 max-w-3xl text-lg text-gray-500">
            Geleneksel dokumacılık sanatını modern teknolojilerle birleştirerek, eşsiz tasarımlar sunuyoruz. 
            Ev ve işyerleriniz için en iyi seçenekleri keşfedin.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
          <a
            href="/sign-up"
             
          >
            <Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
              Daha Fazlasını Keşfedin
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  </section>
  <footer className="py-8 bg-gray-800 text-center">
  <p className="text-white text-sm">
    Designed and Coded by <span className="font-semibold text-orange-500">Sumo</span>
  </p>
</footer>
</main>

  );
}
