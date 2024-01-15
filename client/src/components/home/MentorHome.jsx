import Header from "../header/Header";
import MentorSidebar from "../sidebar/MentorSidebar";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TextField } from "@mui/material";
import { Button } from '@mui/material';
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../context/DataProvider";
import dayjs from "dayjs";
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getAccessToken } from "../../utils/util";
import ImageIcon from '@mui/icons-material/Image';
import { getType } from "../../utils/util";
import MentorPost from "../posts/MentorPost";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import subjects from "../../constants/subjects";
import exams from "../../constants/exams";
import CloseIcon from '@mui/icons-material/Close';
const MentorHome = () =>{
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [imageFile, setImageFile] = useState(null)
    const [posts, setPosts] = useState({})
    const postInitialValues = {
        postAccountId:account.id,
        postLikes:[],
        postComments:[],
        postReposts:[],
        postExams:[],
        postSubjects:[],
        postTitle:'',
        postBody:'',
        postImage:'',
        postTimestamp:dayjs(new Date()),
    };
    const [postState, setPost] = useState(postInitialValues)

    const handleClickOpen = () => {
        setPost(postInitialValues)
        setOpen(true);
    };

    const handleClose = () => {
        setPost(postInitialValues)
        setOpen(false);
  };
  const handleRadio = (e) => {
    setPost({...postState, postAccess:e.target.value });
}
const handleExamSelect = (e) => {
    if(!postState.postExams.includes(e.target.value))
    setPost({...postState, postExams:[...postState.postExams, e.target.value]});
    console.log(postState)
}
const handleDeleteExam = (exam) => {
    
    setPost({...postState, postExams:postState.postExams.filter((e)=>{
        if(e !== exam) return true;
    })});
    console.log(postState)
}
const handleSubjectSelect = (e) => {
    if(!postState.postSubjects.includes(e.target.value))
    setPost({...postState, postSubjects:[...postState.postSubjects, e.target.value]});
    console.log(postState)
}
const handleDeleteSubject = (exam) => {
    setPost({...postState, postSubjects:postState.postSubjects.filter((e)=>{
        if(e !== exam) return true;
    })});
    console.log(postState)
}
  const addNewPostApi = async()=> {
    
    let newPost = postState
    newPost.postTimestamp = dayjs(new Date());
    const settings = {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/createPost?mentorAccountId=${account.id}`, settings);
            const response = await fetchResponse.json();
            setPost(postInitialValues)
            handleClose()
        } catch (e) {
            setPost(postInitialValues)
            return e;
        }    
}

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
                    setPost({...postState, postImage:response});
                    
                } catch (e) {
                    
                    return e;
                }
        }
      }
      storeImageAndGetLink();
    }, [imageFile])
    useEffect(() => {
        const myFunction = async() => {
        const url = `https://my-guru-server.vercel.app/getAllPostsExcept?mentorAccountId=${account.id}`;
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
            setPosts(response.result);
            
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
                fontFamily:'DM Sans'
                }}>     

                <div style={{
                display:'flex',
                flexDirection:'column'
                }}>

            
                <div style={{
                    margin:'auto',
                    position:'sticky',
                    top:64
                }}>
                <TextField
                onClick={() => handleClickOpen()}
                inputProps={{
                    style: {color:'black',fontSize:'16px',fontWeight:'400', borderRadius:'35px', border:'3px solid #c1cdd8', padding:'17px', background:'aliceblue' },
                }}
                placeholder="Start a post"
                 id="outlined-basic" 
                 variant="standard" 
                 InputProps={{
                    disableUnderline: true,
                    style:{
                        width:600,
                        background:''
                        }
                    }}
                 />
                </div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Start new post</DialogTitle>
                    <DialogContent>
                    <div style={{
                        display:'flex',
                        justifyContent:'center',
                        flexDirection:'column',
                        marginTop:'10px',
                        fontSize:'15px'}}>

                        {/* Start of school name */}

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
                                <FormControlLabel value="For all" control={<Radio  />} label="For all" />
                                <FormControlLabel value="Only mentees" control={<Radio />} label="Only mentees" />
                                
                                
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
                        value={postState.postExams && postState.postExams.length > 0 ? postState.postExams[postState.postExams.length-1]:''}
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
                    
                   postState.postExams && postState.postExams.length>0?
                   postState.postExams.map((exam) =>
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
                        value={postState.postSubjects && postState.postSubjects.length > 0 ? postState.postSubjects[postState.postSubjects.length-1]:''}
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
                    
                  postState.postSubjects && postState.postSubjects.length>0?  
                  postState.postSubjects.map((subject) =>
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
                                value={postState.postTitle}
                                onChange={(e) => {
                                    setPost({...postState, [e.target.name]: e.target.value})
                                    console.log(postState)
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
                                value={postState.postBody}
                                onChange={(e) => {
                                    setPost({...postState, [e.target.name]: e.target.value})
                                    console.log(postState)
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
                    <Button onClick={()=>{addNewPostApi(postState)}}>Save</Button>
                    </DialogActions>
             </Dialog>
             <div style={{
             }}>

            
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
            posts && posts.length > 0 ? posts.map(e => (
                        <MentorPost  post = {e.post}
                            mentorName={e.mentorName}
                            mentorTagline={e.mentorTagline}
                            mentorImage = {e.mentorImage}
                            saved = {false}
                        />
            ))
            :
            console.log('no data to show')
        }
        
        </div>
        </div>


                </div>                      
            
            
            </div>
            </div>
        </div>
        </>
    );
}

export default MentorHome;