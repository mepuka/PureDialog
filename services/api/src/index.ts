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

  res.writeHead(200, { "Content-Type": "application/json" }).end(
    JSON.stringify({ message: "PureDialog API placeholder" })
  );
});

server.listen(port, () => {
  console.log(`API service listening on port ${port}`);
});
