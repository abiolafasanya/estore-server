import dotenv from 'dotenv';
import { JwtPayload, Secret } from 'jsonwebtoken';

dotenv.config();

let mongo_uri;
// const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

switch (process.env.NODE_ENV) {
  case 'production':
    // mongo_uri = new URL('mongodb+srv://fastbeet:')
    // mongo_uri.pathname.concat(MONGO_PASSWORD as string)
    // mongo_uri.pathname.concat('@cluster0.uhz9qsw.mongodb.net')
    // mongo_uri.pathname.concat('tscapp')
    mongo_uri =process.env.MONGODB
    break;
  case 'development':
    mongo_uri = 'mongodb://localhost/eshop';
    break;

  default:
    break;
}

const MONGO_URI = mongo_uri;
const PORT = process.env.PORT || 5000;

const config = {
  mongo: {
    url: MONGO_URI || 'mongodb://localhost/eshop',
  },
  server: {
    port: PORT,
  },
  env: process.env.NODE_ENV,
  secret: {
    jwt: process.env.JWT_SECRET_KEY || 'secret',
    refresh: process.env.REFRESH_SECRET_KEY || 'refresh_secret',
    cookies: process.env.COOKIES_SECRET_KEY || 'cookies_secret',
  },
  secretKey: (secret: any) => {
    if (secret == null) {
      secret = process.env.JWT_SECRET_KEY;
    }
    const SECRET_KEY: Secret = secret;
    return SECRET_KEY;
  },
  client_redirect: process.env.CLIENT_REDIRECT || 'http://localhost:5173',
  email: process.env.EMAIL_USER, 
  email_pwd: process.env.EMAIL_PASS, 
  smtp_port: process.env.SMTP_PORT, 
  smtp_secure: process.env.SECURE,
  verify_url: process.env.VERIFIED_REDIRECT_URL 
};

export default config;