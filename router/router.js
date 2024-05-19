import express from "express";
const router = express.Router();
import FATSDB from "../controllers/controlletrsMSSQL.js";
router.get("/allgetprofile", FATSDB.allgetprofile)
router.get("/user_profile", FATSDB.user_profile)
router.post("/addnewuser", FATSDB.addnewuser)
router.post("/addnewcontact", FATSDB.addnewcontact)
router.put("/updateContact/:id",FATSDB.updateContact)
router.post("/addnewroles", FATSDB.addnewroles)
router.post("/addnewsetting", FATSDB.addnewsetting)
router.get("/user_profileuserID/:user_id", FATSDB.user_profileuserID)
router.put("/updateUser/:id",FATSDB.updateUser)
router.post("/addnewpackage", FATSDB.addnewpackage)
router.post("/addnewactivitylog",FATSDB.addnewactivitylog)
router.post("/addnewtransaction_method",FATSDB.addnewtransaction_method)
router.post("/addnewtransaction_category",FATSDB.addnewtransaction_category)
router.post("/addnewtax",FATSDB.addnewtax)
router.post("/loginUser",FATSDB.loginUser)
router.post("/resetPassword",FATSDB.resetPassword)
router.post("/passwordchangeotpSend",FATSDB.passwordchangeotpSend)
router.post("/verifyOTP",FATSDB.verifyOTP)
router.put("/addnewbank_details",FATSDB.addnewbank_details)
export default router;
