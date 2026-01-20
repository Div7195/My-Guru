import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { DataContext } from "../../context/DataProvider";
import MentorItem from "./MentorItem";
import subjects from "../../constants/subjects";
import exams from "../../constants/exams";
import { getAccessToken } from "../../utils/util";
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import StudentSidebar from "../sidebar/StudentSidebar";
import { TextField } from "@mui/material";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import NativeSelect from '@mui/material/NativeSelect';
import '../../css/findMentors.css'
const FindMentors = () => {
    const {account}=useContext(DataContext);
    const {setAccount} = useContext(DataContext);
    const [mentors, setMentors] = useState([])
    const navigate = useNavigate()
    const filterInitial = {
        searchQuery:'',
        sortBy:'',
        queryExams:[],
        querySubjects:[],
    }
    const [filter, setFilter] = useState(filterInitial)
    const handleExamSelect = (e) => {
        if(!filter.queryExams.includes(e.target.value))
        setFilter({...filter, queryExams:[...filter.queryExams, e.target.value]});
        console.log(filter)
    }
    const handleDeleteExam = (exam) => {
        setFilter({...filter, queryExams:filter.queryExams.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(filter)
    }
    const handleSubjectSelect = (e) => {
        if(!filter.querySubjects.includes(e.target.value))
        setFilter({...filter, querySubjects:[...filter.querySubjects, e.target.value]});
        console.log(filter)
    }
    const handleDeleteSubject = (exam) => {
        setFilter({...filter, querySubjects:filter.querySubjects.filter((e)=>{
            if(e !== exam) return e;
        })});
        console.log(filter)
    }
    const handleRadioSortBy = (e) => {
        setFilter({...filter, sortBy:e.target.value });
        console.log(filter)
    }
    const applySearch = async() => {
        const url = `http://localhost:8000/getMentors?userAccountId=${account.id}&userRole=${account.role}&queryExams=${filter.queryExams}&querySubjects=${filter.querySubjects}&searchQuery=${filter.searchQuery}&sortBy=${filter.sortBy}`;
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
                setMentors(response.data);
                
                } catch (e) {
                console.log(e);
                }
        
}
    useEffect(() => {
      const myFunction = async() => {
        const url = `http://localhost:8000/getMentors?userAccountId=${account.id}&userRole=${account.role}&queryExams=${filter.queryExams}&querySubjects=${filter.querySubjects}&searchQuery=${filter.searchQuery}&sortBy=${filter.sortBy}`;
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
                setMentors(response.data);
                
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
                flexDirection:'row',
                fontFamily:'DM Sans'
                }}>     

                <div style={{
                display:'flex',
                flexDirection:'column',
                flexBasis:'60%',
                
                }}>
                    <div className="search-boxC">
                    <TextField
                    onChange={(e) => {setFilter({...filter, searchQuery:e.target.value}); console.log(filter)}}
                    inputProps={{
                        style: {color:'black',fontSize:'16px',fontWeight:'400', borderRadius:'35px', border:'3px solid #c1cdd8', padding:'17px', background:'aliceblue' },
                    }}
                    placeholder="Search keywords"
                    id="outlined-basic" 
                    variant="standard" 
                    InputProps={{
                        disableUnderline: true,
                        style:{
                            width:600,
                            background:''
                            }
                        }}
                    />
                    
                    <div className="icon"
                    onClick={() => {applySearch()}}
                    >
                        <SearchIcon style={{
                            fontSize:'30px'
                        }}/>
                    </div>

                    </div>

                        <div style={{
                        display:'flex',
                        flexDirection:'column',
                        width:'80%',
                        
                
        }}>
                {
            mentors && mentors.length > 0 ? mentors.map(e => (
                <div onClick={() => {navigate(`/student/mentor/profile/${e.mentorAccountId}`)}}>
                
                        <MentorItem  mentor = {e}
                        />
                </div>
            ))
            :
            console.log('no data to show')
        }
        </div>
        </div>
        <div className="filter-boxC">

                <div className="top-boxC">
                <div>
                Mentors Filter
                </div>

                <div className="search-btn"
                onClick={() => {applySearch()}}
                >
                
                Search</div>
                <div className="reset-btn"
                onClick={() => {setFilter(filterInitial)}}
                >
                
                Reset</div>

                </div>
            <div style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'15px'
            }}>
                <div style={{
                    color:'black'
                }}>
                    Select exams
                </div>

                <div>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleExamSelect(e);
                        }}
                        value={filter.queryExams[filter.queryExams.length-1]}
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
                <div className="query-exams-boxC">

                        

                {
                    
                    filter.queryExams.map((skill) =>
                        (
                        <div>
                        <div  className="exam">
                            <div>
                                {skill}
                            </div>
                            <div>
                            <CloseIcon onClick={() => {handleDeleteExam(skill)}}  style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
                }
                    
                        
                   
                </div>
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
                    Select subjects
                </div>

                <div>
                <FormControl fullWidth>
                    
                    <NativeSelect
                        onChange={(e) => {
                            handleSubjectSelect(e);
                        }}
                        value={filter.querySubjects[filter.querySubjects.length-1]}
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
                <div className="query-exams-boxC">

                        

                {
                    
                    filter.querySubjects.map((subject) =>
                        (
                        <div>
                        <div  className="exam">
                            <div>
                                {subject}
                            </div>
                            <div>
                            <CloseIcon onClick={() => {handleDeleteSubject(subject)}}  style={{
                                cursor:'pointer'
                            }}/>
                            </div>
                            </div>
                        </div>
                        ))
                }
                    
                        
                   
                </div>
                </div>

                <div style={{
                    marginTop:'5px'
                }}>
                    <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Sort by</FormLabel>
                    <RadioGroup
                    onChange={(e) => {
                        handleRadioSortBy(e);
                                        }}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="Rating" control={<Radio checked = {filter.sortBy === 'Rating'?true:false}/>} label="Rating" />
                        <FormControlLabel value="No. of students" control={<Radio checked = {filter.sortBy === 'No. of students'?true:false} />} label="No. of students" />
                        
                        
                    </RadioGroup>
                    </FormControl>
                </div>
            </div>

                <div>

                </div>


            </div>

        </div>
        </div>
        </>
    )
}
export default FindMentors