import { NextResponse } from 'next/server';
import { getCariRoles, getUsers, addCariRole, deleteCariRole } from '@/lib/db/queries';

export async function GET() {
  try {
    const roles = await getCariRoles();
    const users = await getUsers();
    return NextResponse.json({ roles, users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Veriler yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, netsisCariKod, userRole } = body;

    if (!userId || !netsisCariKod || !userRole) {
      return NextResponse.json({ error: 'Eksik alanlar var.' }, { status: 400 });
    }

    // Kullanıcının aynı rolde olup olmadığını kontrol et
    const existingRoles = await getCariRoles();
    const isDuplicate = existingRoles.some(
      (role) =>
        role.userId === parseInt(userId)
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: 'Bu kullanıcıya bu rol zaten atanmış.' },
        { status: 400 }
      );
    }

    await addCariRole({ userId: parseInt(userId), netsisCariKod, userRole });
    const roles = await getCariRoles();
    return NextResponse.json({ roles });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Rol eklenirken bir hata oluştu.' }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID belirtilmedi.' }, { status: 400 });
    }

    await deleteCariRole(id);
    const roles = await getCariRoles();
    return NextResponse.json({ roles });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Rol silinirken bir hata oluştu.' }, { status: 500 });
  }
}
