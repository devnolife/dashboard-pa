'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const dosenNav = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Mahasiswa Bimbingan',
    href: '/dashboard/mahasiswa',
    icon: Users,
  },
  {
    label: 'Riwayat Bimbingan',
    href: '/dashboard/bimbingan',
    icon: ClipboardList,
  },
  {
    label: 'Profil Saya',
    href: '/dashboard/profil',
    icon: UserCircle,
  },
];

const mahasiswaNav = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Bimbingan Saya',
    href: '/dashboard/bimbingan',
    icon: ClipboardList,
  },
  {
    label: 'Profil Saya',
    href: '/dashboard/profil',
    icon: UserCircle,
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role;
  const navItems = role === 'DOSEN' ? dosenNav : mahasiswaNav;
  const initials = session?.user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 bg-gradient-to-r from-blue-50 to-transparent">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-500/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent tracking-tight">
          Bimbingan PA
        </span>
      </div>
      <Separator className="bg-blue-100/50" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-blue-100/50 p-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/profil" className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
            <Avatar className="h-10 w-10 border-2 border-blue-100 shadow-sm">
              <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || ''} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800">
                {session?.user?.name}
              </p>
              <p className="text-xs text-blue-600 font-medium truncate">
                {role === 'DOSEN' ? 'Dosen PA' : 'Mahasiswa'}
              </p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r border-blue-100 bg-white h-screen sticky top-0 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-2 border-b border-blue-100 bg-white px-4 py-3 shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigasi</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <GraduationCap className="h-5 w-5 text-blue-600" />
        <span className="font-bold text-blue-950">Bimbingan PA</span>
      </div>
    </>
  );
}
