import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import ejs from "ejs";
import pdf from 'pdfkit';
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
        "firstname",

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
        return res.status(400).json({
          status: 400,
          message: "An account with this email already exists.",
        });
      }

      let fileUrl = null;

      if (req.file) {
        const file = req.file;
        const { path, originalname, mimetype } = file;

        const timestampedFilename = `${originalname}_${Date.now()}`;
        const { data, error } = await supabase.storage
          .from("core") // Replace with your actual bucket name
          .upload(`uploads/${timestampedFilename}`, fs.createReadStream(path), {
            contentType: mimetype,
            cacheControl: "3600",
            upsert: false,
            duplex: "half",
          });

        if (error) {
          throw error;
        }

        fileUrl = `${supabaseUrl}/storage/v1/object/public/core/uploads/${timestampedFilename}`;
      }

      const contactInsert = `
        INSERT INTO member_register 
        (firstname, date_of_birth, gender, email, phone_no, user_name, user_id, password, bankSlipe, cashOnDelivery, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      const values = [
        req.body.firstname,
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
      const insertContactData = `INSERT INTO contact (created_at, updated_at) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      const [contactResult] = await connection.execute(insertContactData);
      const contact_id2 = contactResult.insertId;

      const bankdetails = `INSERT INTO bank_details (created_at, updated_at) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      const [bankdetailsresult] = await connection.execute(bankdetails);
      const bankdetailsresult_id = bankdetailsresult.insertId;
      const Paymnet = `INSERT INTO payment_detail (created_at, updated_at) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      const [Paymnetresult] = await connection.execute(Paymnet);
      const Paymnetresult_id = Paymnetresult.insertId;
      const insertProfileUser = `INSERT INTO profile (user_id, contact_id, bank_details_id,payment_detail_id,created_at, updated_at) VALUES (?, ?,?,?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      const profileValues = [
        contact_id,
        contact_id2,
        bankdetailsresult_id,
        Paymnetresult_id,
      ];
      await connection.execute(insertProfileUser, profileValues);
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
        email:memberData[0].email,
        password:memberData[0].password,
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
  // async get_all_Member(req, res, next) {
  //   try {
  //     const connection = await mysql.createConnection(config);

  //     // Fetch all members
  //     const [members] = await connection.execute("SELECT * FROM member_register");

  //     // Fetch user data for each member and combine results
  //     const memberDataPromises = members.map(async (member) => {
  //       // Remove password field from member object if it exists
  //       const { password, ...memberWithoutPassword } = member;

  //       // Fetch cart products for the current member
  //       const [cartProducts] = await connection.execute(
  //         "SELECT * FROM add_cart_product WHERE member_id = ?",
  //         [member.id] // assuming member.id is the member's ID
  //       );

  //       // Fetch product details for each cart product
  //       const cartProductDetailsPromises = cartProducts.map(async (cartProduct) => {
  //         const [productDetails] = await connection.execute(
  //           "SELECT * FROM product WHERE id = ?",
  //           [cartProduct.product_id] // assuming product_id is the product's ID
  //         );
  //         return {

  //           productDetails: productDetails[0], // Assuming there is always one product
  //         };
  //       });

  //       const cartProductsWithDetails = await Promise.all(cartProductDetailsPromises);

  //       // Fetch additional user details
  //       const [userDetails] = await connection.execute(
  //         "SELECT * FROM user WHERE id = ?",
  //         [member.user_id] // assuming member.user_id is the user's ID
  //       );

  //       // Remove password field from userDetails if it exists
  //       const { password: userPassword, ...userWithoutPassword } = userDetails[0];

  //       return {
  //         ...memberWithoutPassword,
  //         sponerDetails: userWithoutPassword,
  //         cartProducts: cartProductsWithDetails,
  //       };
  //     });

  //     const membersWithCartProductsAndUserDetails = await Promise.all(memberDataPromises);

  //     connection.end();

  //     return res.status(200).send({ data: membersWithCartProductsAndUserDetails });
  //   } catch (e) {
  //     console.error(e);
  //     return res.status(500).send("Internal Server Error");
  //   }
  // }
  // ,

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
      const { isVarified, password } = req.body;

      // Handle undefined values
      const isVarifiedValue =
        isVarified !== undefined ? isVarified : member.isVarified;

      // Update query and values
      const updateFields = [];
      const values = [];

      if (isVarified !== undefined) {
        updateFields.push("isVarified = ?");
        values.push(isVarifiedValue);
      }

      if (password) {
        updateFields.push("password = ?");
        values.push(password);
      }

      values.push(id);

      const memberUpdate = `
        UPDATE member_register 
        SET ${updateFields.join(", ")}
        WHERE id = ?
      `;

      await connection.execute(memberUpdate, values);

      const [updatedMemberRows] = await connection.execute(
        "SELECT * FROM member_register WHERE id = ?",
        [id]
      );

      const updatedMember = updatedMemberRows[0];

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: sendEmail, pass: sendEmailpassword },
      });

      let mailOptions;

      if (updatedMember.isVarified == 1) {
        console.log("user active show");
        mailOptions = {
          from: sendEmail,
          to: updatedMember.email,
          subject: "Congratulations!",
          html: "We are delighted to inform you that your account has been successfully approved. Welcome to our community!",
        };
      } else if (updatedMember.isVarified == 0) {
        console.log("user Blocked show");
        mailOptions = {
          from: sendEmail,
          to: updatedMember.email,
          subject: "COREMLM!",
          html: "Please be advised that your account has been blocked. This action was taken due to non-compliance with our policies. For more information, please get in touch with our support team.",
        };
      }

      if (mailOptions) {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({
              status: 500,
              success: false,
              message: "Failed to send email",
              data: null,
            });
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

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
  async get_all_Member(req, res, next) {
    try {
      const connection = await mysql.createConnection(config);

      // Fetch all members
      const [members] = await connection.execute(
        "SELECT * FROM member_register"
      );

      // Fetch user data for each member and combine results
      const memberDataPromises = members.map(async (member) => {
        // Remove password field from member object if it exists
        const { password, ...memberWithoutPassword } = member;

        // Fetch the first cart product for the current member
        const [cartProducts] = await connection.execute(
          "SELECT * FROM add_cart_product WHERE member_id = ? LIMIT 1",
          [member.id] // assuming member.id is the member's ID
        );

        let cartProductWithDetails = null;
        if (cartProducts.length > 0) {
          const cartProduct = cartProducts[0];
          const [productDetails] = await connection.execute(
            "SELECT * FROM product WHERE id = ?",
            [cartProduct.product_id] // assuming product_id is the product's ID
          );

          cartProductWithDetails = {
            productDetails: productDetails[0], // Assuming there is always one product
          };
        }

        // Fetch additional user details
        const [userDetails] = await connection.execute(
          "SELECT * FROM user WHERE id = ?",
          [member.user_id] // assuming member.user_id is the user's ID
        );

        let userWithoutPassword = null;
        if (userDetails.length > 0) {
          const { password: userPassword, ...user } = userDetails[0];
          userWithoutPassword = user;
        }

        return {
          ...memberWithoutPassword,
          SponserDetail: userWithoutPassword,
          cartProduct: cartProductWithDetails,
        };
      });

      const membersWithCartProductsAndUserDetails = await Promise.all(
        memberDataPromises
      );

      connection.end();

      return res
        .status(200)
        .send({ data: membersWithCartProductsAndUserDetails });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  async getUserbyId(req, res, next) {
    let connection;

    try {
      const connection = await mysql.createConnection(config);
      const { id } = req.query; // Assuming you pass the user ID as a URL parameter

      // Get user record by ID from user table
      const [userRows] = await connection.execute(
        "SELECT * FROM user WHERE id = ?",
        [id]
      );

      let user;
      if (userRows.length > 0) {
        user = userRows[0];
      } else {
        // If user not found in user table, check member_register table
        const [memberUserRows] = await connection.execute(
          "SELECT * FROM member_register WHERE id = ?",
          [id]
        );

        if (memberUserRows.length === 0) {
          return res.status(404).json({
            status: 404,
            message: "User not found",
          });
        }

        user = memberUserRows[0];
      }

      // Recursively get all members for a given user_id
      const getMembersRecursive = async (userId) => {
        const [members] = await connection.execute(
          "SELECT * FROM member_register WHERE user_id = ?",
          [userId]
        );
        for (const member of members) {
          member.subMembers = await getMembersRecursive(member.id);
        }
        return members;
      };

      const memberRegister = await getMembersRecursive(user.id);

      return res.status(200).json({
        status: 200,
        message: "User details retrieved successfully",
        data: {
          user,
          memberRegister,
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
  async getAlltree(req, res, next) {
    let connection;

    try {
      connection = await mysql.createConnection(config);

      // Get all users from the user table ordered by creation time
      const [userRows] = await connection.execute(
        "SELECT * FROM user ORDER BY id ASC"
      );

      if (userRows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No users found",
        });
      }

      // Recursively get all members for a given user_id
      const getMembersRecursive = async (userId) => {
        const [members] = await connection.execute(
          "SELECT * FROM member_register WHERE user_id = ?",
          [userId]
        );
        for (const member of members) {
          member.subMembers = await getMembersRecursive(member.id);
        }
        return members;
      };

      // Attach members to each user
      for (const user of userRows) {
        user.memberRegister = await getMembersRecursive(user.id);
      }

      return res.status(200).json({
        status: 200,
        message: "Users and members retrieved successfully",
        data: userRows,
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
  async download_pdf(req, res,next)  {
   
    const { email, password } = req.query;
    async function getUserByEmail(email) {
      const connection = await mysql.createConnection(config);
      const [rows] = await connection.execute('SELECT * FROM member_register WHERE email = ?', [email]);
      await connection.end();
      return rows.length > 0 ? rows[0] : null;
    }
    try {
      const user = await getUserByEmail(email);
      if (user && user.password === password) {
        // Generate PDF
        const doc = new pdf();
        let filename = 'cart.pdf';
        filename = encodeURIComponent(filename);
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');
  
        doc.text('Your Cart Details:', 50, 50);
        const cartData = await getCartData(user.id); // Implement this function to get cart data by user ID
        cartData.forEach((product, index) => {
          doc.text(`Product ${index + 1}: ${product.product_name}`, 50, 100 + index * 50);
          doc.text(`Price: ${product.product_price}`, 50, 120 + index * 50);
          doc.text(`Description: ${product.description}`, 50, 140 + index * 50);
        });
        async function getCartData(memberId) {
          const connection = await mysql.createConnection(config);
          const [cartProducts] = await connection.execute('SELECT * FROM add_cart_product WHERE member_id = ?', [memberId]);
          const productDetailsPromises = cartProducts.map(async (cartProduct) => {
            const [productDetails] = await connection.execute('SELECT * FROM product WHERE id = ?', [cartProduct.product_id]);
            return productDetails[0];
          });
          const productsWithDetails = await Promise.all(productDetailsPromises);
          await connection.end();
          return productsWithDetails;
        }
        doc.pipe(res);
        doc.end();
      } else {
        res.status(401).send('Invalid password');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  
};
export default MemberRegister;
