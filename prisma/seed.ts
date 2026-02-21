import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Hapus data lama
  await prisma.bimbingan.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Buat Dosen PA
  const dosen1 = await prisma.user.create({
    data: {
      name: "Dr. Ahmad Fauzi, M.Kom",
      email: "ahmad.fauzi@universitas.ac.id",
      password: hashedPassword,
      role: "DOSEN",
      nip: "198501012010011001",
    },
  });

  const dosen2 = await prisma.user.create({
    data: {
      name: "Dr. Siti Nurhaliza, M.T",
      email: "siti.nurhaliza@universitas.ac.id",
      password: hashedPassword,
      role: "DOSEN",
      nip: "198703152011012002",
    },
  });

  // Buat Mahasiswa (di bawah dosen1)
  const mhs1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi.santoso@mahasiswa.ac.id",
      password: hashedPassword,
      role: "MAHASISWA",
      nim: "2021001001",
      dosenPaId: dosen1.id,
    },
  });

  const mhs2 = await prisma.user.create({
    data: {
      name: "Rina Wati",
      email: "rina.wati@mahasiswa.ac.id",
      password: hashedPassword,
      role: "MAHASISWA",
      nim: "2021001002",
      dosenPaId: dosen1.id,
    },
  });

  const mhs3 = await prisma.user.create({
    data: {
      name: "Dimas Pratama",
      email: "dimas.pratama@mahasiswa.ac.id",
      password: hashedPassword,
      role: "MAHASISWA",
      nim: "2021001003",
      dosenPaId: dosen1.id,
    },
  });

  // Buat Mahasiswa (di bawah dosen2)
  const mhs4 = await prisma.user.create({
    data: {
      name: "Anisa Putri",
      email: "anisa.putri@mahasiswa.ac.id",
      password: hashedPassword,
      role: "MAHASISWA",
      nim: "2021002001",
      dosenPaId: dosen2.id,
    },
  });

  // Buat data Bimbingan
  await prisma.bimbingan.createMany({
    data: [
      {
        judul: "Konsultasi KRS Semester 5",
        deskripsi:
          "Ingin berkonsultasi mengenai pengambilan mata kuliah semester 5, khususnya mata kuliah pilihan yang sesuai dengan minat.",
        status: "SELESAI",
        catatan:
          "Disarankan mengambil mata kuliah Machine Learning dan Data Mining.",
        tanggal: new Date("2025-09-01"),
        mahasiswaId: mhs1.id,
        dosenId: dosen1.id,
      },
      {
        judul: "Konsultasi Judul Skripsi",
        deskripsi:
          "Ingin mendiskusikan beberapa alternatif judul skripsi terkait pengembangan aplikasi web menggunakan Next.js.",
        status: "DISETUJUI",
        catatan: "Judul menarik, silakan mulai riset literatur.",
        tanggal: new Date("2025-10-15"),
        mahasiswaId: mhs1.id,
        dosenId: dosen1.id,
      },
      {
        judul: "Laporan Progress Skripsi Bab 1",
        deskripsi:
          "Ingin melaporkan progress penulisan Bab 1 dan meminta masukan mengenai latar belakang masalah.",
        status: "MENUNGGU",
        tanggal: new Date("2026-02-10"),
        mahasiswaId: mhs1.id,
        dosenId: dosen1.id,
      },
      {
        judul: "Konsultasi Nilai Semester 4",
        deskripsi:
          "IPK semester 4 menurun, ingin berkonsultasi strategi untuk memperbaiki nilai di semester berikutnya.",
        status: "SELESAI",
        catatan:
          "Fokus ke mata kuliah inti, kurangi kegiatan di luar akademik sementara.",
        tanggal: new Date("2025-08-20"),
        mahasiswaId: mhs2.id,
        dosenId: dosen1.id,
      },
      {
        judul: "Permohonan Surat Rekomendasi",
        deskripsi:
          "Membutuhkan surat rekomendasi dari dosen PA untuk mendaftar program magang di perusahaan teknologi.",
        status: "DISETUJUI",
        catatan: "Surat rekomendasi sudah disiapkan, silakan ambil di ruangan.",
        tanggal: new Date("2026-01-05"),
        mahasiswaId: mhs2.id,
        dosenId: dosen1.id,
      },
      {
        judul: "Konsultasi Rencana Studi",
        deskripsi:
          "Ingin mendiskusikan rencana studi agar bisa lulus tepat waktu di semester 8.",
        status: "MENUNGGU",
        tanggal: new Date("2026-02-15"),
        mahasiswaId: mhs3.id,
        dosenId: dosen1.id,
      },
      {
        judul: "Konsultasi Topik Penelitian",
        deskripsi:
          "Ingin berkonsultasi tentang topik penelitian di bidang Internet of Things untuk tugas akhir.",
        status: "MENUNGGU",
        tanggal: new Date("2026-02-18"),
        mahasiswaId: mhs4.id,
        dosenId: dosen2.id,
      },
    ],
  });

  console.log("Seeding selesai!");
  console.log("");
  console.log("=== AKUN LOGIN ===");
  console.log("");
  console.log("DOSEN:");
  console.log("  Email: ahmad.fauzi@universitas.ac.id");
  console.log("  Password: password123");
  console.log("");
  console.log("  Email: siti.nurhaliza@universitas.ac.id");
  console.log("  Password: password123");
  console.log("");
  console.log("MAHASISWA:");
  console.log("  Email: budi.santoso@mahasiswa.ac.id");
  console.log("  Password: password123");
  console.log("");
  console.log("  Email: rina.wati@mahasiswa.ac.id");
  console.log("  Password: password123");
  console.log("");
  console.log("  Email: dimas.pratama@mahasiswa.ac.id");
  console.log("  Password: password123");
  console.log("");
  console.log("  Email: anisa.putri@mahasiswa.ac.id");
  console.log("  Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
