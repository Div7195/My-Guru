import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useState, useContext, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EditOutlined from '@mui/icons-material/EditOutlined';
import { DataContext } from '../../context/DataProvider';
import { getAccessToken } from '../../utils/util';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';
import {FormControl} from '@mui/material';
import {Button} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import CommentIcon from '@mui/icons-material/Comment';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import subjects from '../../constants/subjects';
import exams from '../../constants/exams';
import CloseIcon from '@mui/icons-material/Close';
import NativeSelect from '@mui/material/NativeSelect';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import moment from 'moment'
import { cleanDigitSectionValue } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';
const MentorPost = ({post, mentorName, mentorTagline, mentorImage}) => {
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [imageFile, setImageFile] = useState(null)
    const [textLimit, setLimit] = useState(true)
    const [tempComment, setTempComment] = useState({})
    const [postComments, setPostComments] = useState([])
    const [postLikesArray, setPostLikes] = useState([])
    
    const postInitialValues = {
        postAccountId:account.id,
        postLikes:[],
        postReposts:[],
        postComments:[],
        postExams:[],
        postSubjects:[],
        postTitle:'',
        postBody:'',
        postImage:'',
        postTimestamp:'',
    };
    const [postState, setPost] = useState(post)
    const commentInitialValues = {
        commentAccountId:account.id,
        commentBody:'',
        commentTimestamp:dayjs(new Date()),
        commentPostId:postState._id,
        
    }
    const [tempPostState, setTempPost] = useState(postState)
    const handleClickOpen = () => {
        setTempPost(postState)
        setOpen(true);
    };

    const handleClose = () => {
        setTempPost(postInitialValues)
        setOpen(false);
  };
  const handleClickOpen2 = (comment) => {
    setTempComment(comment)
    setOpen2(true);
};
const handleRadio = (e) => {
        setTempPost({...tempPostState, postAccess: e.target.value})
        
}
const handleClose2 = () => {
    setTempComment(commentInitialValues)
    setOpen2(false);
};
const handleClickOpen3 = (postId) => {
    setOpen3(true);
    getLikesApi()
};

const handleClose3 = () => {
    setOpen3(false);
};
const handleExamSelect = (e) => {
       
    setTempPost({...tempPostState, postExams:[...tempPostState.postExams, e.target.value]});
    console.log(tempPostState)
}
const handleDeleteExam = (exam) => {
    setTempPost({...tempPostState, postExams:tempPostState.postExams.filter((e)=>{
        if(e !== exam) return e;
    })});
    console.log(tempPostState)
}
const handleSubjectSelect = (e) => {
    setTempPost({...tempPostState, postSubjects:[...tempPostState.postSubjects, e.target.value]});
    console.log(tempPostState)
}
const handleDeleteSubject = (exam) => {
    setTempPost({...tempPostState, postSubjects:tempPostState.postSubjects.filter((e)=>{
        if(e !== exam) return e;
    })});
    console.log(tempPostState)
}
  const updatePost = async(postId) =>{
    console.log(tempPostState)
    const settings = {
     method: "POST",
     body: JSON.stringify(tempPostState),
     headers: {
         "Content-type": "application/json; charset=UTF-8",
         'authorization' : getAccessToken()
     }
     }
     try {
         console.log(settings.body)
         const fetchResponse = await fetch(`https://my-guru-server.vercel.app/updatepost?postId=${postId}`, settings);
         const response = await fetchResponse.json();
         setPost(tempPostState)
         handleClose()
        
        
     } catch (e) {
         
         return e;
     }    
 }
 const addNewCommentApi = async(postId)=> {
    
    let newComment = tempComment
    newComment.commentTimestamp = dayjs(new Date());
    const settings = {
        method: "POST",
        body: JSON.stringify(tempComment),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/addComment?postId=${postId}&role=${account.role}`, settings);
            const response = await fetchResponse.json();
            setPost({...postState, postComments:[...postState.postComments, response]})
            getCommentsApiSecond(response)
            handleClose2()
        } catch (e) {
            return e;
        }    
}
const getCommentsApiSecond = async(commentId) => {
    let tempList = postState.postComments
    tempList.push(commentId)
    
    const url = `https://my-guru-server.vercel.app/getComments?postComments=${tempList}`;
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
        setPostComments(response.objArrayOfComments)
        
        } catch (e) {
        console.log(e);
        }
}
const getCommentsApi = async() => {
    const url = `https://my-guru-server.vercel.app/getComments?postComments=${postState.postComments}`;
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
        setPostComments(response.objArrayOfComments)
        
        } catch (e) {
        console.log(e);
        }
}
const getLikesApi = async() => {
    const url = `https://my-guru-server.vercel.app/getLikes?postLikes=${postState.postLikes}`;
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
        setPostLikes(response.objArrayOfLikes)
        
        } catch (e) {
        console.log(e);
        }
}
const addLikeApi = async(postId)=> {
    const settings = {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/addLike?postId=${postId}&likeUserId=${account.id}&role=${account.role}`, settings);
            const response = await fetchResponse.json();
            setPost({...postState, postLikes:[...postState.postLikes, account.id]})
            
           
        } catch (e) {
            return e;
        }    
}
const removeLikeApi = async(postId)=> {
    const settings = {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/removeLike?postId=${postId}&likeUserId=${account.id}&role=${account.role}`, settings);
            const response = await fetchResponse.json();
            setPost({...postState, postLikes:postState.postLikes.filter((e) => {
                if(e !== account.id) return e
            })})
           
        } catch (e) {
            return e;
        }    
}
const repostApi = async(postId)=> {
    const settings = {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/repost?postId=${postId}&mentorAccountId=${account.id}&role=${account.role}`, settings);
            const response = await fetchResponse.json();
            setPost({...postState, postReposts:[...postState.postReposts, response]})
           
        } catch (e) {
            return e;
        }    
}
const deletePost = async(postId) => {
    const url = `https://my-guru-server.vercel.app/deletePost?jobId=${postId}&mentorAccountId=${account.id}`;
    const settings = {
    method: 'DELETE',
    headers: {
        accept: 'application/json',
        authorization : getAccessToken()
    }
    };
    try {
        const fetchResponse = await fetch(url, settings);
        const response = await fetchResponse.json();
        navigate('/youropenings')
        } catch (e) {
        console.log(e);
        }

    }

    const bookmarkPostApi = async(postId)=> {
        const settings = {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'authorization' : getAccessToken()
            }
            }
            try {
                console.log(settings.body)
                const fetchResponse = await fetch(`https://my-guru-server.vercel.app/bookmarkPost?postId=${postId}&userAccountId=${account.id}&userRole=${account.role}`, settings);
                const response = await fetchResponse.json();
                setPost({...postState, postBookmarks:[...postState.postBookmarks, account.id]})
               
            } catch (e) {
                return e;
            }    
    }

    const removeBookmarkApi = async(postId)=> {
        const settings = {
            method: "DELETE",
            body: JSON.stringify({}),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'authorization' : getAccessToken()
            }
            }
            try {
                console.log(settings.body)
                const fetchResponse = await fetch(`https://my-guru-server.vercel.app/removeBookmarkPost?postId=${postId}&userAccountId=${account.id}&userRole=${account.role}`, settings);
                const response = await fetchResponse.json();
                setPost({...postState, postBookmarks:postState.postBookmarks.filter((e) => {
                    return e !== account.id
                })})
               
            } catch (e) {
                return e;
            }    
    }
    // post time stamp difference
    const postTimestamp = new Date(postState.postTimestamp);
    const currentTime = new Date();
    const timeDifference = moment(postTimestamp).from(currentTime);
    console.log(timeDifference);
    

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
                  const fetchResponse = await fetch(`https://my-guru-server.vercel.app/image/upload`, settings);
                  const response = await fetchResponse.json();
                  setTempPost({...tempPostState, postImage:response});
                  
              } catch (e) {
                  
                  return e;
              }
      }
    }
    storeImageAndGetLink();
  }, [imageFile])

  useEffect(() => {
    setPost(post)
  }, [post])
  
  
 
  


  function mouseOver() {
    document.getElementById("seemore").style.color = "blue";
  }
  function mouseDown() {
    document.getElementById("seemore").style.color = "#00000099";
  }
    return(
        <>
            <div style={{
                display:'flex',
                flexDirection:'column',
                padding:'18px',
                border:'1px solid #c1bcbc',
                borderRadius:'5px',
                marginTop:'10px'
            }}>
                {/* {
                    postState.postAccountId === account.id?
                    <>

                    </>
                    :
                    <div style={{
                        fontSize:'12px',
                        color:'$00000009'
                    }}>
                        Reposted
                    </div>
                } */}
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    marginTop:'5px'
                }}>

                
                <div style={{
                    display: 'block',
                    minWidth: '70px',
                    borderRadius:'25px',
                    background:'#cda8ff',
                    width:'70px',
                    height:'70px'
                   
                }}>
                    <img src={mentorImage && mentorImage !== ""?mentorImage:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Mentor Image" style={{
                   
                    display: 'block',     
                    width: '100%',
                    minWidth: '100%',
                    height: '100%',
                    minHeight: '100%',
                    borderWidth: '0px',
                    outline: 'none' ,
                    borderRadius:'60px',
                    objectFit:'cover'
                    // display: 'block',     
                    // width: '100%',
                    // minWidth: '100%',
                    // height: '100%',
                    // minHeight: '100%',
                    // borderWidth: '0px',
                    // outline: 'none' ,
                    // borderRadius:'10px'
            }} />
                </div>

                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    marginTop:'6px',
                    marginLeft:'10px'
                }}>
                    <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'14px',
                        fontWeight:'700',
                        color:'black'
                    }}>
                        {mentorName}
                    </div>
                    <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'12px',
                        color:"rgba(0, 0, 0, 0.6)"
                    }}>
                        {mentorTagline}
                    </div>
                    <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'12px',
                        color:"rgba(0, 0, 0, 0.6)"
                    }}>
                        Posted {timeDifference} 
                    </div>
                </div>
                
                <div style={{
                    marginRight:'2px',
                    marginLeft:'auto',
                    cursor:'pointer'
                }}
                
                >
                    {
                        account.role === 'mentor' && postState.postAccountId === account.id?
                        <>
                        <EditOutlined style={{
                            cursor:'pointer',
                            
                        }}
                        onClick={() => {handleClickOpen()}}
                        />
                        <DeleteIcon style={{
                            cursor:'pointer',
                            marginLeft:'10px'
                        }}
                        onCLick = {() => {deletePost(postState._id)}}
                        />
                        </>
                
                        :
                        postState.postBookmarks.includes(account.id) === true?
                        <BookmarkIcon style={{
                            cursor:'pointer',
                            
                        }}
                        
                            onClick = {() => {removeBookmarkApi(postState._id)}}
                        />
                        :
                        <BookmarkBorderIcon style={{
                            cursor:'pointer',
                            
                        }}
                            onClick = {() => {bookmarkPostApi(postState._id)}}
                        />
                    }


                </div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Edit post</DialogTitle>
                    <DialogContent>
                    <div style={{
                        display:'flex',
                        justifyContent:'center',
                        flexDirection:'column',
                        marginTop:'10px',
                        fontSize:'15px'}}>

                       


                        <div>   
                    <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Give access to</FormLabel>
                            <RadioGroup
                            onChange={(e) => {
                                                    handleRadio(e);
                                                }}
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="For all" control={<Radio checked = {tempPostState.postAccess === 'For all'?true:false} />} label="For all" />
                                <FormControlLabel value="Only mentees" control={<Radio checked = {tempPostState.postAccess === 'Only mentees'?true:false} />} label="Only mentees" />
                                
                                
                            </RadioGroup>
                    </FormControl>
                        </div>
                        <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px',
            }}>
                <div style={{
                    color:'black'
                }}>
                    Select the exams
                </div>

                <div style={{
                    width:500,
                }}>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleExamSelect(e)
                        }}
                        value={tempPostState.postExams && tempPostState.postExams.length > 0 ? tempPostState.postExams[tempPostState.postExams.length-1]:''}
                        defaultValue={30}
                        inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                        }}
                    >
                    {
                        exams.map((exam) =>
                        (
                            <option  value={exam}>{exam}</option>
                        ))
                    
                    }
                        
                    </NativeSelect>

                </FormControl>
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    maxHeight:'100px',
                    overflowY:'auto',
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                   tempPostState.postExams && tempPostState.postExams.length>0?
                   tempPostState.postExams.map((exam) =>
                        (
                        <div>
                        <div  style={{
                        background:'#27538b',
                        color:'white',
                        marginTop:'1px',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'5px',
                        display:'flex',
                        flexDirection:'row'
                    }}>
                            <div>
                                {exam}
                            </div>
                            <div>
                            <CloseIcon  onClick={() => {handleDeleteExam(exam)}} style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
                        :
                        ''
                }
                    
                        
                   
                </div>
                </div>
            </div>
            <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px',
               
            }}>
                <div style={{
                    color:'black'
                }}>
                    Select the subjects
                </div>

                <div style={{
                    width:500,
                }}>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleSubjectSelect(e)
                        }}
                        value={tempPostState.postSubjects && tempPostState.postSubjects.length > 0 ? tempPostState.postSubjects[tempPostState.postSubjects.length-1]:''}
                        defaultValue={30}
                        inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                        }}
                    >
                    {
                        subjects.map((subject) =>
                        (
                            <option  value={subject}>{subject}</option>
                        ))
                    
                    }
                        
                    </NativeSelect>

                </FormControl>
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    maxHeight:'100px',
                    overflowY:'auto',
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                  tempPostState.postSubjects && tempPostState.postSubjects.length>0?  
                  tempPostState.postSubjects.map((subject) =>
                        (
                        <div>
                        <div  style={{
                        background:'#27538b',
                        marginTop:'1px',
                        color:'white',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'5px',
                        display:'flex',
                        flexDirection:'row'
                    }}>
                            <div>
                                {subject}
                            </div>
                            <div>
                            <CloseIcon  onClick={() => {handleDeleteSubject(subject)}} style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
                        :
                        ''
                }
                    
                        
                   
                </div>
                </div>
            </div>


                    <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            Post Title
                        </div>

                        <div>
                            <TextField
                                name="postTitle"
                                value={tempPostState.postTitle}
                                onChange={(e) => {
                                    setTempPost({...tempPostState, [e.target.name]: e.target.value})
                                    console.log(tempPostState)
                                }}
                                id="filled-multiline-flexible"
                                label="Multiline"
                                multiline
                                maxRows={4}
                                variant="filled"
                                    style={{width:500}}
                                />
                        </div>
                </div>
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            What you want to talk about? 
                        </div>

                        <div>
                            <TextField
                                name="postBody"
                                value={tempPostState.postBody}
                                onChange={(e) => {
                                    setTempPost({...tempPostState, [e.target.name]: e.target.value})
                                    console.log(tempPostState)
                                }}
                                id="filled-multiline-flexible"
                                label="Multiline"
                                multiline
                                maxRows={10}
                                variant="filled"
                                    style={{width:500}}
                                />
                        </div>
                </div>
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            Attach an image
                        </div>
                        <div>
                            <FormControl>
                                <label htmlFor="fileInput">
                                <ImageIcon style={{
                                    cursor:'pointer',
                                    fontSize:'30px'
                                }}/>
                                </label>
                                <input type="file"
                                id="fileInput"
                                
                                style={{
                                    display:'none'
                                }}
                                onChange={(e) => setImageFile(e.target.files[0])}
                                >
                                
                                </input>
                            </FormControl>
                        </div>
                        
                </div>
                {/* Start of date of education */}

                    
                {/* End of date of education */}
                </div>
                {/* End of school name */}
                
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={()=>{updatePost(post._id)}}>Save update</Button>
                    </DialogActions>
             </Dialog>
                </div>
                <div style={{
                    fontSize:'16px',
                    fontFamily:'DM Sans',
                    fontWeight:'800',
                    borderBottom:'2px solid rgb(213 213 213)',
                    marginTop:'5px'
                }}>
                    {postState.postTitle}

                </div>

                <div style={{
                    fontSize:'14px',
                    fontFamily:'DM Sans',
                    marginTop:'5px'
                }}>
                    {
                        postState.postBody.split("").length>394 &&textLimit===true?
                        postState.postBody.slice(0, 393)
                    :
                    postState.postBody
                    }
                    {
                        postState.postBody.split("").length>394&&textLimit===true?
                        <div id='seemore'  onMouseOver={() => {mouseOver()}} onMouseOut={()=>{mouseDown()}}
                            style={{
                            display:'inline',
                            marginLeft:'auto',
                            marginRight:'0px',
                            cursor:'pointer',
                            color:'00000099'
                        }}
                        onClick={() => {setLimit(false)}}
                        >
                        ...see more

                        </div>
                        :
                        <></>
                    }

                </div>
                <div style={{
                    display: 'block',
                    width: '100%',
                    height: '450px',

                }}>
                    <img src={postState.postImage && postState.postImage !== ""?postState.postImage:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Post Image" style={{
                    width:'100%',
                    display: 'block',     
                    width: '100%',
                    border:'1px solid rgb(213 213 213)',
                    borderRadius:'5px',
                    height: '100%',
                    outline: 'none' ,
                    
            }} />
                </div>
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    fontSize:'12px',
                    color:"rgba(0, 0, 0, 0.6)",
                    marginTop:'10px',
                    
                }}>
                <div style={{
                    cursor:'pointer'
                }}
                onClick={() => {handleClickOpen3()}}
                >
                        {postState.postLikes.length} have liked this
                </div>
                <Dialog open={open3} onClose={handleClose3}>
                    <DialogTitle>People who liked</DialogTitle>
                    <DialogContent>
                    <div style={{
                    display:'flex',
                    flexDirection:'column'
                }}>
                {
                    postLikesArray && postLikesArray.length > 0?

                    postLikesArray.map(e => (
                        <>
                        <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'5px'
                    }}>

                    <div style={{
                    display:'flex',
                    flexDirection:'row',
                    }}>

                
                    <div style={{
                    display: 'block',
                    minWidth: '40px',
                    borderRadius:'25px',
                    background:'#cda8ff',
                    width:'40px',
                    height:'40px',
                    marginTop:'8px'
                   
                }}>
                    <img src={e.userImage && e.userImage !== ""?e.userImage:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Mentor Image" style={{
                   
                    display: 'block',     
                    width: '100%',
                    minWidth: '100%',
                    height: '100%',
                    minHeight: '100%',
                    borderWidth: '0px',
                    outline: 'none' ,
                    borderRadius:'60px',
                    objectFit:'cover'
                    // display: 'block',     
                    // width: '100%',
                    // minWidth: '100%',
                    // height: '100%',
                    // minHeight: '100%',
                    // borderWidth: '0px',
                    // outline: 'none' ,
                    // borderRadius:'10px'
            }} />
                </div>

                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    marginTop:'6px',
                    marginLeft:'10px',
                    background:'#f2f2f2',
                    width:'100%',
                    padding:'8px'
                }}>

                <div style={{
                    display:'flex',
                    flexDirection:'row'
                }}>
                <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'14px',
                        fontWeight:'700',
                        color:'black'
                    }}>
                        {e.userName}
                    </div>
                </div>
                    
                    <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'12px',
                        color:"rgba(0, 0, 0, 0.6)"
                    }}>
                        {e.userTagline}
                    </div>
                </div>
                
                </div>

                    </div>
                        </>
                    ))
                    

                    :
                    <></>

                }

                </div>
                {/* End of school name */}
                
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose3}>Cancel</Button>
                    </DialogActions>
             </Dialog>
                <div style={{
                    cursor:'pointer',
                    marginLeft:'auto',
                    marginRight:'0px',
                    
                }}
                onClick={() => {getCommentsApi()}}
                >
                        {postState.postComments.length} comments
                </div>
                </div>
                
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'space-between',
                    fontSize:'14px',
                    marginTop:'10px',
                    padding:'5px',
                    borderTop:'2px solid rgb(213 213 213)',
                    color:'rgba(0, 0, 0, 0.6)'
                }}> 
                    <div  style={{
                        cursor:'pointer',
                        color:postState.postLikes.includes(account.id) === true?'#0a66c2':''
                    }}
                    onClick={() => {
                        if(!postState.postLikes.includes(account.id)){
                            addLikeApi(postState._id)
                        }else{
                            
                            removeLikeApi(postState._id)
                        }
                    }}
                    >
                            <ThumbUpAltIcon/>{' Like'}
                    </div>
                    

                    <div style={{
                        cursor:'pointer'
                    }}
                    onClick={() => {handleClickOpen2(commentInitialValues)}}
                    >
                            <AddCommentIcon/>{' Comment'}
                    </div>
                    <Dialog open={open2} onClose={handleClose2}>
                    <DialogTitle>Add a comment</DialogTitle>
                    <DialogContent>
                    <div style={{
                        display:'flex',
                        justifyContent:'center',
                        flexDirection:'column',
                        marginTop:'10px',
                        fontSize:'15px'}}>

                        {/* Start of school name */}
                    <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            Comment on post
                        </div>

                        <div>
                            <TextField
                                name="commentBody"
                                value={tempComment.commentBody}
                                onChange={(e) => {
                                    setTempComment({...tempComment, [e.target.name]: e.target.value})
                                    console.log(tempComment)
                                }}
                                id="filled-multiline-flexible"
                                label="Comment your thoughts"
                                multiline
                                maxRows={4}
                                variant="filled"
                                    style={{width:500}}
                                />
                        </div>
                </div>
                {/* Start of date of education */}

                    
                {/* End of date of education */}
                </div>
                {/* End of school name */}
                
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose2}>Cancel</Button>
                    <Button onClick={()=>{addNewCommentApi(post._id)}}>Add comment</Button>
                    </DialogActions>
             </Dialog>

                    <div style={{
                        cursor:'pointer',
                        color:postState.postReposts.includes(account.id) === true?'#0a66c2':''
                    }}
                    onClick={() => {
                        
                        if(postState.postAccountId === account.id || (postState.postReposts.length>0 && postState.postReposts.includes(account.id))){
                            
                        }else{
                            repostApi(postState._id)
                        }
                        }}
                    >
                            <SyncAltIcon/>{postState.postReposts.length?postState.postReposts.length:0}{' Repost'}
                    </div>
                </div>

                <div style={{
                    display:'flex',
                    flexDirection:'column'
                }}>
                {
                    postState.postComments && postState.postComments.length > 0 && postComments && postComments.length>0?

                    postComments.map(e => (
                        <>
                        <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'5px'
                    }}>

                    <div style={{
                    display:'flex',
                    flexDirection:'row',
                    }}>

                
                    <div style={{
                    display: 'block',
                    minWidth: '40px',
                    borderRadius:'25px',
                    background:'#cda8ff',
                    width:'40px',
                    height:'40px',
                    marginTop:'8px'
                   
                }}>
                    <img src={e.userImage && e.userImage !== ""?e.userImage:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Mentor Image" style={{
                   
                    display: 'block',     
                    width: '100%',
                    minWidth: '100%',
                    height: '100%',
                    minHeight: '100%',
                    borderWidth: '0px',
                    outline: 'none' ,
                    borderRadius:'60px',
                    objectFit:'cover'
                    // display: 'block',     
                    // width: '100%',
                    // minWidth: '100%',
                    // height: '100%',
                    // minHeight: '100%',
                    // borderWidth: '0px',
                    // outline: 'none' ,
                    // borderRadius:'10px'
            }} />
                </div>

                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    marginTop:'6px',
                    marginLeft:'10px',
                    background:'#f2f2f2',
                    width:'100%',
                    padding:'8px'
                }}>

                <div style={{
                    display:'flex',
                    flexDirection:'row'
                }}>
                <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'14px',
                        fontWeight:'700',
                        color:'black'
                    }}>
                        {e.userName}
                    </div>

                {/* <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'12px',
                        color:"rgba(0, 0, 0, 0.6)",
                        marginRight:'5px',
                        marginLeft:'auto'
                    }}>
                         {
                            Math.abs(new Date(postState.postTimestamp).getFullYear() - new Date().getFullYear()) === 0?
                            Math.abs(new Date(postState.postTimestamp).getMonth() - new Date().getMonth()) === 0 ?
                            Math.abs(new Date(postState.postTimestamp).getMinutes() - new Date().getMinutes()) === 0 ?
                            Math.abs(new Date(postState.postTimestamp).getSeconds() - new Date().getSeconds()) :
                            Math.abs(new Date(postState.postTimestamp).getMinutes() - new Date().getMinutes()) :
                            Math.abs(new Date(postState.postTimestamp).getHours() - new Date().getHours()):
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) === 1 ?
                            Math.abs(new Date(postState.postTimestamp).getHours() - new Date().getHours()) < 24 ?
                            Math.abs(new Date(postState.postTimestamp).getHours() - new Date().getHours()) === 0 ?
                            Math.abs(new Date(postState.postTimestamp).getMinutes() - new Date().getMinutes()) === 0 ?
                            Math.abs(new Date(postState.postTimestamp).getSeconds() - new Date().getSeconds()) :
                            Math.abs(new Date(postState.postTimestamp).getMinutes() - new Date().getMinutes()) :
                            Math.abs(new Date(postState.postTimestamp).getHours() - new Date().getHours()):
                            '1':
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) < 7 ?
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) :
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) < 30 ?
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate())/7 :
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) < 365 ?
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate())/365:
                            ''
                            
                        }{Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) === 0?
                            Math.abs(new Date(postState.postTimestamp).getHours() - new Date().getHours()) === 0 ?
                            Math.abs(new Date(postState.postTimestamp).getMinutes() - new Date().getMinutes()) === 0 ?
                            ' sec' :
                            ' min' :
                            ' hr':
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) === 1 ?
                            Math.abs(new Date(postState.postTimestamp).getHours() - new Date().getHours()) < 24 ?
                            Math.abs(new Date(postState.postTimestamp).getHours() - new Date().getHours()) === 0 ?
                            Math.abs(new Date(postState.postTimestamp).getMinutes() - new Date().getMinutes()) === 0 ?
                            ' sec' :
                            ' min' :
                            ' hr':
                            ' days' :
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) < 7 ?
                            ' weeks':
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) < 30 ?
                            ' weeks' :
                            Math.abs(new Date(postState.postTimestamp).getDate() - new Date().getDate()) < 365 ?
                            ' years':
                            ''
                            } ago
                    </div> */}
                </div>
                    
                    <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'12px',
                        color:"rgba(0, 0, 0, 0.6)"
                    }}>
                        {e.userTagline}
                    </div>
                    
                    <div style={{
                    marginTop:'5px',
                    fontSize:'14px',
                    fontFamily:'DM Sans',
                }}>
                    {e.comment.commentBody}
                </div>
                </div>
                
                </div>

                    </div>
                        </>
                    ))
                    

                    :
                    <></>

                }

                </div>
            </div>
        </>
    )
}

export default MentorPost