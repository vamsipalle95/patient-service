
import express from "express";
import {currentMedicationList,currentMedicationStore,currentMedicationDetails,currentMedicationUpdate,currentMedicationDelete} from "../controllers/CurrentMedicationController.js";

var router = express.Router();

router.post("/", currentMedicationStore);
router.get("/", currentMedicationList);
router.get("/:id", currentMedicationDetails);
router.put("/:id", currentMedicationUpdate);
router.delete("/:id", currentMedicationDelete);


export default router;

