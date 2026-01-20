import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StudentSidebar from "../sidebar/StudentSidebar";
import { DataContext } from "../../context/DataProvider";
import { getAccessToken } from "../../utils/util";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import SendIcon from '@mui/icons-material/Send';
import socketIO from "socket.io-client";
import AttachmentIcon from '@mui/icons-material/Attachment';
import FormControl from '@mui/material/FormControl';
import '../../css/studentChats.css'; // Make sure this path is correct

const StudentChats = () => {
    const { account } = useContext(DataContext);
    const { chatId } = useParams();
    
    const socketRef = useRef();

    const newMessageInitial = {
        senderRole: account.role,
        senderAccountId: account.id,
        messageType: 'text',
        messageMediaLink: '',
        messageBody: '',
        seenFlag: false
    };

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(newMessageInitial);
    const [imageFile, setImageFile] = useState(null);
    const [chattingWith, setChattingWith] = useState('');

    useEffect(() => {
        socketRef.current = socketIO.connect("http://localhost:8000");
        socketRef.current.emit('joinroom', chatId);

        socketRef.current.on('receive', (obj) => {
            setMessages(prevMessages => [obj.msg, ...prevMessages]);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [chatId]);

    useEffect(() => {
        const getHistory = async () => {
            const url = `http://localhost:8000/getChatMessages?chatId=${chatId}&role=${account.role}`;
            const settings = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: getAccessToken()
                }
            };
            try {
                const fetchResponse = await fetch(url, settings);
                const response = await fetchResponse.json();
                
                let arr = [];
                response.data.forEach((one) => {
                    arr = [one, ...arr];
                });
                
                setMessages(arr);
                setChattingWith(response.name);
            } catch (e) {
                console.log(e);
            }
        };
        getHistory();
    }, [chatId, account.role]);

    const sendMessage = async () => {
        if (!socketRef.current) return;
        
        const payload = {
            ...newMessage,
            messageTimestamp: dayjs(new Date()).$d
        };

        try {
            socketRef.current.emit('send', {
                msg: payload,
                chatId: chatId
            });
            setNewMessage(newMessageInitial);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const storeImageAndGetLink = async () => {
            if (imageFile) {
                const data = new FormData();
                data.append("name", imageFile.name);
                data.append("file", imageFile);

                const settings = {
                    method: "POST",
                    body: data,
                    headers: {
                        'authorization': getAccessToken()
                    },
                };
                try {
                    const fetchResponse = await fetch(`http://localhost:8000/uploadImageMessage?chatId=${chatId}&role=${account.role}&senderAccountId=${account.id}`, settings);
                    const response = await fetchResponse.json();
                    
                    if (socketRef.current) {
                         socketRef.current.emit('send', {
                            msg: response.data,
                            chatId: chatId
                        });
                    }
                    setImageFile(null);
                } catch (e) {
                    return e;
                }
            }
        };
        storeImageAndGetLink();
    }, [imageFile, chatId, account.role, account.id]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <StudentSidebar />
            <div className="main-container">
                <div style={{ fontSize: '20px', color: 'black' }}>
                    Chatting with mentor - {chattingWith}
                </div>
                <div className="chats-container">
                    <div className="chats-main-container">
                        
                        {messages && messages.length > 0 ? messages.map((e, index) => (
                            <div key={e._id || index} style={{ width: '100%' }}>
                                {account.role === e.senderRole ? (
                                    // SENDER (Student)
                                    e.messageType === 'image' || e.messageType === 'video' ? (
                                        e.messageType === 'image' ? (
                                            <div className="msg-1">
                                                <img src={e.messageMediaLink || 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'} alt="Post" className="msg-2"/>
                                            </div>
                                        ) : (
                                            <div className="msg-1">
                                                <video controls height='100%' width="100%">
                                                    <source src={`${e.messageMediaLink}`} type="video/mp4" />
                                                </video>
                                            </div>
                                        )
                                    ) : (
                                        <div className="msg-body">
                                            {e.messageBody}
                                        </div>
                                    )
                                ) : (
                                    // RECEIVER (Mentor)
                                    e.messageType === 'image' || e.messageType === 'video' ? (
                                        e.messageType === 'image' ? (
                                            <div className="msg-3">
                                                <img src={e.messageMediaLink || 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'} alt="Post" className="msg-2" />
                                            </div>
                                        ) : (
                                            <div className="msg-3">
                                                <video controls height='100%' width="100%">
                                                    <source src={`${e.messageMediaLink}`} type="video/mp4" />
                                                </video>
                                            </div>
                                        )
                                    ) : (
                                        <div className="msg-body-2">
                                            {e.messageBody}
                                        </div>
                                    )
                                )}
                            </div>
                        )) : <div></div>}
                    </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'row', alignItems:'center' }}>
                    <FormControl>
                        <label htmlFor="fileInput">
                            <div style={{ cursor: 'pointer' }}>
                                <AttachmentIcon style={{ fontSize: '40px' }} />
                            </div>
                            <input type="file" id="fileInput" style={{ display: 'none' }} onChange={(e) => setImageFile(e.target.files[0])} />
                        </label>
                    </FormControl>

                    <div style={{ flexBasis: '98%', border: '1px solid #ebf0f5', borderRadius: '5px' }}>
                        <TextField
                            style={{ width: '100%' }}
                            name="messageBody"
                            value={newMessage.messageBody}
                            onChange={(e) => setNewMessage({ ...newMessage, [e.target.name]: e.target.value })}
                            variant="filled"
                            label="Write a message..."
                            multiline
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                        />
                    </div>

                    <div className="send-msg-btn"
                        onClick={() => { sendMessage() }}>
                        <SendIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentChats;