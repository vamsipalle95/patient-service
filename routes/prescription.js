
import express from "express";

var router = express.Router();
import imageFile from "../helpers/imageFile.js";


import { prescriptionStore, prescriptionList, prescriptionDetails, prescriptionUpdate, prescriptionDelete } from "../controllers/PrescriptionController.js";

var router = express.Router();

router.post("/", imageFile.array("prescriptionDocument", 10), prescriptionStore);
router.get("/", prescriptionList);
router.get("/:id", prescriptionDetails);
router.put("/:id", imageFile.array("prescriptionDocument", 10), prescriptionUpdate);
router.delete("/:id", prescriptionDelete);


export default router;





