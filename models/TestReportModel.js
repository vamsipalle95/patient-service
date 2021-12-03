import mongoose from "mongoose";

var Schema=mongoose.Schema;

var TestReportSchema=Schema({
	// document:{type:String,required:true},
	document:[{type:Array,required:false}],
	recordDate:{type:Date,required:true},
	testName:{type:String,required:true},
	recordDoctor:{type:String,required:true},
	additionalNote:{type:String,required:true},
	_accountId:{type:Schema.ObjectId,ref:"AccountId",required:true},
  

},
{timestamps:true});

export default mongoose.model("TestReport", TestReportSchema);


