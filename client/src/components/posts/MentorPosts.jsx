import MentorSidebar from "../sidebar/MentorSidebar"
import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util.js"
import MentorPost from "./MentorPost.jsx"

const MentorPosts = () => {
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [posts, setPosts] = useState({})
    useEffect(() => {
        const myFunction = async() => {
        const url = `https://my-guru-server.vercel.app/getPosts?mentorAccountId=${account.id}`;
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
            setPosts(response);
            
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
                <MentorSidebar/>
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
            posts.objArrayOfPosts && posts.objArrayOfPosts.length > 0 ? posts.objArrayOfPosts.map(post => (
                        <MentorPost  post = {post}
                            mentorName={posts.mentorName}
                            mentorTagline={posts.mentorTagline}
                            mentorImage = {posts.mentorImage}
                            
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

export default MentorPosts