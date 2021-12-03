

import express from "express";

import imageFile from "../helpers/imageFile.js";
import {hospitalRecordStore,hospitalRecordList,hospitalDetails,hospitalUpdate,hospitalRecordDelete} from "../controllers/HospitalRecordController.js";

var router = express.Router();

router.post("/", imageFile.array("hospitalDocument", 10), hospitalRecordStore);
router.get("/", hospitalRecordList);
router.get("/:id", hospitalDetails);
router.put("/:id",imageFile.array("hospitalDocument", 10), hospitalUpdate);
router.delete("/:id", hospitalRecordDelete);


export default router;