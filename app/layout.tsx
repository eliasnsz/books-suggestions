import "../styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";

import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

import { QueryClientProvider } from "@/providers/query-client-provider";

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
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
