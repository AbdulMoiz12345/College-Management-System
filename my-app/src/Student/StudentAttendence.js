// StudentAttendence.js

import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import StudentSideBar from './StudentSideBar';
import AttendancePage from './AttendancePage';

const StudentAttendence = () => {
  const navigate = useNavigate();
  const { stid, settid } = useContext(idcontext);
  const [coursesData, setCoursesData] = useState([]);
    const { classid, setclassid } = useContext(idcontext);
    const{courseid,setcourseid}=useContext(idcontext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/Student/attendence', { stid });
        setCoursesData(response.data.attendance);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, [stid]);

  const handleAttendanceClick = (course_id, class_id) => {
    setclassid(class_id)
    setcourseid(course_id)
    console.log('View Details clicked for Course ID:', course_id, 'Class ID:', class_id);
    navigate("/Student/viewattendence")
  };

  return (
    <>
      <Header />
      <StudentSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '390px',fontSize:'46px' }}>Your Attendance</h1>
    <hr/>
      <div className='courses-container1'>
        {coursesData.map((course) => (
          <div className='courses-container2'key={course.course_id} onClick={() => handleAttendanceClick(course.course_id, course.class_id)}>
            <AttendancePage
              course_id={course.course_id}
              course_name={course.coursename}
              class_id={course.class_id}
              class_name={course.ClassName}
              present_days={course.present_count}
              total_days={course.total_days}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default StudentAttendence;
