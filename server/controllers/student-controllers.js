import Mentor from '../model/mentor-schema.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import token from '../model/token-schema.js'
import Student from '../model/student-schema.js';
import Post from '../model/post-schema.js';
import Comment from '../model/comment-schema.js';
import Stripe from 'stripe';
import Subscription from '../model/subscription-schema.js';
import moment from 'moment'
import Chat from '../model/chat-schema.js';
dotenv.config()
export const getStudentProfileController = async(request, response) => {
    
    try{
        let temp = await Student.findOne({studentAccountId:request.query.studentAccountId});
       
        if(!temp){
            return response.status(409).json({msg:'unsuccessfull'});
        }
        return response.status(200).json(temp);
    }
    catch(error){
        return response.status(500).json(error);
    }
}
export const updateStudentProfileController = async (request, response) => {
    try {
        let temp = await Student.findOne({studentAccountId:request.query.studentAccountId});
       
        if(!temp){
            return response.status(409).json({msg:'unsuccessfull'});
        }
        
        for(const key in request.body){
            temp[key] = request.body[key];
        }
        
        const filter = { studentAccountId: request.query.studentAccountId };
        const options = { new: true };
        let updatedStudent = await Student.findOneAndUpdate(filter, temp, options);

        if (!updatedStudent) {
            return response.status(409).json({ msg: 'Unsuccessful - Student not found' });
        }

        return response.status(200).json(updatedStudent);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ msg: 'Internal server error' });
    }
};

