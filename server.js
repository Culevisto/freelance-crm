import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// Serve the compiled frontend assets
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'dist')
});

const PORT = process.env.PORT || 3000;

server.use(middlewares);

// Mount the JSON server API on the /api route
// The router will now prefix all its routes with /api
server.use('/api', router);

// SPA Fallback: for any route not caught by /api or static files, serve index.html
server.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Production server is running on port ${PORT}`);
});
