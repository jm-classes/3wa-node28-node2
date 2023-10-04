export default function dashboard(req, res) {
  res.send(`<!DOCTYPE html>
  <html lang="en">

  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="//unpkg.com/semantic-ui@2.3.1/dist/semantic.min.css" type="text/css">
      <link rel="stylesheet" href="/css/styles.css">
      <title>Login</title>
  </head>

  <body>
      <div class="ui middle aligned center aligned grid">
          <div class="column">
              <div class="ui message header">
                  Welcome Loggued User !<br>
                  <a href="/panel/logout">Logout</a>
              </div>
          </div>
      </div>
  </body>

  </html>`);
}
