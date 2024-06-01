import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
import { log } from "console";
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
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
const MemberRegister = {

    async addnewMember(req, res, next) {
        let connection;
      
        try {
          // Ensure all required fields are present in the request body
          const requiredFields = [
            "first_name",
            "date_of_birth",
            "gender",
            "email",
            "phone_no",
            "user_name",
            "user_id",
            "password"
          ];
          for (const field of requiredFields) {
            if (!req.body[field]) {
              return res.status(400).json({
                status: 400,
                message: `${field} is required`,
              });
            }
          }
      
          connection = await mysql.createConnection(config);
          await connection.connect();
      
          const file = req.file;
          let fileUrl = null;
      
          if (file) {
            const { path, originalname, mimetype } = file;
      
            // Upload the file to Supabase storage
            const { data, error } = await supabase.storage
              .from('core') // Replace with your actual bucket name
              .upload(`uploads/${originalname}`, fs.createReadStream(path), {
                contentType: mimetype,
                cacheControl: '3600',
                upsert: false,
              });
      
            if (error) {
              throw error;
            }
      
            fileUrl = `${supabaseUrl}/storage/v1/object/public/core/uploads/${originalname}`;
          }
      
          const contactInsert = `
            INSERT INTO member_register 
            (first_name, date_of_birth, gender, email, phone_no, user_name, user_id, password, image, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
      
          const values = [
            req.body.first_name,
            req.body.date_of_birth,
            req.body.gender,
            req.body.email,
            req.body.phone_no,
            req.body.user_name,
            req.body.user_id,
            req.body.password,
            fileUrl,
          ];
      
          const [result] = await connection.execute(contactInsert, values);
          const contact_id = result.insertId;
      
          return res.status(201).json({
            status: 201,
            message: "Member has been created",
            data: {
              contactId: contact_id,
              image: fileUrl,
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

}
export default MemberRegister;
