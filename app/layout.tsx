import { Geist } from "next/font/google";
import { ReactNode } from "react";
import "../styles/globals.css";
import { Metadata } from "next";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Suggestions",
  description: "Descubra novas leituras de acordo com o seu gosto!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
