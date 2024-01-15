import { useState, useEffect, useContext } from "react"
import { useNavigate, Link, useParams, useLocation } from "react-router-dom"
import MentorItem from "./MentorItem"
import StudentSidebar from "../sidebar/StudentSidebar"
import { DataContext } from "../../context/DataProvider"
import { getAccessToken } from "../../utils/util"
import dayjs from "dayjs"


const StudentPlans = () => {
    const navigate = useNavigate()
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [plans, setPlans] = useState([])


    useEffect(() => {
        const myFunction = async() => {
            const url = `https://my-guru-server.vercel.app/getYourPlans?studentAccountId=${account.id}`;
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
                    setPlans(response.data);
                    
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
                        width:'80%',
                    }}>
                    


                    <div style={{
                            display:'flex',
                            flexDirection:'column',
                            fontFamily:'DM Sans'
                        }}>
                {
                    plans &&  plans.length > 0 ? plans.map((plan) => (
                        
                        
                        <div style={{
                            display:'flex',
                            flexDirection:'column',
                            border:'3px solid rgb(195 195 195)',
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
                            <div style={{
                                color:'black',
                                fontSize:'18px',
                                width:750,
                                marginTop:'2px',
                            }}>
                            {`Amount paid(in Rs): ${plan.amount}`}
                            </div>
                            <div style={{
                                color:'black',
                                fontSize:'18px',
                                width:750,
                                marginTop:'2px',
                            }}>
                            {`Purchase date: ${new Date(plan.purchaseTimestamp)}`}
                            </div>

                        </div>
                            
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
                        onClick={() => {navigate(`/student/mentor/profile/${plan.mentorAccountId}`)}}
                        >
                            View mentor
                            </div>
                        </div>
                        </div>
                   ))
                   :
                   console.log('No Plan details')
                }
                </div>

                </div>

                </div>
                </div>
        </>
    )
}
export default StudentPlans