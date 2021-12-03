import mongoose from "mongoose";

var Schema = mongoose.Schema;

var vaccineDetail = new Schema({
	vaccineDocument: [{ type: Array, require: false }],
	vaccineName: { type: String, require: true },
	doseNumber: { type: Number, require: true },
	date: { type: Date, require: true },
	place: { type: String, require: true },
	beneficiaryId: { type: Number, require: true },
	nextDueDate: { type: Date, require: false },
	_accountId: { type: Schema.ObjectId, ref: "AccountId", required: true },

}, { timestamps: true });


export default mongoose.model("VaccineDetail", vaccineDetail);