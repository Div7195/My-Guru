import MentorSidebar from "../sidebar/MentorSidebar"
import { TextField } from "@mui/material"
import { DataContext } from "../../context/DataProvider"
import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import exams from "../../constants/exams.js"
import subjects from "../../constants/subjects.js"
import CloseIcon from '@mui/icons-material/Close';
import { getAccessToken } from "../../utils/util.js"
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Button} from "@mui/material";
import FormLabel from '@mui/material/FormLabel';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MentorEducation from "./MentorEducation.jsx"
import MentorExperiences from "./MentorExperiences.jsx"
import MentorAchievements from "./MentorAchievements.jsx"
import MentorStatistics from "./MentorStatistics.jsx"
import MentorReviews from "./MentorReviews.jsx"
import MentorPlans from "./MentorPlans.jsx"
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Image from "@mui/icons-material/Image.js"

const gradientBackgroundStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: -1,
  animation: 'changeColors 10s infinite linear',
};

// CSS animation keyframes
const keyframes = `
  @keyframes changeColors {
    0% {
      background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);
    }
    25% {
      background: linear-gradient(45deg, #0000ff, #ff0000, #00ff00);
    }
    50% {
      background: linear-gradient(45deg, #00ff00, #0000ff, #ff0000);
    }
    75% {
      background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);
    }
    100% {
      background: linear-gradient(45deg, #0000ff, #ff0000, #00ff00);
    }
  }
`;

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
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


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




