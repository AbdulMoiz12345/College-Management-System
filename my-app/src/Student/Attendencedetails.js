import React from 'react'
import Header from '../Header'
import StudentSideBar from './StudentSideBar'
import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
const Attendencedetails = () => {
    const { stid, settid } = useContext(idcontext);
    const { classid, setclassid } = useContext(idcontext);
    const{courseid,setcourseid}=useContext(idcontext);
    const [coursesData, setCoursesData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.post('http://localhost:8000/Student/attendencereview', { stid,courseid,classid });
            setCoursesData(response.data.attendance);
          } catch (error) {
            console.error('Error fetching data from the backend:', error);
          }
        };
    
        fetchData();
      }, [stid]);
  return (
   <>
   <Header/>
   <StudentSideBar/>
   <h1 className="dashboard-title" style={{ '--line-width': '430px',fontSize:'46px' }}>Attendance Details</h1>
   <hr/>
   <div className="courses-container3">
   {coursesData.map((course, index) => (
  <div className="course-item" key={index}>
    <div className="course-info">
      <h3 className={`status ${course.is_present === 'P' ? 'present' : 'not-present'}`}>
        Status: {course.is_present === 'P' ? 'Present' : 'Not Present'}
      </h3>
      <p className="date">Date: {new Date(course.date).toLocaleDateString()}</p>
    </div>
  </div>
))}
    </div>
   </>
  )
}

export default Attendencedetails
