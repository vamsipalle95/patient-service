import path from 'path';
import multer from 'multer';
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {

        
          if (file.fieldname === "profilePhoto") {
            cb(null, './public/patient/profilePhoto/');
          }
            else if (file.fieldname === "prescriptionDocument") {
                cb(null, './public/patient/document/');
            }
          else if (file.fieldname === "document") {
               cb(null, './public/patient/testReport/')
           }
         
           else if (file.fieldname === "hospitalDocument") {
               cb(null, './public/patient/hospitalRecord')
           }
           else if (file.fieldname === "insuranceImage") {
            cb(null, './public/patient/insuranceDetail')
        }
        else if (file.fieldname === "vaccineDocument") {
          cb(null, './public/patient/vaccineDetail')
         
      }
        },

        filename:(req,file,cb)=>{
         if (file.fieldname === "profilePhoto") {
            cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
        }

           else if (file.fieldname === "prescriptionDocument") {
                cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
            }
          else if (file.fieldname === "document") {
            cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
          }
          else if (file.fieldname === "hospitalDocument") {
            cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
          }
          else if (file.fieldname === "insuranceImage") {
            cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
          }
          else if (file.fieldname === "vaccineDocument") {
            cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
          }
          
        }
    });

   
      
      const upload = multer({ storage: storage })


    
      export default upload