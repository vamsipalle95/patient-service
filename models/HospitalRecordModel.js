import mongoose from "mongoose";
var Schema = mongoose.Schema;


var hospitalrecordSchema = new Schema({

	hospitalDocument: [{ type: Array, required: true }],
	recordDate: { type: Date, required: true },
	hospitalRecord: { type: String, required: true },
	doctorName: { type: String, required: false },
	additionalNote: { type: String, required: false },
	_accountId: { type: Schema.ObjectId, ref: "AccountId", required: true }
},
{ timestamps: true }
);

export default mongoose.model("HospitalRecord", hospitalrecordSchema);

