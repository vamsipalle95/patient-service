
import UserProfile from "../models/UserProfileModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import auth from "../middlewares/jwt.js";
import {check} from "express-validator";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config()

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// UserProfile Schema
function UserProfileData(data) {
	this.id = data._id;
	this.firstName = data.firstName;
	this.lastName = data.lastName;
	this.age = data.age;
	this.genderCd = data.genderCd;
	this.mobileNumber = data.mobileNumber;
	this.email = data.email;
	this.profilePhoto = data.profilePhoto;
	this.relationshipCd = data.relationshipCd;
	this.patientUID=data.patientUID;
	this.createdAt = data.createdAt;

}

/**
 * UserProfile List.
 * 
 * @returns {Object}
 */
const userProfileList = [
	auth,
	function (req, res) {
		try {
			UserProfile.find({ _accountId: req.user._id }, "_id firstName lastName age genderCd mobileNumber email profilePhoto relationshipCd patientUID createdAt").then((userProfiles) => {
				if (userProfiles.length > 0) {
					return successResponseWithData(res, "Operation success", userProfiles);
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
 * UserProfiles Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
const userProfileDetail = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return successResponseWithData(res, "Operation success", {});
		}
		try {
			UserProfile.findOne({ _accountId: req.user._id, _id: req.params.id }, "_accountId _id firstName lastName age genderCd mobileNumber email profilePhoto relationshipCd createdAt").then((UserProfile) => {
				if (UserProfile !== null) {
					let userProfileData = new UserProfileData(UserProfile);
					return successResponseWithData(res, "Operation success", userProfileData);
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
 * UserProfile store.
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      age
 * @param {string}      genderCd 
 * @param {string}      mobileNumber
*  @param {string}      email
 * @param {string}      profilePhoto
 * @param {string}      relationshipCd
 * @param {string}      patientUID
 * 
 * nullable
 * 
 * @returns {Object}
 */
const userProfileStore = [
	auth,
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	body("age").isLength({ min: 1 }).trim().withMessage("Age must be specified.")
		.isNumeric().withMessage("Age should be numeric."),
	body("genderCd").isLength({ min:1,max:20 }).trim().withMessage("genderCd must be specified.")
		.isAlphanumeric().withMessage("genderCd should be isAlphanumeric."),
	check('mobileNumber').optional({ checkFalsy: true,optional: true,nullable : true }).isInt().isLength({min:10}).trim().withMessage('Please enter valid mobile no.')
	.isNumeric().withMessage("mobileNumber should be numeric."),
	check('email').optional({ checkFalsy: true, nullable: true }).isEmail().trim().withMessage('Please enter valid email')
	.custom((value, { req }) => {
		return UserProfile.findOne({ email: value}).then(userProfile => {
			if (userProfile) {
				return Promise.reject("This Email has already exits please try to different Email");
			}
		});
	}),
	body("profilePhoto"),
	body("relationshipCd").isLength({min:1}).trim().withMessage("RelationshipCd must required")
	.isAlphanumeric().withMessage("relationshipCd should be isAlphanumeric."),
	
		sanitizeBody("firstName").escape(),
		sanitizeBody("lastName").escape(),
		sanitizeBody("age").escape(),
		sanitizeBody("genderCd").escape(),
		sanitizeBody("mobileNumber").escape(),
		sanitizeBody("email").escape(),
		sanitizeBody("profilePhoto").escape(),
		sanitizeBody("*").escape(),
	(req, res) => {
		try {


			let imageArray = []
            if (req.files) {
                req.files.map(file => {
                    imageArray.push(file.path)
                })
				console.log(imageArray)
            }


			const errors = validationResult(req);
			var userProfile = new UserProfile(
				{
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					age: req.body.age,
					genderCd: req.body.genderCd,
					mobileNumber:req.body.mobileNumber,
					email: req.body.email,
					profilePhoto:imageArray,
					relationshipCd: req.body.relationshipCd,
					patientUID: "PT" + parseInt(Math.random() * (9999999999 - 1000000000) + 1000000000),
					_accountId: req.user._id,
				});

			if (!errors.isEmpty()) {
				return validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save userProfile.
				userProfile.save(function (err) {
					if (err) { return ErrorResponse(res, err); }
					let userProfileData = new UserProfileData(userProfile);
					console.log(userProfileData)
					return successResponseWithData(res, "UserProfile add Success.", userProfileData);
				});
			}
		} catch (err) {
			console.log(err.message);
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
const userProfileUpdate = [
	auth,
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
	.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
	.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
body("age").isLength({ min: 1 }).trim().withMessage("Age must be specified.")
	.isNumeric().withMessage("Age should be numeric."),
body("genderCd").isLength({ min:1,max:20 }).trim().withMessage("genderCd must be specified.")
	.isAlphanumeric().withMessage("genderCd should be isAlphanumeric."),
check('mobileNumber').optional({ checkFalsy: true,optional: true,nullable : true }).isInt().isLength({min:10}).trim().withMessage('Please enter valid mobile no.')
.isNumeric().withMessage("Age should be numeric."),
check('email').optional({ checkFalsy: true, nullable: true }).isEmail().trim().withMessage('Please enter valid email'),
body("profilePhoto"),
body("relationshipCd").isLength({min:1}).trim().withMessage("RelationshipCd must required")
.isAlphanumeric().withMessage("relationshipCd should be isAlphanumeric."),

	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("age").escape(),
	sanitizeBody("genderCd").escape(),
	sanitizeBody("mobileNumber").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("profilePhoto").escape(),
	sanitizeBody("*").escape(),
	(req, res) => {




		let imageArray = []
		if (req.files) {
			req.files.map(file => {
				imageArray.push(file.path)
			})
			console.log(imageArray)
		}




		try {
			const errors = validationResult(req);
			var userProfile = new UserProfile(

				{
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					age: req.body.age,
					genderCd: req.body.genderCd,
					email: req.body.email,
					mobileNumber: req.body.mobileNumber,
					profilePhoto: imageArray,
					relationshipCd: req.body.relationshipCd,
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
					UserProfile.findById(req.params.id, function (err, foundUserProfile) {
						if (foundUserProfile === null) {
							return notFoundResponse(res, "UserProfile not exists with this id");
						} else {
							//Check authorized user
							if (foundUserProfile._accountId.toString() !== req.user._id) {
								return unauthorizedResponse(res, "You are not authorized to do this operation.");
							} else {
								//update userProfile.
								UserProfile.findByIdAndUpdate(req.params.id, userProfile, {}, function (err) {
									if (err) {
										return ErrorResponse(res, err);
									} else {
										let userProfileData = new UserProfileData(userProfile);
										return successResponseWithData(res, "UserProfile update Success.", userProfileData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			console.log(err.message) 
			return ErrorResponse(res, err);
		}
	}
];

/**
 * UserProfile Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
const userProfileDelete = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			///check id null
			UserProfile.findById(req.params.id, function (err, foundUserProfile) {
				if (foundUserProfile === null) {
					return notFoundResponse(res, "UserProfile not exists with this id");
				} else {
					//Check authorized user
					if (foundUserProfile._accountId.toString() !== req.user._id) {
						return unauthorizedResponse(res, "You are not authorized to do this operation.");
					} else {
						//delete userProfile.
						UserProfile.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return ErrorResponse(res, err);
							} else {
								return successResponse(res, "UserProfile delete Success.");
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


export {userProfileList ,userProfileDetail ,userProfileStore, userProfileUpdate,userProfileDelete}