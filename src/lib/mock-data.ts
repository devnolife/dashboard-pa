// ============================================================
// Mock Data untuk Development (tanpa database)
// ============================================================

export const MOCK_USERS = {
  dosen: {
    id: 'dosen-001',
    name: 'Dr. Ahmad Fauzi, M.Kom.',
    email: 'ahmad.fauzi@universitas.ac.id',
    password: 'dosen123',
    role: 'DOSEN' as const,
    nim: null,
    nip: '198507152010011002',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  mahasiswa: {
    id: 'mhs-001',
    name: 'Rizky Pratama',
    email: 'rizky.pratama@universitas.ac.id',
    password: 'mahasiswa123',
    role: 'MAHASISWA' as const,
    nim: '2021071045',
    nip: null,
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
};

export const MOCK_MAHASISWA_LIST = [
  {
    id: 'mhs-001',
    name: 'Rizky Pratama',
    nim: '2021071045',
    email: 'rizky.pratama@universitas.ac.id',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    totalBimbingan: 5,
    menunggu: 1,
    disetujui: 2,
    selesai: 2,
  },
  {
    id: 'mhs-002',
    name: 'Siti Nurhaliza',
    nim: '2021071032',
    email: 'siti.nurhaliza@universitas.ac.id',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    totalBimbingan: 3,
    menunggu: 0,
    disetujui: 1,
    selesai: 2,
  },
  {
    id: 'mhs-003',
    name: 'Budi Santoso',
    nim: '2021071018',
    email: 'budi.santoso@universitas.ac.id',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    totalBimbingan: 4,
    menunggu: 2,
    disetujui: 1,
    selesai: 1,
  },
  {
    id: 'mhs-004',
    name: 'Dewi Lestari',
    nim: '2021071056',
    email: 'dewi.lestari@universitas.ac.id',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    totalBimbingan: 2,
    menunggu: 1,
    disetujui: 0,
    selesai: 1,
  },
  {
    id: 'mhs-005',
    name: 'Andi Wijaya',
    nim: '2021071067',
    email: 'andi.wijaya@universitas.ac.id',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    totalBimbingan: 6,
    menunggu: 0,
    disetujui: 3,
    selesai: 3,
  },
];

export const MOCK_BIMBINGAN = [
  {
    id: 'bimb-001',
    judul: 'Konsultasi KRS Semester 6',
    deskripsi: 'Saya ingin berkonsultasi mengenai pemilihan mata kuliah untuk semester 6, terutama terkait mata kuliah pilihan yang relevan dengan minat saya di bidang Machine Learning.',
    status: 'MENUNGGU',
    catatan: null,
    tanggal: '2026-02-20T08:00:00.000Z',
    createdAt: '2026-02-18T10:30:00.000Z',
    mahasiswaId: 'mhs-001',
    dosenId: 'dosen-001',
    mahasiswa: { id: 'mhs-001', name: 'Rizky Pratama', nim: '2021071045', email: 'rizky.pratama@universitas.ac.id', image: MOCK_MAHASISWA_LIST[0].image },
    dosen: { id: 'dosen-001', name: 'Dr. Ahmad Fauzi, M.Kom.', nip: '198507152010011002', email: 'ahmad.fauzi@universitas.ac.id', image: MOCK_USERS.dosen.image },
  },
  {
    id: 'bimb-002',
    judul: 'Bimbingan Proposal Skripsi',
    deskripsi: 'Membahas outline proposal skripsi tentang implementasi deep learning untuk deteksi penyakit tanaman.',
    status: 'DISETUJUI',
    catatan: 'Proposal sudah cukup baik. Perbaiki bagian metodologi dan tambahkan referensi terbaru.',
    tanggal: '2026-02-15T09:00:00.000Z',
    createdAt: '2026-02-13T14:00:00.000Z',
    mahasiswaId: 'mhs-001',
    dosenId: 'dosen-001',
    mahasiswa: { id: 'mhs-001', name: 'Rizky Pratama', nim: '2021071045', email: 'rizky.pratama@universitas.ac.id', image: MOCK_MAHASISWA_LIST[0].image },
    dosen: { id: 'dosen-001', name: 'Dr. Ahmad Fauzi, M.Kom.', nip: '198507152010011002', email: 'ahmad.fauzi@universitas.ac.id', image: MOCK_USERS.dosen.image },
  },
  {
    id: 'bimb-003',
    judul: 'Konsultasi Akademik - IPK Menurun',
    deskripsi: 'IPK saya menurun di semester lalu, ingin berkonsultasi tentang strategi belajar dan pengambilan mata kuliah.',
    status: 'SELESAI',
    catatan: 'Sudah dibahas strategi belajar. Mahasiswa disarankan untuk mengurangi beban SKS dan fokus pada mata kuliah inti.',
    tanggal: '2026-02-10T10:00:00.000Z',
    createdAt: '2026-02-08T08:00:00.000Z',
    mahasiswaId: 'mhs-002',
    dosenId: 'dosen-001',
    mahasiswa: { id: 'mhs-002', name: 'Siti Nurhaliza', nim: '2021071032', email: 'siti.nurhaliza@universitas.ac.id', image: MOCK_MAHASISWA_LIST[1].image },
    dosen: { id: 'dosen-001', name: 'Dr. Ahmad Fauzi, M.Kom.', nip: '198507152010011002', email: 'ahmad.fauzi@universitas.ac.id', image: MOCK_USERS.dosen.image },
  },
  {
    id: 'bimb-004',
    judul: 'Persetujuan Magang',
    deskripsi: 'Saya mendapat tawaran magang di PT Telkom Indonesia. Mohon persetujuan dan saran dari dosen PA.',
    status: 'DISETUJUI',
    catatan: 'Disetujui. Pastikan jadwal magang tidak bentrok dengan kuliah wajib.',
    tanggal: '2026-02-12T13:00:00.000Z',
    createdAt: '2026-02-10T09:00:00.000Z',
    mahasiswaId: 'mhs-003',
    dosenId: 'dosen-001',
    mahasiswa: { id: 'mhs-003', name: 'Budi Santoso', nim: '2021071018', email: 'budi.santoso@universitas.ac.id', image: MOCK_MAHASISWA_LIST[2].image },
    dosen: { id: 'dosen-001', name: 'Dr. Ahmad Fauzi, M.Kom.', nip: '198507152010011002', email: 'ahmad.fauzi@universitas.ac.id', image: MOCK_USERS.dosen.image },
  },
  {
    id: 'bimb-005',
    judul: 'Review Progress Skripsi Bab 3',
    deskripsi: 'Melaporkan progress penulisan bab 3 skripsi mengenai implementasi sistem dan pengujian.',
    status: 'MENUNGGU',
    catatan: null,
    tanggal: '2026-02-21T08:30:00.000Z',
    createdAt: '2026-02-19T16:00:00.000Z',
    mahasiswaId: 'mhs-003',
    dosenId: 'dosen-001',
    mahasiswa: { id: 'mhs-003', name: 'Budi Santoso', nim: '2021071018', email: 'budi.santoso@universitas.ac.id', image: MOCK_MAHASISWA_LIST[2].image },
    dosen: { id: 'dosen-001', name: 'Dr. Ahmad Fauzi, M.Kom.', nip: '198507152010011002', email: 'ahmad.fauzi@universitas.ac.id', image: MOCK_USERS.dosen.image },
  },
  {
    id: 'bimb-006',
    judul: 'Konsultasi Rencana Studi Lanjut',
    deskripsi: 'Ingin berkonsultasi mengenai rencana melanjutkan studi S2 setelah lulus dan rekomendasi program studi.',
    status: 'SELESAI',
    catatan: 'Sudah diberikan arahan untuk mempersiapkan TOEFL dan mencari beasiswa LPDP.',
    tanggal: '2026-02-05T14:00:00.000Z',
    createdAt: '2026-02-03T11:00:00.000Z',
    mahasiswaId: 'mhs-005',
    dosenId: 'dosen-001',
    mahasiswa: { id: 'mhs-005', name: 'Andi Wijaya', nim: '2021071067', email: 'andi.wijaya@universitas.ac.id', image: MOCK_MAHASISWA_LIST[4].image },
    dosen: { id: 'dosen-001', name: 'Dr. Ahmad Fauzi, M.Kom.', nip: '198507152010011002', email: 'ahmad.fauzi@universitas.ac.id', image: MOCK_USERS.dosen.image },
  },
  {
    id: 'bimb-007',
    judul: 'Pengajuan Cuti Akademik',
    deskripsi: 'Saya perlu mengajukan cuti akademik karena alasan kesehatan. Mohon bimbingan prosedurnya.',
    status: 'DITOLAK',
    catatan: 'Sebaiknya konsultasikan dulu dengan bagian kemahasiswaan. Cuti akademik memerlukan surat keterangan dokter resmi.',
    tanggal: '2026-02-08T10:00:00.000Z',
    createdAt: '2026-02-06T09:00:00.000Z',
    mahasiswaId: 'mhs-004',
    dosenId: 'dosen-001',
    mahasiswa: { id: 'mhs-004', name: 'Dewi Lestari', nim: '2021071056', email: 'dewi.lestari@universitas.ac.id', image: MOCK_MAHASISWA_LIST[3].image },
    dosen: { id: 'dosen-001', name: 'Dr. Ahmad Fauzi, M.Kom.', nip: '198507152010011002', email: 'ahmad.fauzi@universitas.ac.id', image: MOCK_USERS.dosen.image },
  },
];

// Helper: get stats for dosen dashboard
export function getDosenStats() {
  const totalMahasiswa = MOCK_MAHASISWA_LIST.length;
  const totalBimbingan = MOCK_BIMBINGAN.length;
  const menunggu = MOCK_BIMBINGAN.filter((b) => b.status === 'MENUNGGU').length;
  const selesai = MOCK_BIMBINGAN.filter((b) => b.status === 'SELESAI').length;
  return { totalMahasiswa, totalBimbingan, menunggu, selesai };
}

// Helper: get stats for mahasiswa dashboard
export function getMahasiswaStats(mahasiswaId: string) {
  const myBimbingan = MOCK_BIMBINGAN.filter((b) => b.mahasiswaId === mahasiswaId);
  const totalBimbingan = myBimbingan.length;
  const menunggu = myBimbingan.filter((b) => b.status === 'MENUNGGU').length;
  const disetujui = myBimbingan.filter((b) => b.status === 'DISETUJUI').length;
  const selesai = myBimbingan.filter((b) => b.status === 'SELESAI').length;
  return { totalBimbingan, menunggu, disetujui, selesai };
}

// Helper: get recent bimbingan
export function getRecentBimbingan(userId: string, role: string, limit = 5) {
  const filtered =
    role === 'DOSEN'
      ? MOCK_BIMBINGAN.filter((b) => b.dosenId === userId)
      : MOCK_BIMBINGAN.filter((b) => b.mahasiswaId === userId);

  return filtered
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
