import mongoose from "mongoose";

var Schema = mongoose.Schema;

var MedicationSchema = new Schema(
	{
		_accountId: { type: Schema.ObjectId, ref: "AccountId", required: true },
		_patientId: { type: Schema.ObjectId, ref: "AccountId", required: true },

		medication: {
			"morning": [{
				name: { type: String, required: false },
				type: { type: String, required: false },
				noOfTime: { type: String, required: false },
				qty: { type: String, required: false },
				since: { type: String, required: false },
				days: { type: String, required: false }

			}],
			"afternoon": [{
				name: { type: String, required: false },
				type: { type: String, required: false },
				noOfTime: { type: String, required: false },
				qty: { type: String, required: false },
				since: { type: String, required: false },
				days: { type: String, required: false }

			}],
		"night":[{
			    name: { type: String, required: false },
				type: { type: String, required: false },
				noOfTime: { type: String, required: false },
				qty: { type: String, required: false },
				since: { type: String, required: false },
				days: { type: String, required: false }
		}]

		}
	}, { timestamps: true });

	

export default mongoose.model("Medication", MedicationSchema);
