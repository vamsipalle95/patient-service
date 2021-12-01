import InsuranceDetail from "../models/InsuranceDetailModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import auth from "../middlewares/jwt.js";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config()

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);



function InsuranceDetailsData(data) {
    this.id = data._id;
    this.insuranceImage = data.insuranceImage;
    this.insuranceType = data.insuranceType;
    this.insuranceCo_Name = data.insuranceCo_Name;
    this.policyNumber = data.policyNumber;
    this.policy_StartDate = data.policy_StartDate;
    this.policy_EndDate = data.policy_EndDate;
    this.premium_Amount = data.premium_Amount;
    this.premiumPayableBasis = data.premiumPayableBasis;
    this.policyCoverageAmount = data.policyCoverageAmount;
    this.members_Covered = data.members_Covered;
    this.coveredMemberName = data.coveredMemberName;
    this.createdAt = data.createdAt;
}

/**  InsuranceDetails store
 * @params {String}  image
 * @params {String}  insuranceType
 * @params {String}  insuranceCo_Name
 * @params {String}  policyNumber
 * @params {String}  policy_StartDate
 * @params {String}  policy_EndDate
 * @params {String}  premium_Amount
 * @params {String}  premiumPayableBasis
 * @params {String}  policyCoverageAmount
 * @params {String}  members_Covered
 * @params {String}  coveredMemberName
 */

const insuranceDetailSotre = [
    auth,
    body('insuranceImage'),
    body('insuranceType').isLength({ min: 1 }).trim().withMessage("insuranceType must be Specified"),
    body('insuranceCo_Name').isLength({ min: 1 }).trim().withMessage("insuranceCo_Name must be Specified")
        .isAlphanumeric().withMessage("insuranceCo_Name should be Alphanumeric."),
    body('policyNumber').isLength({ min: 1 }).trim().withMessage("policyNumber must be Specified")
        .isAlphanumeric().withMessage("policyNumber should be Alphanumeric.")
        .custom((value, { req }) => {
            return InsuranceDetail.findOne({ policyNumber: value, _accountId: req.user._id, _id: { "$ne": req.params.id } }).then(insuranceDetail => {
                if (insuranceDetail) {
                    return Promise.reject("policyNumber already exist with this record no.");
                }
            });
        }),
    body('policy_StartDate').isLength({ min: 1 }).trim().withMessage("policy_StartDate must be Specified"),
    body('policy_EndDate').isLength({ min: 1 }).trim().withMessage("policy_EndDate must be Specified"),
    body('premium_Amount').isLength({ min: 1 }).trim().withMessage("premium_Amount must be Specified")
        .isAlphanumeric().withMessage("premium_Amount should be Alphanumeric."),
    body('premiumPayableBasis').isLength({ min: 1 }).trim().withMessage("premiumPayableBasis must be Specified")
        .isAlphanumeric().withMessage("premiumPayableBasis should be Alphanumeric."),
    body('policyCoverageAmount').isLength({ min: 1 }).trim().withMessage("policyCoverageAmount must be Specified")
        .isAlphanumeric().withMessage("policyCoverageAmount should be Alphanumeric."),
    body('members_Covered').isLength({ min: 1 }).trim().withMessage("members_Covered must be Specified")
        .isAlphanumeric().withMessage("members_Covered should be Alphanumeric."),
    body('coveredMemberName').isLength({ min: 1 }).trim().withMessage("coveredMemberName must be Specified")
        .isAlphanumeric().withMessage("coveredMemberName should be Alphanumeric."),

    sanitizeBody("insuranceImage").escape(),
    sanitizeBody("insuranceType").escape(),
    sanitizeBody("insuranceCo_Name").escape(),
    sanitizeBody("policyNumber").escape(),
    sanitizeBody("policy_StartDate").escape(),
    sanitizeBody("policy_EndDate").escape(),
    sanitizeBody("premium_Amount").escape(),
    sanitizeBody("premiumPayableBasis").escape(),
    sanitizeBody("policyCoverageAmount").escape(),
    sanitizeBody("members_Covered").escape(),
    sanitizeBody("coveredMemberName").escape(),
    sanitizeBody("*").escape(),


    function (req, res) {

        try {

            let imagesArray = []
            if (req.files == 0) {
                return validationErrorWithData(res, "Atlest One File Required", "Validation Error")

            }
            else {
                req.files.map(file => {
                    imagesArray.push(file.path)
                });
            }

            var errors = validationResult(req);
            var insuranceDetail = new InsuranceDetail({
                insuranceImage: imagesArray,
                insuranceType: req.body.insuranceType,
                insuranceCo_Name: req.body.insuranceCo_Name,
                policyNumber: req.body.policyNumber,
                policy_StartDate: req.body.policy_StartDate,
                policy_EndDate: req.body.policy_EndDate,
                premium_Amount: req.body.premium_Amount,
                premiumPayableBasis: req.body.premiumPayableBasis,
                policyCoverageAmount: req.body.policyCoverageAmount,
                members_Covered: req.body.members_Covered,
                coveredMemberName: req.body.coveredMemberName,

                _accountId: req.user._id

            })
            if (!errors.isEmpty()) {
                return validationErrorWithData(res, "validation Error", errors.array());

            }
            else {
                insuranceDetail.save(function (err) {
                    if (err) {
                        return ErrorResponse(res, err);
                    }
                    else {
                        let insuranceDetailsData = new InsuranceDetailsData(insuranceDetail);
                        console.log(insuranceDetailsData);
                        return successResponseWithData(res, "operation SuccessFull", insuranceDetailsData)
                    }
                });
            }

        }
        catch (err) {
            return ErrorResponse(res, err);
        }
    }

];


