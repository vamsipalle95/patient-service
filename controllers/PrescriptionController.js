
import Prescription from "../models/PrescriptionModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import auth from "../middlewares/jwt.js";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);


///prescription Schema
function PrescriptionData(data) {
	this.id = data._id;
	this.prescriptionDocument = data.prescriptionDocument;
	this.recordDate = data.recordDate;
	this.recordName = data.recordName;
	this.recordPrescribedByDr = data.recordPrescribedByDr;
	this.additionalNotes = data.additionalNotes;
	this.createdAt = data.createdAt;
}


/**
 * Prescription store.
 * @param {string}      uploadDocument
 * @param {string}      recordDate
 * @param {string}      recordName
 * @param {string}      recordPrescribedByDr 
 * @param {string}      additionalNotes

 * @returns {Object}
*
**/

const prescriptionStore = [
	auth,
	body("prescriptionDocument"),
	body("recordDate").isLength({ min: 1 }).trim().withMessage("recordDate must be Specified")
		.custom((value, { req }) => {
			return Prescription.findOne({ recordDate: value, _accountId: req.user._id }).then(prescription => {
				if (prescription) {
					return Promise.reject("Prescription already exist with this recordDate");
				}
			});
		}),
	body("recordName").isLength({ min: 1 }).trim().withMessage("recordName must be Specified")
		.isAlphanumeric().withMessage("RecordName has non-alphanumeric characters."),
	body("recordPrescribedByDr").isLength({ min: 1 }).trim().withMessage("recordPrescribedByDr must be Specified"),
	body("additionalNotes").isLength({ min: 1 }).trim().withMessage("additionalNotes must be Specified"),


	// Sanitize fields.
	sanitizeBody("prescriptionDocument").escape(),
	sanitizeBody("recordDate").escape(),
	sanitizeBody("recordName").escape(),
	sanitizeBody("recordPrescribedByDr").escape(),
	sanitizeBody("additionalNotes").escape(),

	(req, res) => {


		try {
			let imagesArray = [];
			if (req.files == 0 || req.files==2 ) {
				return validationErrorWithData(res, "Atlest One File Required", "Validation Error");

			}
			else {
				req.files.map(file => {
					imagesArray.push(file.path);
				});
			}
			const errors = validationResult(req);
			var prescription = new Prescription({
				prescriptionDocument: imagesArray,
				recordDate: req.body.recordDate,
				recordName: req.body.recordName,
				recordPrescribedByDr: req.body.recordPrescribedByDr,
				additionalNotes: req.body.additionalNotes,

				_accountId: req.user._id,
			});

			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				prescription.save(function (err) {

					if (err) {
						return ErrorResponse(res, err);
					}
					let prescriptionData = new PrescriptionData(prescription);

					return successResponseWithData(res, "Operaration SuccessFull", prescriptionData);
				});
			}
		}
		catch (err) {
			console.log(err.message);
			return ErrorResponse(res, err);

		}
	}



];

/** Prescription List
 * @return{Object}    id
 * 
 */

const prescriptionList = [
	auth,
	function (req, res) {
		try {
			Prescription.find({ _accountId: req.user._id }, "_accountId _id recordDate recordName recordPrescribedByDr").then((prescription) => {
				if (prescription.length > 0) {
					return successResponseWithData(res, "Operation success", prescription);
				} else {
					return successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return ErrorResponse(res, err);
		}
	}
];



/** Prescription Details
 * @params {String}     id
 * @return{object}
 * 
 */

const prescriptionDetails = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return successResponseWithData(res, "Operation success", {});
		}
		try {
			Prescription.findOne({ _id: req.params.id, _accountId: req.user._id }, "prescriptionDocument").then((prescription) => {
				if (prescription !== null) {
					let prescriptionData = new PrescriptionData(prescription);
					return successResponseWithData(res, "Operation SuccessFull", prescriptionData);
				}
				else {
					return successResponseWithData(res, "Operation SuccessFull", {});
				}

			});
		}
		catch (err) {
			return ErrorResponse(res, err);
		}
	}
];

/**Prescription Update
 * @params {String} id
 * @returns{Object}
 * 
 */

const prescriptionUpdate = [
	auth,
	body("prescriptionDocument"),
	body("recordDate").isLength({ min: 1 }).trim().withMessage("recordDate must be Specified"),
	body("recordName").isLength({ min: 1 }).trim().withMessage("recordName must be Specified")
		.isAlphanumeric().withMessage("RecordName has non-alphanumeric characters."),
	body("recordPrescribedByDr").isLength({ min: 1 }).trim().withMessage("recordPrescribedByDr must be Specified"),
	body("additionalNotes").isLength({ min: 1 }).trim().withMessage("additionalNotes must be Specified"),


	// Sanitize fields.
	sanitizeBody("prescriptionDocument").escape(),
	sanitizeBody("recordDate").escape(),
	sanitizeBody("recordName").escape(),
	sanitizeBody("recordPrescribedByDr").escape(),
	sanitizeBody("additionalNotes").escape(),

	(req, res) => {
		try {

			let imagesArray = [];
			if (req.files == 0) {
				return validationErrorWithData(res, "Atlest One File Required", "Validation Error");

			}
			else {
				req.files.map(file => {
					imagesArray.push(file.path);
				});
			}

			const errors = validationResult(req);
			var prescription = new Prescription({
				prescriptionDocument:imagesArray,
				recordDate: req.body.recordDate,
				recordName: req.body.recordName,
				recordPrescribedByDr: req.body.recordPrescribedByDr,
				additionalNotes: req.body.additionalNotes,
				_accountId: req.user._id,
				_id: req.params.id
			});

			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				} else {
					Prescription.findById(req.params.id, function (err, foundPrescriptionId) {
						if (foundPrescriptionId === null) {
							return notFoundResponse(res, "foundPrescriptionId not exists with this id");
						} else {
							//Check authorized user
							if (foundPrescriptionId._accountId.toString() !== req.user._id) {
								return unauthorizedResponse(res, "You are not authorized to do this operation.");
							} else {
								//update userProfile.
								Prescription.findByIdAndUpdate(req.params.id, prescription, {}, function (err) {
									if (err) {
										return ErrorResponse(res, err);
									} else {
										let prescriptionData = new PrescriptionData(prescription);
										console.log(prescriptionData);
										return successResponseWithData(res, "prescription update Success.", prescriptionData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return ErrorResponse(res, err);
		}
	}
];


const prescriptionDelete = [
	auth,
	function (req, res) {
		//check id not valid
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {

			Prescription.findById(req.params.id, function (err, PrescriptionProfile) {
				//Check id null
				if (PrescriptionProfile === null) {
					return notFoundResponse(res, "UserProfile not exists with this id");
				} else {
					//Check authorized user
					if (PrescriptionProfile._accountId.toString() !== req.user._id) {
						return unauthorizedResponse(res, "You are not authorized to do this operation.");
					} else {
						//delete userProfile.
						Prescription.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return ErrorResponse(res, err);
							} else {
								return successResponse(res, "PrescriptionProfile delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return ErrorResponse(res, err);
		}
	}
];

export{prescriptionStore,prescriptionList,prescriptionDetails, prescriptionUpdate,prescriptionDelete};