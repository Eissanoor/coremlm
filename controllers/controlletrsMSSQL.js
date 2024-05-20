// using mssql .....................................................................................
import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

import { createClient } from '@supabase/supabase-js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
import { log } from "console";
dotenv.config({ path: path.join(__dirname, "../.env") });
const supabaseUrl = 'https://hcrhtgjfjnwmyxrjoxkh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabasepass = process.env.supa
const supabase = createClient(supabaseUrl, supabaseKey,supabasepass)
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

const FATSDB = {
  async allgetprofile(req, res, next) {
    try {
      const connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute("SELECT * FROM profile");
      connection.end();

      return res.status(200).send({ data: rows });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  async user_profile(req, res, next) {
    try {
      const connection = await mysql.createConnection(config);

      const query = `
      SELECT * FROM profile
      INNER JOIN user AS user_profile ON profile.user_id = user_profile.id
      LEFT JOIN contact ON profile.contact_id = contact.id
      LEFT JOIN role ON profile.role_id = role.id

    `;

      const [rows, fields] = await connection.execute(query);

      connection.end();

      return res.status(200).send({ data: rows });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  async user_profileuserID(req, res, next) {
    try {
      const connection = await mysql.createConnection(config);

      const getprofile = `
      SELECT * FROM profile
      LEFT JOIN user AS user_profile ON profile.user_id = user_profile.id
      LEFT JOIN contact ON profile.contact_id = contact.id
      LEFT JOIN role ON profile.role_id = role.id
      WHERE profile.user_id = ?
    `;

      const userIdAndprofileId = [req.params.user_id];
      const getprofileId = await connection.execute(
        getprofile,
        userIdAndprofileId
      );
      connection.end();

      return res.status(200).send({ status: 200, data: getprofileId[0][0] });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  //-------------------------POST--------------------------------
  async addnewuser(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO user (firstname, lastname, email, password, gender, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.password,
        req.body.gender,
      ];

      const result = await connection.execute(userInsert, values);
      const user_id = result[0].insertId;
      const insertprofileuser_id = `INSERT INTO profile (user_id, created_at, updated_at) VALUES (${user_id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      await connection.execute(insertprofileuser_id, values);
      return res.status(201).json({
        status: 201,
        message: "user has been created",
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
  async updateUser(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userId = req.params.id;

      // Fetch existing user data
      const [existingUser] = await connection.execute(
        "SELECT * FROM user WHERE id = ?",
        [userId]
      );

      if (existingUser.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      const user = existingUser[0];

      // Use existing data if no new data is provided
      const updatedFirstName = req.body.firstname || user.firstname;
      const updatedLastName = req.body.lastname || user.lastname;
      const updatedGender = req.body.gender || user.gender;
      const updatedTwitter = req.body.twitter || user.twitter;
      const updatedFacebook = req.body.facebook || user.facebook;

      const userUpdate = `
        UPDATE user
        SET firstname = ?, lastname = ?, gender = ?, twitter = ?, facebook = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const values = [
        updatedFirstName,
        updatedLastName,
        updatedGender,
        updatedTwitter,
        updatedFacebook,
        userId,
      ];

      const [result] = await connection.execute(userUpdate, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      // Return the updated (or existing) user data
      return res.status(200).json({
        status: 200,
        message: "User has been updated successfully",
        data: {
          id: userId,
          firstname: updatedFirstName,
          lastname: updatedLastName,
          gender: updatedGender,
          twitter: updatedTwitter,
          facebook: updatedFacebook,
          updated_at: new Date(), // assuming the database updates the timestamp automatically
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
  async loginUser(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const { email, password } = req.body;

      // Check if the user exists
      const userQuery = "SELECT * FROM user WHERE email = ?";
      const [userRows] = await connection.execute(userQuery, [email]);

      if (userRows.length === 0) {
        return res.status(404).json({ status: 404, message: "User not found" });
      }

      const user = userRows[0];

      // Check if the password matches
      if (user.password !== password) {
        return res
          .status(401)
          .json({ status: 401, message: "Invalid password" });
      }

      // If everything is okay, generate a token or return user details
      // For simplicity, let's just return the user details for now
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
  async resetPassword(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const { email, newPassword } = req.body;

      // Check if the user exists
      const userQuery = "SELECT * FROM user WHERE email = ?";
      const [userRows] = await connection.execute(userQuery, [email]);

      if (userRows.length === 0) {
        return res.status(404).json({ status: 404, message: "User not found" });
      }

      const user = userRows[0];

      // Update the user's password in the database
      const updateUserPassword = "UPDATE user SET password = ? WHERE id = ?";
      await connection.execute(updateUserPassword, [newPassword, user.id]);

      return res
        .status(200)
        .json({ status: 200, message: "Password reset successful" });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
  async passwordchangeotpSend(req, res) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const email = req.body.email;

      // Check if the email exists in the database
      const [userRows] = await connection.execute(
        "SELECT * FROM user WHERE email = ?",
        [email]
      );

      if (userRows.length === 0) {
        console.log("You are not a registered email");
        return res.status(404).json("You are not a registered email");
      }

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

      // Send email with the OTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "eissaanoor@gmail.com",
          pass: "asqgbvuvawbtjnqz",
        },
      });

      const mailOptions = {
        from: "eissaanoor@gmail.com",
        to: email,
        subject: "Sending email using Node.js",
        text: `ChangePassword OTP ${random}`,
      };

      // Send email and wait for it to complete
      await transporter.sendMail(mailOptions);

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
  async verifyOTP(req, res) {
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

      // If OTP is valid, you can proceed with further actions like password change

      res.status(200).json("OTP verified successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
  async addnewcontact(req, res, next) {
    let connection;

    try {
      // Ensure all required fields are present in the request body
      const requiredFields = [
        "country",
        "state",
        "city",
        "postcode",
        "mobile",
        "name",
        "user_id",
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

      const contactInsert =
        "INSERT INTO contact (country, state, city, postcode, mobile, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [
        req.body.country,
        req.body.state,
        req.body.city,
        req.body.postcode,
        req.body.mobile,
        req.body.name,
      ];

      const result = await connection.execute(contactInsert, values);
      const contact_id = result[0].insertId;

      const updateProfileQuery =
        "UPDATE profile SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, contact_id = ? WHERE user_id = ?";

      const userIdAndContactId = [contact_id, req.body.user_id];
      await connection.execute(updateProfileQuery, userIdAndContactId);

      return res.status(201).json({
        status: 201,
        message: "Contact has been created",
        data: {
          contactId: contact_id,
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
  async updateContact(req, res, next) {
    let connection;

    try {
      // Ensure the ID parameter is present
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          status: 400,
          message: "ID is required",
        });
      }

      connection = await mysql.createConnection(config);
      await connection.connect();

      // Fetch existing contact data
      const [existingContact] = await connection.execute(
        "SELECT * FROM contact WHERE id = ?",
        [id]
      );

      if (existingContact.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "Contact not found",
        });
      }

      const contact = existingContact[0];

      // Use existing data if no new data is provided
      const updatedCountry = req.body.country || contact.country;
      const updatedState = req.body.state || contact.state;
      const updatedCity = req.body.city || contact.city;
      const updatedPostcode = req.body.postcode || contact.postcode;
      const updatedMobile = req.body.mobile || contact.mobile;
      const updatedName = req.body.name || contact.name;
      const updatedAddress1 = req.body.address1 || contact.address1;
      const updatedAddress2 = req.body.address2 || contact.address2;

      const contactUpdate = `
        UPDATE contact
        SET country = ?, state = ?, city = ?, postcode = ?, mobile = ?, name = ?, address1 = ?, address2 = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const values = [
        updatedCountry,
        updatedState,
        updatedCity,
        updatedPostcode,
        updatedMobile,
        updatedName,
        updatedAddress1,
        updatedAddress2,
        id,
      ];

      const [result] = await connection.execute(contactUpdate, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 404,
          message: "Contact not found",
        });
      }

      // Return the updated contact data
      return res.status(200).json({
        status: 200,
        message: "Contact has been updated successfully",
        data: {
          id: id,
          country: updatedCountry,
          state: updatedState,
          city: updatedCity,
          postcode: updatedPostcode,
          mobile: updatedMobile,
          name: updatedName,
          address1: updatedAddress1,
          address2: updatedAddress2,
          updated_at: new Date(), // assuming the database updates the timestamp automatically
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
  async addnewbank_details(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO bank_details (bank_name, branch_name, account_holder, account_number, IFSC_code, pan_number, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [
        req.body.bank_name || null,
        req.body.branch_name || null,
        req.body.account_holder || null,
        req.body.account_number || null,
        req.body.IFSC_code || null,
        req.body.pan_number || null,
      ];

      // Check for undefined values
      for (let i = 0; i < values.length; i++) {
        if (values[i] === undefined) {
          return res.status(400).json({
            status: 400,
            message: `Missing required field at index ${i}`,
          });
        }
      }

      const result = await connection.execute(userInsert, values);
      const bank_details_id = result[0].insertId;

      // Update the profile with the new bank_details_id based on user_id
      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).json({
          status: 400,
          message: "Missing required field: user_id",
        });
      }

      const updateProfileQuery =
        "UPDATE profile SET bank_details_id = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?";

      await connection.execute(updateProfileQuery, [bank_details_id, userId]);

      return res.status(201).json({
        status: 201,
        message: "Bank details have been created and profile updated",
        data: { bank_details_id: bank_details_id },
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
  async addnewpayment_detail(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO payment_detail (payment_detail_name, payment_detail_method, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [
        req.body.payment_detail_name || null,
        req.body.payment_detail_method || null,
      ];

      // Check for undefined values
      for (let i = 0; i < values.length; i++) {
        if (values[i] === undefined) {
          return res.status(400).json({
            status: 400,
            message: `Missing required field at index ${i}`,
          });
        }
      }

      const result = await connection.execute(userInsert, values);
      const payment_details_id = result[0].insertId;

      // Update the profile with the new payment_details_id based on user_id
      const userId = req.body.user_id;
      if (!userId) {
        return res.status(400).json({
          status: 400,
          message: "Missing required field: user_id",
        });
      }

      const updateProfileQuery =
        "UPDATE profile SET payment_detail_id = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?";

      await connection.execute(updateProfileQuery, [payment_details_id, userId]);

      return res.status(201).json({
        status: 201,
        message: "payment details have been created and profile updated",
        data: { payment_details_id: payment_details_id },
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
  async addnewroles(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const contactInsert =
        "INSERT INTO role (name,  created_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [req.body.name];

      const result = await connection.execute(contactInsert, values);
      const role_id = result[0].insertId;

      const updateProfileQuery =
        "UPDATE profile SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, role_id = ? WHERE user_id = ?";

      const userIdAndContactId = [role_id, req.body.user_id];

      await connection.execute(updateProfileQuery, userIdAndContactId);

      const rolesetting = "INSERT INTO role_setting (role_id) VALUES (?)";

      const rolesettingvalues = [role_id];

      await connection.execute(rolesetting, rolesettingvalues);

      const getprofile = "SELECT * FROM profile WHERE user_id=? ";
      const userIdAndprofileId = [req.body.user_id];
      const getprofileId = await connection.execute(
        getprofile,
        userIdAndprofileId
      );

      const profile_ID = getprofileId[0][0].id;
      return res.status(201).json({
        status: 201,
        message: "roles has been created",
        data: {
          RoleId: role_id,
          profile_ID: profile_ID,
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
  async addnewsetting(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const contactInsert =
        "INSERT INTO setting (name, created_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
      const values = [req.body.name];
      const result = await connection.execute(contactInsert, values);
      const setting_id = result[0].insertId;

      const updateProfileQuery =
        "UPDATE role_setting SET setting_id = ? WHERE role_id = ?";
      const userIdAndContactId = [setting_id, req.body.role_id]; // Updated order of parameters
      await connection.execute(updateProfileQuery, userIdAndContactId);

      return res.status(201).json({
        status: 201,
        message: "Settings have been created",
        data: {
          settingId: setting_id,
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
  async addnewpackage(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO package (profile_id, name, description, amount, created_at, updated_at) VALUES (?, ?, ?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [
        req.body.profile_id,
        req.body.name,
        req.body.description,
        req.body.amount,
      ];

      const result = await connection.execute(userInsert, values);
      const packageId = result[0].insertId;

      return res.status(201).json({
        status: 201,
        message: "package has been created",
        data: { packageId: packageId },
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
  async addnewactivitylog(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO activity_log (profile_id, description, created_at, updated_at) VALUES (?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [req.body.profile_id, req.body.description];

      const result = await connection.execute(userInsert, values);
      const activitylogId = result[0].insertId;

      return res.status(201).json({
        status: 201,
        message: "activitylog has been created",
        data: { activitylogId: activitylogId },
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
  async addnewtransaction_method(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO transaction_method (name, description, created_at, updated_at) VALUES (?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [req.body.name, req.body.description];

      const result = await connection.execute(userInsert, values);
      const transaction_methodId = result[0].insertId;

      const transaction_Insert =
        "INSERT INTO transaction (profile_id, transaction_method_id,amount, created_at, updated_at) VALUES (?, ?,?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const transaction_values = [
        req.body.profile_id,
        req.body.amount,
        transaction_methodId,
      ];

      // Insert transaction
      await connection.execute(transaction_Insert, transaction_values);
      const transactionId = result[0].insertId;
      return res.status(201).json({
        status: 201,
        message: "Transaction has been created",
        data: { transactionId: transactionId },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
  async addnewtransaction_category(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO transaction_category (name, description, created_at, updated_at) VALUES (?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [
        req.body.transaction_category_name,
        req.body.transaction_category_description,
      ];

      const result = await connection.execute(userInsert, values);
      const transaction_category_Id = result[0].insertId;

      const transaction_type_Insert =
        "INSERT INTO transaction_type (transaction_category_id,name, description, created_at, updated_at) VALUES (?, ?,?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const transaction_type_values = [
        transaction_category_Id,
        req.body.transaction_type_name,
        req.body.transaction_type_description,
      ];

      const transaction_type_result = await connection.execute(
        transaction_type_Insert,
        transaction_type_values
      );
      const transaction_type_Id = transaction_type_result[0].insertId;

      const transaction_type_Update =
        "UPDATE transaction SET transaction_category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE profile_id = ?";

      const transactionUpdateValue = [
        transaction_category_Id,

        req.body.profile_id, // Assuming you have the profile_id value
      ];

      const transactionUpdateresult = await connection.execute(
        transaction_type_Update,
        transactionUpdateValue
      );
      return res.status(201).json({
        status: 201,
        message: "Transaction category has been created",
        data: { transaction_category_Id: transaction_category_Id },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
  async addnewtax(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert =
        "INSERT INTO taxes ( name, description,  created_at, updated_at) VALUES (?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

      const values = [req.body.name, req.body.description];

      const result = await connection.execute(userInsert, values);
      const taxesId = result[0].insertId;
      const transaction_type_Update =
        "UPDATE transaction SET taxes_id = ?, updated_at = CURRENT_TIMESTAMP WHERE profile_id = ?";

      const transactionUpdateValue = [
        taxesId,

        req.body.profile_id, // Assuming you have the profile_id value
      ];

      const transactionUpdateresult = await connection.execute(
        transaction_type_Update,
        transactionUpdateValue
      );
      return res.status(201).json({
        status: 201,
        message: "taxes has been created",
        data: { taxesId: taxesId },
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
  async addnewmedia(req, res, next) {
    let connection; // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      if (!req.file) {
        return res.status(400).json({
          status: 400,
          message: "No file uploaded",
        });
      }
  
      const { file } = req;
      
      const fileName = file.originalname; // Use the original filename without any prefix
    const fileType = file.mimetype
      const options = {
        cacheControl: '3600',
        upsert: false,
        contentType: file.mimetype, // Set the correct MIME type
      };
      const { data, error } = await supabase.storage.from('test_bucket').upload(fileName, file.buffer, options);
      if (error) {
        throw error;
      }

      const fileUrl = `${supabaseUrl}/storage/v1/object/public/test_bucket/${fileName}`;

 


       // Assuming `profile_id`, `title`, `description`, `file_type`, and `visibility` come from the request body
    const { profile_id, title, description,  visibility } = req.body;
    const values = [profile_id, title, description, fileType, fileUrl, new Date(), visibility];

    const userInsert = `
      INSERT INTO upload_material (profile_id, title, description, file_type, file_path, upload_date, visibility, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const [result] = await connection.execute(userInsert, values);
    const mediaID = result.insertId;
  
      return res.status(201).json({
        status: 201,
        message: "Media has been created",
        data: { mediaID: mediaID,fileUrl:fileUrl },
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
export default FATSDB;
