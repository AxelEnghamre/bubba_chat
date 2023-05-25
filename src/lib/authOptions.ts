import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import supabase from "./supabaseStore";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const { data } = await supabase
        .from("users")
        .select()
        .eq("email", session.user?.email)
        .single();
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          userData: {
            userName: data?.user_name,
            userDescription: data?.user_description,
          },
        },
      };
    },
  },
};
export default authOptions;
