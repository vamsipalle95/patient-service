
import CurrentMedication  from "../models/MedicationModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import auth from "../middlewares/jwt.js";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);




// CurrentMedication Schema
function CurrentMedicationData(data) {

	this.id = data._id;
	this.medication = data.medication;


}


/**
 * CurrentMedication List.
 * 
 * @returns {Object}
 */
const currentMedicationList = [
	auth,
	function (req, res) {
		try {
			CurrentMedication.find({ _accountId: req.user._id }).then((currentMedication) => {
				console.log(currentMedication);
				if (currentMedication.length > 0) {
					return successResponseWithData(res, "Operation Success", currentMedication);
				} else {
					return successResponseWithData(res, "Operation Success", []);

				}
			});
		}
		catch (err) {
			return ErrorResponse(res, err);
		}
	}
];

/**
 * CurrentMedication store.
 * @param {JSON}      currentMedication
 *  
 * @returns {Object}
 */
const currentMedicationStore = [
	auth,
	(req, res) => {
		try {
			var medicationToSave = JSON.parse(JSON.stringify(req.body));
			const errors = validationResult(req);
			var currentMedication = new CurrentMedication(
				{
					_accountId: req.user._id,
					_patientId: req.user._id,
					medication: medicationToSave
				});
			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save currentMedication.
				currentMedication.save(function (err) {
					if (err) { return ErrorResponse(res, err); }
					let currentMedicationData = new CurrentMedicationData(currentMedication);
					return successResponseWithData(res, "CurrentMedication add Success.", currentMedicationData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return ErrorResponse(res, err);
		}
	}
];

/** CurrentMedication Details
 * @params {String}   id
 * @return {Object}
 * 
 */



const currentMedicationDetails = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return successResponseWithData(res, "Operation success", {});
		}
		try {
			CurrentMedication.findOne({ _id: req.params.id, _accountId: req.user._id }, "_id _accountId _patientId medication createdAt").then((CurrentMedication) => {
				if (CurrentMedication !== null) {
					let currentMedication = new CurrentMedicationData(CurrentMedication);
					console.log(CurrentMedication);
					return successResponseWithData(res, "Operation Success.", currentMedication);
				} else {
					return successResponseWithData(res, "Operation Success.", []);
				}
			});
		}
		catch {
			return ErrorResponse(err, res);
		}
	}
];


/**
 * CurrentMedication update.
 * 
 *  @param {JSON}      medication
 * 
 * @returns {Object}
 */
const currentMedicationUpdate = [
	auth,
	(req, res) => {
		try {

			const errors = validationResult(req);
			var medicationToSave = JSON.parse(JSON.stringify(req.body));
			var currentMedicationToUpdate = new CurrentMedication(
				{
					_id: req.params.id,
					_accountId: req.user._id,
					_patientId: req.user._id,
					medication: medicationToSave.medication

				});

			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				} else {
					CurrentMedication.findById(req.params.id, function (err, foundCurrentMedication) {
						if (foundCurrentMedication === null) {
							return notFoundResponse(res, "CurrentMedication not exists with this id");
						} else {
							//Check authorized user
							if (foundCurrentMedication._accountId.toString() !== req.user._id) {
								return unauthorizedResponse(res, "You are not authorized to do this operation.");
							} else {
								//update currentMedication.
								CurrentMedication.findByIdAndUpdate(req.params.id, currentMedicationToUpdate, {}, function (err) {
									if (err) {
										return ErrorResponse(res, err);
									} else {
										let currentMedicationData = new CurrentMedicationData(currentMedicationToUpdate);
										return successResponseWithData(res, "CurrentMedication update Success.", currentMedicationData);
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




/** currentMedication Delete
 * @param {string}      id
 * 
* @returns {Object}
 */


const currentMedicationDelete = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return validationErrorWithData(res, "Invalid Error", "Invalid ID");
		}
		try {
			CurrentMedication.findById(req.params.id, function (err, fondCurrentMedication) {
				if (fondCurrentMedication == null) {
					return notFoundResponse(res, "UserProfile are not exits and found");
				}
				else {
					//Check authorized user
					if (fondCurrentMedication._accountId.toString() !== req.user._id) {
						return unauthorizedResponse(res, "you are not Authorize to do this operation");
					}
					else {
						//delete userProfile.
						CurrentMedication.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return ErrorResponse(res, err);
							}
							else {
								return successResponse(res, "CurrentMedication Delete SuccesFull");
							}
						});
					}
				}
			});
		}

		catch (err) {
			return ErrorResponse(req, res);
		}
	}
];


export {currentMedicationList,currentMedicationStore,currentMedicationDetails,currentMedicationUpdate,currentMedicationDelete};