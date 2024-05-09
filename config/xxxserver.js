
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
//const cors = require("cors");
const corsOptions = {
  exposedHeaders:['Content-Length', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Nzc1ODA4OTEsImV4cCI6MTY4MDE3Mjg5MX0.o2XtOIXy3veJhwGuhxwC7W_H-DSP5Mj1TOnVOptT-eA', 'Authorization'],
  origin:"http://gs1ksa.org:7001"
};
app.use(cors(corsOptions));

import FATSDB from "./router/router.js";
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", FATSDB);
const PORT =7001 ;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
