import dotenv from "dotenv";

dotenv.config();

const HOSTNAME = process.env.APP_HOSTNAME;
const PORT = process.env.APP_PORT;

export default function home(req, res) {
  res.send(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Hello Express App!</title>
        <link rel="stylesheet" href="http://${HOSTNAME}:${PORT}/css/styles.css" type="text/css" />
      </head>
      <body>
        <h1>Hello Express App!</h1>
      </body>
    </html>`
  );
};
