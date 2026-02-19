import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/mahasiswa - List mahasiswa bimbingan (untuk dosen)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'DOSEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const mahasiswa = await prisma.user.findMany({
      where: {
        dosenPaId: session.user.id,
        role: 'MAHASISWA',
      },
      select: {
        id: true,
        name: true,
        nim: true,
        email: true,
        bimbinganMahasiswa: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Transform data to include bimbingan count summary
    const result = mahasiswa.map((m: typeof mahasiswa[number]) => ({
      id: m.id,
      name: m.name,
      nim: m.nim,
      email: m.email,
      totalBimbingan: m.bimbinganMahasiswa.length,
      menunggu: m.bimbinganMahasiswa.filter(
        (b: { status: string }) => b.status === "MENUNGGU"
      ).length,
      disetujui: m.bimbinganMahasiswa.filter(
        (b: { status: string }) => b.status === "DISETUJUI"
      ).length,
      selesai: m.bimbinganMahasiswa.filter(
        (b: { status: string }) => b.status === "SELESAI"
      ).length,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching mahasiswa:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
