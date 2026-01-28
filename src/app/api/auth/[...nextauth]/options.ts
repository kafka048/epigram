import { UserModel } from "@/src/app/model/usermodel";
import ConnectToDB from "@/src/lib/dbconnection";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        await ConnectToDB();

        if (!credentials || !credentials.email || !credentials.password)
          return null;

        const user = await UserModel.findOne({
          email: credentials.email,
        });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );
        if (!isPasswordCorrect) return null;

        const isUserVerified = user.isVerified;
        if (!isUserVerified) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ((token.id = user.id),
          (token.email = user.email),
          (token.name = user.name));
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        ((session.user.id = token.id),
          (session.user.email = token.email),
          (session.user.name = token.name));
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
