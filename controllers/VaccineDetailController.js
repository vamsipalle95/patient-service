
import VaccineDetail from "../models/VaccineDetailModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import {check} from "express-validator";
import auth from "../middlewares/jwt.js";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);



function VaccineDetailData(data) {
	this.id = data._id;
	this.vaccineDocument = data.vaccineDocument;
	this.vaccineName = data.vaccineName;
	this.doseNumber = data.doseNumber;
	this.date = data.date;
	this.place = data.place;
	this.beneficiaryId = data.beneficiaryId;
	this.nextDueDate = data.nextDueDate;
	this.createdAt = data.createdAt;
}



/**  vacineDetail Store
 *  @param {object} vaccineDocument
 *  @param {object} vaccineName
 *  @param {object} doseNumber
 *  @param {object} date
 * @param {object} place
 *  @param {object} beneficiaryId
 *  @param {object} nextDueDate
 */



const vaccineDetailStore = [
	auth,
	body("vaccineDocument"),
	body("vaccineName").isLength({ min: 1 }).trim().withMessage("vaccineName must be Specified")
		.isAlphanumeric().withMessage("vaccineName should be isAlphanumeric."),
	body("doseNumber").isLength({ min: 0 }).trim().withMessage("doseNumber must be Specified")
		.isNumeric().withMessage("doseNumber must be Specified"),
	check("date").isLength({ min: 1 }).isISO8601().toDate().trim().withMessage("recordDate must be Specified with correct formate"),
	body("place").isLength({ min: 1 }).trim().withMessage("place must be Specified")
		.isAlphanumeric().withMessage("place should be isAlphanumeric."),
	body("beneficiaryId").isLength({ min: 1 }).trim().withMessage("beneficiaryId must be Specified")
		.isAlphanumeric().withMessage("beneficiaryId should be isAlphanumeric.")
		.custom((value, { req }) => {
			return VaccineDetail.findOne({ beneficiaryId: value, _accountId: req.user._id, _id: { "$ne": req.params.id } }).then(vaccineDetail => {
				if (vaccineDetail) {
					return Promise.reject("VaccineDetail already exist with beneficiaryId.");
				}
			});
		}),
	check("nextDueDate").isLength({ min: 1 }).isISO8601().toDate().trim().withMessage("recordDate must be Specified with correct formate"),
	
	sanitizeBody("vaccineDocument").escape(),
	sanitizeBody("vaccineName").escape(),
	sanitizeBody("doesNumber").escape(),
	sanitizeBody("date").escape(),
	sanitizeBody("place").escape(),
	sanitizeBody("beneficiaryId").escape(),
	sanitizeBody("nextDueDate").escape(),
	sanitizeBody("*").escape(),
	function (req, res) {
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
			var vaccineDetail = new VaccineDetail({
				vaccineDocument: imagesArray,
				vaccineName: req.body.vaccineName,
				doseNumber: req.body.doseNumber,
				date: req.body.date,
				place: req.body.place,
				beneficiaryId: req.body.beneficiaryId,
				nextDueDate: req.body.nextDueDate,
				_accountId: req.user._id
			});
			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error", errors.array());
			}
			else {
				vaccineDetail.save(function (err) {
					if (err) {
						return ErrorResponse(res, err);
					}

					let vaccineDetailData = new VaccineDetailData(vaccineDetail);
					console.log(vaccineDetailData);
					return successResponseWithData(res, "OperationSuccessFull", vaccineDetailData);
				});
			}
		}
		catch (err) {
			console.log(err.message);
			return ErrorResponse(res, err);
		}
	}
];

/**VacineDetails Update
 * @params {String} id
 * @returns{Object}
 * 
 */



