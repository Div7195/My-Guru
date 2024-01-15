import { useState, useEffect, useContext } from "react"
import { useNavigate, Link, useParams, useLocation } from "react-router-dom"
import MentorItem from "./MentorItem"
import StudentSidebar from "../sidebar/StudentSidebar"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util"
const StudentMentors = () => {
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [data, setData] = useState([])
    useEffect(() => {
        const myFunction = async() => {
            const url = `https://my-guru-server.vercel.app/getYourMentors?studentAccountId=${account.id}`;
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
                    console.log(response.data)
                    setData(response.data);
                    
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
                fontFamily:'DM Sans'
                }}> 

                    <div style={{
                        display:'flex',
                        flexDirection:'column',
                        width:'80%',
                    }}>
         {
                data && data.length > 0 ? data.map(e => (
                    <div >
                            <div style={{
                                display:'flex',
                                flexDirection:'column'
                            }}>
                                <div onClick={() => {navigate(`/student/mentor/profile/${e.mentor.mentorAccountId}`)}} >
                                    <MentorItem  mentor = {e.mentor}/>
                                </div>
                                
                                
                                <div style={{
                                    display:'flex',
                                    flexDirection:'row',
                                    background:'#f2f2f2',
                                    borderRadius:'5px',
                                    padding:'5px',
                                    
                                }}>
                                    <div style={{
                                        borderRadius:'5px',
                                        border: '1px solid #142683',
                                        background:'green',
                                        padding: '5px 5px 5px 5px',
                                        color:'white',
                                        fontSize:'16px',
                                        fontWeight:'500',
                                        height:'fit-content',
                                        cursor:'pointer',
                                    }}
                                    onClick={() => {navigate(`/student/chats/${e.chatId}`)}}
                                    >
                            Chats
                            </div>

                                    <div style={{
                                        marginLeft:'auto',
                                        marginRight:'0px',
                                        borderRadius:'5px',
                                        border: '1px solid #142683',
                                        background:'green',
                                        padding: '5px 5px 5px 5px',
                                        color:'white',
                                        fontSize:'16px',
                                        fontWeight:'500',
                                        height:'fit-content',
                                        cursor:'pointer',
                                    }}
                                    onClick={() => {navigate(`/student/video_call/${e.chatId}`)}}
                                    >
                            Video Call
                            </div>
                                </div>
                            </div>
                            
                    </div>
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
export default StudentMentors