export const getExploredPostsController = async(request, response) => {

    try{
        let result = []
        let objArrayOfPosts = [];
        let student  = {}
        let mentor = {}
        
        if(request.query.userRole === 'student'){
            student = await Student.findOne({studentAccountId:request.query.userAccountId})
            
        }else{
            mentor = await Student.findOne({mentorAccountId:request.query.userAccountId})
        }
        if(student || mentor){                 
            objArrayOfPosts = await Post.find({postAccess:'For all'})
            
            if(request.query.searchQuery === '' && request.query.queryExams === '' && request.query.querySubjects == ''){
                
                if(request.query.userRole === 'student' && student){
                    
                    if(student.studentExams.length === 0 && student.studentSubjects.length === 0) {
                        for(let i = 0; i<objArrayOfPosts.length;i++){
                            
                            if(result.length === 5) break;
                            let mentor = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId})
                            
                            result.push({
                                post:objArrayOfPosts[i],
                                mentorName:mentor.mentorName,
                                mentorTagline:mentor.mentorTagline,
                                mentorImage:mentor.mentorImage,
                        
                            })
                        }
                    }else{
                        if(student.studentExams.length === 0){
                            objArrayOfPosts = objArrayOfPosts.filter((e) => {
                                for(let i = 0; i<e.postSubjects.length;i++){
                                    if(student.studentSubjects.includes(e.postSubjects[i])){
                                        return true
                                    }
                                }
                            })
                        }else if(student.studentSubjects.length === 0) {
                            objArrayOfPosts = objArrayOfPosts.filter((e) => {
                                for(let i = 0; i<e.postExams.length;i++){
                                    if(student.studentExams.includes(e.postExams[i])){
                                        return true
                                    }
                                }
                            })
                        }
                        for(let i = 0; i<objArrayOfPosts.length;i++){
                            
                            let mentor = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId})
                            
                            result.push({
                                post:objArrayOfPosts[i],
                                mentorName:mentor.mentorName,
                                mentorTagline:mentor.mentorTagline,
                                mentorImage:mentor.mentorImage,
                                
                            })
                        }

                    }
                }else if(request.query.userRole === 'mentor' && mentor){
                    if(mentor.mentorExams.length === 0 && mentor.mentorSubjects.length === 0) {
                        for(let i = 0; i<objArrayOfPosts.length;i++){
                            
                            if(result.length === 5) break;
                            let author = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId})
                            
                            result.push({
                                post:objArrayOfPosts[i],
                                mentorName:author.mentorName,
                                mentorTagline:author.mentorTagline,
                                mentorImage:author.mentorImage,
                                
                            })
                        }
                    }else{
                        if(mentor.mentorExams.length === 0){
                            objArrayOfPosts = objArrayOfPosts.filter((e) => {
                                for(let i = 0; i<e.postSubjects.length;i++){
                                    if(mentor.mentorSubjects.includes(e.postSubjects[i])){
                                        return true
                                    }
                                }
                            })
                        }else if(mentor.mentorSubjects.length === 0) {
                            objArrayOfPosts = objArrayOfPosts.filter((e) => {
                                for(let i = 0; i<e.postExams.length;i++){
                                    if(mentor.mentorExams.includes(e.postExams[i])){
                                        return true
                                    }
                                }
                            })
                        }
                        for(let i = 0; i<objArrayOfPosts.length;i++){
                            
                            let author = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId})
                            if(result.length === 5) break;
                            result.push({
                                post:objArrayOfPosts[i],
                                mentorName:author.mentorName,
                                mentorTagline:author.mentorTagline,
                                mentorImage:author.mentorImage,
                               
                            })
                        }

                    }
                }
            }else{
                if(request.query.queryExams !== ''){
                objArrayOfPosts = objArrayOfPosts.filter((e) => {
                    for(let i = 0;i<e.postExams.length;i++){
                        if(request.query.queryExams.includes(e.postExams[i])){
                            return true
                        }
                    }
                })
            }else{
                if(request.query.userRole === 'student'){
                    if(student.studentExams.length>0){
                objArrayOfPosts = objArrayOfPosts.filter((e) => {
                    for(let i = 0; i<e.postExams.length;i++){
                        if(student.studentExams.includes(e.postExams[i])){
                            return true
                        }
                    }
                })
            }
                }else{
                    if(mentor.mentorExams.length>0){
                    objArrayOfPosts = objArrayOfPosts.filter((e) => {
                        for(let i = 0; i<e.postExams.length;i++){
                            if(mentor.mentorExams.includes(e.postExams[i])){
                                return true
                            }
                        }
                    })
                }
            }
            }
            if(request.query.querySubjects !== ''){
                objArrayOfPosts = objArrayOfPosts.filter((e) => {
                    for(let i = 0;i<e.postSubjects.length;i++){
                        if(request.query.querySubjects.includes(e.postSubjects[i])){
                            return true
                        }
                    }
                })
            }else{
                if(request.query.userRole === 'student'){
                    if(student.studentSubjects.length>0){
                    objArrayOfPosts = objArrayOfPosts.filter((e) => {
                        for(let i = 0; i<e.postSubjects.length;i++){
                            if(student.studentSubjects.includes(e.postSubjects[i])){
                                return true
                            }
                        }
                    })
                }
                }else{
                    if(mentor.mentorSubjects.length>0){
                    objArrayOfPosts = objArrayOfPosts.filter((e) => {
                        for(let i = 0; i<e.postSubjects.length;i++){
                            if(mentor.mentorSubjects.includes(e.postSubjects[i])){
                                return true
                            }
                        }
                    })
                }
            }
            }
            if(request.query.searchQuery !== ''){
                let keywordArray = request.query.searchQuery.split(" ")
                
                objArrayOfPosts = objArrayOfPosts.filter((e) => {
                    for(let i = 0; i<keywordArray.length;i++){
                        if(e.postTitle.toLowerCase().includes(keywordArray[i].toLowerCase())){
                            return true
                        }
                    }
                })
                
            }else{
                
            }
            for(let i = 0; i<objArrayOfPosts.length;i++){
                let mentor = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId})
                
                result.push({
                    post:objArrayOfPosts[i],
                    mentorName:mentor.mentorName,
                    mentorTagline:mentor.mentorTagline,
                    mentorImage:mentor.mentorImage,
                })
            }

        } 
    }
        return response.status(200).json({data:result});

    }catch(error){
        return response.status(500).json('failed posts explore');
    }
}

