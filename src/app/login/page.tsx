'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  GraduationCap,
  Loader2,
  BookOpen,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

const QUICK_LOGINS = [
  {
    label: 'Masuk sebagai Mahasiswa',
    description: 'Rizky Pratama - 2021071045',
    email: 'rizky.pratama@universitas.ac.id',
    password: 'mahasiswa123',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-500',
    hoverGradient: 'hover:from-blue-600 hover:to-cyan-600',
    shadow: 'shadow-blue-500/25',
  },
  {
    label: 'Masuk sebagai Dosen',
    description: 'Dr. Ahmad Fauzi, M.Kom.',
    email: 'ahmad.fauzi@universitas.ac.id',
    password: 'dosen123',
    icon: Users,
    gradient: 'from-violet-500 to-purple-500',
    hoverGradient: 'hover:from-violet-600 hover:to-purple-600',
    shadow: 'shadow-violet-500/25',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');

    const result = await signIn('credentials', {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      return false;
    }

    router.push('/dashboard');
    router.refresh();
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleLogin(email, password);
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (index: number) => {
    const { email: qEmail, password: qPassword } = QUICK_LOGINS[index];
    setQuickLoading(index);
    try {
      await handleLogin(qEmail, qPassword);
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950">
        {/* Animated background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Bimbingan PA
            </span>
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                Sistem Bimbingan Akademik
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Kelola bimbingan
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  akademik dengan mudah
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                Platform digital untuk memudahkan proses bimbingan antara
                mahasiswa dan dosen penasehat akademik.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              {[
                'Pengajuan Bimbingan',
                'Tracking Status',
                'Review & Catatan',
                'Riwayat Lengkap',
              ].map((feature) => (
                <div
                  key={feature}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-sm text-slate-500">
            &copy; 2026 Universitas &middot; Sistem Informasi Akademik
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Subtle background glow for right side */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl -z-10" />

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Bimbingan PA
            </span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Selamat datang
            </h2>
            <p className="text-muted-foreground">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Quick Login Buttons */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Login Cepat (Demo)
            </p>
            <div className="grid gap-3">
              {QUICK_LOGINS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(index)}
                  disabled={quickLoading !== null || loading}
                  className={`
                    group relative w-full flex items-center gap-4 p-4 rounded-xl
                    bg-gradient-to-r ${item.gradient} ${item.hoverGradient}
                    text-white shadow-lg ${item.shadow}
                    transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                    active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100
                    cursor-pointer
                  `}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    {quickLoading === index ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <item.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-white/70">{item.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              atau masuk manual
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@universitas.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={loading || quickLoading !== null}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer hint */}
          <p className="text-center text-xs text-muted-foreground">
            Gunakan tombol login cepat di atas untuk mencoba demo aplikasi
          </p>
        </div>
      </div>
    </div>
  );
}
