import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MOCK_BIMBINGAN, MOCK_USERS } from '@/lib/mock-data';

// GET /api/bimbingan - List bimbingan
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role } = session.user;

    let bimbingan;

    if (role === 'DOSEN') {
      bimbingan = MOCK_BIMBINGAN.filter((b) => b.dosenId === id).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      bimbingan = MOCK_BIMBINGAN.filter((b) => b.mahasiswaId === id).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return NextResponse.json(bimbingan);
  } catch (error) {
    console.error('Error fetching bimbingan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST /api/bimbingan - Buat bimbingan baru (mahasiswa)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'MAHASISWA') {
      return NextResponse.json(
        { error: 'Hanya mahasiswa yang bisa membuat bimbingan' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { judul, deskripsi, tanggal } = body;

    if (!judul || !deskripsi) {
      return NextResponse.json(
        { error: 'Judul dan deskripsi wajib diisi' },
        { status: 400 },
      );
    }

    const dosen = MOCK_USERS.dosen;

    const newBimbingan = {
      id: `bimb-${Date.now()}`,
      judul,
      deskripsi,
      status: 'MENUNGGU',
      catatan: null,
      tanggal: tanggal ? new Date(tanggal).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      mahasiswaId: session.user.id,
      dosenId: dosen.id,
      mahasiswa: {
        id: session.user.id,
        name: session.user.name ?? '',
        nim: session.user.nim ?? '',
        email: session.user.email ?? '',
        image: session.user.image ?? '',
      },
      dosen: {
        id: dosen.id,
        name: dosen.name,
        nip: dosen.nip,
        email: dosen.email,
        image: dosen.image,
      },
    };

    // Add to mock data (in-memory only, resets on restart)
    MOCK_BIMBINGAN.push(newBimbingan);

    return NextResponse.json(newBimbingan, { status: 201 });
  } catch (error) {
    console.error('Error creating bimbingan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
