import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const stripekey = process.env.Stripe_Securet


import Stripe from 'stripe';
const stripe = new Stripe(stripekey);



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

const Payment = {
async sendpayment(req,res,next) {

    const { amount, email, name, productId } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        receipt_email: email,
        description: `Payment for ${name} - Product ID: ${productId}`,
        metadata: {
          productId: productId,  // Include additional metadata if needed
        },
      });
  
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
    res.status(500).send({ error: error.message });
  }
},
async get_all_payment_enable(req, res, next) {
    try {
      const connection = await mysql.createConnection(config);
  
      // Query to get data from the 'payment_enable' table where the user_id matches the id in params
      const paymentEnableQuery = `
        SELECT * from payment_enable
      `;
      const [paymentEnableRows] = await connection.execute(paymentEnableQuery);
  
      connection.end();
  
      // Return the retrieved data
      return res.status(200).send({ payment_enable: paymentEnableRows });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e.message);
    }
  },
  async update_payment_enable(req, res, next) {
    try {
      const { id } = req.params; // Get the id from the request parameters
      const { paymentMethod, status } = req.body; // Get the new values from the request body
      const connection = await mysql.createConnection(config);
  
      // Query to update the 'payment_enable' table
      const updatePaymentEnableQuery = `
        UPDATE payment_enable
        SET paymentMethod = ?, status = ?
        WHERE id = ?
      `;
      const [result] = await connection.execute(updatePaymentEnableQuery, [paymentMethod, status, id]);
  
      connection.end();
  
      // Check if any rows were affected (i.e., if the update was successful)
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Payment record not found or no changes made" });
      }
  
      // Return a success message
      return res.status(200).send({ message: "Payment record updated successfully" });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e.message);
    }
  }

}
export default Payment;
