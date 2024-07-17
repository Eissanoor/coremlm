import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
let host = process.env.host;

let user = process.env.user;
let password = process.env.password;
let database = process.env.database;
let sendEmailpassword = process.env.sendEmailpassword;
let sendEmail = process.env.sendEmail;
let port = process.env.port;
const config = {
  host: host,
  user: user,
  password: password,
  database: database,
  port: port,
};
const Email = {
    async addNewMessage(req, res, next) {
        let connection;
    
        try {
            connection = await mysql.createConnection(config);
            await connection.connect();
            
            const { sender_id, receiver_id, subject, body } = req.body;
    
            // Ensure all necessary fields are provided
            if (!sender_id || !receiver_id || !subject || !body) {
                return res.status(400).json({ status: 400, message: "Missing required fields" });
            }
    
            // Check if receiver_id exists in user or member_register table
            const checkUserQuery = "SELECT email FROM user WHERE id = ?";
            const checkMemberQuery = "SELECT email FROM member_register WHERE id = ?";
    
            let email = null;
            
            // First, check in the user table
            let [userRows] = await connection.execute(checkUserQuery, [receiver_id]);
            
            if (userRows.length > 0) {
                email = userRows[0].email;
            } else {
                // If not found in user table, check in the member_register table
                let [memberRows] = await connection.execute(checkMemberQuery, [receiver_id]);
                
                if (memberRows.length > 0) {
                    email = memberRows[0].email;
                } else {
                    // If receiver_id not found in either table, handle the error
                    return res.status(404).json({ status: 404, message: "Receiver not found" });
                }
            }
    
            // Insert the message into the inbox table
            const insertInboxMessageQuery = `
                INSERT INTO email_inbox (sender_id, receiver_id, subject, body, is_read, received_at)
                VALUES (?, ?, ?, ?, false, NOW())
            `;
    
            const [inboxResult] = await connection.execute(insertInboxMessageQuery, [sender_id, receiver_id, subject, body]);
    
            // Insert the message into the sent table
            const insertSentMessageQuery = `
                INSERT INTO email_send (sender_id, receiver_id, subject, body, sent_at)
                VALUES (?, ?, ?, ?, NOW())
            `;
    
            const [sentResult] = await connection.execute(insertSentMessageQuery, [sender_id, receiver_id, subject, body]);
    
            // Fetch the newly added message from the inbox table
            const [newInboxMessageRows] = await connection.execute(
                "SELECT * FROM email_inbox WHERE id = ?",
                [inboxResult.insertId]
            );
    
            const newInboxMessage = newInboxMessageRows[0];
    
            // Fetch the newly added message from the sent table
            const [newSentMessageRows] = await connection.execute(
                "SELECT * FROM email_send WHERE id = ?",
                [sentResult.insertId]
            );
    
            const newSentMessage = newSentMessageRows[0];
    
            // Set up the email transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: sendEmail, pass: sendEmailpassword },
            });
    
            const mailOptions = {
                from: sendEmail,
                to: email, // Use the retrieved email address
                subject: "New Message Notification",
                html: `You have received a new message from user ${sender_id} with the subject: ${subject}. Please check your inbox for more details.`,
            };
    
            // Send the notification email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Failed to send email:", error);
                    // Handle email sending failure
                } else {
                    console.log("Email sent:", info.response);
                }
            });
    
            return res.status(201).json({
                status: 201,
                message: "New message has been added to the inbox and sent items",
                inboxData: newInboxMessage,
                sentData: newSentMessage,
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
    async getInboxMessages(req, res, next) {
        let connection;
    
        try {
            connection = await mysql.createConnection(config);
            await connection.connect();
    
            const { receiver_id } = req.query;
    
            // Ensure receiver_id is provided
            if (!receiver_id) {
                return res.status(400).json({ status: 400, message: "Missing required query parameters" });
            }
    
            const query = `
                SELECT * FROM email_inbox 
                WHERE receiver_id = ?
                ORDER BY received_at DESC
            `;
    
            const [rows] = await connection.execute(query, [receiver_id]);
    
            // Function to get sender details
            const getSenderDetails = async (sender_id) => {
                const userQuery = "SELECT id, email, CONCAT(firstname, ' ', lastname) as user_name,image, 'user' as type FROM user WHERE id = ?";
                const memberQuery = "SELECT id, email,user_name, image, 'member' as type FROM member_register WHERE id = ?";
    
                let [userRows] = await connection.execute(userQuery, [sender_id]);
                if (userRows.length > 0) {
                    return userRows[0];
                }
    
                let [memberRows] = await connection.execute(memberQuery, [sender_id]);
                if (memberRows.length > 0) {
                    return memberRows[0];
                }
    
                return null;
            };
    
            // Add sender details to each message
            for (let message of rows) {
                const senderDetails = await getSenderDetails(message.sender_id);
                if (senderDetails) {
                    message.sender = senderDetails;
                }
            }
    
            return res.status(200).json({
                status: 200,
                message: "Inbox messages retrieved successfully",
                data: rows
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json(e.message);
        } finally {
            if (connection && connection.end) {
                connection.end();
            }
        }
    },
    async getSentMessages(req, res, next) {
        let connection;
    
        try {
            connection = await mysql.createConnection(config);
            await connection.connect();
    
            const { sender_id } = req.query;
    
            // Ensure sender_id is provided
            if (!sender_id) {
                return res.status(400).json({ status: 400, message: "Missing required query parameters" });
            }
    
            const query = `
                SELECT * FROM email_send 
                WHERE sender_id = ?
                ORDER BY sent_at DESC
            `;
    
            const [rows] = await connection.execute(query, [sender_id]);
    
            // Function to get receiver details
            const getReceiverDetails = async (receiver_id) => {
                const userQuery = "SELECT id, email, CONCAT(firstname, ' ', lastname) as user_name, image, 'user' as type FROM user WHERE id = ?";
                const memberQuery = "SELECT id, email, user_name, image, 'member' as type FROM member_register WHERE id = ?";
    
                let [userRows] = await connection.execute(userQuery, [receiver_id]);
                if (userRows.length > 0) {
                    return userRows[0];
                }
    
                let [memberRows] = await connection.execute(memberQuery, [receiver_id]);
                if (memberRows.length > 0) {
                    return memberRows[0];
                }
    
                return null;
            };
    
            // Add receiver details to each message
            for (let message of rows) {
                const receiverDetails = await getReceiverDetails(message.receiver_id);
                if (receiverDetails) {
                    message.receiver = receiverDetails;
                }
            }
    
            return res.status(200).json({
                status: 200,
                message: "Sent messages retrieved successfully",
                data: rows
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json(e.message);
        } finally {
            if (connection && connection.end) {
                connection.end();
            }
        }
    },
    async getSentOneMessages(req, res, next) {
        let connection;
    
        try {
            connection = await mysql.createConnection(config);
            await connection.connect();
    
            const { receiver_id, sender_id } = req.query;
    
            // Ensure both receiver_id and sender_id are provided
            if (!receiver_id || !sender_id) {
                return res.status(400).json({ status: 400, message: "Missing required query parameters" });
            }
    
            const query = `
                SELECT * FROM email_send
                WHERE receiver_id = ? AND sender_id = ?
                ORDER BY sent_at DESC
            `;
    
            const [rows] = await connection.execute(query, [receiver_id, sender_id]);
    
            // Function to get receiver details
            const getReceiverDetails = async (receiver_id) => {
                const userQuery = "SELECT id, email, CONCAT(firstname, ' ', lastname) as user_name, image, 'user' as type FROM user WHERE id = ?";
                const memberQuery = "SELECT id, email, user_name, image, 'member' as type FROM member_register WHERE id = ?";
    
                let [userRows] = await connection.execute(userQuery, [receiver_id]);
                if (userRows.length > 0) {
                    return userRows[0];
                }
    
                let [memberRows] = await connection.execute(memberQuery, [receiver_id]);
                if (memberRows.length > 0) {
                    return memberRows[0];
                }
    
                return null;
            };
    
            // Add receiver details to each message
            for (let message of rows) {
                const receiverDetails = await getReceiverDetails(message.receiver_id);
                if (receiverDetails) {
                    message.receiver = receiverDetails;
                }
            }
    
            return res.status(200).json({
                status: 200,
                message: "Sent messages retrieved successfully",
                data: rows
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json(e.message);
        } finally {
            if (connection && connection.end) {
                connection.end();
            }
        }
    },
   async getInboxOneMessages(req, res, next) {
        let connection;
    
        try {
            connection = await mysql.createConnection(config);
            await connection.connect();
    
            const { receiver_id, sender_id } = req.query;
    
            // Ensure both receiver_id and sender_id are provided
            if (!receiver_id || !sender_id) {
                return res.status(400).json({ status: 400, message: "Missing required query parameters" });
            }
    
            const query = `
                SELECT * FROM email_inbox 
                WHERE receiver_id = ? AND sender_id = ?
                ORDER BY received_at DESC
            `;
    
            const [rows] = await connection.execute(query, [receiver_id, sender_id]);
    
            // Function to get sender details
            const getSenderDetails = async (sender_id) => {
                const userQuery = "SELECT id, email, CONCAT(firstname, ' ', lastname) as user_name, image, 'user' as type FROM user WHERE id = ?";
                const memberQuery = "SELECT id, email, user_name, image, 'member' as type FROM member_register WHERE id = ?";
    
                let [userRows] = await connection.execute(userQuery, [sender_id]);
                if (userRows.length > 0) {
                    return userRows[0];
                }
    
                let [memberRows] = await connection.execute(memberQuery, [sender_id]);
                if (memberRows.length > 0) {
                    return memberRows[0];
                }
    
                return null;
            };
    
            // Add sender details to each message
            for (let message of rows) {
                const senderDetails = await getSenderDetails(message.sender_id);
                if (senderDetails) {
                    message.sender = senderDetails;
                }
            }
    
            return res.status(200).json({
                status: 200,
                message: "Inbox messages retrieved successfully",
                data: rows
            });
        } catch (e) {
            console.error(e);
            return res.status(500).json(e.message);
        } finally {
            if (connection && connection.end) {
                connection.end();
            }
        }
    }

}
export default Email;