import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "../styles/globals.css";

import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale(ptBr);
dayjs.extend(relativeTime);

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeiaAI",
  description: "Descubra novas leituras de acordo com o seu gosto!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
