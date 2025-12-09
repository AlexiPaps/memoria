import type { Metadata } from "next";
import ApolloWrapper from "@/components/ApolloWrapper";
import { PostHogProvider } from "@/components/PostHogProvider";
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
        <PostHogProvider>
          <ApolloWrapper>{children}</ApolloWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}