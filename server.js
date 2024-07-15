import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import path from "path"
import  cors from 'cors';
import helmet from 'helmet';
import morgan from'morgan';
import Member from "./controllers/memberRegister.js"
const app = express();
const corsOptions = {
  origin: '*', 
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

const uploadFolder = path.join(process.cwd(), "uploads"); // get the absolute path to the uploads folder
app.use("/uploads", express.static(uploadFolder));
import FATSDB from "./router/router.js";
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors()); // Enable CORS
app.use(helmet()); // Set security-related HTTP headers
app.use(morgan('dev')); // HTTP request logger
app.use("/api", FATSDB);
app.get("/download-pdf",Member.download_pdf)
// Handle unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
const PORT = 7001;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});


// TODO: npm i cookie-parser and its setup  update verify token function in jwt_Token.js