export const getForYouPostsController = async(request, response) => {
    try {
        let result = []
        let activeMentorIdList = []
        let postsToFetch = []
        const options = { new: true };
        let activeSubscriptions = await Subscription.find({studentAccountId:request.query.studentAccountId, status:true})
        
        for(let i = 0; i< activeSubscriptions.length;i++){
            let timeDifference = moment(new Date(activeSubscriptions[i].purchaseTimestamp)).from(new Date())
            console.log(timeDifference)
            if(timeDifference.includes('month') || timeDifference.includes('year')){
                activeSubscriptions[i].status = false
                await Subscription.findOneAndUpdate({_id:activeSubscriptions[i]._id.toString()}, activeSubscriptions[i], options)
            }else{
                activeMentorIdList.push(activeSubscriptions[i].mentorAccountId)
            }
        }
        //removing duplicate mentors
        activeMentorIdList.filter((mentorAccountId, index) => {
        return  activeMentorIdList.indexOf(mentorAccountId) === index; 
        })

        for(let i = 0;i < activeMentorIdList.length;i++){
            let mentor = await Mentor.findOne({mentorAccountId:activeMentorIdList[i]})
            if(mentor){
            for(let i = 0; i<mentor.mentorPosts.length;i++){
                postsToFetch.push(mentor.mentorPosts[i])
            }
            if(postsToFetch.length > 0){
                for(let j = 0;j<postsToFetch.length;j++){
                    let post = await Post.findOne({_id:postsToFetch[j]})
                    if(post){
                        result.push({
                            post:post,
                            mentorName:mentor.mentorName,
                            mentorTagline:mentor.mentorTagline,
                            mentorImage:mentor.mentorImage,
                        })
                }
                }
            }
            postsToFetch = []
        }
        }
        return response.status(200).json({data:result})
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({msg:'failed fetching for you posts'})
    }
}

export const getYourMentorsController = async(request, response) => {
    try {
        let result = []
        let activeMentorIdList = []        
        const options = { new: true };
        let activeSubscriptions = await Subscription.find({studentAccountId:request.query.studentAccountId, status:true})
        for(let i = 0; i< activeSubscriptions.length;i++){
            let timeDifference = moment(new Date(activeSubscriptions[i].purchaseTimestamp)).from(new Date())
            if(timeDifference.includes('month') || timeDifference.includes('year')){
                activeSubscriptions[i].status = false
                await Subscription.findOneAndUpdate({_id:activeSubscriptions[i]._id.toString()}, activeSubscriptions[i], options)
            }else{
                activeMentorIdList.push(activeSubscriptions[i].mentorAccountId)
            }
        }
        //removing duplicate mentors
        activeMentorIdList.filter((mentorAccountId, index) => {
        return  activeMentorIdList.indexOf(mentorAccountId) === index; 
        })

        for(let i = 0; i<activeMentorIdList.length;i++){
            let mentor = await Mentor.findOne({mentorAccountId:activeMentorIdList[i]})
            if(mentor){
                let chat = await Chat.findOne({mentorAccountId:mentor.mentorAccountId, studentAccountId:request.query.studentAccountId})
                result.push({
                    mentor:{
                        mentorAccountId:mentor.mentorAccountId,
                        mentorName:mentor.mentorName,
                        mentorTagline:mentor.mentorTagline,
                        mentorImage:mentor.mentorImage,
                        mentorExams:mentor.mentorExams,
                        mentorSubjects:mentor.mentorSubjects,
                        mentorRating:mentor.rating,
                        mentorStudentsCount:0
                    },
                    chatId:chat._id.toString()
                })
                
            }
        }
        return response.status(200).json({
            data:result
        })

        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({msg:'failed fetching your mentors'})
    }
}

