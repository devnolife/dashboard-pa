"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface MahasiswaItem {
  id: string;
  name: string;
  nim: string | null;
  email: string;
  image?: string | null;
  totalBimbingan: number;
  menunggu: number;
  disetujui: number;
  selesai: number;
}

export default function MahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState<MahasiswaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMahasiswa = useCallback(async () => {
    try {
      const res = await fetch("/api/mahasiswa");
      if (res.ok) {
        const data = await res.json();
        setMahasiswa(data);
      }
    } catch (error) {
      console.error("Error fetching mahasiswa:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMahasiswa();
  }, [fetchMahasiswa]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mahasiswa Bimbingan</h1>
        <p className="text-muted-foreground">
          Daftar mahasiswa di bawah bimbingan PA Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Daftar Mahasiswa ({mahasiswa.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mahasiswa.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Belum ada mahasiswa bimbingan
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mahasiswa</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">
                      Total Bimbingan
                    </TableHead>
                    <TableHead className="text-center">Menunggu</TableHead>
                    <TableHead className="text-center">Disetujui</TableHead>
                    <TableHead className="text-center">Selesai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mahasiswa.map((m) => {
                    const initials = m.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();

                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={m.image || undefined} alt={m.name} className="object-cover" />
                              <AvatarFallback className="text-xs">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{m.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {m.nim}
                        </TableCell>
                        <TableCell className="text-sm">{m.email}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{m.totalBimbingan}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{m.menunggu}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">{m.disetujui}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{m.selesai}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
