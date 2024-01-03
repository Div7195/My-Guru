import React from 'react';
import MentorSidebar from "../sidebar/MentorSidebar";
import StudentSidebar from "../sidebar/StudentSidebar.jsx"
import {
    Box,
    Typography,
    Paper,
    Grid,
    Avatar,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
  } from "@mui/material";
import { useParams } from "react-router-dom";
import { getAccessToken } from "../../utils/util.js";
import MentorEducation from "./MentorEducation.jsx";
import MentorExperiences from "./MentorExperiences.jsx";
import MentorAchievements from "./MentorAchievements.jsx";
import MentorStatistics from "./MentorStatistics.jsx";
import MentorReviews from "./MentorReviews.jsx";
import MentorPlans from "./MentorPlans.jsx";
import mentor from "./MentorProfile.jsx";

import { useState, useEffect, useContext } from "react"


import { DataContext } from "../../context/DataProvider"

const PublicMentorProfile = () => {
  const { mentorAccountId } = useParams();

  const {account}=useContext(DataContext);
  const {setAccount} = useContext(DataContext);

  const mentorObjInitial = {
    mentorAccountId:account.id,
        mentorName:'',
        mentorEmail:'',
        mentorContact:'',
        rating:5,
        mentorTagline:'',
        mentorImage:'',
        mentorExams:[],
        mentorSubjects:[],
        mentorFollowers:[],
        mentorPosts:[],
        mentorPlans:[],
        education:[],
        workExperiences:[],
        achievements:[],
        reviewsGot:[],
        mentorChats:[],
        statistics:{},
        
}
const [mentor, setMentor] = useState(mentorObjInitial)

  useEffect(() => {
    const myFunction = async() => {

      const url = `http://localhost:8000/getMentorProfile?mentorAccountId=${mentorAccountId !== null?mentorAccountId:account.id}`;
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
        setMentor(response);
          } catch (e) {
          console.log(e);
          }
    }
    myFunction();
  }, [])

//   return (
//     <>
//       <div style={{ display: 'flex', flexDirection: 'row' }}>
//         <MentorSidebar />
//         <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontFamily: 'DM Sans' }}>
//           {/* Cover Picture */}
//           <div style={{ height: '150px', background: '#2bedbc', position: 'relative' }}>
//             {/* You can add cover picture here */}
//           </div>

//           <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', top: '-80px' }}>
//             {/* Circular Profile Picture */}
//             <Avatar
//               alt={mentor.mentorName}
//               src={mentor.mentorImage ? mentor.mentorImage : 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}
//               sx={{ width: 150, height: 150, border: '5px solid #fff' }}
//             />
//           </div>

//           <Paper style={{ padding: '20px', marginTop: '20px' }}>
//             <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '10px' }}>
//               {mentor.mentorName}
//             </Typography>
//             <Typography variant="subtitle1" style={{ color: '#555', textAlign: 'center', marginBottom: '10px' }}>
//               Mentor ID: {id}
//             </Typography>

//             {/* Display other non-editable information */}
//             <Typography variant="subtitle1" gutterBottom>
//               Email: {mentor.mentorEmail}
//             </Typography>
//             <Typography variant="subtitle1" gutterBottom>
//               Contact: {mentor.mentorContact}
//             </Typography>
//             <Typography variant="subtitle1" gutterBottom>
//               Tagline: {mentor.mentorTagline}
//             </Typography>
//             {/* ... Display other non-editable information ... */}
//             <Divider style={{ margin: '20px 0' }} />
//             {/* Display other non-editable sections like Exams, Subjects, etc. */}
//             <MentorEducation mentor={mentor} />
//             <MentorExperiences mentor={mentor} />
//             <MentorAchievements mentor={mentor} />
//             <MentorStatistics mentor={mentor} />
//             <MentorReviews mentor={mentor} />
//             <MentorPlans mentor={mentor} />
//           </Paper>
//         </div>
//       </div>
//     </>
//   );
// };


