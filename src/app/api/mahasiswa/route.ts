import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MOCK_MAHASISWA_LIST } from '@/lib/mock-data';

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

    return NextResponse.json(MOCK_MAHASISWA_LIST);
  } catch (error) {
    console.error('Error fetching mahasiswa:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
