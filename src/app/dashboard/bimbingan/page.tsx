"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TambahBimbinganDialog } from "@/components/dashboard/tambah-bimbingan-dialog";
import { ReviewBimbinganDialog } from "@/components/dashboard/review-bimbingan-dialog";
import { Loader2, Eye, Trash2 } from "lucide-react";

interface BimbinganItem {
  id: string;
  judul: string;
  deskripsi: string;
  status: string;
  catatan: string | null;
  tanggal: string;
  createdAt: string;
  mahasiswa?: { id: string; name: string; nim: string | null; email: string };
  dosen?: { id: string; name: string; nip: string | null; email: string };
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  MENUNGGU: "secondary",
  DISETUJUI: "default",
  DITOLAK: "destructive",
  SELESAI: "outline",
};

const statusLabel: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
  SELESAI: "Selesai",
};

export default function BimbinganPage() {
  const { data: session } = useSession();
  const [bimbingan, setBimbingan] = useState<BimbinganItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBimbingan, setSelectedBimbingan] =
    useState<BimbinganItem | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const role = session?.user?.role;

  const fetchBimbingan = useCallback(async () => {
    try {
      const res = await fetch("/api/bimbingan");
      if (res.ok) {
        const data = await res.json();
        setBimbingan(data);
      }
    } catch (error) {
      console.error("Error fetching bimbingan:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBimbingan();
  }, [fetchBimbingan]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus bimbingan ini?")) return;

    try {
      const res = await fetch(`/api/bimbingan/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBimbingan();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus bimbingan");
      }
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  const handleReview = (item: BimbinganItem) => {
    setSelectedBimbingan(item);
    setReviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {role === "DOSEN" ? "Riwayat Bimbingan" : "Bimbingan Saya"}
          </h1>
          <p className="text-muted-foreground">
            {role === "DOSEN"
              ? "Daftar bimbingan dari mahasiswa Anda"
              : "Daftar pengajuan bimbingan Anda"}
          </p>
        </div>
        {role === "MAHASISWA" && (
          <TambahBimbinganDialog onSuccess={fetchBimbingan} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Daftar Bimbingan ({bimbingan.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bimbingan.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Belum ada data bimbingan
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    {role === "DOSEN" && <TableHead>Mahasiswa</TableHead>}
                    {role === "MAHASISWA" && <TableHead>Dosen PA</TableHead>}
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bimbingan.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.judul}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {item.deskripsi}
                          </p>
                        </div>
                      </TableCell>
                      {role === "DOSEN" && (
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {item.mahasiswa?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.mahasiswa?.nim}
                            </p>
                          </div>
                        </TableCell>
                      )}
                      {role === "MAHASISWA" && (
                        <TableCell>{item.dosen?.name}</TableCell>
                      )}
                      <TableCell>
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[item.status]}>
                          {statusLabel[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {item.catatan || "-"}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {role === "DOSEN" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReview(item)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          )}
                          {role === "MAHASISWA" &&
                            item.status === "MENUNGGU" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog (Dosen only) */}
      <ReviewBimbinganDialog
        bimbingan={selectedBimbingan}
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        onSuccess={fetchBimbingan}
      />
    </div>
  );
}
