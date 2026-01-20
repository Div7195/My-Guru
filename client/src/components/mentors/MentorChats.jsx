import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"
import StudentSidebar from "../sidebar/StudentSidebar"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util"
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import SendIcon from '@mui/icons-material/Send';
// import {socket} from '../../service/socket.js'
import socket from "socket.io-client";
import MentorSidebar from "../sidebar/MentorSidebar.jsx"
import AttachmentIcon from '@mui/icons-material/Attachment';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import '../../css/mentorChats.css'
const StudentChats = () => {
    
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const {chatId} = useParams()
    const [messages, setMessages] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [chattingWith, setChattingWith] = useState('')
    const newMessageInitial = {
        senderRole:account.role,
        senderAccountId:account.id,
        messageType:'text',
        messageMediaLink:'',
        messageBody:'',
        messageTimestamp:new Date(),
        seenFlag:false,
    }
    const [newMessage, setNewMessage] = useState(newMessageInitial)
    const io = socket.connect("http://localhost:8000");

    const sendMessage = async() => {
        newMessage.messageTimestamp = dayjs(new Date()).$d
         try {
            io.emit('send', {
                msg:newMessage,
                chatId:chatId
            })
            setNewMessage(newMessageInitial)
             
         } catch (e) {
             return e;
         }    
    }
    


    useEffect(() => {
      const myFunction = async() => {
        const url = `http://localhost:8000/getChatMessages?chatId=${chatId}&role=${account.role}`;
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
                    let arr = [];
                    response.data.forEach((one) => {
                    arr = [one, ...arr];
                    });

                    setMessages((msgs) => arr); 
                    // response.data.reverse()
                    // setMessages(response.data);
                    setChattingWith(response.name)
                    
                    } catch (e) {
                    console.log(e);
                    }
      }

      myFunction()
      io.emit('joinroom', chatId);
    }, [])

    io.on('receive',(obj)=>{
        console.log(obj)
        console.log('New message received:', obj.msg);
        setMessages(prevMessages => [obj.msg, ...prevMessages]);
        })
    useEffect(() => {
        const storeImageAndGetLink = async() => {
          
          if(imageFile){
              const data = new FormData();
              data.append("name", imageFile.name);
              data.append("file", imageFile);
              
              const settings = {
                  method: "POST",
                  body: data,
                  headers: {
                      'authorization' : getAccessToken()
                  },
                  
                  }
                  try {
                      const fetchResponse = await fetch(`http://localhost:8000/uploadImageMessage?chatId=${chatId}&role=${account.role}&senderAccountId=${account.id}`, settings);
                      const response = await fetchResponse.json();

                    io.emit('send', {
                        msg:response.data,
                        chatId:chatId
                    })
                    
                      
                  } catch (e) {
                      
                      return e;
                  }
          }
        }
        storeImageAndGetLink();
      }, [imageFile])

      


    return(
        <>
            <div style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center'
          }}>
                <MentorSidebar/>
                <div className="main-container">
                <div style={{
                    fontSize:'20px',
                    color:'black',
                    width:'100%',
                    
                }}>
                 Chatting with student - {chattingWith}
                </div>
                        <div className="chats-container">
                
                    <div className="chats-main-container">

                        {
                            messages && messages.length > 0 ? messages.map(e => (
                                <>
                                {
                                        account.role === e.senderRole ?
                                        e.messageType === 'image' || e.messageType === 'video'?
                                        e.messageType === 'image'?
                                        <div className="msg-1"
                                        onClick={() => {
                                            
                                        }}
                                        >
                                            <img src={e.messageMediaLink && e.messageMediaLink !== ""?e.messageMediaLink:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Post Image" className="msg-2" />
                                        </div>
                                       :
                                       
                                        <div className="msg-1"
                                        onClick={() => {
                                            
                                        }}
                                        >
                                        <video controls height='100%' width="100%">
                                            <source src={`${e.messageMediaLink}`} type="video/mp4" />
                                            Sorry, your browser doesn't support videos.
                                        </video>
                                        </div>
                                        :

                                        <div className="msg-body">
                                    {e.messageBody}
                                    </div>


                                    :

                                    e.messageType === 'image' || e.messageType === 'video'?
                                    e.messageType === 'image' ?
                                    <div className="msg-3"
                                        onClick={() => {
                                            
                                        }}
                                        >
                                            <img src={e.messageMediaLink && e.messageMediaLink !== ""?e.messageMediaLink:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Post Image" className="msg-2"/>
                                        </div>
                                        :
                                        
                                        <div className="msg-3"
                                        onClick={() => {
                                            
                                        }}
                                        >
                                        <video controls height='100%' width="100%">
                                            <source src={`${e.messageMediaLink}`} type="video/mp4" />
                                            Sorry, your browser doesn't support videos.
                                        </video>
                                        </div>
                                        :

                                    <div className="msg-body-2" style={{background:'rgb(255 186 247)'}}>
                                    {e.messageBody}
                                    </div>
                                    }
                                </>
                            ))
                            :
                            <div></div>
                        }
            </div>
            <div style={{
                display:'flex',
                flexDirection:'row',
                // marginTop:'auto',
                // marginBottom:'20px'
            }}>
            
            <FormControl>
                    <label htmlFor="fileInput">
                    <div style={{
                    cursor:'pointer'
                }}
                >
                    <AttachmentIcon style={{
                        fontSize:'40px'
                    }}/>
                    </div>
                            <input type="file"
                                id="fileInput"
                                
                                style={{
                                    display:'none'
                                }}
                                onChange={(e) => setImageFile(e.target.files[0])}
                                >
                                
                            </input>
                    </label>

                </FormControl>
                    <div style={{
                    flexBasis:'98%',
                    border:'1px solid #ebf0f5',
                    borderRadius:'5px',
                    
                }}>
                    <TextField style={{
                        width:'100%'
                    }} 
                    name="messageBody"
                    value={newMessage.messageBody}
                    onChange={(e) => {setNewMessage({...newMessage, [e.target.name]:e.target.value}); console.log(newMessage)}}
                    id="filled-multiline-flexible" 
                    variant="filled" 
                    label="Multiline"
                    multiline
                    />
                </div>
                <div className="send-msg-btn"
                onClick={() => {sendMessage()}}
                >
                <SendIcon/>
                </div>
            </div>
            
            
        </div>
            </div>
        </div>
        </>
    )
}
export default StudentChats