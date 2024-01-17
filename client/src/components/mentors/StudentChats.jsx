import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"
import StudentSidebar from "../sidebar/StudentSidebar"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util"
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import SendIcon from '@mui/icons-material/Send';
// import {socket} from '../../service/socket.js'
import AttachmentIcon from '@mui/icons-material/Attachment';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
const StudentChats = () => {
    
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const newMessageInitial = {
        senderRole:account.role,
        senderAccountId:account.id,
        messageType:'text',
        messageMediaLink:'',
        messageBody:'',
        messageTimestamp:new Date(),
        seenFlag:false
    }
    const {setAccount} = useContext(DataContext);
    const {chatId} = useParams()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState(newMessageInitial)
    const [imageFile, setImageFile] = useState(null)
    const [check, setCheck] = useState(false)
    const [chattingWith, setChattingWith] = useState('')
    const sendMessage = async() => {
        newMessage.messageTimestamp = dayjs(new Date()).$d
        const settings = {
         method: "POST",
         body: JSON.stringify({
            newMessage:newMessage
         }),
         headers: {
             "Content-type": "application/json; charset=UTF-8",
             'authorization' : getAccessToken()
         }
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`https://my-guru-server.vercel.app/updateChatMessages?chatId=${chatId}`, settings);
             setNewMessage(newMessageInitial)
             const response = await fetchResponse.json();
             
            if(response.msg.includes('success')){
                // socket.emit('send', {
                //     msg:newMessage,
                // })
                
                
            }else{

            }
             
         } catch (e) {
             
             return e;
         }    
    }


    

    useEffect(() => {
      const myFunction = async() => {
        const url = `https://my-guru-server.vercel.app/getChatMessages?chatId=${chatId}&role=${account.role}`;
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
                    
                    response.data.reverse()
                    setMessages(response.data);
                    setChattingWith(response.name)
                    // socket.emit('joinroom', chatId);
                    } catch (e) {
                    console.log(e);
                    }
      }

      myFunction()
    }, [])
    
    // socket.on('receive',(obj)=>{
    //     console.log(messages.length)
    //     let tempArray = []
    //     for(let i = 0; i<messages.length;i++){
    //         tempArray.push(messages[i])
    //     }
        
    //     tempArray.reverse();
    //     tempArray.push(obj.msg);
    //     tempArray.reverse();
    //     setMessages(tempArray);
    //     })
    //     useEffect(() => {
    //         return () => {
    //           socket.disconnect()
    //         };
    //       }, []);
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
                      const fetchResponse = await fetch(`https://my-guru-server.vercel.app/uploadImageMessage?chatId=${chatId}&role=${account.role}&senderAccountId=${account.id}`, settings);
                      const response = await fetchResponse.json();
                    //   socket.emit('send', {
                    //     msg:response.data
                    // })
                    
                      
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
                <StudentSidebar/>
                <div style={{
                    display:'flex',
                    flexBasis:"70%",
                    flexDirection:'column',
                    height:'600px'
                    
                }}>
                <div style={{
                    fontSize:'20px',
                    color:'black'
                }}>
                    Chatting with mentor - {chattingWith}
                </div>
                        <div style={{
                            display:'flex',
                            flexDirection:'column',
                            marginBottom:'5px',
                            marginTop:'auto',
                        }}>
                
                    <div style={{
                        display:'flex',
                        flexDirection:'column-reverse',
                        maxHeight:'580px',
                        overflowY:'auto',
                        }}>

                        {
                            messages && messages.length > 0 ? messages.map(e => (
                                <>
                                {
                                        account.role === e.senderRole ?
                                        e.messageType === 'image' || e.messageType === 'video'?
                                        e.messageType === 'image'?
                                        <div style={{
                                            display: 'block',
                                            width: '40%',
                                            height: '250px',
                                            cursor:'pointer',
                                            marginBottom:'10px',
                                            marginRight:'0px',
                                            marginLeft:'auto',
                                        }}
                                        onClick={() => {
                                            
                                        }}
                                        >
                                            <img src={e.messageMediaLink && e.messageMediaLink !== ""?e.messageMediaLink:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Post Image" style={{
                                            width:'100%',
                                            display: 'block',     
                                            width: '100%',
                                            border:'1px solid rgb(213 213 213)',
                                            borderRadius:'5px',
                                            height: '100%',
                                            outline: 'none' ,
                                            }} />
                                        </div>
                                       :
                                       
                                        <div style={{
                                            display: 'block',
                                            width: '40%',
                                            height: '250px',
                                            cursor:'pointer',
                                            marginBottom:'10px',
                                            marginRight:'0px',
                                            marginLeft:'auto',
                                        }}
                                        onClick={() => {
                                            
                                        }}
                                        >
                                        <video controls height='100%' width="100%">
                                            <source src={`${e.messageMediaLink}`} type="video/mp4" />
                                            Sorry, your browser doesn't support videos.
                                        </video>
                                        </div>
                                        :

                                        <div style={{
                                        marginBottom:'10px',
                                        marginRight:'0px',
                                        marginLeft:'auto',
                                        borderRadius:'5px',
                                        background:'rgb(186 201 255)',
                                        maxWidth:'60%',
                                        padding:'10px',
                                        fontFamily:'DM Sans',
                                        color:'rgb(7 10 10)'
                                    }}>
                                    {e.messageBody}
                                    </div>


                                    :

                                    e.messageType === 'image' || e.messageType === 'video'?
                                    e.messageType === 'image' ?
                                    <div style={{
                                            display: 'block',
                                            width: '40%',
                                            height: '250px',
                                            cursor:'pointer',
                                            marginBottom:'10px',
                                            marginRight:'auto',
                                            marginLeft:'5px',
                                        }}
                                        onClick={() => {
                                            
                                        }}
                                        >
                                            <img src={e.messageMediaLink && e.messageMediaLink !== ""?e.messageMediaLink:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Post Image" style={{
                                            width:'100%',
                                            display: 'block',     
                                            width: '100%',
                                            border:'1px solid rgb(213 213 213)',
                                            borderRadius:'5px',
                                            height: '100%',
                                            outline: 'none' ,
                                            }} />
                                        </div>
                                        :
                                        
                                        <div style={{
                                            display: 'block',
                                            width: '40%',
                                            height: '250px',
                                            cursor:'pointer',
                                            marginBottom:'10px',
                                            marginRight:'auto',
                                            marginLeft:'5px',
                                        }}
                                        onClick={() => {
                                            
                                        }}
                                        >
                                        <video controls height='100%' width="100%" >
                                            <source src={`${e.messageMediaLink}`} type="video/mp4" />
                                            Sorry, your browser doesn't support videos.
                                        </video>
                                        </div>
                                        :

                                    <div style={{
                                        marginBottom:'10px',
                                        marginRight:'auto',
                                        marginLeft:'5px',
                                        padding:'10px',
                                        borderRadius:'5px',
                                        background:'rgb(255 186 247)',
                                        maxWidth:'60%',
                                        fontFamily:'DM Sans',
                                        color:'rgb(7 10 10)'
                                    }}>
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
                    label="Write a message..."
                    multiline
                    />
                </div>
                
                <div style={{
                    flexBasis:'2%',
                    marginBottom:'0px',
                    marginTop:'auto',
                    background:"rgb(66 142 81)",
                    borderRadius:'5px',
                    padding:'15px',
                    color:'white',
                    height:'fit-content',
                    cursor:'pointer'
                }}
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