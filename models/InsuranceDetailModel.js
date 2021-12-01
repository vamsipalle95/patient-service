import mongoose from "mongoose";

const Schema = mongoose.Schema;

var insuranceDetail = new Schema({

    insuranceImage: [{ type: Array, required: false }],
    insuranceType: { type: String, required: true },
    insuranceCo_Name: { type: String, required: true },
    policyNumber: { type: String, required: true },
    policy_StartDate: { type: Date, required: true },
    policy_EndDate: { type: Date, required: true },
    premium_Amount: { type: String, required: true },
    premiumPayableBasis: { type: String, required: true },
    policyCoverageAmount: { type: String, required: true },
    members_Covered: { type: String, required: true },
    coveredMemberName: { type: Array, required: true },
    _accountId: { type: Schema.ObjectId, ref: "AccountId", required: true }

}, { timestamps: true });


export default mongoose.model("InsuranceDetail", insuranceDetail);