import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle, Users } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userId = session?.user?.id;

  let stats;

  if (role === "DOSEN") {
    const [totalMahasiswa, totalBimbingan, menunggu, selesai] =
      await Promise.all([
        prisma.user.count({
          where: { dosenPaId: userId, role: "MAHASISWA" },
        }),
        prisma.bimbingan.count({ where: { dosenId: userId } }),
        prisma.bimbingan.count({
          where: { dosenId: userId, status: "MENUNGGU" },
        }),
        prisma.bimbingan.count({
          where: { dosenId: userId, status: "SELESAI" },
        }),
      ]);

    stats = [
      {
        label: "Mahasiswa Bimbingan",
        value: totalMahasiswa,
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Total Bimbingan",
        value: totalBimbingan,
        icon: ClipboardList,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      {
        label: "Menunggu Review",
        value: menunggu,
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      },
      {
        label: "Selesai",
        value: selesai,
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
      },
    ];
  } else {
    const [totalBimbingan, menunggu, disetujui, selesai] = await Promise.all([
      prisma.bimbingan.count({ where: { mahasiswaId: userId } }),
      prisma.bimbingan.count({
        where: { mahasiswaId: userId, status: "MENUNGGU" },
      }),
      prisma.bimbingan.count({
        where: { mahasiswaId: userId, status: "DISETUJUI" },
      }),
      prisma.bimbingan.count({
        where: { mahasiswaId: userId, status: "SELESAI" },
      }),
    ]);

    stats = [
      {
        label: "Total Bimbingan",
        value: totalBimbingan,
        icon: ClipboardList,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      {
        label: "Menunggu",
        value: menunggu,
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      },
      {
        label: "Disetujui",
        value: disetujui,
        icon: CheckCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Selesai",
        value: selesai,
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
      },
    ];
  }

  // Recent bimbingan
  const recentBimbingan = await prisma.bimbingan.findMany({
    where:
      role === "DOSEN" ? { dosenId: userId } : { mahasiswaId: userId },
    include: {
      mahasiswa: { select: { name: true, nim: true } },
      dosen: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const statusColor: Record<string, string> = {
    MENUNGGU: "bg-yellow-100 text-yellow-800",
    DISETUJUI: "bg-blue-100 text-blue-800",
    DITOLAK: "bg-red-100 text-red-800",
    SELESAI: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Selamat datang, {session?.user?.name}
        </h1>
        <p className="text-muted-foreground">
          {role === "DOSEN"
            ? "Dashboard Dosen Penasehat Akademik"
            : "Dashboard Mahasiswa"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bimbingan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bimbingan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBimbingan.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Belum ada data bimbingan
            </p>
          ) : (
            <div className="space-y-3">
              {recentBimbingan.map((b: typeof recentBimbingan[number]) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{b.judul}</p>
                    <p className="text-sm text-muted-foreground">
                      {role === "DOSEN"
                        ? `${b.mahasiswa.name} (${b.mahasiswa.nim})`
                        : b.dosen.name}{" "}
                      &middot;{" "}
                      {new Date(b.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusColor[b.status]}`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
