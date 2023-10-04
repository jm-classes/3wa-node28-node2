export default function home(req, res) {

  const errorMessage = req.query?.errorMessage

  res.send(
    `<!DOCTYPE html>
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
                ${errorMessage && `<div class="ui negative message">
                  <p>${errorMessage}</p>
                </div>` || ''}

                <h2 class="ui teal image header">
                    <div class="content">
                        Login
                    </div>
                </h2>
                <form action="/login" method="post" class="ui large form">
                    <div class="ui stacked segment">
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="user icon"></i>
                                <input type="text" name="login" placeholder="login">
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui left icon input">
                                <i class="lock icon"></i>
                                <input type="password" name="password" placeholder="Password">
                            </div>
                        </div>
                        <button class="ui fluid large teal submit button">Login</button>
                    </div>
                    <div class="ui error message"></div>
                </form>
            </div>
    </body>

    </html>`
  );
}
