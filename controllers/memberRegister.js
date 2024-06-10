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
        "password",
      ];

      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res
            .status(400)
            .json({ status: 400, message: `${field} is required` });
        }
      }

      connection = await mysql.createConnection(config);
      await connection.connect();

      // Check if an account with the provided email already exists
      const emailCheckQuery =
        "SELECT COUNT(*) as count FROM member_register WHERE email = ?";
      const [emailCheckResult] = await connection.execute(emailCheckQuery, [
        req.body.email,
      ]);
      const emailExists = emailCheckResult[0].count > 0;

      if (emailExists) {
        return res
          .status(400)
          .json({
            status: 400,
            message: "An account with this email already exists.",
          });
      }

      let fileUrl = null;

      if (req.file) {
        const file = req.file;
        const { path, originalname, mimetype } = file;

        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
          .from("core") // Replace with your actual bucket name
          .upload(`uploads/${originalname}`, fs.createReadStream(path), {
            contentType: mimetype,
            cacheControl: "3600",
            upsert: false,
            duplex: "half",
          });

        if (error) {
          throw error;
        }

        fileUrl = `${supabaseUrl}/storage/v1/object/public/core/uploads/${originalname}`;
      }

      const contactInsert = `
        INSERT INTO member_register 
        (first_name, date_of_birth, gender, email, phone_no, user_name, user_id, password, bankSlipe, cashOnDelivery, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

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
        req.body.cashOnDelivery,
      ];

      const [result] = await connection.execute(contactInsert, values);
      const contact_id = result.insertId;

      // Retrieve the newly inserted member data
      const memberQuery = "SELECT * FROM member_register WHERE id = ?";
      const [memberData] = await connection.execute(memberQuery, [contact_id]);

      // Check if product_id array is provided in the request body
      if (
        Array.isArray(req.body.product_id) &&
        req.body.product_id.length > 0
      ) {
        const userId = req.body.user_id;
        const productIds = req.body.product_id;

        const productInsert = `
          INSERT INTO add_cart_product (user_id, product_id, member_id, created_at, updated_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

        const productPromises = productIds.map((productId) => {
          const productValues = [userId, productId, contact_id];
          return connection.execute(productInsert, productValues);
        });

        await Promise.all(productPromises);
      }

      // Retrieve related data from add_cart_product based on member_id
      const cartQuery = "SELECT * FROM add_cart_product WHERE member_id = ?";
      const [cartData] = await connection.execute(cartQuery, [contact_id]);

      // Get all product_ids from add_cart_product
      const cartProducts = cartData.map((product) => product.product_id);
      const cartProductsString = cartProducts.join(", ");

      // Retrieve product details from product table
      const productQuery = `SELECT * FROM product WHERE id IN (${cartProductsString})`;
      const [productData] = await connection.execute(productQuery);

      // Send an email to the user with the products in their cart
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: sendEmail, pass: sendEmailpassword },
      });

      // Render the EJS template
      const emailTemplatePath = path.join(__dirname, "../views/email.ejs");
      const emailHtml = await ejs.renderFile(emailTemplatePath, {
        username: req.body.user_name,
        member: memberData[0],
        cartData: productData,
      });

      const mailOptions = {
        from: sendEmail,
        to: req.body.email,
        subject: "Welcome! Verify Your Email Address",
        html: emailHtml, // Use the rendered HTML
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to send OTP email",
            data: null,
          });
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      return res.status(201).json({
        status: 201,
        message:
          "Member has been created. Products have been added to the cart. Please check your email.",
        data: { member: memberData[0], cartData: productData },
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ status: 500, message: e.message });
    } finally {
      if (connection && connection.end) {
        await connection.end();
      }
    }
  },
  async get_all_Member(req, res, next) {
    try {
      const connection = await mysql.createConnection(config);

      // Fetch all members
      const [members] = await connection.execute(
        "SELECT * FROM member_register"
      );

      // Fetch add_cart_product data for each member and combine results
      const memberDataPromises = members.map(async (member) => {
        // Fetch cart products for the current member
        const [cartProducts] = await connection.execute(
          "SELECT * FROM add_cart_product WHERE member_id = ?",
          [member.id] // assuming member.id is the member's ID
        );

        // Fetch product details for each cart product
        const cartProductDetailsPromises = cartProducts.map(
          async (cartProduct) => {
            const [productDetails] = await connection.execute(
              "SELECT * FROM product WHERE id = ?",
              [cartProduct.product_id] // assuming product_id is the product's ID
            );
            return {
              ...cartProduct,
              productDetails: productDetails[0], // Assuming there is always one product
            };
          }
        );

        const cartProductsWithDetails = await Promise.all(
          cartProductDetailsPromises
        );

        return {
          ...member,
          cartProducts: cartProductsWithDetails,
        };
      });

      const membersWithCartProducts = await Promise.all(memberDataPromises);

      connection.end();

      return res.status(200).send({ data: membersWithCartProducts });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  async updateMember(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const { id } = req.params;

      // Fetch the existing member to get the current data
      const [memberRows] = await connection.execute(
        "SELECT * FROM member_register WHERE id = ?",
        [id]
      );

      if (memberRows.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "Member Id not found" });
      }

      const member = memberRows[0];

      const { isVarified } = req.body;

      // Handle undefined values
      const isVarifiedValue =
        isVarified !== undefined ? isVarified : member.isVarified;

      const values = [isVarifiedValue, id];

      const memberUpdate = `
        UPDATE member_register 
        SET isVarified = ?
        WHERE id = ?
      `;

      await connection.execute(memberUpdate, values);
      const [updatedMemberRows] = await connection.execute(
        "SELECT * FROM member_register WHERE id = ?",
        [id]
      );
      const updatedMember = updatedMemberRows[0];

      return res.status(200).json({
        status: 200,
        message: "Member Register has been updated",
        data: updatedMember,
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
  async deleteMember(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const { id } = req.params;

      // Check if the member exists
      const [memberRows] = await connection.execute(
        "SELECT * FROM member_register WHERE id = ?",
        [id]
      );

      if (memberRows.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "Member Id not found" });
      }

      // Delete the member
      await connection.execute("DELETE FROM member_register WHERE id = ?", [
        id,
      ]);

      return res.status(200).json({
        status: 200,
        message: "Member has been deleted successfully",
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
export default MemberRegister;