export const getYourPlansController = async(request, response) => {
    try {
        let activeSubscriptions = []
        let result  = []
        const options = { new: true };
        let studentSubscriptions = await Subscription.find({studentAccountId:request.query.studentAccountId, status:true})
        console.log('woowow')
        
        for(let i = 0; i< studentSubscriptions.length;i++){
            let timeDifference = moment(new Date(studentSubscriptions[i].purchaseTimestamp)).from(new Date())
            if(timeDifference.includes('month') || timeDifference.includes('year')){
                studentSubscriptions[i].status = false
                await Subscription.findOneAndUpdate({_id:studentSubscriptions[i]._id.toString()}, studentSubscriptions[i], options)
            }else{
                activeSubscriptions.push(studentSubscriptions[i])
            }
        }

        for(let i = 0;i<studentSubscriptions.length;i++){
            let mentor = await Mentor.findOne({mentorAccountId:studentSubscriptions[i].mentorAccountId})
            let plan = {}
            for(let j = 0;j<mentor.mentorPlans.length;j++){
                if(mentor.mentorPlans[j]._id.toString() === studentSubscriptions[i].planId){
                    plan = mentor.mentorPlans[j]
                    break
                }
            }
            result.push({
                videoCalls:plan.videoCalls,
                streams:plan.streams,
                posts:plan.posts,
                otherPerks:plan.otherPerks,
                price:plan.price,
                amount:studentSubscriptions[i].amount,
                purchaseTimestamp:studentSubscriptions[i].purchaseTimestamp,
                mentorAccountId:mentor.mentorAccountId
            })
        }
        return response.status(200).json({data:result})
    } catch (error) {
        console.log(error.message)
        return response.status(200).json({msg:'failed fetching plans'})
    }
}

export const getChatMessagesController = async(request, response) => {
    try {
        let result = []
        const options = { new: true };
        let mentorName = ''
        let studentName = ''
        let chat = await Chat.findOne({_id:request.query.chatId})
        if(request.query.role === 'student'){
            let mentor = await Mentor.findOne({mentorAccountId:chat.mentorAccountId})
            mentorName = mentor.mentorName
            result = chat.messages
            return response.status(200).json({data:result, name:mentorName})
        }else{
            let student = await Student.findOne({studentAccountId:chat.studentAccountId})
            studentName = student.studentName
            result = chat.messages
            return response.status(200).json({data:result, name:studentName})
        }
        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({msg:'failed fetching chat messages'})
    }
}

export const updateChatMessagesController = async(request, response) => {
    try {
        const options = { new: true };
        let chat = await Chat.findOne({_id:request.query.chatId})
        if(chat){
            chat.messages.push(request.body.newMessage)
            await Chat.findOneAndUpdate({_id:request.query.chatId}, chat, options )
            return response.status(200).json({msg:'success saving new message'})
        }
        
    } catch (error) {
        console.log(error.message)
        return response.status(500).json({msg:'update chat messages'})
    }
}



export const bookmarkPostController = async(request, response) => {
        try {
            let post = await Post.findOne({_id:request.query.postId})
            if(request.query.userRole === 'student'){
                let student = await Student.findOne({studentAccountId:request.query.userAccountId})
               
                if(student){
                   student = {...student._doc, studentSavedPosts:[...student._doc.studentSavedPosts, request.query.postId]}
                   
                   post = {...post._doc, postBookmarks:[...post._doc.postBookmarks, request.query.userAccountId]}
                    const options = { new: true };
                  let updatedStudent = await Student.findOneAndUpdate({studentAccountId:request.query.userAccountId}, student, options )
                  if (!updatedStudent) {
                    return response.status(409).json({ msg: 'Unsuccessful - Student not found' });
                }
                let updatedPost = await Post.findOneAndUpdate({_id:request.query.postId}, post, options)
                if(!updatedPost){
                    return response.status(409).json({ msg:'Unsuccessfull - Post not found'})
                }
                return response.status(200).json({msg:'success adding to postBookmarks'})
                }
            }else{
                let mentor = await Mentor.findOne({mentor:request.query.userAccountId})
                if(mentor){
                    mentor = {...mentor._doc, mentorSavedPosts:[...mentor._doc.mentorSavedPosts, request.query.postId]}
                   post = {...post._doc, postBookmarks:[...post._doc.postBookmarks, request.query.userAccountId]}

                   const options = { new: true };
                  let updatedMentor = await Mentor.findOneAndUpdate({mentor:request.query.userAccountId}, mentor, options )
                  if (!updatedMentor) {
                    return response.status(409).json({ msg: 'Unsuccessful - mentor not found' });
                }
                let updatedPost = await Post.findOneAndUpdate({_id:request.query.postId}, post, options)
                if(!updatedPost){
                    return response.status(409).json({ msg:'Unsuccessfull - Post not found'})
                }
                return response.status(200).json({msg:'success adding to postBookmarks'})
                }
            }
        } catch (error) {
            console.log(error)
            return response.status(500).json('failed bookmarking post')
        }
}

