import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { DataContext } from "../../context/DataProvider"
import StarIcon from '@mui/icons-material/Star';
import '../../css/mentorItem.css'
const MentorItem = ({mentor}) => {
    return(
        <>
            <div className="main-boxC">

            {/* Image div start */}
                <div className="image-box">
                    <img src={mentor.mentorImage && mentor.mentorImage !== ""?mentor.mentorImage:'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}alt="Mentor Image" className="image" />
                
                </div>

                {/* Image div end */}
                {/* Mentor content div start */}
        <div className="details-container">

        
                <div style={{
                    display:'flex',
                    flexDirection:'column',
                    
                }}>
                     <div className="name">
                        {mentor.mentorName}
                    </div>


                    <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'14px',
                        color:"rgba(0, 0, 0, 0.6)"
                    }}>
                        {mentor.mentorTagline}
                    </div>

                    <div style={{
                        fontFamily:'DM Sans',
                        fontSize:'14px',
                        color:"rgba(0, 0, 0, 0.6)"
                    }}>
                        {mentor.mentorStudentsCount} students mentored
                    </div>

                    {/* <div style={{
                        display:'flex',
                        flexDirection:'row',
                        marginBottom:'10px'
                    }}>Exams:
                    {
                    
                    mentor.mentorExams.map((exam) =>
                        (
                        <div>
                        <div  style={{
                        background:'#d5d5d5',
                        color: '#566474',
                        fontSize:'12px',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'4.5px 10px',
                        fontWeight:'400',
                        display:'flex',
                        flexDirection:'row',
                        fontFamily: "DM Sans",
                        marginRight:'5px'
                    }}>
                             <div>
                                {exam}
                            </div>
                            </div>
                        </div>
                        ))
                }

                </div>

                <div style={{
                        display:'flex',
                        flexDirection:'row',
                        marginBottom:'10px'
                    }}>Subjects:
                    {
                    
                    mentor.mentorSubjects.map((subject) =>
                        (
                        <div>
                        <div  style={{
                        background:'#d5d5d5',
                        color: '#566474',
                        fontSize:'12px',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'4.5px 10px',
                        fontWeight:'400',
                        display:'flex',
                        flexDirection:'row',
                        fontFamily: "DM Sans",
                        marginRight:'5px'
                    }}>
                             <div>
                                {subject}
                            </div>
                            </div>
                        </div>
                        ))
                }

                </div> */}

                </div>
                <div className="rating">
                    {mentor.mentorRating}<StarIcon/>
                </div>
</div>
                {/* Mentor content div end */}
                {/* {Rating div start} */}
                
                {/* {Rating div end} */}

                <div>

                </div>
            </div>
        </>
    )
}
export default MentorItem