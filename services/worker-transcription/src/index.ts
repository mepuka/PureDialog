import * as http from "node:http";

const port = Number(process.env.PORT ?? 8080);

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  if (!req.url) {
    res.writeHead(400, { "Content-Type": "application/json" }).end(
      JSON.stringify({ error: "missing url" })
    );
    return;
  }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" }).end(
      JSON.stringify({ status: "ok" })
    );
    return;
  }

  if (req.method === "POST" && req.url === "/pubsub") {
    res.writeHead(200, { "Content-Type": "application/json" }).end(
      JSON.stringify({ status: "ack" })
    );
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" }).end(
    JSON.stringify({ error: "not found" })
  );
});

server.listen(port, () => {
  console.log(`Transcription worker listening on port ${port}`);
});
