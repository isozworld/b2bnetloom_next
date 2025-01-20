import { and, eq, sql } from 'drizzle-orm';
import { db } from './drizzle';
import { shoppingCart } from './schema';

// Sepete ürün ekle
export async function addToCart({
  userId,
  productCode,
  productName,
  catalog,
  variant,
  size,
  quantity,
  stockCode,
}: {
  userId: number;
  productCode: string;
  productName: string;
  catalog: string;
  variant: string;
  size: string;
  quantity: number;
  stockCode: string;
}) {
  await db.insert(shoppingCart).values({
    userId,
    productCode,
    productName,
    catalog,
    variant,
    size,
    quantity,
    stockCode,
    createdAt: new Date(),
  });
}

// Sepetten ürün sil
export async function deleteFromCart(id: number) {
  await db.delete(shoppingCart).where(and(eq(shoppingCart.id, id)));
}

// Sepetteki ürün miktarını güncelle
export async function updateCartQuantity(id: number,  quantity: number) {
    console.log("updateCartQuantity",id,quantity);
  await db.update(shoppingCart).set({ quantity }).where(and(eq(shoppingCart.id, id)));
}

// Kullanıcının sepetini getir
export async function getCart(userId: number) {
  return await db.select().from(shoppingCart).where(eq(shoppingCart.userId, userId));
}
export async function getShoppingCartCount(userId: number): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(shoppingCart)
      .where(eq(shoppingCart.userId, userId));

    return Number(result[0]?.count) || 0;
  } catch (error) {
    console.error('Error fetching shopping cart count:', error);
    throw new Error('Shopping cart count could not be retrieved');
  }
}