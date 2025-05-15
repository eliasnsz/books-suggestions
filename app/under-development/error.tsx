"use client";

import { CircleAlertIcon } from "lucide-react";
import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";

export default function UnderDevelopmentErrorPage() {
  return (
    <div className="space-y-6">
      <div className="bg-red-200 rounded-md p-4 border-red-500 border space-y-1">
        <h2 className="flex items-center gap-1 text-sm font-bold text-red-900">
          <CircleAlertIcon size={16} />
          Ocorreu um erro
        </h2>
        <p className="text-xs sm:text-sm text-red-600">
          Não foi possível buscar as informações do projeto no GitHub.
        </p>
      </div>

      <p className="text-xs sm:text-sm text-center text-muted-foreground">
        Caso o problema persista, fique à vontade para entrar em contato com o{" "}
        <StyledLink href="mailto:leia.ai.software@gmail.com">
          suporte
        </StyledLink>
        , ou{" "}
        <StyledLink
          target="_blank"
          href="https://github.com/eliasnsz/leia-ai/issues/new"
        >
          abrir uma issue
        </StyledLink>{" "}
        para que possamos resolver.
      </p>
    </div>
  );
}

function StyledLink(props: ComponentProps<"a"> & LinkProps) {
  return <Link {...props} className="underline text-black" />;
}
