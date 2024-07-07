import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs"
import sendEmail from '../util/email.js' 
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

const Admin = {

  async adminLogin(req, res, next) {
    let connection;

    try {
        connection = await mysql.createConnection(config);
        await connection.connect();

        const { email, password } = req.body;
        let user;

        // Check if the user exists in the member_register table
        let userQuery = "SELECT * FROM member_register WHERE email = ?";
        let [userRows] = await connection.execute(userQuery, [email]);

        if (userRows.length > 0) {
            user = userRows[0];
        } else {
            // If not found in member_register, check the user table
            userQuery = "SELECT * FROM user WHERE email = ?";
            [userRows] = await connection.execute(userQuery, [email]);

            if (userRows.length > 0) {
                user = userRows[0];
            } else {
                return res.status(404).json({ status: 404, message: "User not found" });
            }
        }

        // Check if the account is verified
        if (user.isVarified == 0) {
            return res.status(403).json({
                status: 403,
                message: "Pending for approval",
            });
        }

        // Check if the password matches (assuming plain text password comparison for simplicity)
        // It's highly recommended to use bcrypt or another hashing algorithm in production
        if (user.password !== password) {
            return res.status(401).json({ status: 401, message: "Invalid password" });
        }

        // Check if the user is an admin
        if (user.isAdmin === 0) {
            return res.status(403).json({
                status: 403,
                message: "User is not an admin",
            });
        }

        // If everything is okay, generate a token or return user details
        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: {
                userId: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                gender: user.gender,
                created_at: user.created_at,
                updated_at: user.updated_at,
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
// Import the email utility

async  addnewadmin(req, res, next) {
  let connection; // Declare connection outside the try block

  try {
    connection = await mysql.createConnection(config);
    await connection.connect();

    const userInsert =
      "INSERT INTO user (firstname, lastname, email, password, gender, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

    const userValues = [
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.password,
      req.body.gender,
    ];

    const [userResult] = await connection.execute(userInsert, userValues);
    const user_id = userResult.insertId;

    const insertContactData = `INSERT INTO contact (created_at, updated_at) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    const [contactResult] = await connection.execute(insertContactData);
    const contact_id = contactResult.insertId;

    const bankdetails = `INSERT INTO bank_details (created_at, updated_at) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    const [bankdetailsresult] = await connection.execute(bankdetails);
    const bankdetailsresult_id = bankdetailsresult.insertId;

    const Paymnet = `INSERT INTO payment_detail (created_at, updated_at) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    const [Paymnetresult] = await connection.execute(Paymnet);
    const Paymnetresult_id = Paymnetresult.insertId;

    const insertProfileUser = `INSERT INTO profile (user_id, contact_id, bank_details_id,payment_detail_id,created_at, updated_at) VALUES (?, ?,?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

    const profileValues = [
      user_id,
      contact_id,
      bankdetailsresult_id,
      Paymnetresult_id,
    ];
    await connection.execute(insertProfileUser, profileValues);
    const random = Math.floor(Math.random() * 10000) + 1;

    const expireIn = new Date(Date.now() + 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const otpData = {
      email: req.body.email,
      otp: random,
      expireIn: expireIn,
    };

    // Insert OTP data into the database
    await connection.execute(
      "INSERT INTO otp (email, otp, expireIn) VALUES (?, ?, ?)",
      [otpData.email, otpData.otp, otpData.expireIn]
    );
    // Send welcome email
    await sendEmail(req.body.email, 'Welcome to Our Service', 'Thank you for registering!' , `this is your OTP ${random} `);

    return res.status(201).json({
      status: 201,
      message: "admin has been created",
      data: { userId: user_id },
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
async admineotpSend(req, res) {
  let connection;

  try {
    connection = await mysql.createConnection(config);
    await connection.connect();

    const email = req.body.email;

    // Check if the email exists in the user table
    const [userRows] = await connection.execute(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    // Check if the email exists in the member_register table if not found in user table
    const [memberRows] = userRows.length === 0 
      ? await connection.execute(
          "SELECT * FROM member_register WHERE email = ?",
          [email]
        )
      : [];

    if (userRows.length === 0 && memberRows.length === 0) {
      console.log("You are not a registered email");
      return res.status(404).json("You are not a registered email");
    }

    const random = Math.floor(Math.random() * 10000) + 1;

    const expireIn = new Date(Date.now() + 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const otpData = {
      email: email,
      otp: random,
      expireIn: expireIn,
    };

    // Insert OTP data into the database
    await connection.execute(
      "INSERT INTO otp (email, otp, expireIn) VALUES (?, ?, ?)",
      [otpData.email, otpData.otp, otpData.expireIn]
    );

    // Send email with the OTP
    await sendEmail(req.body.email, 'Welcome to Our Service' , `this is your OTP ${random} `);

    res.status(201).json("OTP sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  } finally {
    if (connection && connection.end) {
      connection.end();
    }
  }
},
async adminverifyOTP(req, res) {
  let connection;

  try {
    connection = await mysql.createConnection(config);
    await connection.connect();

    const { email, otp } = req.body;

    // Check if the OTP exists in the database for the provided email
    const [otpRows] = await connection.execute(
      "SELECT * FROM otp WHERE email = ? AND otp = ? AND expireIn > CURRENT_TIMESTAMP",
      [email, otp]
    );

    if (otpRows.length === 0) {
      console.log("Invalid or expired OTP");
      return res.status(400).json("Invalid or expired OTP");
    }

    // Check if the email exists in the user table
    const [userRows] = await connection.execute(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );

    // Check if the email exists in the member_register table
    const [memberRows] = await connection.execute(
      "SELECT * FROM member_register WHERE email = ?",
      [email]
    );

    if (userRows.length > 0) {
      // Update isAdmin to 1 in the user table
      await connection.execute(
        "UPDATE user SET isAdmin = 1 WHERE email = ?",
        [email]
      );
    } else if (memberRows.length > 0) {
      // Update isAdmin to 1 in the member_register table
      await connection.execute(
        "UPDATE member_register SET isAdmin = 1 WHERE email = ?",
        [email]
      );
    } else {
      console.log("Email not found in user or member_register tables");
      return res.status(400).json("Email not found in user or member_register tables");
    }

    res.status(200).json("OTP verified and isAdmin updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  } finally {
    if (connection && connection.end) {
      connection.end();
    }
  }
},

}

export default Admin;