import "./globals.css";
import { TRPCReactProvider } from "@/utils/trpc";
import { getServerAuthSession } from "@/server/auth";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthContextProvider, AuthContextHandler } from "@/utils/AuthContext";
import LeftSidebar from "./_components/LeftSidebar";

export const metadata = {
  title: "Twidder",
  description: "Still in development",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heads = headers();

  const pathname = heads.get("x-pathname");

  const session = await getServerAuthSession();

  if (pathname === "/login" || pathname === "/register") {
    if (session?.user !== undefined) {
      redirect("/");
    }
  } else {
    if (session?.user === undefined) {
      redirect("/login");
    }
  }

  return (
    <html>
      <body>
        <TRPCReactProvider>
          <AuthContextProvider>
            <AuthContextHandler session={session} />
            <LeftSidebar />
            {children}
          </AuthContextProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
