import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MOCK_USERS } from '@/lib/mock-data';

const allUsers = Object.values(MOCK_USERS);

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi');
        }

        const user = allUsers.find((u) => u.email === credentials.email);

        if (!user) {
          throw new Error('Email atau password salah');
        }

        // Mock: plain text comparison (no bcrypt/database needed)
        if (credentials.password !== user.password) {
          throw new Error('Email atau password salah');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          nim: user.nim,
          nip: user.nip,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
        token.nim = (user as { nim?: string | null }).nim ?? undefined;
        token.nip = (user as { nip?: string | null }).nip ?? undefined;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.nim = token.nim as string | undefined;
        session.user.nip = token.nip as string | undefined;
        session.user.image = token.picture as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-bimbingan-pa',
};