export const removeBookmarkController = async(request, response) => {
    try {
        let post = await Post.findOne({_id:request.query.postId})
        if(request.query.userRole === 'student'){
            let student = await Student.findOne({studentAccountId:request.query.userAccountId})
            
            if(student){
                student = {...student._doc, studentSavedPosts:student._doc.studentSavedPosts.filter((e) => {
                    
                    return e !== request.query.postId
                  })}

              post = {...post._doc, postBookmarks:post._doc.postBookmarks.filter((e) => {
                return e !== request.query.userAccountId
              })}
              const options = { new: true };
              let updatedStudent = await Student.findOneAndUpdate({studentAccountId:request.query.userAccountId}, student, options )
              if (!updatedStudent) {
                return response.status(409).json({ msg: 'Unsuccessful - Student not found' });
            }
            let updatedPost = await Post.findOneAndUpdate({_id:request.query.postId}, post, options)
            if(!updatedPost){
                return response.status(409).json({ msg:'Unsuccessfull - Post not found'})
            }
            return response.status(200).json({msg:'success adding to postBookmarks'})
            }
        }else{
            let mentor = await Mentor.findOne({mentor:request.query.userAccountId})
            if(mentor){
                mentor = {...mentor._doc, mentorSavedPosts:mentor._doc.mentorSavedPosts.filter((e) => {
                    return e !== request.query.postId
                  })}
              console.log(mentor.mentorSavedPosts)

              post = {...post._doc, postBookmarks:post._doc.postBookmarks.filter((e) => {
                return e !== request.query.userAccountId
              })}
                  const options = { new: true };
              let updatedMentor = await Mentor.findOneAndUpdate({mentor:request.query.userAccountId}, mentor, options )
              if (!updatedMentor) {
                return response.status(409).json({ msg: 'Unsuccessful - mentor not found' });
            }
            let updatedPost = await Post.findOneAndUpdate({_id:request.query.postId}, post, options)
            if(!updatedPost){
                return response.status(409).json({ msg:'Unsuccessfull - Post not found'})
            }
            return response.status(200).json({msg:'success adding to postBookmarks'})
            }
        }
    } catch (error) {
        return response.status(500).json('failed bookmarking post')
    }
}

