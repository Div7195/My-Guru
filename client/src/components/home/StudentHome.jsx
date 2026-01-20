
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
import StudentSidebar from "../sidebar/StudentSidebar";
import '../../css/studentHome.css'
const StudentHome = () =>{
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [posts, setPosts] = useState({})

    return(
   <>
        <div style={{
            display:'flex',
            flexDirection:'row',
            
          }}>
                <StudentSidebar/>
                <div className="container">     

                <div style={{
                display:'flex',
                flexDirection:'column',
                width:'100%',
                background:'#3b4464',
                height:'100%'
                }}>

                <div className="sub-container">

                    <div style={{
                        fontSize:'40px'
                    }}>
                        Top Mentors/Consultants At One Place
                    </div>
                    <div style={{
                        fontSize:'70px',
                        fontWeight:'700',
                        color:'#04274a'
                    }}>
                        MyGuru
                    </div>
                    
                    <div style={{
                        fontSize:'25px'
                    }}>
                        Get Mentorship From Various Subject Experts
                    </div>
                    <div style={{
                        fontSize:'25px'
                    }}>
                        Unleash Your True Potential By Getting Best Mentorship
                    </div>
                </div>

                <div className="section-row-container">
                <div>

                        <div className="card-heading">
                            Top Experts in JEE
                        </div>

                        <div style={{
                            marginTop:'5px',
                            background:'aliceblue',
                            borderRadius:'5px',
                        }}>
                            
                        </div>

                </div>

                <div>
                        <div className="card-heading">
                            Top Experts in NEET
                        </div>

                        <div style={{
                            marginTop:'5px',
                            background:'aliceblue',
                            borderRadius:'5px',
                        }}>
                            
                        </div>
                </div>
                <div>
                        <div className="card-heading">
                            Top Experts in UPSC
                        </div>

                        <div style={{
                            marginTop:'5px',
                            background:'aliceblue',
                            borderRadius:'5px',
                        }}>
                            
                        </div>
                </div>

                </div>

                <div className="section-row-container">
                <div>
                        <div className="card-heading">
                            Top Experts in GATE
                        </div>

                        <div style={{
                            marginTop:'5px',
                            background:'aliceblue',
                            borderRadius:'5px',
                        }}>
                            
                        </div>
                </div>

                <div>
                        <div className="card-heading">
                            Top Experts in CA/CFA
                        </div>

                        <div style={{
                            marginTop:'5px',
                            background:'aliceblue',
                            borderRadius:'5px',
                        }}>
                            
                        </div>
                </div>
                <div>
                        <div className="card-heading">
                            Top Experts in RRB
                        </div>

                        <div style={{
                            marginTop:'5px',
                            background:'aliceblue',
                            borderRadius:'5px',
                        }}>
                            
                        </div>
                </div>

                </div>

                </div>
            </div>
        </div>
   </>
    );
}

export default StudentHome;