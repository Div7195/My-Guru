import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"
import MentorSidebar from "../sidebar/MentorSidebar"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util"
import '../../css/mentorStudents.css'


const MentorStudents = () => {
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const {planId} = useParams()
    const [data, setData] = useState([])

    useEffect(() => {
        const myFunction = async() => {
            const url = `http://localhost:8000/getPlanStudents?mentorAccountId=${account.id}&planId=${planId}`;
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
                <MentorSidebar/>
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
                data && data.length > 0 ?
                data.map(e => (

                    <div className="main-box">

                     <div className="image-box">
                    <img src={'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Student Image" className="image" />
                </div>
                    <div className="sub-box"
                >
                <div style={{
                    display:'flex',
                    flexDirection:"row",
                    
                }}>
                <div className="name">
                {e.studentName}
                {console.log(e)}
                </div>

                

                </div>

                        <div className="btns-box">
                                    <div className="chats-btn"
                                    onClick={() => {navigate(`/mentor/chats/${e.chatId}`)}}
                                    >
                            Chats
                            </div>

                                    <div className="video-call-btn"
                                    onClick={() => {navigate(`/mentor/video_call/${e.chatId}`)}}
                                    >
                            Video Call
                            </div>
                                </div>

                
                



                </div>
                </div>
                ))
                
                :
                <div>
                </div>
            }
                    

                    </div>

            </div>
        </div>
        </>
    )

}

export default MentorStudents