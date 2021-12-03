

import express from "express";
var router = express.Router();
import imageFile from "../helpers/imageFile.js";

import {vaccineDetailStore,vaccineDetailUpdate,vaccineDetails,vaccineDetailList,vaccineDetailDelete} from "../controllers/VaccineDetailController.js";

var router = express.Router();

router.post("/", imageFile.array("vaccineDocument", 10), vaccineDetailStore);
router.get("/", vaccineDetailList);
router.get("/:id", vaccineDetails);
router.put("/:id", imageFile.array("vaccineDocument", 10), vaccineDetailUpdate);
router.delete("/:id", vaccineDetailDelete);

export default router;