import mongoose from "mongoose";
const mentorSchema = mongoose.Schema({
    mentorAccountId:{
        type:String,
        required:false
    },
    mentorExams:{
        type:String,
        required:false
    },
    mentorExams:{
        type:[String],
        required:false
    },
    mentorSubjects:{
        type:[String],
        required:false
    },
    mentorFollowers:{
        type:[String],
        required:false
    },
    mentorPosts:{
        type:[String],
        required:false
    },
    mentorPlans:[
        {
            perks:{
                type:String,
                required:false
            }
        }
    ],
    education :[{
        schoolName : {
            
            type:String,
            required:false,

        },
        course:{
            type:String,
            required:false,

        },
        startYear:{
            type:Date,
            required:false
        },
        finishYear:{ 
            type:Date,
            required:false
        },
        grade:{
            type:String,
            required:false
        }
}],
workExperiences:[{
    companyName:{
        type:String,
        required:false
    },
    workTitle:{
        type:String,
        required:false
    },
    aboutWork:{
        type:String,
        required:false
    },
    location:{
        type:String,
        required:false
    },
    startDate:{
        type:Date,
        required:false
    },
    finishDate:{
        type:Date,
        required:false
    },
    workSkills:{
        type:[String],
        required:false
    }
}],
achievements:[{
    achievementDesc:{
        type:String,
        required:false
    }
}],
mentorChats:{
    type:String,
    required:false
}




})

const mentor = mongoose.model('mentor', mentorSchema);
export default mentor;