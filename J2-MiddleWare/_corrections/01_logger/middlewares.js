let counter = 0;
import chalk from 'chalk';

export function requestCounter(req, _, next) {
  req.counter = ++counter;
  next();
}

export function logger(req, res, next) {
  res.on('finish', () => {
    const method = req.method.toUpperCase();
    const path = req.path;
    const query = isNotEmpty(req.query) ? JSON.stringify(req.query) : '';
    const body = isNotEmpty(req.body) ? JSON.stringify(req.body) : '';
    const status = res.statusCode;

    console.log(`${req.counter}) ${chalk.yellow(status)} - ${chalk.red(method)} ${path} ${query} ${body}`);
  });

  next();
}

function isNotEmpty(obj) {
  return Object.keys(obj).length > 0;
}