//   return (
//     <>
//       <div style={{ display: 'flex', flexDirection: 'row' }}>
//         <MentorSidebar />
//         <div
//           style={{
//             display: 'flex',
//             width: '100%',
//             fontFamily: 'DM Sans',
//             padding: '20px',
//           }}
//         >
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={3}>
//               <Paper style={{ padding: '20px', textAlign: 'center' }}>
//                 <Avatar
//                   alt={mentor.mentorName}
//                   src={mentor.mentorImage ? mentor.mentorImage : 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}
//                   sx={{ width: 150, height: 150 }}
//                 />
//                 <Typography variant="h5" style={{ marginTop: '10px' }}>
//                   {mentor.mentorName}
//                 </Typography>
//                 <Typography variant="subtitle1" style={{ color: '#555', marginTop: '5px' }}>
//                   Mentor ID: {id}
//                 </Typography>
//               </Paper>
//             </Grid>
//             <Grid item xs={12} md={9}>
//               <Paper style={{ padding: '20px' }}>
//                 <Typography variant="h4" gutterBottom>
//                   Public Profile of <strong>{mentor.mentorName} </strong>
//                 </Typography>
//                 {/* Display other non-editable information */}
//                 <Typography variant="subtitle1" gutterBottom>
//                   Email: {mentor.mentorEmail}
//                 </Typography>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Contact: {mentor.mentorContact}
//                 </Typography>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Tagline: {mentor.mentorTagline}
//                 </Typography>
//                 {/* ... Display other non-editable information ... */}
//                 <Divider style={{ margin: '20px 0' }} />
//                 {/* Display other non-editable sections like Exams, Subjects, etc. */}
//                 <MentorEducation mentor={mentor} />
//                 <MentorExperiences mentor={mentor} />
//                 <MentorAchievements mentor={mentor} />
//                 <MentorStatistics mentor={mentor} />
//                 <MentorReviews mentor={mentor} />
//                 <MentorPlans mentor={mentor} />
//               </Paper>
//             </Grid>
//           </Grid>
//         </div>
//       </div>
//     </>
//   );

// //    return(
// //     <div>
// //         hello
// //     </div>
// //    )
// };
const [openDialog, setOpenDialog] = React.useState(false);

const handleContactDetails = () => {
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};

return (
  <>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
    {
      account.role === 'mentor' ?   <MentorSidebar /> :  <StudentSidebar/>
    }
      
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontFamily: 'DM Sans' }}>
        {/* Cover Picture */}
        <div style={{ position: 'relative', height: '200px', background: '#2bedbc', marginBottom: '20px' }}>
          {/* You can add cover picture here */}
          <div style={{ position: 'absolute', bottom: '0', left: '0', padding: '10px' }}>
            {/* Circular Profile Picture */}
            <Avatar
              alt={mentor.mentorName}
              src={mentor.mentorImage ? mentor.mentorImage : 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'}
              sx={{ width: 150, height: 150, border: '3px solid #fff', position: 'absolute', transform: 'translate(-0%, -50%)' }}
            />
          </div>
        </div>

        <Paper style={{ padding: '20px', marginTop: '20px', marginBottom: '20px' }}>
          {/* Display Mentor Name in LinkedIn style font */}
          <Typography variant="h5" style={{  marginBottom: '10px',  fontFamily: 'LinkedIn Sans' }}>
            {mentor.mentorName}
          </Typography>
          <Typography variant="subtitle1" style={{ color: '#555', marginBottom: '10px' }}>
            Mentor ID: {mentorAccountId}
          </Typography>

          {/* Blue color link for Contact Details */}
          <Typography variant="subtitle1" gutterBottom style={{ color: '#0073b1', cursor: 'pointer' }} onClick={handleContactDetails}>
            Contact Details
          </Typography>
        </Paper>

        {/* Education details below the cover picture */}
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          <MentorEducation mentor={mentor} />
        </Paper>

        {/* Display other non-editable sections like Exams, Subjects, etc. */}
        <MentorExperiences mentor={mentor} />
        <MentorAchievements mentor={mentor} />
        <MentorStatistics mentor={mentor} />
        <MentorReviews mentor={mentor} />
        <MentorPlans mentor={mentor} />
      </div>

      {/* Dialog for Contact Details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Contact Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Email: {mentor.mentorEmail}
            <br />
            Phone: {mentor.mentorContact}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  </>
);
};

export default PublicMentorProfile;
