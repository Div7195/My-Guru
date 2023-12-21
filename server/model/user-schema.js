import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required:true
    },
    role :{
        type:String,
        required:true
    }
})

const user = mongoose.model('user', userSchema);
export default user;