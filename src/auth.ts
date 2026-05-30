import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import prisma from './lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { email: user.email, password: '', credits: 1000 },
      });
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, credits: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.credits = dbUser.credits;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; credits?: number }).id = token.id as string;
        (session.user as { id?: string; credits?: number }).credits = token.credits as number;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});