/**insuranceDetails Update
 * 
 */


const insuranceDetailUpdate = [
    auth,
    body('insuranceImage'),
    body('insuranceType').isLength({ min: 1 }).trim().withMessage("insuranceType must be Specified"),
    body('insuranceCo_Name').isLength({ min: 1 }).trim().withMessage("insuranceCo_Name must be Specified")
        .isAlphanumeric().withMessage("insuranceCo_Name should be Alphanumeric."),
    body('policyNumber').isLength({ min: 1 }).trim().withMessage("policyNumber must be Specified"),
    body('policy_StartDate').isLength({ min: 1 }).trim().withMessage("policy_StartDate must be Specified"),
    body('policy_EndDate').isLength({ min: 1 }).trim().withMessage("policy_EndDate must be Specified"),
    body('premium_Amount').isLength({ min: 1 }).trim().withMessage("premium_Amount must be Specified")
        .isAlphanumeric().withMessage("premium_Amount should be Alphanumeric."),
    body('premiumPayableBasis').isLength({ min: 1 }).trim().withMessage("premiumPayableBasis must be Specified")
        .isAlphanumeric().withMessage("premiumPayableBasis should be Alphanumeric."),
    body('policyCoverageAmount').isLength({ min: 1 }).trim().withMessage("policyCoverageAmount must be Specified")
        .isAlphanumeric().withMessage("policyCoverageAmount should be Alphanumeric."),
    body('members_Covered').isLength({ min: 1 }).trim().withMessage("members_Covered must be Specified")
        .isAlphanumeric().withMessage("members_Covered should be Alphanumeric."),
    body('coveredMemberName').isLength({ min: 1 }).trim().withMessage("coveredMemberName must be Specified")
        .isAlphanumeric().withMessage("coveredMemberName should be Alphanumeric."),

    sanitizeBody("insuranceImage").escape(),
    sanitizeBody("insuranceType").escape(),
    sanitizeBody("insuranceCo_Name").escape(),
    sanitizeBody("policyNumber").escape(),
    sanitizeBody("policy_StartDate").escape(),
    sanitizeBody("policy_EndDate").escape(),
    sanitizeBody("premium_Amount").escape(),
    sanitizeBody("premiumPayableBasis").escape(),
    sanitizeBody("policyCoverageAmount").escape(),
    sanitizeBody("members_Covered").escape(),
    sanitizeBody("coveredMemberName").escape(),
    sanitizeBody("*").escape(),


    function (req, res) {
        try {
            let imagesArray = []
            if (req.files == 0) {
                return validationErrorWithData(res, "Atlest One File Required", "Validation Error")

            }
            else {
                req.files.map(file => {
                    imagesArray.push(file.path)
                });
            }
            const errors = validationResult(req);
            var insuranecDetail = new InsuranceDetail({
                insuranceImage: imagesArray,
                insuranceType: req.body.insuranceType,
                insuranceCo_Name: req.body.insuranceCo_Name,
                policyNumber: req.body.policyNumber,
                policy_StartDate: req.body.policy_StartDate,
                policy_EndDate: req.body.policy_EndDate,
                premium_Amount: req.body.premium_Amount,
                premiumPayableBasis: req.body.premiumPayableBasis,
                policyCoverageAmount: req.body.policyCoverageAmount,
                members_Covered: req.body.members_Covered,
                coveredMemberName: req.body.coveredMemberName,
                _accountId: req.user._id,
                _id: req.params.id
            })
            if (!errors.isEmpty()) {
                return validationErrorWithData(res, "Invalid Error", errors.array())
            }
            else {
                if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                    return validationErrorWithData(res, "Invalid Error", "Invalid Id")
                }
                else {
                    InsuranceDetail.findById(req.params.id, function (err, foundByInsuranceDetail) {
                        if (foundByInsuranceDetail === null) {
                            return notFoundResponse(res, "foundByInsuranceDetail does not exits by Id")
                        }
                        else {
                            if (foundByInsuranceDetail._accountId.toString() !== req.user._id) {
                                return unauthorizedResponse(res, "You are not authorized to do this operation.")
                            }
                            else {
                                InsuranceDetail.findByIdAndUpdate(req.params.id, insuranecDetail, {}, function (err) {
                                    if (err) {
                                        return ErrorResponse(res, err);
                                    }
                                    else {
                                        let insuranceDetailsData = new InsuranceDetailsData(insuranecDetail);
                                        return successResponseWithData(res, "operation is SuccesFull", insuranceDetailsData)
                                    }
                                })
                            }
                        }
                    })

                }

            }
        }
        catch (err) {
            return ErrorResponse(res, err);
        }
    }
];



