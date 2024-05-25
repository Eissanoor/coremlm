import express from "express";
const router = express.Router();
import upload from "../config/multerConfig.js"
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
router.put("/addnewpayment_detail",FATSDB.addnewpayment_detail)
router.post("/addnewmedia",upload.single("file"), FATSDB.addnewmedia)
router.put("/updateprofile/:id",upload.single("file"), FATSDB.updateprofile)
router.put("/updatebank_details/:id",FATSDB.updatebank_details)
router.put("/updatepayment_detail/:id",FATSDB.updatepayment_detail)
router.put("/updateProfilePic/:id",upload.single("image"),FATSDB.updateProfilePic)
router.get("/",(req,res)=>{
    res.json({statusCode:200, message:"Project is Running", Data:null})
})
export default router;
