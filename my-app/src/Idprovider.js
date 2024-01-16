import React, { createContext, useState } from 'react';

export const idcontext = createContext(null);

const IdContextProvider = ({ children }) => {
  const [stid, setstid] = useState("");
  const [adminid, setadminid] = useState("");
  const [tid, settid] = useState("");
  const [courseid, setcourseid] = useState("");
  const [coursename, setcoursename] = useState("");
  const[classid,setclassid]=useState("")
  const[adminname,setadminname]=useState("")
  const[studentname,setstudentname]=useState("")
  const[teachername,setteachername]=useState("")
  const[AssignmentID,setAssignmentID]=useState("")
  const[complaintid,setComplaintid]=useState("")
  const[quizid,setquizid]=useState("")
  return (
    <idcontext.Provider value={{ stid, setstid, tid, settid,courseid, setcourseid,coursename, setcoursename,classid,setclassid,adminname,setadminname,studentname,setstudentname,teachername,setteachername,AssignmentID,setAssignmentID,complaintid,setComplaintid,quizid,setquizid,adminid, setadminid }}>
      {children}
    </idcontext.Provider>
  );
};

export default IdContextProvider;
