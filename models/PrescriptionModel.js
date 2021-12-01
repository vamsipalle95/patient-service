import mongoose from "mongoose";

var Schema=mongoose.Schema;

var PrescriptionSchema=new Schema({
    prescriptionDocument:[{type:Array,required:false}] ,
    recordDate:{type:Date,required:true},
    recordName:{type:String,required:true},
    recordPrescribedByDr:{type:String,required:true},
    additionalNotes:{type:String,required:true},
    _accountId:{type:Schema.ObjectId,ref:"AccountId",required:true},

},

{ timestamps: true});


export default mongoose.model("Prescription", PrescriptionSchema);

