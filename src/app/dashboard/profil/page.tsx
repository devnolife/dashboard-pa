'use client';

import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  User,
  IdCard,
  Calendar,
  Shield,
  GraduationCap,
  BookOpen,
} from 'lucide-react';

export default function ProfilPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role;

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const roleLabel = role === 'DOSEN' ? 'Dosen PA' : 'Mahasiswa';
  const roleColor =
    role === 'DOSEN'
      ? 'bg-violet-100 text-violet-800 border-violet-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';

  const infoItems = [
    {
      icon: User,
      label: 'Nama Lengkap',
      value: user?.name ?? '-',
    },
    {
      icon: Mail,
      label: 'Email',
      value: user?.email ?? '-',
    },
    {
      icon: Shield,
      label: 'Role',
      value: roleLabel,
    },
    ...(role === 'DOSEN'
      ? [
          {
            icon: IdCard,
            label: 'NIP',
            value: user?.nip ?? '-',
          },
        ]
      : [
          {
            icon: IdCard,
            label: 'NIM',
            value: user?.nim ?? '-',
          },
        ]),
    {
      icon: Calendar,
      label: 'Status Akun',
      value: 'Aktif',
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-muted-foreground">
          Informasi akun dan data pribadi Anda
        </p>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={user?.image || undefined} alt={user?.name || ''} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white shadow-sm" title="Online" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className={roleColor}>
                  {role === 'DOSEN' ? (
                    <GraduationCap className="h-3 w-3 mr-1" />
                  ) : (
                    <BookOpen className="h-3 w-3 mr-1" />
                  )}
                  {roleLabel}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Aktif
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {infoItems.map((item, index) => (
            <div key={item.label}>
              {index > 0 && <Separator />}
              <div className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="font-medium truncate">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional info for dosen */}
      {role === 'DOSEN' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Akademik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Jabatan
                </p>
                <p className="font-medium">Dosen Penasehat Akademik</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Fakultas
                </p>
                <p className="font-medium">Teknik Informatika</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Program Studi
                </p>
                <p className="font-medium">S1 Informatika</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Periode Aktif
                </p>
                <p className="font-medium">2025/2026 Genap</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional info for mahasiswa */}
      {role === 'MAHASISWA' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Akademik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Dosen PA
                </p>
                <p className="font-medium">Dr. Ahmad Fauzi, M.Kom.</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Semester
                </p>
                <p className="font-medium">Semester 10</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Program Studi
                </p>
                <p className="font-medium">S1 Informatika</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Angkatan
                </p>
                <p className="font-medium">2021</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
