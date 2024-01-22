import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
let jwtSecret = process.env.JWT_SECRET;
let jwtExpiration = process.env.JWT_EXPIRATION;
//  console.log(jwtSecret)

const t = {
  async createToken(data) {
    return new Promise(async (resolve, reject) => {
      jwt.sign(
        data ? data : {},
        jwtSecret,
        { expiresIn: jwtExpiration },
        (err, token) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          console.log(token);
          return resolve(token);
        }
      );
    });
  },

  async verifyToken(token) {
    const error = {};
    return new Promise(async (resolve, reject) => {
      await jwt.verify(token, jwtSecret, (err, info) => {
        if (err) {
          console.log(err);
          error.status = httpStatus.UNAUTHORIZED;
          error.message = err.message;
          return reject(error);
        }
        console.log(info);
        return resolve(info);
      });
    });
  },
};
export default t;
