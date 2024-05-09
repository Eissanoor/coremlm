import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default {

  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION_IN_MINUTES,
    jwtSessionSecret: process.env.SESSION_SECRET,
  }
};
