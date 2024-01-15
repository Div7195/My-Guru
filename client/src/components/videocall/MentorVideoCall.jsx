import React from 'react' ;
import {useParams} from 'react-router-dom';
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';
import { useState ,useEffect , useContext } from "react";
import { getAccessToken } from "../../utils/util";
import { DataContext } from "../../context/DataProvider";
import MentorSidebar from '../sidebar/MentorSidebar';


const MentorVideoCall = () => {
   
   const {account}=useContext(DataContext);
   const [mentorName, setMentorName] = useState("");

  

   useEffect(() => {
       
      

      const myFunction = async() => {
          const url = `https://my-guru-server.vercel.app/getMentorProfile?mentorAccountId=${account.id}`;
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
              console.log(response);
              console.log(response.mentorName);
              setMentorName(response.mentorName);
              console.log(mentorName);
       


              
              } catch (e) {
              console.log(e);
              }
      
          }
          myFunction()
  
    
  }, [])





  






   
  const {roomId} = useParams()


  const myMeeting = async(element) =>{
     const appID = 479869529 ;
     const serverSecret =  "c421642e571f0e005e5de8e501fccb12";
     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
         mentorName,
        ) ;


        const zp = ZegoUIKitPrebuilt.create(kitToken) ;

        if(zp)
        {
            zp.joinRoom({
                container : element,
                scenario : {
                    mode :  ZegoUIKitPrebuilt.VideoConference  ,
                },
             });
          };
        }

        
    

    return(
       
      <>
      <div className='room-page'>
      <div style={{
            display:'flex',
            flexDirection:'row',
            
          }}>
                <MentorSidebar/>
                <div style={{
                width:'100%',
                display:'flex',
                justifyContent:'center',
                
                }}>


                </div>
            </div>
        <div ref={myMeeting}/>
        </div>
    </>








     

    )
       
}


export default MentorVideoCall



