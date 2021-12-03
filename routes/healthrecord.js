import express from "express";
import { healthRecordStore, healthRecordList,healthRecordDetail
	,healthRecordUpdate,healthRecordDelete} from "../controllers/HealthRecordController.js";

var router = express.Router();

router.post("/", healthRecordStore);
router.get("/", healthRecordList);
router.get("/:id", healthRecordDetail);
router.put("/:id", healthRecordUpdate);
router.delete("/:id", healthRecordDelete);


export default router;