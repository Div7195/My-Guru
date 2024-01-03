
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
import subjects from '../../constants/subjects.js';
import { Link } from 'react-router-dom';

import monthMap from '../../constants/monthMap.js';
const MentorPlans = ({mentor, onUpdate}) =>{
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const planObjInitial = {
        perks:'',
        _id:''
    }
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [tempPlan, setTempPlan] = useState(planObjInitial)
    const handleClickOpen = () => {
        setTempPlan(planObjInitial)
        setOpen(true);
    };
    const handleClickOpen2 = (plan) => {
        setTempPlan(plan)
        setOpen2(true);
    };

    const handleClose = () => {
        setTempPlan(planObjInitial)
        setOpen(false);
  };
  const handleClose2 = () => {
    setTempPlan(planObjInitial)
    setOpen2(false);
};
  const handleStartDateChange = (e) => {
        
    setTempPlan({...tempPlan, certificateIssueDate:e.$d});
    
}
const handleFinishDateChange = (e) => {
    
    setTempPlan({...tempPlan, finishDate:e.$d});
}

const handleSkillSelect = (e) => {
    setTempPlan({...tempPlan, certificateSkills:[...tempPlan.certificateSkills, e.target.value]});
}
const handleDeleteSkill = (skill) => {
    setTempPlan({...tempPlan, certificateSkills:tempPlan.certificateSkills.filter((e)=>{
        if(e !== skill) return e;
    })});
}

const addNewPlanApi = async(field)=> {
    
    let tempArray = mentor.mentorPlans;
    
    tempArray.push(field);
    const settings = {
        method: "POST",
        body: JSON.stringify({
            mentorPlans:tempArray
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
            setTempPlan(planObjInitial)
            onUpdate(response)
            handleClose()
        } catch (e) {
            setTempPlan(planObjInitial)
            return e;
        }    
}

const editPlanApi = async(field, id) => {
    let tempArray = mentor.mentorPlans;
    for(let i = 0;i<tempArray.length;i++){
        if(tempArray[i]._id === id){
            tempArray[i] = field
            break;
        }
    }

    const settings = {
        method: "POST",
        body: JSON.stringify({
            mentorPlans:tempArray
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
           
            const fetchResponse = await fetch(`http://localhost:8000/updateMentorProfile?mentorAccountId=${account.id}`, settings);
            const response = await fetchResponse.json();
            setTempPlan(planObjInitial)
            onUpdate(response)
            console.log(mentor)
            handleClose2()
        } catch (e) {
            setTempPlan(planObjInitial)
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
                {/* <div>
                Add Plans
                </div> */}
                <div style={{
                    color:'#566474',
                    
                }}>
                Plans detailing your services
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
                    <DialogTitle>Add New Plans</DialogTitle>
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
                            Plan Description
                        </div>

                        <div>
                            <TextField
                                name="perks"
                                value={tempPlan.perks}
                                onChange={(e) => {
                                    setTempPlan({...tempPlan, [e.target.name]: e.target.value})
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

                

                    
                {/* End of date of education */}
                </div>
                {/* End of school name */}
                
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={()=>{addNewPlanApi(tempPlan)}}>Save</Button>
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
                    mentor.mentorPlans &&  mentor.mentorPlans.length > 0 ? mentor.mentorPlans.map((plan) => (
                        
                        
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
                                fontSize:'18px',
                                width:750
                            }}>
                            {plan.perks}
                            </div>

                            {
                                account.role !== 'company'?
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
                            
                            handleClickOpen2(plan);
                        }}
                        >
                            <EditOutlinedIcon/> Edit
                            </div>
                            :
                            <div></div>
                            }
                            


                        </div>

                        <Dialog open={open2} onClose={handleClose2}>
                    <DialogTitle>Add New Plans</DialogTitle>
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
                            Plan Description
                        </div>

                        <div>
                            <TextField
                                name="perks"
                                value={tempPlan.perks}
                                onChange={(e) => {
                                    setTempPlan({...tempPlan, [e.target.name]: e.target.value})
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

                

                    
                {/* End of date of education */}
                </div>
                {/* End of school name */}
                
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={()=>{editPlanApi(tempPlan, tempPlan._id)}}>Save</Button>
                    </DialogActions>
             </Dialog>  

                            

                        </div>
                   ))
                   :
                   console.log('No Plan details')
                }
                </div>
            </div>
        </>
    )
}
export default MentorPlans