import express from "express";
const router = express.Router();
import upload from "../config/multerConfig.js"
import FATSDB from "../controllers/controlletrsMSSQL.js";
import Member from "../controllers/memberRegister.js"
router.get("/allgetprofile", FATSDB.allgetprofile)
router.get("/user_profile", FATSDB.user_profile)
router.post("/addnewuser", FATSDB.addnewuser)
router.post("/addnewcontact", FATSDB.addnewcontact)
router.put("/updateContact/:id",FATSDB.updateContact)
router.post("/addnewroles", FATSDB.addnewroles)
router.post("/addnewsetting", FATSDB.addnewsetting)
router.get("/user_profileuserID/:user_id", FATSDB.user_profileuserID)
router.put("/updateUser",FATSDB.updateUser)
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
router.delete("/deleteProfilePic/:id",FATSDB.deleteProfilePic)
router.get("/",(req,res)=>{
    res.json({statusCode:200, message:"Project is Running", Data:null})
})
router.post("/addnewproduct",upload.single("product_image"),FATSDB.addnewproduct)
router.post("/add_to_cart_product",FATSDB.add_to_cart_product)
router.get("/get_all_product",FATSDB.get_all_product)
router.put("/updateUserforapprovel/:id",FATSDB.updateUserforapprovel)
router.get("/get_all_users",FATSDB.get_all_users)
router.get("/get_user_by_id/:id",FATSDB.get_user_by_id)
router.get("/get_product_by_id/:id",FATSDB.get_product_by_id)
router.put("/updateProduct/:id", upload.single("product_image"), FATSDB.updateProduct)
router.delete("/deleteProduct/:id",FATSDB.deleteProduct)

//Members
router.post("/addnewMember",upload.single("bankSlipe"),Member.addnewMember)
router.get("/get_all_Member",Member.get_all_Member)
router.put("/updateMember/:id",Member.updateMember)
router.delete("/deleteMember/:id",Member.deleteMember)
export default router;
