import express  from "express";
import {userProfileList ,userProfileDetail ,userProfileStore, userProfileUpdate,userProfileDelete} from "../controllers/UserProfileController.js";

import imageFile from "../helpers/imageFile.js";
var router = express.Router();

router.get("/", userProfileList);
router.get("/:id", userProfileDetail);
router.post("/", imageFile.array('profilePhoto',1), userProfileStore);
router.put("/:id",imageFile.array('profilePhoto',1), userProfileUpdate);
router.delete("/:id", userProfileDelete);




export default router;