
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
import NativeSelect from '@mui/material/NativeSelect';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAccessToken } from '../../utils/util.js';
import { DataContext } from '../../context/DataProvider.jsx';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useContext } from 'react';
const MentorEducation = ({mentor, onUpdate}) =>{
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const educationObjInitial = {
        schoolName:'',
        course:'',
        grade:'',
        startYear:'',
        finishYear:'',
        _id:''
    }
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [tempEducation, setTempEducation] = useState(educationObjInitial)
    const handleClickOpen = () => {
        setTempEducation(educationObjInitial)
        setOpen(true);
    };
    const handleClickOpen2 = (education) => {
        setTempEducation(education)
        setOpen2(true);
    };

    const handleClose = () => {
        setTempEducation(educationObjInitial)
        setOpen(false);
  };
  const handleClose2 = () => {
    setTempEducation(educationObjInitial)
    setOpen2(false);
};
  const handleStartDateChange = (e) => {
        
    setTempEducation({...tempEducation, startYear:e.$d});
    
}
const handleFinishDateChange = (e) => {
    
    setTempEducation({...tempEducation, finishYear:e.$d});
}

const addNewEducationApi = async(field)=> {
    
    let tempArray = mentor.education;
    
    tempArray.push(field);
    const settings = {
        method: "POST",
        body: JSON.stringify({
            education:tempArray
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
            console.log(settings.body)
            const fetchResponse = await fetch(`http://localhost:8000/updateMentorProfile?mentorAccountId=${account.id}`, settings);
            const response = await fetchResponse.json();
            setTempEducation(educationObjInitial)
            onUpdate(response)
            handleClose()
        } catch (e) {
            setTempEducation(educationObjInitial)
            return e;
        }    
}

const editEducationApi = async(field, id) => {
    let tempArray = mentor.education;
    for(let i = 0;i<tempArray.length;i++){
        if(tempArray[i]._id === id){
            tempArray[i] = field
            break;
        }
    }

    const settings = {
        method: "POST",
        body: JSON.stringify({
            education:tempArray
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
           
            const fetchResponse = await fetch(`http://localhost:8000/updateMentorProfile?mentorAccountId=${account.id}`, settings);
            const response = await fetchResponse.json();
            setTempEducation(educationObjInitial)
            onUpdate(response)
            console.log(mentor)
            handleClose2()
        } catch (e) {
            setTempEducation(educationObjInitial)
            return e;
        }    
}
const deleteEducationApi = () => {

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
                {/* <div>
                Add Education Details
                </div> */}
                <div style={{
                    color:'#566474',
                    
                }}>
                Your school / college details
                </div>
                
                </div>
                {
                    account.role !== 'company'?
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

                    :
                    <div></div>
                    }
                

                {/* Start of form dialog form */}

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New School</DialogTitle>
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
                            School Name
                        </div>

                        <div>
                            <TextField
                                name="schoolName"
                                value={tempEducation.schoolName}
                                onChange={(e) => {
                                    setTempEducation({...tempEducation, [e.target.name]: e.target.value})
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
                            Course
                        </div>

                        <div>
                            <TextField
                                name="course"
                                value={tempEducation.course}
                                onChange={(e) => {
                                    setTempEducation({...tempEducation, [e.target.name]: e.target.value})
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
                            Grade
                        </div>

                        <div>
                            <TextField
                                name="grade"
                                value={tempEducation.grade}
                                onChange={(e) => {
                                    setTempEducation({...tempEducation, [e.target.name]: e.target.value})
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
                <DatePicker  label="Select start date" value={dayjs(tempEducation.startYear)}
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
                <DatePicker  label="Select end date" value={dayjs(tempEducation.finishYear)}
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
                    <Button onClick={()=>{addNewEducationApi(tempEducation)}}>Save</Button>
                    </DialogActions>
             </Dialog>
                {/* End of dialog form */}
                
                </div>
                {/* End of add new top view */}

                {/* Start of list of educations */}
                {
                    mentor.education &&  mentor.education.length > 0 ? mentor.education.map((education) => (
                        
                        <div style={{
                            display:'flex',
                            flexDirection:'column',
                            fontFamily:'DM Sans'
                        }}>
                        <div style={{
                            display:'flex',
                            flexDirection:'row',
                            border:'1px solid #ebf0f5',
                            padding: '30px 30px 30px 45px',
                            marginTop:'10px'
                        }}>

                        <div style={{
                            display:'flex',
                            flexDirection:'column'
                        }}>

                        
                            <div style={{
                                color:'black',
                                fontSize:'20px',
                            }}>
                            {education.schoolName}
                            </div>

                            <div style={{
                            color: '#566474',
                            fontSize:'16px',
                            marginTop: '5px'
                        }}>
                            {education.course}
                        </div>

                        <div style={{
                            color: '#566474',
                            fontSize:'14px',
                            marginTop: '5px'
                        }}>
                            {new Date(education.startYear).getFullYear()}-{new Date(education.finishYear).getFullYear()}
                        </div>
                        </div>
                        {
                            account.role !== 'company'?
                            <div style={{
                            marginLeft:'auto',
                            marginRight:'0px',
                            borderRadius:'5px',
                            border: '1px solid #142683',
                            
                            padding: '4px 4px 4px 4px',
                            color:'#142683',
                            height:'fit-content',
                            cursor:'pointer',
                        }}
                        onClick={() => {
                            
                            handleClickOpen2(education);
                        }}
                        >
                            <EditOutlinedIcon/> Edit
                            </div>

                            :
                            <div></div>
                            }
                        
                            <Dialog open={open2} onClose={handleClose2}>
                    <DialogTitle>Edit education</DialogTitle>
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
                            School Name
                        </div>

                        <div>
                            <TextField
                                name="schoolName"
                                value={tempEducation.schoolName}
                                onChange={(e) => {
                                    setTempEducation({...tempEducation, [e.target.name]: e.target.value})
                                    
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
                            Course
                        </div>

                        <div>
                            <TextField
                                name="course"
                                value={tempEducation.course}
                                onChange={(e) => {
                                    setTempEducation({...tempEducation, [e.target.name]: e.target.value})
                                    
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
                            Grade
                        </div>

                        <div>
                            <TextField
                                name="grade"
                                value={tempEducation.grade}
                                onChange={(e) => {
                                    setTempEducation({...tempEducation, [e.target.name]: e.target.value})
                                    
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
                <DatePicker  label="Select start date" value={dayjs(tempEducation.startYear)}
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
                <DatePicker  label="Select end date" value={dayjs(tempEducation.finishYear)}
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
                    <Button onClick={handleClose2}>Cancel</Button>
                    <Button onClick={()=>{editEducationApi(tempEducation, tempEducation._id)}}>Save</Button>
                    </DialogActions>
             </Dialog>
                            

                        </div>

                        
                        

                        </div>
                    
                   ))
                   :
                   console.log('No Education details')
                }
            </div>
        </>
    )
}
export default MentorEducation