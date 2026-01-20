import Mentor from '../model/mentor-schema.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import token from '../model/token-schema.js'
import Student from '../model/student-schema.js';
import Post from '../model/post-schema.js';
import Comment from '../model/comment-schema.js';
import Subscription from '../model/subscription-schema.js';
import Chat from '../model/chat-schema.js';
import moment from 'moment'
export const getMentorProfileController = async(request, response) => {
    
    try{
        let temp = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
        if(!temp){
            return response.status(409).json({msg:'unsuccessfull'});
        }
        return response.status(200).json(temp);
    }
    catch(error){
        return response.status(500).json(error);
    }
}
export const updateMentorProfileController = async (request, response) => {
    try {
        let temp = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
        if(!temp){
            return response.status(409).json({msg:'unsuccessfull'});
        }
        for(const key in request.body){
            temp[key] = request.body[key];
        }
        const filter = { mentorAccountId: request.query.mentorAccountId };
        const options = { new: true };
        let updatedMentor = await Mentor.findOneAndUpdate(filter, temp, options);

        if (!updatedMentor) {
            return response.status(409).json({ msg: 'Unsuccessful - Mentor not found' });
        }

        return response.status(200).json(updatedMentor);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ msg: 'Internal server error' });
    }
};
export const createPostController = async(request, response) => {
    let temp = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
    if(!temp){
        return response.status(409).json({msg:'unsuccessfull'});
    }
    try {
        const newPost = new Post(request.body);
        await newPost.save();
        temp.mentorPosts.push(newPost._id)
        const options = { new: true };
        // console.log(temp)
        await Mentor.findOneAndUpdate({mentorAccountId:request.query.mentorAccountId}, temp, options);
        return response.status(200).json({msg:'created post successfully'})
    } catch (error) {

        console.log(error)
    }
}
export const updatePostController = async(request, response) => {

    try {
        let temp = Post.findOne({_id:request.query.postId});
        if(!temp){
            return response.status(404).json('failed post update not found');
        }
        const options = {new : true}
        await Post.findOneAndUpdate({_id:request.query.postId}, request.body, options);
        return response.status(200).json('success post update');
    } catch (error) {
        return response.status(500).json('failed post updating');
    }
}
export const getPostsController = async(request, response) => {

    try{
        let objArrayOfPosts = [];
        objArrayOfPosts = await Post.find({postAccountId:request.query.mentorAccountId});
        let mentor = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
        // let mentor = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
        return response.status(200).json({objArrayOfPosts, mentorName:mentor.mentorName, mentorTagline:mentor.mentorTagline, mentorImage:mentor.mentorImage});

    }catch(error){
        return response.status(500).json('failed posts fetching');
    }
}
export const getAllPostsExceptYoursController = async(request, response) => {

    try{
        let result = []
        let objArrayOfPosts = [];
        objArrayOfPosts = await Post.find({});
        for(let i = 0;i<objArrayOfPosts.length;i++){
            if(objArrayOfPosts[i].postAccountId !== request.query.mentorAccountId){
                if(objArrayOfPosts[i].postAccess === 'For all'){
                let temp = await Mentor.findOne({mentorAccountId:objArrayOfPosts[i].postAccountId});
                
                if(temp){
                    result.push({
                        post:objArrayOfPosts[i],
                        mentorName:temp.mentorName,
                        mentorTagline:temp.mentorTagline,
                        mentorImage:temp.mentorImage,
                        
                    })
                }
            }
            }
        }
        // let mentor = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
        return response.status(200).json({result});

    }catch(error){
        return response.status(500).json('failed posts fetching');
    }
}

export const createCommentController = async(request, response) => {
    
    try {
        
        const newComment = new Comment(request.body);
        await newComment.save();
        let temp = await Post.findOne({_id:request.query.postId});
        if(!temp){
            return response.status(404).json('failed commend add not found post');
        }
        temp.postComments.push(newComment._id)
        const options = {new : true}
        await Post.findOneAndUpdate({_id:request.query.postId}, temp, options);
        return response.status(200).json(newComment._id);
    } catch (error) {
        console.log(error)
        return response.status(500).json('failed adding comment')
    }
}
export const addLikeController = async(request, response) => {
    
    try {
        
        let temp = await Post.findOne({_id:request.query.postId});
        if(!temp){
            return response.status(404).json('failed like add not found post');
        }
        
        temp.postLikes.push(request.query.likeUserId)
        // console.log(temp)
        const options = {new : true}
        await Post.findOneAndUpdate({_id:request.query.postId}, temp, options);
        return response.status(200).json('success adding likes');
    } catch (error) {
        console.log(error)
        return response.status(500).json('failed adding like')
    }
}
export const removeLikeController = async(request, response) => {
    
    try {
        let temp = await Post.findOne({_id:request.query.postId});
        if(!temp){
            return response.status(404).json('failed like add not found post');
        }
        temp = {...temp._doc, postLikes:temp._doc.postLikes.filter((e) => {
            if(e !== request.query.likeUserId) return e
        })}
        const options = {new : true}
        await Post.findOneAndUpdate({_id:request.query.postId}, temp, options);
        return response.status(200).json('success remove like');
    } catch (error) {
        console.log(error)
        return response.status(500).json('failed remove like')
    }
}

