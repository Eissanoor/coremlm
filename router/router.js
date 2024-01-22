import express from "express";
const router = express.Router();
import FATSDB from "../controllers/controlletrsMSSQL.js";
router.get("/allgetprofile", FATSDB.allgetprofile)
router.get("/user_profile", FATSDB.user_profile)
router.post("/addnewuser", FATSDB.addnewuser)
router.post("/addnewcontact", FATSDB.addnewcontact)
router.post("/addnewroles", FATSDB.addnewroles)
router.post("/addnewsetting", FATSDB.addnewsetting)
router.get("/user_profileuserID/:user_id", FATSDB.user_profileuserID)
router.post("/addnewpackage", FATSDB.addnewpackage)
export default router;
