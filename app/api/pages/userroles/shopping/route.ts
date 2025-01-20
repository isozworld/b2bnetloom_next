import { NextResponse } from 'next/server';
import { addToCart, deleteFromCart, updateCartQuantity, getCart, getShoppingCartCount } from '@/lib/db/shopping';
import { getUser } from '@/lib/db/queries';
export async function GET(req: Request) {
  try {
    const {searchParams}= new URL(req.url);
    const methodname= searchParams.get("methodname");   

   

    const user = await getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    const userId = user.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID belirtilmedi.' }, { status: 400 });
    }


 
    if(methodname=="getCart"){
      const cart = await getCart(userId);
      return NextResponse.json({ count: cart.length });
    }


    const cart = await getCart(userId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Sepet bilgileri alınamadı.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    const userId = user.id;
    const body = await req.json();
    const {productCode, productName, catalog, variant, size, quantity, stockCode } = body;

    if (!userId || !productCode || !productName || !catalog || !variant || !size || !quantity || !stockCode) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }

    await addToCart({
      userId: userId,
      productCode,
      productName,
      catalog,
      variant,
      size,
      quantity: parseInt(quantity),
      stockCode,
    });

    const cart = await getCart(userId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ürün sepete eklenirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    const userId = user.id;
    const body = await req.json();
    const {  id } = body;

    if (!userId || !id) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }

    await deleteFromCart(id);

    const cart = await getCart(userId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ürün sepetten silinirken bir hata oluştu.' }, { status: 500 });
  }
}
export async function GET_COUNT(req: Request): Promise<Response> {
console.log("GET_COUNT request received");
  const user = await getUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const userId = user.id;
  const count = await getShoppingCartCount(userId);
  return NextResponse.json({ count });
}

export async function PATCH(req: Request) {
  try {
    console.log("PATCH request received");
    const user = await getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    const userId = user.id;

    const body = await req.json();
    const { id, productCode, quantity } = body;

    if (!id || quantity == null) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }
console.log("id",id);
    await updateCartQuantity(parseInt(id),  parseInt(quantity));

    const cart = await getCart(userId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ürün miktarı güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

