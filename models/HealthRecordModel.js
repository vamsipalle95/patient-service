import mongoose from "mongoose";

var Schema = mongoose.Schema;

var HealthRecordSchema = new Schema({
	height: {type: String, required: true},
	weight: {type: String, required: true},
	bloodGroup: {type: String, required: false},
	genderCd: {type: String, required: true},
	age: {type: Number, required: true},
	_accountId: { type: Schema.ObjectId, ref: "AccountId", required: true },
}, {timestamps: true});



export default mongoose.model("HealthRecord", HealthRecordSchema);