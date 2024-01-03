import React from 'react';
import MentorSidebar from "../sidebar/MentorSidebar";
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
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from "react"


import { DataContext } from "../../context/DataProvider"



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


const PublicMentorProfile = () => {
  const { id } = useParams();
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
      const url = `http://localhost:8000/getMentorProfile?mentorAccountId=${account.id}`;
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
        console.log(response);
          } catch (e) {
          console.log(e);
          }
          
    }
    myFunction();
  }, [])


const [openDialog, setOpenDialog] = React.useState(false);



const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 25, 255, 0.7)',
    '&.Mui-selected': {
      color: 'rgba(25, 255, 25, 0.7)',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 28, 0.32)',
    },
  }),
);

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 60,
    width: '100%',
    backgroundColor: '#2bedbc',
  },
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const [value, setValue] = useState(0)


const handleChange = (event, newValue) => {
    setValue(newValue);
};



















const handleContactDetails = () => {
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};


return (
  <>

  
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <MentorSidebar />
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
            Mentor ID: {id}
          </Typography>

          {/* Blue color link for Contact Details */}
          <Typography variant="subtitle1" gutterBottom style={{ color: '#0073b1', cursor: 'pointer' }} onClick={handleContactDetails}>
            Contact Details
          </Typography>
        </Paper>

        {/* Education details below the cover picture 
         <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Education
          </Typography>
          <MentorEducation mentor={mentor} />
        </Paper>

         <MentorExperiences mentor={mentor} />
        <MentorAchievements mentor={mentor} />
        <MentorStatistics mentor={mentor} />
        <MentorReviews mentor={mentor} />
        <MentorPlans mentor={mentor} /> 
        */}
       



    { <Box sx={{ borderBottom: 1, borderColor: 'divider',bgcolor:'#2e1534' }}>
                        <StyledTabs value={value} onChange={handleChange} aria-label="ant example">
                        <StyledTab  label="Education" {...a11yProps(0)} />
                        <StyledTab  label="Experiences" {...a11yProps(1)} />
                        <StyledTab  label="Awards and Achievements" {...a11yProps(2)} />
                        <StyledTab  label="Reviews" {...a11yProps(3)} />
                        <StyledTab  label="Statistics" {...a11yProps(4)} />
                        <StyledTab  label="Plans" {...a11yProps(5)} />
                        <StyledTab  label="Exams" {...a11yProps(6)} />
                        <StyledTab  label="Subjects" {...a11yProps(7)} />
                        </StyledTabs>
                </Box> }
                <CustomTabPanel value={value} index={0}>
                    <MentorEducation 
                        mentor={mentor}
                        onUpdate={(state) => {setMentor(state)}}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <MentorExperiences
                        mentor={mentor}
                        onUpdate={(state) => {setMentor(state)}}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={2}>
                    <MentorAchievements 
                        mentor={mentor}
                        onUpdate={(state) => {setMentor(state)}}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={3}>
                    <MentorStatistics 
                        mentor={mentor}
                        onUpdate={(state) => {setMentor(state)}}
                    />
                </CustomTabPanel>


                <CustomTabPanel value={value} index={4}>
                    <MentorReviews 
                        mentor={mentor}
                        onUpdate={(state) => {setMentor(state)}}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={5}>
                    <MentorPlans 
                        mentor={mentor}
                        onUpdate={(state) => {setMentor(state)}}
                    />
                </CustomTabPanel>
                
                <CustomTabPanel value={value} index={6}>
                
               

               {mentor.mentorExams.map((exam) => (
                   <div key={exam}>
                    {exam}
                    </div>
                                ))}
              
                </CustomTabPanel>


                <CustomTabPanel value={value} index={7}>
                
               

                {mentor.mentorExams.map((subject) => (
                    <div key={subject}>
                     {subject}
                     </div>
                      ))}
               
                 </CustomTabPanel>


                <div
            style={{
              position: 'fixed',  // Set the position to fixed
              top: '20px',  // Adjust the top position as needed
              right: '1px',  // 
                width: '17%',  // Set the width to 30% of the screen
                height: '100vh',  // Set the height to 100% of the viewport height
                float: 'right',  // Align the div to the right
                backgroundColor: 'lightgray',  // Example background color
                boxSizing: 'border-box',  // Include padding in the width calculation
                
            }}
        >
            <img
                src="https://static.vecteezy.com/system/resources/previews/000/380/945/original/edit-profile-vector-icon.jpg" // Replace with the URL of your image
                alt="Your Image"
                style={{
     
                    width: '100%',  // Make the image occupy 100% of the container width
                    height: '100%',  // Make the image occupy 100% of the container height
                    objectFit: 'cover',  // Maintain aspect ratio and cover the container
                }}
            />
        </div>
                


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
