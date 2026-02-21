import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getDosenStats,
  getMahasiswaStats,
  getRecentBimbingan,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle, Users } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userId = session?.user?.id ?? "";

  let stats;

  if (role === "DOSEN") {
    const d = getDosenStats();
    stats = [
      {
        label: "Mahasiswa Bimbingan",
        value: d.totalMahasiswa,
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Total Bimbingan",
        value: d.totalBimbingan,
        icon: ClipboardList,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      {
        label: "Menunggu Review",
        value: d.menunggu,
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      },
      {
        label: "Selesai",
        value: d.selesai,
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
      },
    ];
  } else {
    const m = getMahasiswaStats(userId);
    stats = [
      {
        label: "Total Bimbingan",
        value: m.totalBimbingan,
        icon: ClipboardList,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      {
        label: "Menunggu",
        value: m.menunggu,
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      },
      {
        label: "Disetujui",
        value: m.disetujui,
        icon: CheckCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Selesai",
        value: m.selesai,
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
      },
    ];
  }

  const recentBimbingan = getRecentBimbingan(userId, role ?? "MAHASISWA");

  const statusColor: Record<string, string> = {
    MENUNGGU: "bg-amber-50 text-amber-700 border-amber-200/50",
    DISETUJUI: "bg-blue-50 text-blue-700 border-blue-200/50",
    DITOLAK: "bg-rose-50 text-rose-700 border-rose-200/50",
    SELESAI: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Selamat datang, <span className="text-blue-600">{session?.user?.name}</span>
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          {role === "DOSEN"
            ? "Dashboard Dosen Penasehat Akademik"
            : "Dashboard Mahasiswa"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-2xl ${stat.bg} shadow-sm border border-white/50`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bimbingan */}
      <Card className="border-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
        <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl px-6 py-5">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Bimbingan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentBimbingan.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <ClipboardList className="h-12 w-12 text-slate-300 mb-3" />
              <p className="text-sm font-medium">Belum ada data bimbingan</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBimbingan.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-6">
                    <p className="text-base font-semibold text-slate-800 truncate mb-1">
                      {b.judul}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <span className="font-medium text-slate-600">
                        {role === "DOSEN"
                          ? `${b.mahasiswa.name} (${b.mahasiswa.nim})`
                          : b.dosen.name}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      {new Date(b.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm border ${statusColor[b.status]}`}
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
