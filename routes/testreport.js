
import express from "express";
var router = express.Router();
import imageFile from "../helpers/imageFile.js";

import {testReortStore,testReportList,testReportDetails,testReportUpdate,deleteTestReport} from "../controllers/TestReportController.js";

var router = express.Router();

router.post("/", imageFile.array("document", 10), testReortStore);
router.get("/", testReportList);
router.get("/:id", testReportDetails);
router.put("/:id", imageFile.array("document", 10), testReportUpdate);
router.delete("/:id", deleteTestReport);

export default router;
