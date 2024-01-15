
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
import { useLocation } from 'react-router-dom';
import monthMap from '../../constants/monthMap.js';

const MentorPlans = ({mentor, onUpdate}) =>{
    const location  = useLocation();
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const planObjInitial = {
        videoCalls:'',
        streams:'',
        posts:'',
        otherPerks:'',
        price:0,
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
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/updateMentorProfile?mentorAccountId=${account.id}`, settings);
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
           
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/updateMentorProfile?mentorAccountId=${account.id}`, settings);
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
const makePaymentApi = async(planId, studentAccountId, mentorAccountId) => {
    const settings = {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            'authorization' : getAccessToken()
        }
        }
        try {
           
            const fetchResponse = await fetch(`https://my-guru-server.vercel.app/create-checkout-session?planId=${planId}&studentAccountId=${studentAccountId}&mentorAccountId=${mentorAccountId}`, settings);
            const response = await fetchResponse.json();
            
            if(response.msg === 'payment not allowed'){
                return
            }
            console.log(response.url)
            
            window.location = response.url
        } catch (e) {
            return e;
        }
}


    return(
        <>
            <div style={{
                display:'flex',
                flexDirection:'column',
                width:'80%'
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
                Add Plans
                </div>
                <div style={{
                    color:'#566474',
                    
                }}>
                Plans detailing your services
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
                            No. of video calls
                        </div>

                        <div>
                            <TextField
                                name="videoCalls"
                                value={tempPlan.videoCalls}
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
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            No. of streams
                        </div>

                        <div>
                            <TextField
                                name="streams"
                                value={tempPlan.streams}
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
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            No. of posts/articles provided
                        </div>

                        <div>
                            <TextField
                                name="posts"
                                value={tempPlan.posts}
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
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            Other perks
                        </div>

                        <div>
                            <TextField
                                name="otherPerks"
                                value={tempPlan.otherPerks}
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
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            {`Price of plan (in Rs per month)`}
                        </div>

                        <div>
                            <TextField
                                name="price"
                                value={tempPlan.price}
                                onChange={(e) => {
                                    setTempPlan({...tempPlan, [e.target.name]: e.target.value})
                                }}
                                id="standard-number"
                                label="Multiline"
                                type="number"
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
                            display:'flex',
                            flexDirection:'column'
                        }}>
                            <div style={{
                                color:'black',
                                fontSize:'18px',
                                width:750
                                
                            }}>
                            {`No. of video calls: ${plan.videoCalls}`}
                            </div>

                            <div style={{
                                color:'black',
                                fontSize:'18px',
                                width:750,
                                marginTop:'2px',

                            }}>
                            {`No. of streams: ${plan.streams}`}
                            </div>

                            <div style={{
                                color:'black',
                                fontSize:'18px',
                                width:750,
                                marginTop:'2px',
                            }}>
                            {`No. of posts/articles: ${plan.posts}`}
                            </div>

                            <div style={{
                                color:'black',
                                fontSize:'18px',
                                width:750,
                                marginTop:'2px',
                            }}>
                            {`Other perks: ${plan.otherPerks}`}
                            </div>
                            <div style={{
                                color:'black',
                                fontSize:'18px',
                                width:750,
                                marginTop:'2px',
                            }}>
                            {`Price of plan(in Rs per month): ${plan.price}`}
                            </div>

                        </div>
                            

                            {
                                location.pathname.includes('public') === true || account.id !== mentor.mentorAccountId?
                                <div style={{
                            marginLeft:'auto',
                            marginRight:'0px',
                            borderRadius:'5px',
                            border: '1px solid #142683',
                            background:'green',
                            padding: '10px 10px 10px 10px',
                            color:'white',
                            fontSize:'16px',
                            fontWeight:'700',
                            height:'fit-content',
                            cursor:'pointer',
                        }}
                        onClick={() => {
                            makePaymentApi(plan._id, account.id, mentor.mentorAccountId)
                            
                        }}
                        >
                            Buy Plan
                            </div>
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
                            
                            handleClickOpen2(plan);
                        }}
                        >
                            <EditOutlinedIcon/> Edit
                            </div>
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
                            No. of video calls
                        </div>

                        <div>
                            <TextField
                                name="videoCalls"
                                value={tempPlan.videoCalls}
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

                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            No. of streams
                        </div>

                        <div>
                            <TextField
                                name="streams"
                                value={tempPlan.streams}
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
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            No. of posts/articles provided
                        </div>

                        <div>
                            <TextField
                                name="posts"
                                value={tempPlan.posts}
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
                <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            Other perks
                        </div>

                        <div>
                            <TextField
                                name="otherPerks"
                                value={tempPlan.otherPerks}
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
               <div style={{
                        display:'flex',
                        flexDirection:'column',
                        marginTop:'15px'
                    }}>
                        <div style={{
                            color:'black'
                        }}>
                            {`Price of plan (in Rs per month)`}
                        </div>

                        <div>
                            <TextField
                                name="price"
                                value={tempPlan.price}
                                onChange={(e) => {
                                    setTempPlan({...tempPlan, [e.target.name]: e.target.value})
                                }}
                                id="standard-number"
                                label="Multiline"
                                type="number"
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