const vaccineDetailUpdate = [
	auth,
	body("vaccineDocument"),
	body("vaccineName").isLength({ min: 1 }).trim().withMessage("vaccineName must be Specified")
		.isAlphanumeric().withMessage("vaccineName should be isAlphanumeric."),
	body("doseNumber").isLength({ min: 0 }).trim().withMessage("doseNumber must be Specified")
		.isNumeric().withMessage("doseNumber must be Specified"),
	check("date").isLength({ min: 1 }).isISO8601().toDate().trim().withMessage("recordDate must be Specified with correct formate"),
	body("place").isLength({ min: 1 }).trim().withMessage("place must be Specified")
		.isAlphanumeric().withMessage("place should be isAlphanumeric."),
	body("beneficiaryId").isLength({ min: 1 }).trim().withMessage("beneficiaryId must be Specified")
		.isAlphanumeric().withMessage("beneficiaryId should be isAlphanumeric."),
	check("nextDueDate").isLength({ min: 1 }).isISO8601().toDate().trim().withMessage("recordDate must be Specified with correct formate"),
	
	sanitizeBody("vaccineDocument").escape(),
	sanitizeBody("vaccineName").escape(),
	sanitizeBody("doseNumber").escape(),
	sanitizeBody("date").escape(),
	sanitizeBody("place").escape(),
	sanitizeBody("beneficiaryId").escape(),
	sanitizeBody("nextDueDate").escape(),
	sanitizeBody("*").escape(),
	function (req, res) {
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
			var vaccineDetail = new VaccineDetail({
				vaccineDocument: imagesArray,
				vaccineName: req.body.vaccineName,
				doseNumber: req.body.doseNumber,
				date: req.body.date,
				place: req.body.place,
				beneficiaryId: req.body.beneficiaryId,
				nextDueDate: req.body.nextDueDate,
				_accountId: req.user._id,
				_id: req.params.id
			});
			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return validationErrorWithData(res, "Invalid Error", "Invalid Id");
				}
				else {
					VaccineDetail.findById(req.params.id, function (err, foundByVaccineDetail) {
						if (foundByVaccineDetail === null) {
							return notFoundResponse(res, "foundByInsuranceDetail does not exits by Id");
						}
						else {
							if (foundByVaccineDetail._accountId.toString() !== req.user._id) {
								return unauthorizedResponse(res, "You are not authorized to do this operation.");
							}
							else {
								VaccineDetail.findByIdAndUpdate(req.params.id, vaccineDetail, {}, function (err) {
									if (err) {
										return ErrorResponse(res, err);
									}
									else {
										let vaccineDetailData = new VaccineDetailData(vaccineDetail);
										return successResponseWithData(res, "operation is SuccesFull", vaccineDetailData);
									}
								});
							}
						}
					});

				}

			}
		}
		catch (err) {
			return ErrorResponse(res, err);
		}
	}
];

/** vaccineDetail details
 * @params {String} id
 * @return {Object}
 */

const vaccineDetails = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return successResponseWithData(res, "Operation SuccessFull", {});
		}
		try {

			VaccineDetail.findOne({ _accountId: req.user._id, _id: req.params.id }, "vaccineDocument").then((vaccineDetailOne) => {
				if (vaccineDetailOne !== null) {
					let vaccineDetailData = new VaccineDetailData(vaccineDetailOne);
					return successResponseWithData(res, "Operation SuccessFull", vaccineDetailData);
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


const vaccineDetailList = [
	auth,
	function (req, res) {
		try {
			VaccineDetail.find({ _accountId: req.user._id }).then((vaccineDetail) => {
				if (vaccineDetail.length > 0) {
					return successResponseWithData(res, "Operation SuccessFull", vaccineDetail);
				}
				else {
					return successResponseWithData(res, "operation SuccessFull", {});
				}
			});
		}
		catch (err) {
			return ErrorResponse(res, err);

		}
	}
];



/** vaccineDetailDelete
 *  @param {String} id
 */


const vaccineDetailDelete = [
	auth,
	function (req, res) {

		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			//check null id??
			VaccineDetail.findById(req.params.id, function (err, foundUser) {
				if (foundUser == null) {
					return notFoundResponse(res, "foundUser not exists with this id");
				}
				/// check authorization
				else {
					if (foundUser._accountId.toString() !== req.user._id) {
						return unauthorizedResponse(res, "You are not authorize person to do this operation");
					}
					//delete userProfile.
					else {
						VaccineDetail.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return ErrorResponse(err, res);
							}
							else {
								return successResponse(res, "VaccineDetail SuccessFully Deleted");
							}
						});
					}
				}
			});

		} catch (err) {
			return ErrorResponse(res, err);
		}
	}

];



export {vaccineDetailStore,vaccineDetailUpdate,vaccineDetails,vaccineDetailList,vaccineDetailDelete};