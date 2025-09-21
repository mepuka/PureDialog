import "dotenv/config";
import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, "dist");

// MIME types for static files
const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

// Get MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || "application/octet-stream";
}

// Serve static files
function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, {
      "Content-Type": mimeType,
      "Cache-Control": filePath.endsWith(".html")
        ? "no-cache"
        : "public, max-age=31536000",
    });
    res.end(data);
  });
}

// Handle API routes
function handleApiRoute(req, res, pathname) {
  // Health check endpoint
  if (pathname === "/api/health" || pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() })
    );
    return;
  }

  // Add more API routes here as needed
  // Example:
  // if (pathname === '/api/transcribe' && req.method === 'POST') {
  //   // Handle transcription API
  //   return;
  // }

  // API route not found
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "API endpoint not found" }));
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle API routes
  if (pathname.startsWith("/api/") || pathname === "/health") {
    handleApiRoute(req, res, pathname);
    return;
  }

  // Handle static files
  let filePath = path.join(DIST_DIR, pathname);

  // If requesting a directory, serve index.html
  if (pathname === "/" || pathname.endsWith("/")) {
    filePath = path.join(DIST_DIR, "index.html");
  }

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist - for SPA routing, serve index.html
      if (!pathname.startsWith("/api/")) {
        filePath = path.join(DIST_DIR, "index.html");
        serveStaticFile(res, filePath);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not found");
      }
    } else {
      // Check if it's a directory
      fs.stat(filePath, (err, stats) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal server error");
          return;
        }

        if (stats.isDirectory()) {
          // Serve index.html for directories
          filePath = path.join(filePath, "index.html");
        }

        serveStaticFile(res, filePath);
      });
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${DIST_DIR}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
