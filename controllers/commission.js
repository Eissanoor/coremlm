import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import ejs from "ejs";
import pdf from 'html-pdf';
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
const Commission = {
    async get_comission(req, res, next) {
        try {
          const connection = await mysql.createConnection(config);
          const [rows, fields] = await connection.execute("SELECT * FROM comission");
          connection.end();
    
          return res.status(200).send({ data: rows[0] });
        } catch (e) {
          console.error(e);
          return res.status(500).send("Internal Server Error");
        }
      },
      async update_comission(req, res, next) {
        try {
         
          const { serviceCharges, tax,transactionFee } = req.body;
          const connection = await mysql.createConnection(config);
          const [result] = await connection.execute(
            "UPDATE comission SET serviceCharges = ?, tax = ?, transactionFee = ? WHERE id = 1",
            [serviceCharges, tax, transactionFee]
          );
          connection.end();
      
         
          return res.status(200).json({ data: "comission updated successfully"});
        } catch (e) {
          console.error(e);
          return res.status(500).json("Internal Server Error");
        }

      },
      async get_compensation(req, res, next) {
        try {
          const connection = await mysql.createConnection(config);
          const [rows, fields] = await connection.execute("SELECT * FROM compensation");
          connection.end();
    
          return res.status(200).send({ data: rows[0] });
        } catch (e) {
          console.error(e);
          return res.status(500).send("Internal Server Error");
        }
      },
      async update_compensation(req, res, next) {
        try {
         
          const { levelComission, referelComission, } = req.body;
          const connection = await mysql.createConnection(config);
          const [result] = await connection.execute(
            "UPDATE compensation SET levelComission = ?, referelComission = ? WHERE id = 1",
            [levelComission, referelComission]
          );
          connection.end();
      
         
          return res.status(200).json({ data: "compensation updated successfully"});
        } catch (e) {
          console.error(e);
          return res.status(500).json("Internal Server Error");
        }

      },
      async get_level_commision(req, res, next) {
        try {
          const connection = await mysql.createConnection(config);
          const [rows, fields] = await connection.execute("SELECT * FROM level_commision");
          connection.end();
    
          return res.status(200).send({ data: rows[0] });
        } catch (e) {
          console.error(e);
          return res.status(500).send("Internal Server Error");
        }
      },
      async update_level_commision(req, res, next) {
        try {
         
          const { typeOfCommission, commissionCritaria, level_commision} = req.body;
          const connection = await mysql.createConnection(config);
          const [result] = await connection.execute(
            "UPDATE level_commision SET typeOfCommission = ?, commissionCritaria = ? , level_commision=? WHERE id = 1",
            [typeOfCommission, commissionCritaria, level_commision]
          );
          connection.end();
      
         
          return res.status(200).json({ data: "level_commision updated successfully"});
        } catch (e) {
          console.error(e);
          return res.status(500).json("Internal Server Error");
        }

      },
      async get_commission_base_on_geonology(req, res, next) {
        try {
          const connection = await mysql.createConnection(config);
          const [rows, fields] = await connection.execute("SELECT * FROM commission_base_on_geonology");
          connection.end();
    
          return res.status(200).send({ data: rows[0] });
        } catch (e) {
          console.error(e);
          return res.status(500).send("Internal Server Error");
        }
      },
      async update_commission_base_on_geonology(req, res, next) {
        try {
         
          const { level_1, level_2, level_3} = req.body;
          const connection = await mysql.createConnection(config);
          const [result] = await connection.execute(
            "UPDATE commission_base_on_geonology SET level_1 = ?, level_2 = ? , level_3=? WHERE id = 1",
            [level_1, level_2, level_3]
          );
          connection.end();
      
         
          return res.status(200).json({ data: "commission_base_on_geonology updated successfully"});
        } catch (e) {
          console.error(e);
          return res.status(500).json("Internal Server Error");
        }

      },
      async get_referel_commission(req, res, next) {
        try {
          const connection = await mysql.createConnection(config);
          const [rows, fields] = await connection.execute("SELECT * FROM referel_commission");
          connection.end();
    
          return res.status(200).send({ data: rows[0] });
        } catch (e) {
          console.error(e);
          return res.status(500).send("Internal Server Error");
        }
      },
      async update_referel_commission(req, res, next) {
        try {
         
          const { typeOfCommission, referel_commission_critaria, pack_1, pack_2 , pack_3} = req.body;
          const connection = await mysql.createConnection(config);
          const [result] = await connection.execute(
            "UPDATE referel_commission SET typeOfCommission = ?, referel_commission_critaria = ? , pack_1=?, pack_2=?, pack_3=?  WHERE id = 1",
            [typeOfCommission, referel_commission_critaria, pack_1,pack_2, pack_3]
          );
          connection.end();
      
         
          return res.status(200).json({ data: "referel_commission updated successfully"});
        } catch (e) {
          console.error(e);
          return res.status(500).json("Internal Server Error");
        }

      },
}
//
export default Commission;