export const getBookmarkedPostsController = async(request, response) => {
    try {
        let result = []
    let objArrayOfPosts = await Post.find({})
    if(request.query.userRole === 'student'){
        let student = await Student.findOne({studentAccountId:request.query.userAccountId})
            if(student){
                for(let i = 0;i<objArrayOfPosts.length;i++){
                    if(student.studentSavedPosts.includes(objArrayOfPosts[i]._id)){
                        let author = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId})
                        result.push({
                            post:objArrayOfPosts[i],
                            mentorName:author.mentorName,
                            mentorImage:author.mentorImage,
                            mentorTagline:author.mentorTagline,
                        })
                    }
                }
            }
        }else if(request.query.userRole === 'mentor'){
            let mentor = await Mentor.findOne({mentorAccountId:request.query.userAccountId})
            if(mentor){
                for(let i = 0;i<objArrayOfPosts.length;i++){
                    if(mentor.mentorSavedPosts.includes(objArrayOfPosts[i]._id)){
                        let author = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId})
                        result.push({
                            post:objArrayOfPosts[i],
                            mentorImage:author.mentorImage,
                            mentorName:author.mentorName,
                            mentorTagline:author.mentorTagline,
                        })
                    }
                }
            }
        }
        return response.status(200).json({data:result})
    } catch (error) {
        console.log(error)
        return response.status(500).json({msg:'failed fetching bookmarks'})
    }
    
    }


    export const getMentorsController = async(request, response) => {
        try {
            let result = []
            let objArrayOfMentors = await Mentor.find({})
            
            let student = {}
            let mentor = {}
            let queryExams = []
            let querySubjects = []
            let sortBy = ''
            let searchQueryArray = []
            if(request.query.searchQuery === '' && request.query.queryExams === '' && request.query.querySubjects === '' && request.query.sortBy === ''){
                for(let i = 0; i<objArrayOfMentors.length;i++){
                    // if(queryExams.length === 0 && querySubjects.length === 0){
                    //     if(request.query.userRole === 'student' && student.studentExams.length === 0 && student.studentSubjects.length ===0){
                    //         if(result.length === 5) break
                    //     }else if(request.query.userRole === 'mentor' && mentor.mentorExams.length === 0 && mentor.mentorSubjects.length ===0){
                    //         if(result.length === 5) break
                    //     }
                    // }
                    result.push({
                        mentorAccountId:objArrayOfMentors[i].mentorAccountId,
                        mentorName:objArrayOfMentors[i].mentorName,
                        mentorTagline:objArrayOfMentors[i].mentorTagline,
                        mentorImage:objArrayOfMentors[i].mentorImage,
                        mentorExams:objArrayOfMentors[i].mentorExams,
                        mentorSubjects:objArrayOfMentors[i].mentorSubjects,
                        mentorRating:objArrayOfMentors[i].rating,
                        mentorStudentsCount:0
                    })
                }
                return response.status(200).json({data:result})
            }
            // console.log(request.query.searchQuery, request.query.queryExams, request.query.querySubjects, request.query.sortBy);
            if(request.query.searchQuery !== ''){
                searchQueryArray = request.query.searchQuery.split(" ")
            }
            if(request.query.userRole === 'mentor'){
                mentor = await Mentor.findOne({mentorAccountId:request.query.userAccountId})

            }else{
                student = await Student.findOne({studentAccountId:request.query.userAccountId})
                
            }
            if(request.query.queryExams !== ''){
                queryExams = request.query.queryExams.split(',')
            }
            if(request.query.querySubjects !== ''){
                querySubjects = request.query.querySubjects.split(',')
            }
            if(request.query.sortBy !== ''){
                sortBy = request.query.sortBy
            }

            if(queryExams.length > 0){
                objArrayOfMentors = objArrayOfMentors.filter((e) => {
                    for(let i = 0; i < queryExams.length;i++){
                        return e.mentorExams.includes(queryExams[i])
                    }
                })
            }else{
                if(request.query.userRole === 'student'){
                    if(student.studentExams.length > 0){
                    objArrayOfMentors = objArrayOfMentors.filter((e) => {
                        for(let i = 0; i < student.studentExams.length;i++){
                            return e.mentorExams.includes(queryExams[i])
                        }
                    })
                }
                    
                }else if(request.query.userRole === 'mentor'){
                    if(mentor.mentorExams.length > 0){
                    objArrayOfMentors = objArrayOfMentors.filter((e) => {
                        for(let i = 0; i < mentor.mentorExams.length;i++){
                            return e.mentorExams.includes(queryExams[i])
                        }
                    })
                }
            }
            }

            if(querySubjects.length > 0){
                objArrayOfMentors = objArrayOfMentors.filter((e) => {
                    for(let i = 0; i < querySubjects.length;i++){
                        return e.mentorSubjects.includes(querySubjects[i])
                    }
                })
            }else{
                if(request.query.userRole === 'student'){
                    if(student.studentSubjects.length > 0){
                    objArrayOfMentors = objArrayOfMentors.filter((e) => {
                        for(let i = 0; i < student.studentSubjects.length;i++){
                            return e.mentorSubjects.includes(querySubjects[i])
                        }
                    })
                }
                }else if(request.query.userRole === 'mentor'){
                    if(mentor.mentorSubjects.length > 0){
                    objArrayOfMentors = objArrayOfMentors.filter((e) => {
                        for(let i = 0; i < mentor.mentorSubjects.length;i++){
                            return e.mentorSubjects.includes(querySubjects[i])
                        }
                    })
                }
            }
            }
            if(searchQueryArray.length > 0){
                
                objArrayOfMentors = objArrayOfMentors.filter((e) => {
                    for(let i = 0; i<searchQueryArray.length;i++){
                        return e.mentorName.toLowerCase().includes(searchQueryArray[i].toLowerCase())
                    }
                })
            }
            if(sortBy === 'Rating'){
                objArrayOfMentors = objArrayOfMentors.sort((a, b) => {
                    return a.rating - b.rating;
                })
            }else if(sortBy === 'No. of students'){
                objArrayOfMentors = objArrayOfMentors.sort((a, b) => {
                    return a.mentorFollowers.length - b.mentorFollowers.length
                })
            }

            // filtering of mentors who havent set their profile name
            objArrayOfMentors = objArrayOfMentors.filter((e) => {
                return e.mentorName !== ''
            })


            for(let i = 0; i<objArrayOfMentors.length;i++){
                if(queryExams.length === 0 && querySubjects.length === 0){
                    if(request.query.userRole === 'student' && student.studentExams.length === 0 && student.studentSubjects.length ===0){
                        if(result.length === 5) break
                    }else if(request.query.userRole === 'mentor' && mentor.mentorExams.length === 0 && mentor.mentorSubjects.length ===0){
                        if(result.length === 5) break
                    }
                }
                result.push({
                    mentorAccountId:objArrayOfMentors[i].mentorAccountId,
                    mentorName:objArrayOfMentors[i].mentorName,
                    mentorTagline:objArrayOfMentors[i].mentorTagline,
                    mentorImage:objArrayOfMentors[i].mentorImage,
                    mentorExams:objArrayOfMentors[i].mentorExams,
                    mentorSubjects:objArrayOfMentors[i].mentorSubjects,
                    mentorRating:objArrayOfMentors[i].rating,
                    mentorStudentsCount:0
                })
            }
            return response.status(200).json({data:result})

        } catch (error) {
            console.log(error)
            return response.status(500).json({msg:'failed fetching mentors'})
        }
    }

