// using mssql .....................................................................................
import path from "path";
import jwt from "jsonwebtoken";
import mysql from 'mysql2/promise';
import util from 'util';
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
let jwtSecret = process.env.JWT_SECRET;
let jwtExpiration = process.env.JWT_EXPIRATION;
const config = {
  host: host,
  user: user,
  password: password,
  database: database,
  port: port,
};

const FATSDB = {
  async home(req, res, next)
  {
    try {
      const connection = await mysql.createConnection(config);


      return res.status(200).send({ status: 200, data: "THIS IS CORE_MLM HOME PAGE" });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  async allgetprofile(req, res, next)
  {
    try {
      const connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute('SELECT * FROM profile');
      connection.end();

      return res.status(200).send({ data: rows });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  async user_profile(req, res, next)
  {
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
  async user_profileuserID(req, res, next)
  {
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
      const getprofileId = await connection.execute(getprofile, userIdAndprofileId);
      connection.end();

      return res.status(200).send({ status: 200, data: getprofileId[0][0] });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  },
  //post
  async addnewuser(req, res, next)
  {
    let connection;  // Declare connection outside the try block

    try {

      connection = await mysql.createConnection(config);
      await connection.connect();


      const { email } = req.body;
      const [rows] = await connection.execute(
        'SELECT * FROM user WHERE email = ?',
        [email]
      );
      if (rows.length > 0) {
        return res.status(400).json({ status: 400, message: "This user already exists", data: null });
      }
      const userInsert = 'INSERT INTO user (firstname, lastname, email, password, gender, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

      const values = [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.password,
        req.body.gender
      ];

      const result = await connection.execute(userInsert, values);
      const user_id = result[0].insertId
      const insertprofileuser_id = `INSERT INTO profile (user_id, created_at, updated_at) VALUES (${user_id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;

      await connection.execute(insertprofileuser_id, values);
      return res.status(201).json({ status: 201, message: "user has been created", data: { "userId": user_id } });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
  async UserLoginAuth(req, res, next)
  {
    try {
      let token;
      let tokenPayload;
      const { email, password } = req.body;
      const connection = await mysql.createConnection(config);

      // Query to check user credentials
      const [rows] = await connection.execute(
        'SELECT * FROM user WHERE email = ? AND password = ?',
        [email, password]
      );

      if (rows.length > 0) {
        // Fetch roles assigned to user based on email
        const [dataRows] = await connection.execute(
          'SELECT * FROM user WHERE email = ?',
          [email]
        );

        if (dataRows.length !== 0) {
          const assignedRoles = dataRows.map((item) => item.RoleID);
          tokenPayload = {
            userloginId: email,
            assignedRoles: assignedRoles,
          };
        } else {
          tokenPayload = {
            userloginId: email,
            assignedRoles: [],
          };
        }

        token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiration });

        if (!token) {
          return res.status(500).send({ success: false, message: 'Token not generated' });
        }

        res.status(200).send({ success: true, user: rows, token: token });
      } else {
        return res.status(400).send({ success: false, message: 'Invalid Credentials' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ success: false, message: 'Internal Server Error', error: err });
    }
  },
  async addnewcontact(req, res, next)
  {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const contactInsert = 'INSERT INTO contact (country, state, city, postcode, mobile, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

      const values = [
        req.body.country,
        req.body.state,
        req.body.city,
        req.body.postcode,
        req.body.mobile,
        req.body.name
      ];

      const result = await connection.execute(contactInsert, values);
      const contact_id = result[0].insertId;

      const updateProfileQuery = 'UPDATE profile SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, contact_id = ? WHERE user_id = ?';

      const userIdAndContactId = [contact_id, req.body.user_id];
      await connection.execute(updateProfileQuery, userIdAndContactId);

      return res.status(201).json({
        status: 201,
        message: "Contact has been created",
        data: {
          contactId: contact_id
        }
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
  async addnewroles(req, res, next)
  {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const contactInsert = 'INSERT INTO role (name,  created_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

      const values = [
        req.body.name,

      ];

      const result = await connection.execute(contactInsert, values);
      const role_id = result[0].insertId;

      const updateProfileQuery = 'UPDATE profile SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, role_id = ? WHERE user_id = ?';

      const userIdAndContactId = [role_id, req.body.user_id];

      await connection.execute(updateProfileQuery, userIdAndContactId);

      const rolesetting = 'INSERT INTO role_setting (role_id) VALUES (?)';

      const rolesettingvalues = [
        role_id
      ];

      await connection.execute(rolesetting, rolesettingvalues);

      const getprofile = 'SELECT * FROM profile WHERE user_id=? ';
      const userIdAndprofileId = [req.body.user_id];
      const getprofileId = await connection.execute(getprofile, userIdAndprofileId);

      const profile_ID = getprofileId[0][0].id
      return res.status(201).json({
        status: 201,
        message: "roles has been created",
        data: {
          RoleId: role_id,
          profile_ID: profile_ID
        }
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
  async addnewsetting(req, res, next)
  {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const contactInsert = 'INSERT INTO setting (name,  created_at, updated_at) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

      const values = [
        req.body.name,

      ];

      const result = await connection.execute(contactInsert, values);
      const setting_id = result[0].insertId;

      const updateProfileQuery = 'UPDATE role_setting SET setting_id = ? WHERE role_id = ?';
      const userIdAndContactId = [req.body.role_id, setting_id];
      await connection.execute(updateProfileQuery, userIdAndContactId);


      return res.status(201).json({
        status: 201,
        message: "settings has been created",
        data: {
          settingId: setting_id
        }
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
  async addnewpackage(req, res, next)
  {
    let connection;  // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert = 'INSERT INTO package (profile_id, name, description, amount, created_at, updated_at) VALUES (?, ?, ?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

      const values = [
        req.body.profile_id,
        req.body.name,
        req.body.description,
        req.body.amount
      ];

      const result = await connection.execute(userInsert, values);
      const packageId = result[0].insertId

      return res.status(201).json({ status: 201, message: "package has been created", data: { "packageId": packageId } });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  },
  async addnewupload_material(req, res, next)
  {
    let connection;  // Declare connection outside the try block

    try {
      connection = await mysql.createConnection(config);
      await connection.connect();

      const userInsert = 'INSERT INTO upload_material (profile_id, name, description, amount, created_at, updated_at) VALUES (?, ?, ?, ?,  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';

      const values = [
        req.body.profile_id,
        req.body.name,
        req.body.description,
        req.body.amount
      ];

      const result = await connection.execute(userInsert, values);
      const packageId = result[0].insertId

      return res.status(201).json({ status: 201, message: "package has been created", data: { "packageId": packageId } });
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    } finally {
      if (connection && connection.end) {
        connection.end();
      }
    }
  }

};
export default FATSDB;
