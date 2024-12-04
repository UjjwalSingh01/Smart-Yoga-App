import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/database/mongodb";
import User from "@/models/User";

const SECRET_KEY = process.env.NEXTAUTH_SECRET || "your-secret-key";

export const authOptions: AuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials as { email: string; password: string };

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
          throw new Error("Invalid credentials");
        }

        return { 
          id: user._id.toString(), 
          // name: user.fullname, 
          // email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages:{
    signIn: "/sign-in" ,
    // signOut: '/'
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
        };
      }
      return session;
    },
  },
  secret: SECRET_KEY,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
