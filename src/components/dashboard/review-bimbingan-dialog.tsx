"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface BimbinganItem {
  id: string;
  judul: string;
  deskripsi: string;
  status: string;
  catatan: string | null;
  tanggal: string;
  mahasiswa?: { name: string; nim: string | null; image?: string | null };
}

interface ReviewBimbinganDialogProps {
  bimbingan: BimbinganItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReviewBimbinganDialog({
  bimbingan,
  open,
  onOpenChange,
  onSuccess,
}: ReviewBimbinganDialogProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && bimbingan) {
      setStatus(bimbingan.status);
      setCatatan(bimbingan.catatan || "");
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bimbingan) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/bimbingan/${bimbingan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, catatan }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengupdate bimbingan");
      }

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (!bimbingan) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Review Bimbingan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage src={bimbingan.mahasiswa?.image || undefined} alt={bimbingan.mahasiswa?.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium text-sm">
                {bimbingan.mahasiswa?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'M'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-800">
                {bimbingan.mahasiswa?.name}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                {bimbingan.mahasiswa?.nim}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Judul</p>
              <p className="font-medium">{bimbingan.judul}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deskripsi</p>
              <p className="text-sm">{bimbingan.deskripsi}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tanggal</p>
              <p className="text-sm">
                {new Date(bimbingan.tanggal).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MENUNGGU">Menunggu</SelectItem>
                <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                <SelectItem value="DITOLAK">Ditolak</SelectItem>
                <SelectItem value="SELESAI">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              placeholder="Tulis catatan untuk mahasiswa..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
