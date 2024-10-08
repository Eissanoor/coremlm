import express from "express";
const router = express.Router();
import upload from "../config/multerConfig.js"
import FATSDB from "../controllers/controlletrsMSSQL.js";
import Member from "../controllers/memberRegister.js"
import LogoCon from "../controllers/logo.js";
import Comission from "../controllers/commission.js";
import Admin from "../controllers/admin.js"
import EmailInbox from '../controllers/emailController.js'
import StripePayment from "../controllers/strippayment.js"
import PaypalPayment from "../controllers/paypal.js"


//---------------------------Paypal_Payment------------------------
router.get("/addpayment_paypal" , PaypalPayment.addpayment_paypal)
router.get("/success", PaypalPayment.success)

//---------------------------stripe-payment------------------------

router.post("/create_payment_intent", StripePayment.sendpayment)
router.get("/get_all_payment_enable", StripePayment.get_all_payment_enable)
router.put("/update_payment_enable/:id", StripePayment.update_payment_enable)
//---------------------------email-inbox------------------------
router.post("/email_replay", EmailInbox.replyMessage)
router.post('/email_send', EmailInbox.addNewMessage)
router.get('/email_receved', EmailInbox.getInboxMessages)
router.get('/getSentMessages', EmailInbox.getSentMessages)
router.get("/getSentOneMessages", EmailInbox.getSentOneMessages)
router.get('/getInboxOneMessages', EmailInbox.getInboxOneMessages)
router.get('/get_all_my_members/:id',EmailInbox.get_all_my_members)
router.delete('/deleteInboxMessage', EmailInbox.deleteInboxMessages)
router.get("/get_all_my_filter_members/:id", EmailInbox.get_all_my_filter_members)
router.post("/smtpemailaddnew", EmailInbox.smtpemailaddnew)
router.put("/updateSmtp/:id", EmailInbox.updateSmtp)
router.delete("/deleteSmtp/:id", EmailInbox.deleteSmtp)
router.get("/getAllSmtp", EmailInbox.getAllSmtp)
//admin---------------------
router.post("/adminLogin", Admin.adminLogin)
router.post("/addnewadmin",Admin.addnewadmin)
router.post("/admineotpSend", Admin.admineotpSend)
router.post("/adminverifyOTP",Admin.adminverifyOTP)

//referal links----------------------------------------------------------------

router.post("/addnewMemberWithReferalLink",upload.single("bankSlipe"), Member.addnewMemberWithReferalLink)
router.post("/generatereferrallink", Member.generatereferrallink)
//commission----------------------------------------------------------------
router.get('/get_commission', Comission.get_comission )
router.put("/update_comission",Comission.update_comission)
router.get("/get_compensation",Comission.get_compensation)
router.put("/update_compensation",Comission.update_compensation)
router.get("/get_level_commision", Comission.get_level_commision)
router.put("/update_level_commision",Comission.update_level_commision)
router.get("/get_commission_base_on_geonology",Comission.get_commission_base_on_geonology)
router.put("/update_commission_base_on_geonology",Comission.update_commission_base_on_geonology)
router.get("/get_referel_commission",Comission.get_referel_commission)
router.put("/update_referel_commission",Comission.update_referel_commission)
router.get("/getcommissionbyId", Comission.getcommissionbyId)
router.get("/gettotalearnbyId",Comission.gettotalearnbyId)
//----------------------------------------------------------------
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
router.put("/updateProfilePic",upload.single("image"),FATSDB.updateProfilePic)
router.delete("/deleteProfilePic",FATSDB.deleteProfilePic)
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

//logo
router.put("/updateLogo/:id",upload.single("logo"),LogoCon.updateLogo )
router.get("/getLogo",LogoCon.getLogo)
router.get("/getlogobyid/:id",LogoCon.getlogobyid)
router.post("/insertnewlogo",upload.single("logo"),LogoCon.insertnewlogo)
router.delete("/deletelogobyid/:id",LogoCon.deletelogobyid)

//tree
router.get("/getUserbyId",Member.getUserbyId)
router.get("/getAlltree",Member.getAlltree)

router.get("/getdownload_button",Member.getdownload_button)
router.get("/getinvoice",Member.getinvoice)

//fakers-------
router.post("/addMultipleMembers", Member.addMultipleMembers)

export default router;
