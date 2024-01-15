import { useState, useContext, useEffect } from "react"
import { useParams, useLocation, Link, useNavigate } from "react-router-dom"
import StudentSidebar from "../sidebar/StudentSidebar"
import MentorPost from "../posts/MentorPost"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util"
const StudentForYou = () => {
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const myFunction = async() => {
            const url = `https://my-guru-server.vercel.app/getForYouPosts?studentAccountId=${account.id}`;
            const settings = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization : getAccessToken()
            }
            };
            try {
                const fetchResponse = await fetch(url, settings);
                const response = await fetchResponse.json();
                setPosts(response.data);
                
                } catch (e) {
                console.log(e);
                }
        
            }
            
            myFunction()
    }, [])
    

    return(
        <>
            <div style={{
            display:'flex',
            flexDirection:'row',
            
          }}>
                <StudentSidebar/>
                <div style={{
                width:'100%',
                display:'flex',
                justifyContent:'center',
                
                }}>
                <div style={{
                display:'flex',
                flexDirection:'column',
                flexBasis:'50%'
        }}>

        {
            posts && posts.length > 0 ? posts.map(post => (
                        <MentorPost  post = {post.post}
                            mentorName={post.mentorName}
                            mentorTagline={post.mentorTagline}
                            mentorImage = {post.mentorImage}
                            
                            // onUpdate={(post) => {
                            //     for(let i = 0; i< posts.objArrayOfPosts.length;i++){
                            //         if(posts.objArrayOfPosts[i]._id === post._id){
                            //             posts.objArrayOfPosts[i] = post
                            //             console.log(posts)
                            //             break
                            //         }
                            //     }
                            //     setPosts({...posts, objArrayOfPosts:posts.objArrayOfPosts})
                            // }}
                        />
            ))
            :
            console.log('no data to show')
        }
        
        </div>


                </div>
            </div>
        </>
    )
}
export default StudentForYou