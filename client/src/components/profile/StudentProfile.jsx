import StudentSidebar from "../sidebar/StudentSidebar"
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


const StudentProfile = () => {
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const studentInitial = {
        studentAccountId:account.id,
        studentName:'',
        studentEmail:'',
        studentContact:'',
        aboutYourself:'',
        payerId:'',
        studentExams:[],
        studentSavedPosts:[],
        studentLikedPosts:[],
        studentSubjects:[],
        studentChats:[],
        reviewsPosted:[],
        ratingGiven:[]
    }
    const [student, setStudent] = useState(studentInitial)

    const handleTextFieldsChange = (e) => {
        setStudent({...student, [e.target.name]: e.target.value});
        console.log(student)
    }
    const handleExamSelect = (e) => {
       
        setStudent({...student, studentExams:[...student.studentExams, e.target.value]});
        console.log(student)
    }
    const handleDeleteExam = (exam) => {
        setStudent({...student, studentExams:student.studentExams.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(student)
    }
    const handleSubjectSelect = (e) => {
        setStudent({...student, studentSubjects:[...student.studentSubjects, e.target.value]});
        console.log(student)
    }
    const handleDeleteSubject = (exam) => {
        setStudent({...student, studentSubjects:student.studentSubjects.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(student)
    }
    
    const updateProfile = async() => {
        
        const settings = {
         method: "POST",
         body: JSON.stringify(student),
         headers: {
             "Content-type": "application/json; charset=UTF-8",
             'authorization' : getAccessToken()
         }
         }
         try {
             console.log(settings.body)
             const fetchResponse = await fetch(`https://my-guru-server.vercel.app/updateStudentProfile?studentAccountId=${account.id}`, settings);
             const response = await fetchResponse.json();
            
             
         } catch (e) {
             
             return e;
         }    
    }
    useEffect(() => {
        const myFunction = async() => {
          const url = `https://my-guru-server.vercel.app/getStudentProfile?studentAccountId=${account.id}`;
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
              setStudent(response);
              
              } catch (e) {
              console.log(e);
              }
        }
        myFunction();
      }, [])
    return(
        <>
            <div style={{
            display:'flex',
            flexDirection:'row',
            
          }}>
                <StudentSidebar/>
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
               
            }}>
            <div style={{
                display:'flex',
                flexDirection:'column'
            }}>
            <div style={{
                    fontSize:'16px',
                    fontFamily:'DM Sans',
                    marginTop:'10px',
                    backgroundColor:'#142683',
                    borderRadius:'5px',
                    fontWeight:400,
                    cursor:'pointer',
                    padding: '4px 4px 8px 4px',
                    color:'white',
                    width:'fit-content'
                }}
                onClick={()=>{updateProfile()}}
                >Save Changes</div>

            <div style={{
                display:'flex',
                flexDirection:'column',
                
            }}>
                <div style={{
                    color:'black'
                }}>
                     Name
                </div>

                <div style={{
                    background:'#d8ebf0',
                    width:'fit-content'
                }}>
                    <TextField
                        name="studentName"
                        value={student.studentName}
                        onChange={(e) => {
                            handleTextFieldsChange(e)
                        }}
                        id="filled-multiline-flexible"
                        label="Multiline"
                        multiline
                        maxRows={4}
                        style={{width:500}}
                        variant="filled"
                        />
                </div>
            </div>
            <div style={{
                display:'flex',
                flexDirection:'column',  
                
            }}>
                <div style={{
                    color:'black'
                }}>
                     Email
                </div>

                <div style={{
                    background:'#d8ebf0',
                    width:'fit-content'
                }}>
                    <TextField
                        name="studentEmail"
                        value={student.studentEmail}
                        onChange={(e) => {
                            handleTextFieldsChange(e)
                        }}
                        id="filled-multiline-flexible"
                        label="Multiline"
                        multiline
                        maxRows={4}
                        style={{width:500}}
                        variant="filled"
                        />
                </div>
            </div>
            <div style={{
                display:'flex',
                flexDirection:'column',  
                
            }}>
                <div style={{
                    color:'black'
                }}>
                     Contact No.
                </div>

                <div style={{
                    background:'#d8ebf0',
                    width:'fit-content'
                }}>
                    <TextField
                        name="studentContact"
                        value={student.studentContact}
                        onChange={(e) => {
                            handleTextFieldsChange(e)
                        }}
                        id="filled-multiline-flexible"
                        label="Multiline"
                        multiline
                        maxRows={4}
                        style={{width:500}}
                        variant="filled"
                        />
                </div>
            </div>
            <div style={{
                display:'flex',
                flexDirection:'column',  
                
            }}>
                <div style={{
                    color:'black'
                }}>
                     About yourself
                </div>

                <div style={{
                    background:'#d8ebf0',
                    width:'fit-content'
                }}>
                    <TextField
                        name="aboutYourself"
                        value={student.aboutYourself}
                        onChange={(e) => {
                            handleTextFieldsChange(e)
                        }}
                        id="filled-multiline-flexible"
                        label="Multiline"
                        multiline
                        maxRows={4}
                        style={{width:500}}
                        variant="filled"
                        />
                </div>
            </div>

           

                <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px',
            }}>
                <div style={{
                    color:'black'
                }}>
                    Exams
                </div>

                <div style={{
                    width:500,
                }}>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleExamSelect(e)
                        }}
                        value={student.studentExams && student.studentExams.length > 0 ? student.studentExams[student.studentExams.length-1]:''}
                        defaultValue={30}
                        inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                        }}
                    >
                    {
                        exams.map((exam) =>
                        (
                            <option  value={exam}>{exam}</option>
                        ))
                    
                    }
                        
                    </NativeSelect>

                </FormControl>
                <div style={{
                    display:'flex',
                    flexDirection:'row',
                    maxHeight:'100px',
                    overflowY:'auto',
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                   student.studentExams && student.studentExams.length>0?
                    student.studentExams.map((exam) =>
                        (
                        <div>
                        <div  style={{
                        background:'#27538b',
                        color:'white',
                        marginTop:'1px',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'5px',
                        display:'flex',
                        flexDirection:'row'
                    }}>
                            <div>
                                {exam}
                            </div>
                            <div>
                            <CloseIcon  onClick={() => {handleDeleteExam(exam)}} style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
                        :
                        ''
                }
                    
                        
                   
                </div>
                </div>
            </div>
            <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px',
               
            }}>
                <div style={{
                    color:'black'
                }}>
                    Subjects
                </div>

                <div style={{
                    width:500,
                }}>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleSubjectSelect(e)
                        }}
                        value={student.studentSubjects && student.studentSubjects.length > 0 ? student.studentSubjects[student.studentSubjects.length-1]:''}
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
                    maxHeight:'100px',
                    overflowY:'auto',
                    flexWrap:'wrap'
                }}>

                        

                {
                    
                  student.studentSubjects && student.studentSubjects.length>0?  
                  student.studentSubjects.map((subject) =>
                        (
                        <div>
                        <div  style={{
                        background:'#27538b',
                        marginTop:'1px',
                        color:'white',
                        borderRadius:'20px',
                        width:'fit-content',
                        padding:'5px',
                        display:'flex',
                        flexDirection:'row'
                    }}>
                            <div>
                                {subject}
                            </div>
                            <div>
                            <CloseIcon  onClick={() => {handleDeleteSubject(subject)}} style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
                        :
                        ''
                }
                    
                        
                   
                </div>
                </div>
            </div>
            

            </div>

            </div>
            </div>
            </div>
            
        </>
    )
}
export default StudentProfile