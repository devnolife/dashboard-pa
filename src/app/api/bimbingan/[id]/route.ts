import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MOCK_BIMBINGAN } from '@/lib/mock-data';

// PATCH /api/bimbingan/[id] - Update status bimbingan (dosen) atau edit bimbingan (mahasiswa)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const index = MOCK_BIMBINGAN.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Bimbingan tidak ditemukan' },
        { status: 404 },
      );
    }

    const existing = MOCK_BIMBINGAN[index];

    if (session.user.role === 'DOSEN') {
      if (existing.dosenId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      MOCK_BIMBINGAN[index] = {
        ...existing,
        status: body.status ?? existing.status,
        catatan: body.catatan ?? existing.catatan,
      };

      return NextResponse.json(MOCK_BIMBINGAN[index]);
    } else {
      if (existing.mahasiswaId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (existing.status !== 'MENUNGGU') {
        return NextResponse.json(
          { error: 'Bimbingan yang sudah diproses tidak bisa diedit' },
          { status: 400 },
        );
      }

      MOCK_BIMBINGAN[index] = {
        ...existing,
        judul: body.judul ?? existing.judul,
        deskripsi: body.deskripsi ?? existing.deskripsi,
        tanggal: body.tanggal
          ? new Date(body.tanggal).toISOString()
          : existing.tanggal,
      };

      return NextResponse.json(MOCK_BIMBINGAN[index]);
    }
  } catch (error) {
    console.error('Error updating bimbingan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// DELETE /api/bimbingan/[id] - Hapus bimbingan (mahasiswa, hanya status MENUNGGU)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const index = MOCK_BIMBINGAN.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Bimbingan tidak ditemukan' },
        { status: 404 },
      );
    }

    const existing = MOCK_BIMBINGAN[index];

    if (existing.mahasiswaId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (existing.status !== 'MENUNGGU') {
      return NextResponse.json(
        { error: 'Bimbingan yang sudah diproses tidak bisa dihapus' },
        { status: 400 },
      );
    }

    MOCK_BIMBINGAN.splice(index, 1);

    return NextResponse.json({ message: 'Bimbingan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting bimbingan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
