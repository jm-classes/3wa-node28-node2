import crypto from 'crypto';

export function sha256(value, secret = process.env.APP_HASH_SALT) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

/* export function compare(value, hash) {
  return sha256(value) === hash;
} */
