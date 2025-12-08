import type { Metadata } from "next";
import ApolloWrapper from "@/components/ApolloWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memoria",
  description: "Your AI Memory Vault"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}