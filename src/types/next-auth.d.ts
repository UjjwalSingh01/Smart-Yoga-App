import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "admin" | "user"; // Define the role types explicitly
    } & DefaultSession["user"]; // Combine with default properties
  }

  interface User extends DefaultUser {
    id: string;
    role: "admin" | "user"; // Add role to the User interface
  }

  interface JWT {
    id: string;
    email: string;
    role: "admin" | "user"; // Add role to JWT payload
  }
}
