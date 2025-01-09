'use client'
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function SiparisPage() {
  const [stokKodu, setStokKodu] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; data?: any; error?: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setResponse(null);

    try {
      const queryParams = new URLSearchParams({
        Offset: '0',
        Limit: '10',
        StokKodu: stokKodu,
      }).toString();

      const res = await fetch(`/api/netsis?endpoint=api/v2/Items&${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('API call failed');
      }

      const data = await res.json();
      setResponse({ success: true, data: data });
    } catch (error: any) {
      setResponse({ success: false, error: error.message });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Stok Bilgisi Sorgulama
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Stok Bilgisi Getir</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="stokKodu">Stok Kodu</Label>
              <Input
                id="stokKodu"
                name="stokKodu"
                placeholder="Stok kodunu girin"
                value={stokKodu}
                onChange={(e) => setStokKodu(e.target.value)}
                required
              />
            </div>
            {response && response.success && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                <h2 className="font-bold">Stok Bilgisi:</h2>
                <pre>{JSON.stringify(response.data, null, 2)}</pre>
              </div>
            )}
            {response && !response.success && (
              <p className="text-red-500 text-sm">{response.error}</p>
            )}
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                'Stok Getir'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
