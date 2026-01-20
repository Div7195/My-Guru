import grid  from "gridfs-stream";
import mongoose from "mongoose";
import Chat from "../model/chat-schema.js";
const url = 'http://localhost:8000'

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open',()=>{
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db,{
        bucketName: 'fs'
    });
    gfs= grid(conn.db, mongoose.mongo);
    gfs.collection('fs');

})

export const uploadImageController=(request , response)=>{
    try {
    if(!request.file){
        return response.status(404).json({msg: "File Not Found"})
    }

    const imageUrl = `${url}/file/${request.file.filename}`;

    return response.status(200).json(imageUrl);
} catch (error) {
    console.log(error)
    return
}
}
export const uploadChatImageController=async (request , response)=>{
    try {
        
    if(!request.file){
        return response.status(404).json({msg: "File Not Found"})
    }

    const imageUrl = `${url}/file/${request.file.filename}`;
    const options = { new: true };
        let chat = await Chat.findOne({_id:request.query.chatId})
        if(chat){
            let newMessage = {
                senderRole:request.query.role,
                senderAccountId:request.query.senderAccountId,
                messageType:imageUrl.toLowerCase().includes('mp4') === true?'video':'image',
                messageMediaLink:imageUrl,
                messageBody:'',
                messageTimestamp:new Date(),
                seenFlag:false
            }
            // console.log('fdsfsdfdsfs')
            // console.log(newMessage)
            chat.messages.push(newMessage)
            await Chat.findOneAndUpdate({_id:request.query.chatId}, chat, options )
            return response.status(200).json({data:newMessage})
        }
   
} catch (error) {
    console.log(error)
    return
}
}


export const getImageController = async(request , response) => {
    try {
        const file = await gfs.files.findOne({ filename: request.params.filename })
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(response);

    } catch (error) {
        console.log(error)
        return response.status(500).json({ msg: error.message});
    }
}
