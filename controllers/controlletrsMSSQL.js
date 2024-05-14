// using mssql .....................................................................................
import path from "path";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });
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

      const values = [
        req.body.name,
        req.body.description,
      ];

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
};
export default FATSDB;
