import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const paypalClient_id = process.env.paypalClient_id
const paypal_Securet = process.env.paypal_Securet
import paypal from 'paypal-rest-sdk'
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

paypal.configure({
    'mode': 'sandbox', // Use 'live' for production
    'client_id': paypalClient_id,
    'client_secret': paypal_Securet
  });
const paypalcontroller = {
 
    async addpayment_paypal(req, res, next) {
        try {
            const { name, email, amount } = req.body;
            const currency = "USD"; // Ensure the currency is in uppercase
      
            const create_payment_json = {
              "intent": "sale",
              "payer": {
                "payment_method": "paypal",
                "payer_info": {
                  "email": "eissaanoor@gmail.com"
                }
              },
              "redirect_urls": {
                "return_url": `http://localhost:7002/api/success?amount=100&currency=name`,
                "cancel_url": "http://localhost:7002/cancel"
              },
              "transactions": [{
                "item_list": {
                  "items": [{
                    "name": "name",
                    "sku": "item",
                    "price": 100,
                    "currency": currency,
                    "quantity": 1
                  }]
                },
                "amount": {
                  "currency": currency,
                  "total": "100"
                },
                "description": "This is the payment description."
              }]
            };
      
            paypal.payment.create(create_payment_json, (error, payment) => {
              if (error) {
                console.error(error);
                res.status(500).send(error);
              } else {
                console.log(payment);
                
                for (let i = 0; i < payment.links.length; i++) {
                  if (payment.links[i].rel === 'approval_url') {
                    return res.redirect(payment.links[i].href);
                  }
                }
                res.status(500).send('No approval URL found');
              }
            });
          } catch (error) {
          console.error(error);
          res.status(500).send(error);
        }
      },
    
      async success(req, res, next) {
        try {
          const payerId = req.query.PayerID;
          const paymentId = req.query.paymentId;
          const amount = req.query.amount;
          const currency = req.query.currency;
    
          const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
              "amount": {
                "currency": currency,
                "total": amount
              }
            }]
          };
    
          paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
            if (error) {
              console.error(error.response);
              res.status(500).send(error);
            } else {
              res.send('Success');
            }
          });
        } catch (error) {
          console.error(error);
          res.status(500).send(error);
        }
      }
}

export default paypalcontroller;