import User from "../model/user-schema.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import token from '../model/token-schema.js'
import Mentor from "../model/mentor-schema.js";
import Student from "../model/student-schema.js";

export const signupUserController = async(request, response) => {
    try {
        let temp = {};
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        
        const user = {username: request.body.username, password: hashedPassword, role:request.body.role};
        const newUser = new User(user);
        await newUser.save();
        if(newUser.role === 'mentor'){
            const newMentor = new Mentor({
                mentorAccountId:newUser._id,
                mentorName:'',
                mentorEmail:'',
                mentorContact:'',
                rating:0,
                mentorTagline:'',
                mentorImage:'',
                mentorExams:[],
                mentorSubjects:[],
                mentorPosts:[],
                mentorPlans:[],
                education:[],
                workExperiences:[],
                achievements:[],
                reviewsGot:[],
                mentorChats:[],
                mentorSavedPosts:[],
                statistics:{},
                
            })
            await newMentor.save();
        }else{
            const newMentor = new Student({
                studentAccountId:newUser._id,
                studentName:'',
                studentEmail:'',
                studentContact:'',
                aboutYourself:'',
                payerId:'',
                studentExams:[],
                studentSavedPosts:[],
                studentLikedPosts:[],
                studentSubjects:[],
                studentChats:[],
                reviewsPosted:[],
                ratingGiven:[]
                
                
            })
            await newMentor.save();
        }
        return response.status(200).json({temp, msg:'signup successfull'})
    } catch (error) {
        return response.status(500).json(error);
    }
}

export const loginUserController = async(request, response) => {
    
    let user = await User.findOne({username : request.body.username});
    if(!user){
        return response.status(400).json({msg:'Username does not exist'});
    }
    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if(match){
            if(request.body.role !== user.role){
                return response.status(400).json({msg:'Account does not exist'});
            }
             const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, {expiresIn :'200m' });
             const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
             const newToken = new token({token:refreshToken});
             await newToken.save();
             return response.status(200).json({accessToken : accessToken, refreshToken : refreshToken, username : user.username,role : user.role, mongoId:user._id});
        }else{
            return response.status(400).json({msg:'Password does not match'});
        }
    } catch (error) {
        console.log(error)
        return response.status(500).json({msg:'Error while login user'});
    }
}