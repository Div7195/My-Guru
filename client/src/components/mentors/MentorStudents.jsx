import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"
import MentorSidebar from "../sidebar/MentorSidebar"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util"



const MentorStudents = () => {
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const {planId} = useParams()
    const [data, setData] = useState([])

    useEffect(() => {
        const myFunction = async() => {
            const url = `https://my-guru-server.vercel.app/getPlanStudents?mentorAccountId=${account.id}&planId=${planId}`;
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

                    <div style={{
                        display:'flex',
                        flexDirection:'row',
                        border:'2px solid #ebe1f0',
                        borderRadius:'5px',
                        padding:'5px',
                        cursor:'pointer',
                        background:'#c7dff5',
                        marginTop:'10px'
                    }}>

                     <div style={{
                    display: 'block',
                    minWidth: '40px',
                    borderRadius:'25px',
                    background:'#cda8ff',
                    width:'40px',
                    height:'40px',
                    
                   
                }}>
                    <img src={'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Student Image" style={{
                   
                    display: 'block',     
                    width: '100%',
                    minWidth: '100%',
                    height: '100%',
                    minHeight: '100%',
                    borderWidth: '0px',
                    outline: 'none' ,
                    borderRadius:'60px',
                    objectFit:'cover'
                }} />
                </div>
                    <div style={{
                    display:'flex',
                    flexDirection:'column',
                    marginLeft:'5px',
                    flexGrow:2
                }}
                >
                <div style={{
                    display:'flex',
                    flexDirection:"row",
                    
                }}>
                <div style={{
                    fontSize:'16px',
                    fontFamily:'DM Sans',
                    fontWeight:'800',
                    color:'#566474',
                    borderRadius:'5px',
                    padding:'5px',
                    background:"#dad4f0"
                }}>
                {e.studentName}
                {console.log(e)}
                </div>

                

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
                                    onClick={() => {navigate(`/mentor/chats/${e.chatId}`)}}
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