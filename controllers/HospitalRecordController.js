
import HospitalRecord from "../models/HospitalRecordModel.js";
import { body, validationResult } from "express-validator";
import { sanitizeBody } from"express-validator";
import auth from "../middlewares/jwt.js";
import {successResponse,successResponseWithData,ErrorResponse,notFoundResponse,validationErrorWithData,unauthorizedResponse}  from "../helpers/apiResponse.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config()

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);



var mongoose = require('mongoose');
mongoose.set("useFindAndModify", false);

function HospitalRecordData(data) {
    this.id = data.id;
    this.hospitalDocument = data.hospitalDocument;
    this.recordDate = data.recordDate;
    this.hospitalRecord = data.hospitalRecord;
    this.doctorName = data.doctorName;
    this.additionalNote = data.additionalNote;
    this.createdAt = data.createdAt;
}

/** hospitalRecords Store
 * @params {String}    hospitalDocument
 * @params {String}    recordDate
 * @params {String}    hospitalRecord
 * @params {String}    doctorName
 * @params {String}    additionalNote
 */

const hospitalRecordStore = [
    auth,

    body('hospitalDocument'),
    body("recordDate").isLength({ min: 1 }).trim().withMessage("recordDate must be Specified"),
    body("hospitalRecord").isLength({ min: 1 }).trim().withMessage("hospitalRecord must be Specified")
        .isAlphanumeric().withMessage("hospitalRecord must be Specified.")
        .custom((value, { req }) => {
            return HospitalRecord.findOne({ hospitalRecord: value, _accountId: req.user._id, _id: { "$ne": req.params.id } }).then(hospitalRecord => {
                if (hospitalRecord) {
                    return Promise.reject("HospitalRecord already exist with this record no.");
                }
            });
        }),
    body("doctorName").isLength({ min: 1 }).trim().withMessage("doctorName must be Specified"),
    body("additionalNote").isLength({ min: 1 }).trim().withMessage("additionalNote must be Specified"),

    sanitizeBody("hospitalDocument").escape(),
    sanitizeBody("recordDate").escape(),
    sanitizeBody("hospitalRecord").escape(),
    sanitizeBody("doctorName").escape(),
    sanitizeBody("additionalNote").escape(),
    sanitizeBody("*").escape(),

    function (req, res) {


        try {

            let imagesArray = []
            if (req.files == 0) {
                return apiResponse.validationErrorWithData(res, "Atlest One File Required", "Validation Error")

            }
            else {
                req.files.map(file => {
                    imagesArray.push(file.path)
                });
            }




            var errors = validationResult(req);
            var hospitalRecord = new HospitalRecord({

                hospitalDocument: imagesArray,
                recordDate: req.body.recordDate,
                hospitalRecord: req.body.hospitalRecord,
                doctorName: req.body.doctorName,
                additionalNote: req.body.additionalNote,
                _accountId: req.user._id,

            })

            if (!errors.isEmpty()) {
                return validationErrorWithData(res, "Validation Error.", errors.array())
            }
            else {
                hospitalRecord.save(function (err) {
                    if (err) {
                        return ErrorResponse(res, err);
                    }
                    else {
                        let hospitalRecordData = new HospitalRecordData(hospitalRecord);
                        console.log(hospitalRecordData)
                        return successResponseWithData(res, "Operaration Success Full", hospitalRecordData);
                    }
                });
            }
        }
        catch (err) {
            console.log(err.message)
            return ErrorResponse(res, err);
        }
    }
];


/** HospitalRecord List
 * @return{object} 
 * 
 */

const hospitalRecordList = [
    auth,

    function (req, res) {
        try {
            HospitalRecord.find({ _accountId: req.user._id }).then((hospitalRecord) => {
                if (hospitalRecord.length > 0) {
                    return successResponseWithData(res, "Operation SuccessFull", hospitalRecord)

                }
                else {
                    return successResponseWithData(res, "Operation SuccessFull", [])
                }
            })

        }
        catch (err) {
            return ErrorResponse(res, err);
        }
    }

];


const hospitalDetails = [
    auth,
    function (req, res) {

        if (!mongoose.Types.ObjectId(req.params.id)) {
            return successResponseWithData(res, "operationSuccessFull", []);

        }
        try {
            HospitalRecord.findOne({ _accountId: req.user._id, _id: req.params.id }, "hospitalDocument").then((hospitalRecord) => {
                if (hospitalRecord !== null) {
                    let hospitalRecordData = new HospitalRecordData(hospitalRecord);
                    return successResponseWithData(res, "operationSuccessFull", hospitalRecordData)
                }
                else {
                    return successResponseWithData(res, "operationSuccessFull", {});
                }
            });
        }
        catch (err) {
            return ErrorResponse(res, err);
        }
    }
];


/** HeathRecord Update
 * 
 * @param {string}      image 
 * @param {string}      recordDate
 * @param {string}      hospitalRecord
 * @param {string}      doctorName
 * @param {string}      additionalNote
 * 
 * return {Object}
 * 
 */

const hospitalUpdate = [
    auth,
    body('hospitalDocument'),
    body("recordDate").isLength({ min: 1 }).trim().withMessage("recordDate must be Specified"),
    body("hospitalRecord").isLength({ min: 1 }).trim().withMessage("hospitalRecord must be Specified")
        .isAlphanumeric().withMessage("hospitalRecord must be Specified."),
    body("doctorName").isLength({ min: 1 }).trim().withMessage("doctorName must be Specified"),
    body("additionalNote").isLength({ min: 1 }).trim().withMessage("additionalNote must be Specified"),

    sanitizeBody("hospitalDocument").escape(),
    sanitizeBody("recordDate").escape(),
    sanitizeBody("hospitalRecord").escape(),
    sanitizeBody("doctorName").escape(),
    sanitizeBody("additionalNote").escape(),
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
            var hospitalRecord = new HospitalRecord({
                hospitalDocument: imagesArray,
                recordDate: req.body.recordDate,
                hospitalRecord: req.body.hospitalRecord,
                doctorName: req.body.doctorName,
                additionalNote: req.body.additionalNote,
                _accountId: req.user._id,
                _id: req.params.id
            })
            if (!errors.isEmpty()) {
                return validationErrorWithData(res, "Validation Error.", errors.array())
            }
            else {
                if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                    return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
                } else {
                    HospitalRecord.findById(req.params.id, function (err, foundUserHospitalRecord) {
                        if (foundUserHospitalRecord === null) {
                            return notFoundResponse(res, "foundUserHospitalRecord not exists with this id");
                        } else {

                            //Check authorized user
                            if (foundUserHospitalRecord._accountId.toString() !== req.user._id) {
                                return unauthorizedResponse(res, "You are not authorized to do this operation.");
                            } else {
                                //update userProfile.
                                HospitalRecord.findByIdAndUpdate(req.params.id, hospitalRecord, {}, function (err) {
                                    if (err) {
                                        return ErrorResponse(res, err);
                                    } else {
                                        let hospitalRecordData = new HospitalRecordData(hospitalRecord);
                                        console.log(hospitalRecordData);
                                        return successResponseWithData(res, "hospitalRecord update Success.", hospitalRecordData);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
        catch (err) {
            console.log(err.message)
            return ErrorResponse(res.err);
        }
    }
];

const hospitalRecordDelete = [
    auth,
    function (req, res) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return validationErrorWithData(res, "Invalid Error.", "Invalid ID");
        }
        try {
            HospitalRecord.findById(req.params.id, function (err, foundUserHospitalRecord) {
                if (foundUserHospitalRecord === null) {
                    return notFoundResponse(res, "UserProfile not exists with this id");
                } else {
                    //Check authorized user
                    if (foundUserHospitalRecord._accountId.toString() !== req.user._id) {
                        return unauthorizedResponse(res, "You are not authorized to do this operation.");
                    } else {
                        //delete userProfile.
                        HospitalRecord.findByIdAndRemove(req.params.id, function (err) {
                            if (err) {
                                return ErrorResponse(res, err);
                            } else {
                                return successResponse(res, "HospitalRecord delete Success.");
                            }
                        });
                    }
                }
            });

        }
        catch (err) {
            return ErrorResponse(res, err);
        }

    }
];


export {hospitalRecordStore,hospitalRecordList,hospitalDetails,hospitalUpdate,hospitalRecordDelete}