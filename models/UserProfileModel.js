import mongoose from "mongoose";


var Schema = mongoose.Schema;

var UserProfileSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	age: { type: Number, required: true},
	genderCd: {type: String, required: true},
	mobileNumber: {type: Number,required: false},
	email: {type: String,required: false,lowercase: true},
	relationshipCd: {type: String, required: false},
	patientUID: {type: String, required: true},
	profilePhoto: [{type:Array,required:false}],
	_accountId: { type: Schema.ObjectId, ref: "AccountId", required: true },
}, {timestamps: true});

export default mongoose.model("UserProfile", UserProfileSchema);

