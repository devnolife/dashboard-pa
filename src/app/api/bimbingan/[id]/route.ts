import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Cek bimbingan exists
    const existing = await prisma.bimbingan.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Bimbingan tidak ditemukan' },
        { status: 404 },
      );
    }

    if (session.user.role === 'DOSEN') {
      // Dosen hanya bisa update status dan catatan
      if (existing.dosenId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const bimbingan = await prisma.bimbingan.update({
        where: { id },
        data: {
          status: body.status,
          catatan: body.catatan,
        },
        include: {
          mahasiswa: {
            select: { id: true, name: true, nim: true, email: true },
          },
        },
      });

      return NextResponse.json(bimbingan);
    } else {
      // Mahasiswa hanya bisa edit bimbingan yang MENUNGGU
      if (existing.mahasiswaId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (existing.status !== 'MENUNGGU') {
        return NextResponse.json(
          { error: 'Bimbingan yang sudah diproses tidak bisa diedit' },
          { status: 400 },
        );
      }

      const bimbingan = await prisma.bimbingan.update({
        where: { id },
        data: {
          judul: body.judul,
          deskripsi: body.deskripsi,
          tanggal: body.tanggal ? new Date(body.tanggal) : undefined,
        },
        include: {
          dosen: {
            select: { id: true, name: true, nip: true, email: true },
          },
        },
      });

      return NextResponse.json(bimbingan);
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

    const existing = await prisma.bimbingan.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Bimbingan tidak ditemukan' },
        { status: 404 },
      );
    }

    if (existing.mahasiswaId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (existing.status !== 'MENUNGGU') {
      return NextResponse.json(
        { error: 'Bimbingan yang sudah diproses tidak bisa dihapus' },
        { status: 400 },
      );
    }

    await prisma.bimbingan.delete({ where: { id } });

    return NextResponse.json({ message: 'Bimbingan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting bimbingan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
