"use client";
import dayjs from "dayjs";
import { CircleAlertIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { emojify } from "node-emoji";

type FetchStatusResponse = {
  updated_at: string;
  dependencies: {
    database: {
      status: string;
      postgres_version: string;
      active_connections: number;
      max_connections: number;
      first_query_duration_in_miliseconds: number;
      second_query_duration_in_miliseconds: number;
      third_query_duration_in_miliseconds: number;
    };
    webserver: {
      status: string;
      provider: string;
      environment: string;
      last_commit_author: string;
      last_commit_message: string;
      last_commit_message_sha: string;
    };
  };
};

export default function StatusPage() {
  const { data, isLoading, error, promise } = useQuery<FetchStatusResponse>({
    queryKey: ["status"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`).then((res) =>
        res.json(),
      ),
    refetchInterval: 1000 * 10, // 10 seconds,
    retry: false,
  });

  let servicesStatus = <p>Carregando informações...</p>;

  if (!isLoading && data) {
    servicesStatus = (
      <>
        <p className="text-sm text-muted-foreground">
          Última atualização:{" "}
          {dayjs(data.updated_at).format("DD/MM/YYYY, HH:mm:ss")}
        </p>

        <div className="my-4 space-y-2">
          <h4 className="font-bold text-lg tracking-tighter">Banco de dados</h4>
          <ul className="text-sm space-y-2 pl-4">
            <StatusBadge
              label="Status"
              data={data.dependencies.database.status}
            />

            {data.dependencies.database.status === "HEALTHY" && (
              <>
                <DefaultBadge
                  label="Conexões Disponíveis"
                  data={data.dependencies.database.max_connections.toString()}
                />

                <DefaultBadge
                  label="Conexões Abertas"
                  data={data.dependencies.database.active_connections.toString()}
                />
                <DefaultBadge
                  label="Versão"
                  data={data.dependencies.database.postgres_version}
                />
                <LatencyBadges
                  latencyFirstValue={
                    data.dependencies.database
                      .first_query_duration_in_miliseconds
                  }
                  latencySecondValue={
                    data.dependencies.database
                      .second_query_duration_in_miliseconds
                  }
                  latencyThirdValue={
                    data.dependencies.database
                      .third_query_duration_in_miliseconds
                  }
                />
              </>
            )}
          </ul>
        </div>

        <div className="my-4 space-y-2">
          <h4 className="font-bold text-lg tracking-tighter">Servidor Web</h4>
          <ul className="text-sm space-y-2 pl-4">
            <StatusBadge
              label="Status"
              data={data.dependencies.webserver.status}
            />
            <DefaultBadge
              label="Provedor"
              data={data.dependencies.webserver.provider}
            />
            <DefaultBadge
              label="Ambiente"
              data={data.dependencies.webserver.environment}
            />

            {data.dependencies.webserver.last_commit_message_sha && (
              <>
                <DefaultBadge
                  label="Autor do último commit"
                  data={data.dependencies.webserver.last_commit_author}
                />
                <DefaultBadge
                  label="Mensagem do último commit"
                  data={emojify(
                    data.dependencies.webserver.last_commit_message
                      .substring(0, 25)
                      .concat("..."),
                  )}
                />

                <DefaultBadge
                  label="Hash do último commit"
                  data={data.dependencies.webserver.last_commit_message_sha.substring(
                    0,
                    10,
                  )}
                />
              </>
            )}
          </ul>
        </div>
      </>
    );
  }

  if (!isLoading && error) {
    servicesStatus = (
      <div className="rounded-md border w-fit my-4 border-red-500/50 px-4 py-3 text-red-600">
        <p className="font-semibold text-sm">
          <CircleAlertIcon
            className="mr-1 mb-0.5 inline-flex opacity-60"
            size={16}
            aria-hidden="true"
          />
          Ocorreu um erro ao buscar as informações.
        </p>
        <p className="text-sm">
          Caso o erro persista, entre em contato com o suporte.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold tracking-tighter">Status Page</h1>
      {servicesStatus}
    </div>
  );
}

function DefaultBadge({ label, data }: { label: string; data: string }) {
  return (
    <li className="font-semibold">
      {label}:{" "}
      <Badge variant="outline" className="gap-1.5">
        {data}
      </Badge>
    </li>
  );
}

function StatusBadge({ label, data }: { label: string; data: string }) {
  return (
    <li className="font-semibold">
      {label}:{" "}
      <Badge variant="outline" className="gap-1.5">
        <span
          data-is-healthy={data === "HEALTHY"}
          className="size-1.5 rounded-full data-[is-healthy=true]:bg-emerald-500 data-[is-healthy=true]:animate-pulse bg-red-500"
          aria-hidden="true"
        />
        {data}
      </Badge>
    </li>
  );
}

function LatencyBadges(props: {
  latencyFirstValue: number;
  latencySecondValue: number;
  latencyThirdValue: number;
}) {
  const latencyValues = props;

  const formattedLatencyValues = [];

  for (const latency in props) {
    const latencyInMs = latencyValues[latency];

    formattedLatencyValues.push(
      <Badge
        variant="outline"
        data-latency={latencyInMs}
        className={cn("mx-0.5", {
          "text-emerald-600 border-emerald-600 bg-emerald-100":
            latencyInMs <= 100,
          "text-orange-500 border-orange-500 bg-orange-100": latencyInMs > 100,
          "text-red-500 border-red-500 bg-red-100": latencyInMs >= 800,
        })}
      >
        {latencyInMs.toFixed()}ms
      </Badge>,
    );
  }

  return <li className="font-semibold">Latência: {formattedLatencyValues}</li>;
}