const insuranceDetailList = [
    auth,
    function (req, res) {
        try {
            InsuranceDetail.find({ _accountId: req.user._id }, "insuranceType policyNumber policy_StartDate policy_EndDate").then((insuranceDetail) => {
                if (insuranceDetail.length > 0) {
                    return successResponseWithData(res, "Operation SuccessFull", insuranceDetail);
                }
                else {
                    return successResponseWithData(res, "operation SuccessFull", []);
                }
            })
        }
        catch (err) {
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

const insuranceDetails = [
    auth,
    function (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return successResponseWithData(res, "Operation success", {});
        }
        try {
            InsuranceDetail.findOne({ _accountId: req.user._id, _id: req.params.id }, "insuranceImage").then((insuranceDetail) => {
                if (insuranceDetail !== null) {
                    let insuranceDetailData = new InsuranceDetailsData(insuranceDetail);
                    return successResponseWithData(res, "Operation success", insuranceDetailData);
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


const insuranceDetailDelete = [
    auth,

    function (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return validationErrorWithData(res, "validation Id", "validation Id")
        }
        try {
            InsuranceDetail.findById(req.params.id, function (err, foundInsuranceDetail) {
                if (foundInsuranceDetail == null) {
                    return notFoundResponse(res, "InsuranceDetail does not Exits");
                }
                else {
                    /// check authentication
                    if (foundInsuranceDetail._accountId.toString() !== req.user._id) {

                        return unauthorizedResponse(res, "You are not authorized to do this operation.")
                    }
                    else {
                        InsuranceDetail.findByIdAndRemove(req.params.id, function (err) {
                            if (err) {
                                return ErrorResponse(res, err);
                            }
                            else {
                                return successResponse(res, "InsuranceDetail SuccessFull Deleted")

                            }
                        });
                    }
                }
            })
        }
        catch (err) {
            return ErrorResponse(res, err);
        }
    }
];


export {insuranceDetailSotre,insuranceDetailUpdate,insuranceDetailList,insuranceDetails,insuranceDetailDelete}