export const paymentController = async(request, response) => {
        try {
            const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
            let plan = {}
            let planId = ''
            let planToShowToUser = {}
            let student = await Student.findOne({studentAccountId:request.query.studentAccountId})
            let mentor = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId})

            if(mentor && student){
                let studentSubscriptions = await Subscription.find({mentorAccountId:mentor.mentorAccountId, studentAccountId:student.studentAccountId, status:true})
                let paymentAllowOrNot = true
                for(let i = 0;i<studentSubscriptions.length;i++){
                    let timeDifference = moment(new Date(studentSubscriptions[i].purchaseTimestamp)).from(new Date())

                    //paymentAllowOrNot will be set to false, if there is atleast one subscription that is still ongoing 
                    if(timeDifference.includes('month') || timeDifference.includes('year')){
                        studentSubscriptions[i].status = false
                        await Subscription.findOneAndUpdate({_id:studentSubscriptions[i]._id.toString()}, studentSubscriptions[i], options)
                    }else{
                        paymentAllowOrNot = false
                        return response.status(400).json({msg:'payment not allowed'})
                    }
                }

                if(paymentAllowOrNot === true){
                for(let i = 0;i<mentor.mentorPlans.length;i++){
                    if(request.query.planId === mentor.mentorPlans[i]._id.toString()){
                        plan = mentor.mentorPlans[i]
                        planToShowToUser = {
                            videoCalls:plan.videoCalls,
                            streams:plan.streams,
                            posts:plan.posts,
                            otherPerks:plan.otherPerks,
                            price:plan.price
                        }
                        planId = plan._id.toString()
                        break
                    }
                }
                if(plan !== null && planToShowToUser !== null && planId !== ''){
                    let customer = {}
                    if(student.payerId === '' || !student.payerId){
                        customer = await stripe.customers.create({
                        name: student.studentName !== ''?student.studentName:'tempname',
                        email: 'jennyrosen@example.com',
                        address:{"city":"kota","country":"india","line1":"unr","line2":"kota","postal_code":"324002","state":"rajasthan"},
                      });
                    }
                    
                    
                    const session = await stripe.checkout.sessions.create({
                        metadata : {
                               studentAccountId: student.studentAccountId,
                               mentorAccountId : mentor.mentorAccountId,
                               planId:planId
                        },  
                        customer:(!student.payerId || student.payerId === '') === true ? customer.id:student.payerId,
                              
                        payment_method_types:['card'],
                        mode:'payment',
                        line_items:[{
                            price_data:{
                                currency:"inr",
                                product_data:{
                                    name:`Video calls: ${plan.videoCalls}, Streams: ${plan.streams}, Posts/Articles:${plan.posts},  Other perks: ${plan.otherPerks}`
                                },
                                unit_amount:plan.price*100,
                            },
                            quantity:1
                        }],
                        success_url:`${process.env.CLIENT_URL}/public/success.html`,
                        cancel_url:`${process.env.CLIENT_URL}/public/cancel.html`,
                    })
                    // console.log(session)
                    return  response.status(200).json({url:session.url})
                }
                
              
            }   
        }
        } catch (error) {
            console.log(error)
            response.status(500).json({msg:error.message})
        }
} 