export const getCommentsController = async(request, response) => {

    try{
        let objArrayOfComments = [];
        
        let temp = request.query.postComments.split(",")
        for(let i = 0; i<temp.length;i++){
            let temp2 = await Comment.findOne({_id:temp[i]});
            console.log(temp2)
            if(temp2){
                let user = await Mentor.findOne({mentorAccountId:temp2.commentAccountId});
                if(user){
                    objArrayOfComments.push({
                        comment:temp2,
                        userName:user.mentorName,
                        userTagline:user.mentorTagline,
                        userImage:user.mentorImage,
                        userAccountId:user.mentorAccountId
                    });
                }
                else{
                    user = await Student.findOne({studentAccountId:temp2.commentAccountId});
                    if(user){
                        objArrayOfComments.push({
                            comment:temp2,
                            userName:user.studentName,
                            userTagline:'',
                            userImage:user.mentorImage,
                            userAccountId:user.studentAccountId
                        });
                    }
                }
                
            }
            
        }
        return response.status(200).json({objArrayOfComments});

    }catch(error){
        return response.status(500).json('failed comments fetching');
    }
}

export const getLikesController = async(request, response) => {

    try{
        let objArrayOfLikes = [];
        let temp = request.query.postLikes.split(",")
        console.log(temp)
        for(let i = 0; i<temp.length;i++){
            let user = {}
                 user = await Mentor.findOne({mentorAccountId:temp[i]});
                 if(user){
                    objArrayOfLikes.push({
                        userName:user.mentorName,
                        userTagline:user.mentorTagline,
                        userImage:user.mentorImage
                    });
                 }
                else{
                    user = await Student.findOne({studentAccountId:temp[i]})
                    if(user){
                        objArrayOfLikes.push({
                            userName:user.studentName,
                            userTagline:'',
                            userImage:''
                        });
                    }
                    
                }
                
        }
        return response.status(200).json({objArrayOfLikes});

    }catch(error){
        return response.status(500).json('failed likes fetching');
    }
}
export const repostPostController = async(request, response) => {
    let temp = {}
    if(request.query.role === 'mentor'){
         temp = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
    }
    
    if(!temp){
        return response.status(409).json({msg:'unsuccessfull'});
    }
    let post = await Post.findOne({_id:request.query.postId})
    if(!post){
        return response.status(409).json({msg:'unsuccessfull'});
        
    }
    try {
        temp.mentorPosts.push(request.query.postId)
        post.postReposts.push(request.query.mentorAccountId)
        const options = { new: true };
        console.log(temp)
        await Mentor.findOneAndUpdate({mentorAccountId:request.query.mentorAccountId}, temp, options);
        await Post.findOneAndUpdate({_id:request.query.postId}, post, options);
        return response.status(200).json(request.query.mentorAccountId)
    } catch (error) {

        console.log(error)
    }
}

export const deletePostController = async(request, response) => {

    try{
        await Post.findOneAndDelete({_id:request.query.postId});
        let mentor = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
        mentor = {...mentor._doc, mentorPosts:[...mentor._doc.mentorPosts.filter(e => {
            if(e._id.toString() !== request.query.postId) return e
        })]}
        // let mentor = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId});
        return response.status(200).json({objArrayOfPosts, mentorName:mentor.mentorName, mentorTagline:mentor.mentorTagline, mentorImage:mentor.mentorImage});

    }catch(error){
        return response.status(500).json('failed posts fetching');
    }
}

export const getMentorPlansController = async(request, response) => {
    try {
        let result = []
        let mentor = await Mentor.findOne({mentorAccountId:request.query.mentorAccountId})
        result = mentor.mentorPlans
        return response.status(200).json({data:result})
    } catch (error) {
        console.log(error.message);
        return response.status(500).json({msg:'failed fetching mentor plans'})
    }
}

export const getPlanStudentsController = async(request, response) => {
    try {
        let result = []
        let studentIdList = []
        let subscriptions = []
        const options = { new: true };
        if(request.query.planId === 'all'){
             subscriptions = await Subscription.find({mentorAccountId:request.query.mentorAccountId, status:true})
        }else{
            subscriptions = await Subscription.find({mentorAccountId:request.query.mentorAccountId, planId:request.query.planId, status:true})
        }
            for(let i = 0;i<subscriptions.length;i++){
                let timeDifference = moment(new Date(subscriptions[i].purchaseTimestamp)).from(new Date())
                if(timeDifference.includes('month') || timeDifference.includes('year')){
                    subscriptions[i].status = false
                    await Subscription.findOneAndUpdate({_id:subscriptions[i]._id.toString()}, subscriptions[i], options)
                }else{
                    studentIdList.push(subscriptions[i].studentAccountId)
                }
            }
            for(let i = 0; i<studentIdList.length;i++){
                let student = await Student.findOne({studentAccountId:studentIdList[i]})
                let chat = await Chat.findOne({mentorAccountId:request.query.mentorAccountId, studentAccountId:student.studentAccountId})
                result.push({
                    studentAccountId:student.studentAccountId,
                    studentName:student.studentName,
                    chatId:chat._id.toString()
                })
            }
            return response.status(200).json({data:result})
        }
    catch (error) {
        console.log(error.message)
        return response.status(200).json({msg:'failed fetching students enrolled in plan'})
    }
}

