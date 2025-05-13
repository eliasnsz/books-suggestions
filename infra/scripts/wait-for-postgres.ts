import { exec, type ExecException } from "node:child_process";

checkPostgres();

async function checkPostgres() {
  exec(
    "docker exec leia-ai-database pg_isready --host localhost",
    handleReturn,
  );

  function handleReturn(
    _error: ExecException | null,
    stdout: string,
    _stderr: string,
  ) {
    const isAcceptingConnections =
      stdout.search("accepting connections") !== -1;

    if (!isAcceptingConnections) {
      twirlTimer;
      checkPostgres();
      return;
    }

    twirlTimer.close();
    process.stdout.clearLine(0);
    console.log("\n🟢 Postgres está pronto e aceitando conexões! \n");
  }
}

const twirlTimer = (() => {
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  return setInterval(() => {
    process.stdout.write(`\r${P[x++]}`);
    process.stdout.write(" Aguardando Postgres aceitar conexões...");
    x &= 3;
  }, 250);
})();
