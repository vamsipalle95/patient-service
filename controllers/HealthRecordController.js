import HealthRecord from "../models/HealthRecordModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import auth from "../middlewares/jwt.js";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// HealthRecord Schema
function HealthRecordData(data) {
	this.id = data._id;
	this.height = data.height;
	this.weight = data.weight;
	this.bloodGroup = data.bloodGroup;
	this.genderCd = data.genderCd;
	this.age = data.age;
	this.createdAt = data.createdAt;
}

/**
 * PatientRecord List.
 * 
 * @returns {Object}
 */
const healthRecordList = [
	auth,
	function (req, res) {
		try {
			HealthRecord.find({ _accountId: req.user._id }, "_id height weight bloodGroup genderCd age createdAt").then((healthRecords) => {
				console.log(healthRecords);
				if (healthRecords.length > 0) {
					return successResponseWithData(res, "Operation success", healthRecords);
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


/**
 * HeathRecord store.
 * @param {string}      height
 * @param {string}      weight
 * @param {string}      bloodGroup
 * @param {string}      genderCd
 * @param {Number}      age
 * 
 * @returns {Object}
 */
const healthRecordStore = [
	auth,
	body("height").isLength({ min: 1 }).trim().withMessage("Height name must be specified."),
	body("weight").isLength({ min: 1 }).trim().withMessage("Weight name must be specified."),
	body("bloodGroup")
		.custom((value, { req }) => {
			return HealthRecord.findOne({ bloodGroup: value, _accountId: req.user._id, _id: { "$ne": req.params.id } }).then(healthRecord => {
				if (healthRecord) {
					return Promise.reject("HealthRecord already exist with this Height & Weight");
				}
			});
		}),
	body("genderCd").isLength({ min: 1 }).trim().withMessage("Weight name must be specified."),
	body("age").isLength({ min: 1 }).trim().withMessage("Weight name must be specified.")
		.isNumeric().withMessage("Invalid Mobile Number."),
		
	sanitizeBody("height").escape(),
	sanitizeBody("weight").escape(),
	sanitizeBody("bloodGroup").escape(),
	sanitizeBody("genderCd").escape(),
	sanitizeBody("age").escape(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var heathRecord = new HealthRecord(
				{
					height: req.body.height,
					weight: req.body.weight,
					bloodGroup: req.body.bloodGroup,
					genderCd: req.body.genderCd,
					age: req.body.age,

					_accountId: req.user._id,
				});

			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save healthRecord.
				heathRecord.save(function (err) {
					if (err) { return ErrorResponse(res, err); }
					let healthRecordData = new HealthRecordData(heathRecord);
					return successResponseWithData(res, "HealthRecord add Success.", healthRecordData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return ErrorResponse(res, err);
		}
	}
];

/**
 * HealthRecord Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
const healthRecordDetail = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return successResponseWithData(res, "Operation success", {});
		}

		try {
			HealthRecord.findOne({ _id: req.params.id, _accountId: req.user._id }, "_id height weight bloodGroup  genderCd age createdAt").then((healthRecord) => {
				if (healthRecord !== null) {
					let healthRecordData = new HealthRecordData(healthRecord);
					return successResponseWithData(res, "Operation success", healthRecordData);
				} else {
					return successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return ErrorResponse(res, err);
		}
	}
];

/**
 * UserProfile update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */


const healthRecordUpdate = [
	auth,
	body("height").isLength({ min: 1 }).trim().withMessage("height must be specified.")
		.isAlphanumeric().withMessage("height has non-alphanumeric characters."),
	body("weight").isLength({ min: 1 }).trim().withMessage("weight  must be specified.")
		.isAlphanumeric().withMessage("weight  has non-alphanumeric characters."),
	body("bloodGroup"),
	body("genderCd").isLength({ min: 1 }).trim().withMessage("genderCd must be specified.")
		.isAlphanumeric().withMessage("genderCd should be Alphanumeric."),
	body("age").isLength({ min: 1 }).trim().withMessage("age must be specified.")
		.isNumeric().withMessage("genderCd should be numeric."),
	sanitizeBody("height").escape(),
	sanitizeBody("weight").escape(),
	sanitizeBody("bloodGroup").escape(),
	sanitizeBody("genderCd").escape(),
	sanitizeBody("age").escape(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var healthRecord = new HealthRecord(

				{
					height: req.body.height,
					weight: req.body.weight,
					bloodGroup: req.body.bloodGroup,
					genderCd: req.body.genderCd,
					age: req.body.age,
					_accountId: req.user._id,
					_id: req.params.id
				});
			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}
				else {
					HealthRecord.findById(req.params.id, function (err, foundUserHealthRecord) {
						if (foundUserHealthRecord === null) {
							return notFoundResponse(res, "HealthRecord not exists with this id");
						} else {
							//Check authorized user
							if (foundUserHealthRecord._accountId.toString() !== req.user._id) {
								return unauthorizedResponse(res, "You are not authorized to do this operation.");
							} else {
								//update userProfile.
								HealthRecord.findByIdAndUpdate(req.params.id, healthRecord, {}, function (err) {
									if (err) {
										return ErrorResponse(res, err);
									} else {
										let healthRecordData = new HealthRecordData(healthRecord);
										return successResponseWithData(res, "HealthRecordData update Success.", healthRecordData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			console.log(err.message);
			//throw error in json response with status 500. 
			return ErrorResponse(res, err);
		}
	}
];

/**
 * HealthRecord Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
const healthRecordDelete = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			HealthRecord.findById(req.params.id, function (err, foundUserHealthRecord) {
				if (foundUserHealthRecord === null) {
					return notFoundResponse(res, "UserHealthRecord not exists with this id");
				} else {
					//Check authorized user
					if (foundUserHealthRecord._accountId.toString() !== req.user._id) {
						return unauthorizedResponse(res, "You are not authorized to do this operation.");
					} else {
						//delete userProfile.
						HealthRecord.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return ErrorResponse(res, err);
							} else {
								return successResponse(res, "UserHealthRecord delete Success.");
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


export  { healthRecordStore, healthRecordList,healthRecordDetail,healthRecordUpdate,healthRecordDelete};