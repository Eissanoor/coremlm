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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
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
          return res.status(500).json(e.message);
        }

      },
      async gettotalearnbyId(req, res, next) {
        let connection;
    
        try {
          connection = await mysql.createConnection(config);
          const { id } = req.query; // Assuming you pass the user ID as a URL parameter
  
          // Get user record by ID from user table
          const [userRows] = await connection.execute(
              "SELECT id FROM user WHERE id = ?",
              [id]
          );
  
          let user;
          if (userRows.length > 0) {
              user = userRows[0];
          } else {
              // If user not found in user table, check member_register table
              const [memberUserRows] = await connection.execute(
                  "SELECT id FROM member_register WHERE id = ?",
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
  
          // Recursively get all members' ids and their products for a given user_id
          const getMembersRecursive = async (userId) => {
              const [members] = await connection.execute(
                  "SELECT id FROM member_register WHERE user_id = ?",
                  [userId]
              );
  
              let totalProductPrice = 0;
              const memberDetails = [];
  
              for (const member of members) {
                  // Fetch products for each member and join with product table to get product details
                  const [productRows] = await connection.execute(
                      `SELECT p.*, p.product_price FROM add_cart_product acp
                      JOIN product p ON acp.product_id = p.id
                      WHERE acp.member_id = ?`,
                      [member.id]
                  );
  
                  const memberProductPrice = productRows.reduce((sum, product) => sum + product.product_price, 0);
                  totalProductPrice += memberProductPrice;
  
                  const subMembers = await getMembersRecursive(member.id);
                  totalProductPrice += subMembers.totalProductPrice;
  
                  memberDetails.push({
                      id: member.id,
                      products: productRows,
                      subMembers: subMembers.memberDetails,
                  });
              }
  
              return { memberDetails, totalProductPrice };
          };
  
          const { memberDetails, totalProductPrice } = await getMembersRecursive(user.id);
  
          return res.status(200).json({
              status: 200,
              message: "User details and products retrieved successfully",
              data: {
                  id: user.id,
                  memberRegister: memberDetails,
                  totalProductPrice: totalProductPrice,
              },
          });
      }catch (e) {
            console.error(e);
            return res.status(500).json(e.message);
        } finally {
            if (connection && connection.end) {
                connection.end();
            }
        }
    },
      async getcommissionbyId(req, res, next) {
        let connection;
    
        try {
          connection = await mysql.createConnection(config);
          const { id } = req.query; // Assuming you pass the user ID as a URL parameter
  
          // Get user record by ID from user table
          const [userRows] = await connection.execute(
              "SELECT id FROM user WHERE id = ?",
              [id]
          );
  
          let user;
          if (userRows.length > 0) {
              user = userRows[0];
          } else {
              // If user not found in user table, check member_register table
              const [memberUserRows] = await connection.execute(
                  "SELECT id FROM member_register WHERE id = ?",
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
  
          // Recursively get all members' ids and their products for a given user_id
          const getMembersRecursive = async (userId) => {
              const [members] = await connection.execute(
                  "SELECT id FROM member_register WHERE user_id = ?",
                  [userId]
              );
  
              let totalProductPrice = 0;
              let totalMembersCount = members.length;
              const memberDetails = [];
              let subMemberCount = 0;
  
              for (const member of members) {
                  // Fetch products for each member and join with product table to get product details
                  const [productRows] = await connection.execute(
                      `SELECT p.*, p.product_price FROM add_cart_product acp
                      JOIN product p ON acp.product_id = p.id
                      WHERE acp.member_id = ?`,
                      [member.id]
                  );
  
                  const memberProductPrice = productRows.reduce((sum, product) => sum + product.product_price, 0);
                  totalProductPrice += memberProductPrice;
  
                  const subMembers = await getMembersRecursive(member.id);
                  totalProductPrice += subMembers.totalProductPrice;
                  totalMembersCount += subMembers.totalMembersCount;
                  subMemberCount += subMembers.totalMembersCount;
  
                  memberDetails.push({
                      id: member.id,
                      products: productRows,
                      subMembers: subMembers.memberDetails,
                  });
              }
  
              return { memberDetails, totalProductPrice, totalMembersCount, subMemberCount };
          };
  
          const [rows] = await connection.execute("SELECT * FROM comission");
          console.log(rows[0].serviceCharges);
          const { serviceCharges, transactionFee, tax } = rows[0];
  const percent = serviceCharges+ transactionFee+ tax;
  console.log(percent);
          const { memberDetails, totalProductPrice, totalMembersCount, subMemberCount } = await getMembersRecursive(user.id);
  const commissionFind=  percent/100;
  const secondstep = 1+commissionFind
  

  const totalSolidEarn = totalProductPrice/secondstep;
  const formattedNumber = totalSolidEarn.toFixed(2);
          return res.status(200).json({
              status: 200,
              message: "User details and products retrieved successfully",
              data: {
                  id: user.id,
                  memberRegister: memberDetails,
                  totalProductPrice,
                  totalMembersCount,
                  subMemberCount,
                  earnWithCommission: formattedNumber
              },
          });
      }catch (e) {
            console.error(e);
            return res.status(500).json(e.message);
        } finally {
            if (connection && connection.end) {
                connection.end();
            }
        }
    },
    
}
//
export default Commission;