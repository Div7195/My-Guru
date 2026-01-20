import multer from 'multer'
import {GridFsStorage} from 'multer-gridfs-storage'
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config()
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const storage = new GridFsStorage({
    url:`mongodb://localhost:27017/myguru`,
    // url: `mongodb+srv://${username}:${password}@movieverse-app.tpux4jp.mongodb.net/myGuru?retryWrites=true&w=majority`,
    file: (request, file) => {
      
      const match = ["image/jpeg", "image/png", "image/jpg, video/mp4"];
      if (match.indexOf(file.mimetype) === -1) {
        return `${Date.now()}-post-${file.originalname}`;
      }
      
      return {
        bucketName: "fs",
        filename: `${Date.now()}-post-${file.originalname}`,
        
      };
    
    },
  });
  
export default multer({ storage })
