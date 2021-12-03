
import express from "express";

import imageFile from "../helpers/imageFile.js";
import  {insuranceDetailSotre,insuranceDetailUpdate,insuranceDetailList,insuranceDetails,insuranceDetailDelete} from "../controllers/InsuranceDetailController.js";

var router = express.Router();

router.post("/", imageFile.array("insuranceImage", 10), insuranceDetailSotre);
router.get("/", insuranceDetailList);
router.get("/:id", insuranceDetails);
router.put("/:id",imageFile.array("insuranceImage", 10), insuranceDetailUpdate);
router.delete("/:id", insuranceDetailDelete);


export default router;

