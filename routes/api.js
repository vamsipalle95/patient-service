import express from "express";
import authRouter from "./auth.js";

import userProfileRouter from"./userProfile.js";
import healthRecordRouter from "./healthrecord.js";
import currentMedicationRouter from"./currentmedication.js";

import prescriptionRouter from"./prescription.js";
import testreportRouter from"./testreport.js";
import hospitaRecordslRouter from"./hospitalrecord.js";
import insuranceDetailsRouter from"./insurancedetail.js";
import vaccineDetailRouter from"./vaccinedetail.js";

var app = express();

app.use("/auth/", authRouter);
app.use("/userprofile/", userProfileRouter);
app.use("/healthrecord/", healthRecordRouter);
app.use("/currentmedication/", currentMedicationRouter);

app.use("/prescription/", prescriptionRouter);
app.use("/testreport",testreportRouter);
app.use("/hospitalrecord",hospitaRecordslRouter);
app.use("/insurancedetail",insuranceDetailsRouter);
app.use("/vaccinedetail",vaccineDetailRouter);

export default app
