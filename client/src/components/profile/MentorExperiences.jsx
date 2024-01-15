
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { cleanDigitSectionValue } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import {TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAccessToken } from '../../utils/util.js';
import { DataContext } from '../../context/DataProvider.jsx';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useContext } from 'react';
import NativeSelect from '@mui/material/NativeSelect';
import { Link } from 'react-router-dom';
import monthMap from '../../constants/monthMap.js';
import subjects from '../../constants/subjects.js';
import { useLocation } from 'react-router-dom';
const MentorExperiences = ({mentor, onUpdate}) =>{
    const location  = useLocation();
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const workObjInitial = {
        companyName:'',
        workTitle:'',
        startDate:'',
        finishDate:'',
        aboutWork:'',
        location:'',
        workSkills:[],
        _id:''
    }
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [tempWork, setTempWork] = useState(workObjInitial)
    const handleClickOpen = () => {
        setTempWork(workObjInitial)
        setOpen(true);
    };
    const handleClickOpen2 = (work) => {
        setTempWork(work)
        setOpen2(true);
    };

    const handleClose = () => {
        setTempWork(workObjInitial)
        setOpen(false);
  };
  const handleClose2 = () => {
    setTempWork(workObjInitial)
    setOpen2(false);
};
  const handleStartDateChange = (e) => {
        
    setTempWork({...tempWork, startDate:e.$d});
    
}
const handleFinishDateChange = (e) => {
    
    setTempWork({...tempWork, finishDate:e.$d});
}

const handleSkillSelect = (e) => {
    setTempWork({...tempWork, workSkills:[...tempWork.workSkills, e.target.value]});
}
const handleDeleteSkill = (skill) => {
    setTempWork({...tempWork, workSkills:tempWork.workSkills.filter((e)=>{
        if(e !== skill) return e;
    })});
}

const addNewWorkApi = async(field)=> {
    
    let tempArray = mentor.workExperiences;
    
    tempArray.push(field);
    const settings = {
        method: "POST",
        body: JSON.stringify({
            workExperiences:tempArray
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/updateMentorProfile?mentorAccountId=${account.id}`, settings);
            const response = await fetchResponse.json();
            setTempWork(workObjInitial)
            onUpdate(response)
            handleClose()
        } catch (e) {
            setTempWork(workObjInitial)
            return e;
        }    
}

const editWorkApi = async(field, id) => {
    let tempArray = mentor.workExperiences;
    for(let i = 0;i<tempArray.length;i++){
        if(tempArray[i]._id === id){
            tempArray[i] = field
            break;
        }
    }

    const settings = {
        method: "POST",
        body: JSON.stringify({
            workExperiences:tempArray
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
           
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/updateMentorProfile?mentorAccountId=${account.id}`, settings);
            const response = await fetchResponse.json();
            setTempWork(workObjInitial)
            onUpdate(response)
            console.log(mentor)
            handleClose2()
        } catch (e) {
            setTempWork(workObjInitial)
            return e;
        }    
}
const deleteProjectApi = () => {

}



    return(
        <>
            <div style={{
                display:'flex',
                flexDirection:'column'
            }}>
                {/* Start of add new top view */}
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    fontSize:'16px',
                    marginTop:'15px',
                    fontFamily:'DM Sans',
                    
                }}>
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    fontSize:'16px',
                    fontWeight: 700,
                    fontFamily:'DM Sans'
                }}>
                <div>
                Add Work Experiences
                </div>
                <div style={{
                    color:'#566474',
                    
                }}>
                Jobs or internships that you have previously done
                </div>
                
                </div>
                {
                    location.pathname.includes('public') === true || account.id !== mentor.mentorAccountId?
                    <div></div>
                :

                    <div onClick={handleClickOpen} style={{
                    marginLeft:'auto',
                    marginRight:'0px',
                    borderRadius:'5px',
                    cursor:'pointer',
                    border: '1px solid #142683',
                    padding: '4px',
                    color:'#142683'
                }}>
                <AddCircleOutlineIcon/> Add New
                </div>
                    }
                

                {/* Start of form dialog form */}

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New Experience</DialogTitle>
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
                            Company Name
                        </div>

                        <div>
                            <TextField
                                name="companyName"
                                value={tempWork.companyName}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                            Work title
                        </div>

                        <div>
                            <TextField
                                name="workTitle"
                                value={tempWork.workTitle}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                            Location
                        </div>

                        <div>
                            <TextField
                                name="location"
                                value={tempWork.location}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                            About Work
                        </div>

                        <div>
                            <TextField
                                name="aboutWork"
                                value={tempWork.aboutWork}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                    Skills
                </div>

                <div style={{
                    width:500,
                }}>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleSkillSelect(e)
                        }}
                        value={tempWork.workSkills[tempWork.workSkills.length-1]}
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
                    
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                    tempWork.workSkills.map((skill) =>
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
                            <CloseIcon  onClick={() => {handleDeleteSkill(skill)}} style={{
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



                {/* Start of date of education */}

                <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px'
            }}>
                <div style={{
                    color:'black'
                }}>
                    Start Date
                </div>

                <div>
                
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']} >
                <DatePicker  label="Select start date" value={dayjs(tempWork.startDate)}
          onChange={(e) => {handleStartDateChange(e)}}/>
                </DemoContainer>
                </LocalizationProvider>
                    
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
                    End Date
                </div>

                <div>
                
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']} >
                <DatePicker  label="Select end date" value={dayjs(tempWork.finishDate)}
          onChange={(e) => {handleFinishDateChange(e)}}/>
                </DemoContainer>
                </LocalizationProvider>
                    
                </div>
            </div>
                    
                {/* End of date of education */}
                </div>
                {/* End of school name */}
                
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={()=>{addNewWorkApi(tempWork)}}>Save</Button>
                    </DialogActions>
             </Dialog>
                {/* End of dialog form */}
                
                </div>
                {/* End of add new top view */}

                {/* Start of list of educations */}
                <div style={{
                            display:'flex',
                            flexDirection:'column',
                            fontFamily:'DM Sans'
                        }}>
                {
                    mentor.workExperiences &&  mentor.workExperiences.length > 0 ? mentor.workExperiences.map((work) => (
                        
                        
                        <div style={{
                            display:'flex',
                            flexDirection:'column',
                            border:'1px solid #ebf0f5',
                            padding: '30px 30px 30px 45px',
                            marginTop:'10px'
                        }}>
                        <div style={{
                            display:'flex',
                            flexDirection:'row',

                        }}>
                            <div style={{
                                color:'black',
                                fontSize:'20px',
                            }}>
                            {work.companyName} - {work.location}
                            </div>

                            {
                                location.pathname.includes('public') === true || account.id !== mentor.mentorAccountId?
                    <div></div>
                :

                            <div style={{
                            marginLeft:'auto',
                            marginRight:'0px',
                            borderRadius:'5px',
                            border: '1px solid #142683',
                            
                            padding: '1px 1px 1px 1px',
                            color:'#142683',
                            height:'fit-content',
                            cursor:'pointer',
                        }}
                        onClick={() => {
                            
                            handleClickOpen2(work);
                        }}
                        >
                            <EditOutlinedIcon/> Edit
                            </div>
                            }
                            


                        </div>

                        <Dialog open={open2} onClose={handleClose2}>
                    <DialogTitle>Edit Work Experience</DialogTitle>
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
                            Company Name
                        </div>

                        <div>
                            <TextField
                                name="companyName"
                                value={tempWork.companyName}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                            Work title
                        </div>

                        <div>
                            <TextField
                                name="workTitle"
                                value={tempWork.workTitle}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                            Location
                        </div>

                        <div>
                            <TextField
                                name="location"
                                value={tempWork.location}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                            About Work
                        </div>

                        <div>
                            <TextField
                                name="aboutWork"
                                value={tempWork.aboutWork}
                                onChange={(e) => {
                                    setTempWork({...tempWork, [e.target.name]: e.target.value})
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
                    Skills
                </div>

                <div style={{
                    width:500,
                }}>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleSkillSelect(e)
                        }}
                        value={tempWork.workSkills[tempWork.workSkills.length-1]}
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
                    
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                    tempWork.workSkills.map((skill) =>
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
                            <CloseIcon  onClick={() => {handleDeleteSkill(skill)}} style={{
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



                {/* Start of date of education */}

                <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px'
            }}>
                <div style={{
                    color:'black'
                }}>
                    Start Date
                </div>

                <div>
                
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']} >
                <DatePicker  label="Select start date" value={dayjs(tempWork.startDate)}
          onChange={(e) => {handleStartDateChange(e)}}/>
                </DemoContainer>
                </LocalizationProvider>
                    
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
                    End Date
                </div>

                <div>
                
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']} >
                <DatePicker  label="Select end date" value={dayjs(tempWork.finishDate)}
          onChange={(e) => {handleFinishDateChange(e)}}/>
                </DemoContainer>
                </LocalizationProvider>
                    
                </div>
            </div>
                    
                {/* End of date of education */}
                </div>
                {/* End of school name */}
                
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={()=>{editWorkApi(tempWork, tempWork._id)}}>Save</Button>
                    </DialogActions>
             </Dialog>

             <div style={{
                            color: '#566474',
                            fontSize:'18px',
                            fontWeight: 800,
                            
                }}>
                    {work.workTitle}

                </div>  
                     <div style={{
                            color: '#566474',
                            fontSize:'14px',
                            marginTop: '5px'
                        }}>
                            {monthMap[new Date(work.startDate).getMonth()+1]} {new Date(work.startDate).getFullYear()} - {monthMap[new Date(work.finishDate).getMonth()+1]} {new Date(work.finishDate).getFullYear()}
                    </div>

                

                <div style={{
                            color: '#566474',
                            fontSize:'16px',
                            marginTop: '5px',
                            fontWeight: 400,
                            width:750
                }}>
                    {work.aboutWork}

                </div>

                
                

                <div style={{
                            display:'flex',
                            flexDirection:'row',
                            flexWrap:'wrap'
                        }}>
                    {
                    
                    work.workSkills.map((skill) =>
                        (
                        <div>
                        <div  style={{
                        background:'#f0f0f0',
                        color: '#566474',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'4.5px 10px',
                        display:'flex',
                        flexDirection:'row',
                        fontFamily: "DM Sans",
                        marginRight:'5px',
                        marginTop:'10px',
                        fontSize:'16px'
                    }}>
                             <div>
                                {skill}
                            </div>
                            </div>
                        </div>
                        ))
                }
                
                        </div>
                            

                        </div>
                   ))
                   :
                   console.log('No Work experience details')
                }
                </div>
            </div>
        </>
    )
}
export default MentorExperiences