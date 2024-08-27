import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    newUser: "/register",
    signOut: "/",
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "514701",
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await db.table.user.findUnique({
          where: { name: credentials?.name },
          select: {
            id: true,
            name: true,
            password: true,
          },
        });

        if (!user) {
          throw new Error("Either name or password is wrong");
        }

        if (credentials?.password !== user?.password) {
          throw new Error("Either name or password is wrong");
        }

        user.password = "";

        return user;
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
