import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"

const app = express();
const corsOptions = {
  exposedHeaders: ['Content-Length', 'Authorization'],
  origin: ['http://localhost:3000',
    'http://161.97.172.46:3000',
  ],
  credentials: true
};
app.use(cors());
app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));
// serve static files from the uploads directory
const uploadFolder = path.join(process.cwd(), "uploads"); // get the absolute path to the uploads folder
app.use("/uploads", express.static(uploadFolder));
import FATSDB from "./router/router.js";
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", FATSDB);
const PORT = 7001;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});


// TODO: npm i cookie-parser and its setup  update verify token function in jwt_Token.js