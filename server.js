const http = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOST || process.env.HOSTNAME || '0.0.0.0';

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, hostname, () => {
        // eslint-disable-next-line no-console
        console.log(`✅ Next server listening on http://${hostname}:${port}`);
      });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start Next server', err);
    process.exit(1);
  });
