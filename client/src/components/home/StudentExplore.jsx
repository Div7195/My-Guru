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
import StudentSidebar from "../sidebar/StudentSidebar";
import exams from "../../constants/exams";
import subjects from "../../constants/subjects";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
const StudentExplore = () => {
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const filterInitial = {
        searchQuery:'',
        queryExams:[],
        querySubjects:[]
    }
    const [filter, setFilter] = useState(filterInitial)
    const [posts, setPosts] = useState([])
    const handleExamSelect = (e) => {
        if(!filter.queryExams.includes(e.target.value))
        setFilter({...filter, queryExams:[...filter.queryExams, e.target.value]});
        console.log(filter)
    }
    const handleDeleteExam = (exam) => {
        setFilter({...filter, queryExams:filter.queryExams.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(filter)
    }
    const handleSubjectSelect = (e) => {
        if(!filter.querySubjects.includes(e.target.value))
        setFilter({...filter, querySubjects:[...filter.querySubjects, e.target.value]});
        console.log(filter)
    }
    const handleDeleteSubject = (exam) => {
        setFilter({...filter, querySubjects:filter.querySubjects.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(filter)
    }

    const applySearch = async() => {
        const url = `https://my-guru-server.vercel.app/getExploredPosts?userAccountId=${account.id}&userRole=${account.role}&queryExams=${filter.queryExams}&querySubjects=${filter.querySubjects}&searchQuery=${filter.searchQuery}`;
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
                setPosts(response.data);
                
                } catch (e) {
                console.log(e);
                }
        
            }
    
    useEffect(() => {
        const myFunction = async() => {
            const url = `https://my-guru-server.vercel.app/getExploredPosts?userAccountId=${account.id}&userRole=${account.role}&queryExams=${filter.queryExams}&querySubjects=${filter.querySubjects}&searchQuery=${filter.searchQuery}`;
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
                
                fontFamily:'DM Sans'
                }}>     

                <div style={{
                display:'flex',
                flexDirection:'column',
                flexBasis:'60%',
                
                }}>
                    <div style={{
                        display:'flex',
                        flexDirection:'row',
                        width:'100%',
                        position:'sticky',
                        top:64
                        
                    }}>
                    <TextField
                    onChange={(e) => {setFilter({...filter, searchQuery:e.target.value}); console.log(filter)}}
                    inputProps={{
                        style: {color:'black',fontSize:'16px',fontWeight:'400', borderRadius:'35px', border:'3px solid #c1cdd8', padding:'17px', background:'aliceblue' },
                    }}
                    placeholder="Search keywords"
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
                    
                    <div style={{
                        cursor:'pointer',
                        marginTop:'10px',
                        marginLeft:-40,
                        zIndex:1
                    }}
                    onClick={() => {applySearch()}}
                    >
                        <SearchIcon style={{
                            fontSize:'30px'
                        }}/>
                    </div>

                    </div>

                        <div style={{
                        display:'flex',
                        flexDirection:'column',
                        width:'80%',
                        
                
        }}>

        {
            posts && posts.length > 0 ? posts.map(e => (
                        <MentorPost  post = {e.post}
                            mentorName={e.mentorName}
                            mentorTagline={e.mentorTagline}
                            mentorImage = {e.mentorImage}
                            
                            // onUpdate={(post) => {
                            //     for(let i = 0; i< posts.length;i++){
                            //         if(posts[i]._id === post._id){
                            //             posts[i] = post
                            //             console.log(posts)
                            //             break
                            //         }
                            //     }
                            //     setPosts(posts)
                            // }}
                        />
            ))
            :
            console.log('no data to show')
        }
        
        
        </div>
         </div> 

         <div style={{
                display:'flex',
                flexDirection:'column',
                flexBasis:'40%',
                position:'fixed',
                top:64,
                left:'auto',
                right:'5px',
                fontFamily:'DM Sans',
                
                
            }}>

                <div style={{
                    fontSize:'20px',
                    display:'flex',
                    flexDirection:'row',
                    marginTop:'5px',
                    
                }}>
                <div>
                Posts Filter
                </div>

                <div style={{
                    marginRight:'5px',
                    marginLeft:'auto',
                    
                    fontSize:'16px',
                    fontFamily:'DM Sans',
                    backgroundColor:'#142683',
                    borderRadius:'5px',
                    fontWeight:700,
                    cursor:'pointer',
                    padding: '4px 4px 4px 4px',
                    color:'white'
                }}
                onClick={() => {applySearch()}}
                >
                
                Search</div>
                <div style={{
                    marginRight:'5px',
                    marginLeft:'auto',
                    
                    fontSize:'16px',
                    fontFamily:'DM Sans',
                    backgroundColor:'#142683',
                    borderRadius:'5px',
                    fontWeight:700,
                    cursor:'pointer',
                    padding: '4px 4px 4px 4px',
                    color:'white'
                }}
                onClick={() => {setFilter(filterInitial)}}
                >
                
                Reset</div>

                </div>
            <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px'
            }}>
                <div style={{
                    color:'black'
                }}>
                    Select exams
                </div>

                <div>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleExamSelect(e);
                        }}
                        value={filter.queryExams[filter.queryExams.length-1]}
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
                    width:400,
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                    filter.queryExams.map((skill) =>
                        (
                        <div>
                        <div  style={{
                        background:'black',
                        color:'white',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'5px',
                        display:'flex',
                        flexDirection:'row'
                    }}>
                            <div>
                                {skill}
                            </div>
                            <div>
                            <CloseIcon onClick={() => {handleDeleteExam(skill)}}  style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
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
                    Select subjects
                </div>

                <div>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleSubjectSelect(e);
                        }}
                        value={filter.querySubjects[filter.querySubjects.length-1]}
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
                    width:400,
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                    filter.querySubjects.map((subject) =>
                        (
                        <div>
                        <div  style={{
                        background:'black',
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
                            <CloseIcon onClick={() => {handleDeleteSubject(subject)}}  style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
                }
                    
                        
                   
                </div>
                </div>
            </div>

                <div>

                </div>


            </div>


                </div>
            </div>
        </>
    )

}
export default StudentExplore