import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import ejs from "ejs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
let sendEmailpassword = process.env.sendEmailpassword;
let sendEmail = process.env.sendEmail;
let host = process.env.host;
let user = process.env.user;
let password = process.env.password;
let database = process.env.database;
let port = process.env.port;
const config = {
  host: host,
  user: user,
  password: password,
  database: database,
  port: port,
};
const LogoCon = {
  async addnewLogo(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();
      let fileUrl = null;

      if (req.file) {
        const file = req.file;
        const { path, originalname, mimetype } = file;

        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
          .from("core") // Replace with your actual bucket name
          .upload(
            `uploads/${originalname + Date.now()}`,
            fs.createReadStream(path),
            {
              contentType: mimetype,
              cacheControl: "3600",
              upsert: false,
              duplex: "half",
            }
          );

        if (error) {
          throw error;
        }

        fileUrl = `${supabaseUrl}/storage/v1/object/public/core/uploads/${originalname}`;
      }

      const { id } = req.params; // Assuming you pass the logo ID as a URL parameter

      const logoUpdate =
        "UPDATE logo SET logo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";

      const values = [fileUrl, id];

      const [result] = await connection.execute(logoUpdate, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 404,
          message: "Logo not found",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Logo has been updated successfully",
        data: {
          logo: fileUrl,
        },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
  async getLogo(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const { id } = req.query; // Assuming you pass the logo ID as a URL parameter

      const [rows] = await connection.execute(
        "SELECT * FROM logo WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Logo not found",
        });
      }

      const logo = rows[0];

      return res.status(200).json({
        status: 200,
        message: "Logo details retrieved successfully",
        data: logo,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
};
export default LogoCon;
