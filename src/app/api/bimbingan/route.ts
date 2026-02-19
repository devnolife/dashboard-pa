import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
      // Dosen melihat semua bimbingan mahasiswa-nya
      bimbingan = await prisma.bimbingan.findMany({
        where: { dosenId: id },
        include: {
          mahasiswa: {
            select: { id: true, name: true, nim: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Mahasiswa melihat bimbingan sendiri
      bimbingan = await prisma.bimbingan.findMany({
        where: { mahasiswaId: id },
        include: {
          dosen: {
            select: { id: true, name: true, nip: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
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

    // Cari dosen PA dari mahasiswa
    const mahasiswa = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dosenPaId: true },
    });

    if (!mahasiswa?.dosenPaId) {
      return NextResponse.json(
        { error: 'Anda belum memiliki dosen PA' },
        { status: 400 },
      );
    }

    const bimbingan = await prisma.bimbingan.create({
      data: {
        judul,
        deskripsi,
        tanggal: tanggal ? new Date(tanggal) : new Date(),
        mahasiswaId: session.user.id,
        dosenId: mahasiswa.dosenPaId,
      },
      include: {
        dosen: {
          select: { id: true, name: true, nip: true, email: true },
        },
      },
    });

    return NextResponse.json(bimbingan, { status: 201 });
  } catch (error) {
    console.error('Error creating bimbingan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
