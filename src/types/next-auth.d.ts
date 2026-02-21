import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      nim?: string;
      nip?: string;
      image?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    nim?: string | null;
    nip?: string | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    nim?: string;
    nip?: string;
    picture?: string | null;
  }
}
