import { createServer } from "http";
import { Registry } from "@coolcinema/registry";

const config = Registry.Ololo;
const PORT = config.port;

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      service: config.name,
      status: "OK",
      timestamp: new Date().toISOString(),
    }),
  );
});

server.listen(PORT, () => {
  console.log(`🚀 ${config.name} is running on port ${PORT}`);
});