const MentorProfile = () => {
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [imageFile, setImageFile] = useState(null)

    const [searchExam, setSearchExam] = useState("");
    const [searchSubject, setSearchSubject] = useState("");
  
    const filteredExams = exams.filter((exam) =>
      exam.toLowerCase().includes(searchExam.toLowerCase())
    );
  
    const filteredSubjects = subjects.filter((subject) =>
      subject.toLowerCase().includes(searchSubject.toLowerCase())
    );
  
    const [selectedExams, setSelectedExams] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);


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


    const styleTag = document.createElement('style');
    styleTag.appendChild(document.createTextNode(keyframes));
    document.head.appendChild(styleTag);

    
    const [mentor, setMentor] = useState(mentorObjInitial)
    const handleTextFieldsChange = (e) => {
        setMentor({...mentor, [e.target.name]: e.target.value});
        console.log(mentor);
    }
    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleExamSelect = (e) => {
        setMentor({...mentor, mentorExams:[...mentor.mentorExams, e.target.value]});
        console.log(mentor);
    }
    const handleDeleteExam = (exam) => {
        setMentor({...mentor, mentorExams:mentor.mentorExams.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(mentor);
    }


    const handleSelectExam = (exam) => {
        if (!selectedExams.includes(exam)) {
          setSelectedExams([...selectedExams, exam]);
          setMentor({ ...mentor, mentorExams: [...mentor.mentorExams, exam] });
          updateProfile();
          console.log(mentor);
         
        }
      };
    
      const handleDeselectExam = (exam) => {
        setSelectedExams(selectedExams.filter((e) => e !== exam));
        setMentor({
          ...mentor,
          mentorExams: mentor.mentorExams.filter((e) => e !== exam),
           
        });
        updateProfile();
        console.log(mentor);
       
      };







    const handleSubjectSelect = (e) => {
        setMentor({...mentor, mentorSubjects:[...mentor.mentorSubjects, e.target.value]});
        console.log(mentor);
    }
    const handleDeleteSubject = (exam) => {
        setMentor({...mentor, mentorSubjects:mentor.mentorSubjects.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(mentor);
    }

      
    const handleSelectSubject = (subject) => {
        if (!selectedSubjects.includes(subject)) {
          setSelectedSubjects([...selectedSubjects, subject]);
          setMentor({ ...mentor, mentorSubjects: [...mentor.mentorSubjects, subject] });
      updateProfile(); 
      console.log(mentor);
 
        }
      };
      
      const handleDeselectSubject = (subject) => {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
        setMentor({
          ...mentor,
          mentorSubjects: mentor.mentorSubjects.filter((s) => s !== subject),
         
        });
        updateProfile();
         console.log(mentor);
        
      };



 
    const updateProfile = async() => {
        
        const settings = {
         method: "POST",
         body: JSON.stringify(mentor),
         headers: {
             "Content-type": "application/json; charset=UTF-8",
             'authorization' : getAccessToken()
         }
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`http://localhost:8000/updateMentorProfile?mentorAccountId=${account.id}`, settings);
             const response = await fetchResponse.json();
            
             
         } catch (e) {
             
             return e;
         }    
    }


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
              
              } catch (e) {
              console.log(e);
              }
        }
        myFunction();
      }, [])

      useEffect(() => {
        const storeImageAndGetLink = async() => {
          
          if(imageFile){
              const data = new FormData();
              data.append("name", imageFile.name);
              data.append("file", imageFile);
              
              const settings = {
                  method: "POST",
                  body: data,
                  headers: {
                      'authorization' : getAccessToken()
                  },
                  
                  }
                  try {
                      const fetchResponse = await fetch(`http://localhost:8000/image/upload`, settings);
                      const response = await fetchResponse.json();
                      setMentor({...mentor, mentorImage:response});
                      
                  } catch (e) {
                      
                      return e;
                  }
          }
        }
        storeImageAndGetLink();
      }, [imageFile])

    return(
        <>
     <MentorSidebar/>
   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
       <div style={{ color: 'black', marginBottom: '20px' }}>Add a profile picture</div>
       <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '20px' }}>
           <FormControl>
               <label htmlFor="fileInput">
                   <CameraAltIcon style={{ color: '#00ecff', fontSize: '40px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -30%)' }} />
                 <input
                      type="file"
                      id="fileInput"
                      style={{ display: 'none' }}
                      onChange={(e) => setImageFile(e.target.files[0])}
                  />
              </label>
          </FormControl>
          <div
              style={{
                  borderRadius: '50%',
                  background: '#cda8ff',
                  padding: '1px',
                  textAlign: 'center',
                  overflow: 'hidden',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
              }}
          >
              <img
                  src={
                      mentor.mentorImage && mentor.mentorImage !== ''
                          ? mentor.mentorImage
                          : 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'
                  }
                  alt="Mentor Image"
                  style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                  }}
              />
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
          <div style={{ color: 'black', marginBottom: '10px' }}>Name</div>
          <div style={{ background: '#d8ebf0' }}>
              <TextField
                  name="mentorName"
                  value={mentor.mentorName}
                  onChange={(e) => handleTextFieldsChange(e)}
                  id="filled-multiline-flexible"
                  label="Multiline"
                  multiline
                  maxRows={4}
                  style={{ width: '100%' }}
                  variant="filled"
              />
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
          <div style={{ color: 'black', marginBottom: '10px' }}>Email</div>
          <div style={{ background: '#d8ebf0' }}>
              <TextField
                  name="mentorEmail"
                  value={mentor.mentorEmail}
                  onChange={(e) => handleTextFieldsChange(e)}
                  id="filled-multiline-flexible"
                  label="Multiline"
                  multiline
                  maxRows={4}
                  style={{ width: '100%' }}
                  variant="filled"
              />
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
          <div style={{ color: 'black', marginBottom: '10px' }}>Contact</div>
          <div style={{ background: '#d8ebf0' }}>
              <TextField
                  name="mentorContact"
                  value={mentor.mentorContact}
                  onChange={(e) => handleTextFieldsChange(e)}
                  id="filled-multiline-flexible"
                  label="Multiline"
                  multiline
                  maxRows={4}
                  style={{ width: '100%' }}
                  variant="filled"
              />
          </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '300px', marginTop: '20px' }}>
          <div style={{ color: 'black', marginBottom: '10px' }}>Tagline</div>
          <div style={{ background: '#d8ebf0' }}>
              <TextField
                  name="mentorTagline"
                  value={mentor.mentorTagline}
                  onChange={(e) => handleTextFieldsChange(e)}
                  id="filled-multiline-flexible"
                  label="Multiline"
                  multiline
                  maxRows={4}
                  style={{ width: '100%' }}
                  variant="filled"
              />
          </div>
      </div>
  </div>
      






















            {/* <div style={{
            display:'flex',
            flexDirection:'row',
            
          }}>
                <MentorSidebar/>
                <div style={{
                display:'flex',
                width:'100%',
                fontSize:'20px',
                color:'black',
                fontFamily:'DM Sans',
                
                }}>


            <div style={{
                display:'flex',
                justifyContent:'center',
                flexDirection:'column',
                fontSize:'15px',
                fontFamily:'DM Sans',
               
            }}> */}
           
            

           <div  style={{
                width: '70%',  // Set the width to half of the screen
                margin: '0 auto',  // Center the div horizontally
                backgroundColor: 'white',  // Example background color
                padding: '20px',  // Add padding for better visibility
                boxSizing: 'border-box',  // Include padding in the width calculation
            }}>
       
                <Box style={{
                width: '100%',  // Set the width to half of the screen
                margin: '0 auto',  // Center the div horizontally
                backgroundColor: 'lightgray',  // Example background color
                padding: '20px',  // Add padding for better visibility
                boxSizing: 'border-box',  // Include padding in the width calculation
            }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider',bgcolor:'#2e1534' }}>
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
                </Box>
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ width: "50%" }}>
              <FormControl fullWidth>
                <TextField
                  label="Search Exams"
                  value={searchExam}
                  onChange={(e) => setSearchExam(e.target.value)}
                />
              </FormControl>
              <div style={{ maxHeight: "150px", overflowY: "auto", flexWrap: "wrap" }}>
                {filteredExams.map((exam) => (
                  <div key={exam}>
                    <div
                      onClick={() => handleSelectExam(exam)}
                      style={{
                        background: "#27538b",
                        color: "white",
                        marginTop: "1px",
                        borderRadius: "20px",
                        width: "fit-content",
                        padding: "5px",
                        display: "flex",
                        flexDirection: "row",
                        cursor: "pointer",
                      }}
                    >
                      <div>{exam}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ width: "50%" }}>
              <FormControl fullWidth>
                <TextField label="Selected Exams" disabled />
              </FormControl>
              <div style={{ maxHeight: "150px", overflowY: "auto", flexWrap: "wrap" }}>
                {selectedExams.map((exam) => (
                  <div key={exam}>
                    <div
                      onClick={() => handleDeselectExam(exam)}
                      style={{
                        background: "#2bedbc",
                        color: "black",
                        marginTop: "1px",
                        borderRadius: "20px",
                        width: "fit-content",
                        padding: "5px",
                        display: "flex",
                        flexDirection: "row",
                        cursor: "pointer",
                      }}
                    >
                      <div>{exam}</div>
                      <div>
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={7}>
  <div style={{ display: "flex", flexDirection: "row" }}>
    <div style={{ width: "50%" }}>
      <FormControl fullWidth>
        <TextField
          label="Search Subjects"
          value={searchSubject}
          onChange={(e) => setSearchSubject(e.target.value)}
        />
      </FormControl>
      <div style={{ maxHeight: "150px", overflowY: "auto", flexWrap: "wrap" }}>
        {filteredSubjects.map((subject) => (
          <div key={subject}>
            <div
              onClick={() => handleSelectSubject(subject)}
              style={{
                background: "#27538b",
                color: "white",
                marginTop: "1px",
                borderRadius: "20px",
                width: "fit-content",
                padding: "5px",
                display: "flex",
                flexDirection: "row",
                cursor: "pointer",
              }}
            >
              <div>{subject}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ width: "50%" }}>
      <FormControl fullWidth>
        <TextField label="Selected Subjects" disabled />
      </FormControl>
      <div style={{ maxHeight: "150px", overflowY: "auto", flexWrap: "wrap" }}>
        {selectedSubjects.map((subject) => (
          <div key={subject}>
            <div
              onClick={() => handleDeselectSubject(subject)}
              style={{
                background: "#2bedbc",
                color: "black",
                marginTop: "1px",
                borderRadius: "20px",
                width: "fit-content",
                padding: "5px",
                display: "flex",
                flexDirection: "row",
                cursor: "pointer",
              }}
            >
              <div>{subject}</div>
              <div>
                <CloseIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</CustomTabPanel>



            </Box>
    {/* </div>
    
            </div>
            </div> */}
            </div>

          

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
       
        </>
        
    )
}





export default MentorProfile