export const postPaymentController = async(request, response) => {
    
    try {
        
        // return response.status(200).json({message:'working'})
    const sig = request.headers['stripe-signature'];
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
    const endpointSecret = process.env.ENDPOINT_SECRET_KEY
    let event;
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        switch (event.type) {
            case 'payment_intent.succeeded':
              const paymentIntent = event.data.object;
              console.log(paymentIntent.metadata)
              // Then define and call a method to handle the successful payment intent.
              // handlePaymentIntentSucceeded(paymentIntent);
              break;
              case 'checkout.session.completed':
                console.log('ooooooooooooooooooo')
              const intent = event.data.object;
              console.log(intent)
              
              let mentorAccountId = intent.metadata.mentorAccountId
              let studentAccountId = intent.metadata.studentAccountId
              let planId = intent.metadata.planId
              let amount = intent.amount_total
              if(mentorAccountId && studentAccountId && planId){
                    const newSubscription = new Subscription({
                        studentAccountId:studentAccountId,
                        mentorAccountId:mentorAccountId,
                        planId:planId,
                        purchaseTimestamp:new Date(),
                        status:true,
                        amount:amount/100
                    })
                    await newSubscription.save()
                    const newChat = new Chat({
                        mentorAccountId:mentorAccountId,
                        studentAccountId:studentAccountId,
                        messages:[]
                    })
                    await newChat.save()
                    return response.status(200).json({msg:'payment done and details saved success'})
                }
              break;
            case 'payment_method.attached':
              const paymentMethod = event.data.object;
              // Then define and call a method to handle the successful attachment of a PaymentMethod.
              // handlePaymentMethodAttached(paymentMethod);
              break;
            // ... handle other event types
            default:
              console.log(`Unhandled event type ${event.type}`);
          }
    } catch (error) {
        console.log(error)
        response.status(500).json({msg:error.message})
    }
}