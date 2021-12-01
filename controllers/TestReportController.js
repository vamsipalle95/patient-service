

import TestReport from "../models/TestReportModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import auth from "../middlewares/jwt.js";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config()

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);


function TestReportData(data) {
    this.id = data._id;
    this.document = data.document;
    this.recordDate = data.recordDate;
    this.testName = data.testName;
    this.recordDoctor = data.recordDoctor;
    this.additionalNote = data.additionalNote;
    this.createdAt = data.createdAt;
}

/**
 * TestReport Store
 * @param   {string}  document
 * @param   {Date}    recordDate
 * @param   {string}  testName
 * @param   {string}  recordDoctor
 * @param   {string}  additionalNote
 * @returns {Object}
 */

const testReortStore = [
    auth,
    body("document"),
    body("recordDate").isLength({ min: 1 }).trim().withMessage("recordDate must be Specified")
        .custom((value, { req }) => {
            return TestReport.findOne({ recordDate: value, _accountId: req.user._id, _id: { "$ne": req.params.id } }).then(testReport => {
                if (testReport) {
                    return Promise.reject("RecordDate already exist with this ISBN no.");
                }
            });
        }),
    body("testName").isLength({ mn: 1 }).trim().withMessage("testName must be Specified"),
    body("recordDoctor").isLength({ mn: 1 }).trim().withMessage("recordDoctor must be Specified"),
    body("additionalNote").isLength({ mn: 1 }).trim().withMessage("additionalNote must be Specified"),

    sanitizeBody("document").escape(),
    sanitizeBody("recordDate").escape(),
    sanitizeBody("testName").escape(),
    sanitizeBody("recordDoctor").escape(),
    sanitizeBody("additionalNote").escape(),
    sanitizeBody("*").escape(),
    async (req, res) => {


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
            var testReport = new TestReport({
                document: imagesArray,
                recordDate: req.body.recordDate,
                testName: req.body.testName,
                recordDoctor: req.body.recordDoctor,
                additionalNote: req.body.additionalNote,
                _accountId: req.user._id,
            });
            if (!errors.isEmpty()) {
                return validationErrorWithData(res, "Validation Error.", errors.array())
            }
            else {
                testReport.save(function (err) {
                    if (err) {
                        return ErrorResponse(res, err);
                    }
                    let testReportData = new TestReportData(testReport);
                    console.log(testReportData);
                    return successResponseWithData(res, "Operation SuccessFull", testReportData)
                });


            }


        }
        //throw error in json response with status 500. 
        catch (err) {
            return ErrorResponse(res, err);
        }

    }
]


/** Test Report List
 * @return {object}
 * 
 */

const testReportList = [
    auth,
    (req, res) => {
        try {
            TestReport.find({ _accountId: req.user._id }, "testName recordDoctor").then((testReport) => {
                if (testReport.length > 0) {
                    return successResponseWithData(res, "Operation SuccessFull", testReport);
                }
                else {
                    return successResponseWithData(res, "Operation SuccessFull", {})
                }
            });
        }
        catch (err) {
            return ErrorResponse(res, err);
        }
    }

];

/**
 * @params {object}   id
 * @returns{object}
 */


const testReportDetails = [
    auth,
    (req, res) => {

        // check id is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return successResponseWithData(res, "Operation SuccessFull", {});
        }
        try {
            TestReport.findById({ _accountId: req.user._id, _id: req.params.id }, "document").then((testreprot) => {
                //id check null
                if (testreprot !== null) {
                    let testReportData = new TestReportData(testreprot);
                    console.log(testReportData);
                    return successResponseWithData(res, "Operation SuccessFull", testReportData);
                }
                else {
                    return successResponseWithData(res, "Operation SuccessFull", {});
                }
            })
        }
        catch (err) {
            return ErrorResponse(res, err);
        }

    }

];


/**
 * UserTestReport update.
 * 
 * @param {string}      document 
 * @param {Date}      recordDate
 * @param {string}      testName
 * @param {string}      recordDoctor
 * @param {string}      additionalNote
 * 
 * @returns {Object}
 */


const testReportUpdate = [
    auth,
    body("document"),
    body("recordDate").isLength({ min: 1 }).trim().withMessage("recordDate must be Specified"),
    body("testName").isLength({ mn: 1 }).trim().withMessage("testName must be Specified"),
    body("recordDoctor").isLength({ mn: 1 }).trim().withMessage("recordDoctor must be Specified"),
    body("additionalNote").isLength({ mn: 1 }).trim().withMessage("additionalNote must be Specified"),

    sanitizeBody("document").escape(),
    sanitizeBody("recordDate").escape(),
    sanitizeBody("testName").escape(),
    sanitizeBody("recordDoctor").escape(),
    sanitizeBody("additionalNote").escape(),
    sanitizeBody("*").escape(),

    (req, res) => {
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
            var testReport = new TestReport({
                document: imagesArray,
                recordDate: req.body.recordDate,
                testName: req.body.testName,
                recordDoctor: req.body.recordDoctor,
                additionalNote: req.body.additionalNote,
                _accountId: req.user._id,
                _id: req.params.id
            });

            if (!errors.isEmpty()) {
                return validationErrorWithData(res, "validation Error", errors.array())
            }
            else {
                if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                    return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
                } else {
                    TestReport.findById(req.params.id, function (err, foundtestReportId) {
                        if (foundtestReportId === null) {
                            return notFoundResponse(res, "foundtestReportId not exists with this id");
                        } else {
                            //Check authorized user
                            if (foundtestReportId._accountId.toString() !== req.user._id) {
                                return unauthorizedResponse(res, "You are not authorized to do this operation.");
                            } else {
                                //update TestReport.
                                TestReport.findByIdAndUpdate(req.params.id, testReport, {}, function (err) {
                                    if (err) {
                                        return ErrorResponse(res, err);
                                    } else {
                                        let testReportData = new TestReportData(testReport);
                                        console.log(testReportData);
                                        return successResponseWithData(res, "testReportData update Success.", testReportData);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        } catch (err) {
            console.log(err.message)
            //throw error in json response with status 500. 
            return ErrorResponse(res, err);
        }
    }
];

/**TestResport Delete
 * @param {string}      id
 * @return{Object}  Id
 */
const deleteTestReport = [
    auth,
    (req, res) => {
        //check id valid?

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
        }
        try {
            //check null id??
            TestReport.findById(req.params.id, function (err, foundUser) {
                if (foundUser == null) {
                    return notFoundResponse(res, "foundUser not exists with this id");
                }
                /// check authorization
                else {
                    if (foundUser._accountId.toString() !== req.user._id) {
                        return unauthorizedResponse(res, "You are not authorize person to do this operation")
                    }
                    //delete userProfile.
                    else {
                        TestReport.findByIdAndRemove(req.params.id, function (err) {
                            if (err) {
                                return ErrorResponse(err, res);
                            }
                            else {
                                return successResponse(res, "Test Resport SuccessFull Deleted")
                            }
                        })
                    }
                }
            })

        } catch (err) {
            return ErrorResponse(res, err);
        }
    }
];

export {testReortStore,testReportList,testReportDetails,testReportUpdate,deleteTestReport}