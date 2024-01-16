import React from 'react'
import { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import TeacherSideBar from './TeacherSideBar';
import Header from '../Header';
import Coursecard from './Cards';
import './Sidebar.css'
import { useNavigate } from 'react-router-dom';
const Teacher = () => {
  const { teachername,setteachername } = useContext(idcontext);
  const navigate = useNavigate();
    const { tid,settid } = useContext(idcontext);
    const{courseid,setcourseid}=useContext(idcontext);
    const{setcoursename}=useContext(idcontext);
    const [coursesData, setCoursesData] = useState([]);
    const { classid, setclassid } = useContext(idcontext);
    const [photo, setPhoto] = useState(null);
    useEffect(() => {
      const storedStid = localStorage.getItem('tid');
      const storedName = localStorage.getItem('teachername');
      settid(storedStid);
      setteachername(storedName);
      const fetchData = async () => {
        try {
          const response = await axios.post('http://localhost:8000/get-courses-teacher', { tid });
          setCoursesData(response.data.courses); // Log the state inside useEffect
          localStorage.setItem('coursesDatateacher', JSON.stringify(response.data.courses))
        } catch (error) {
          console.error('Error fetching data from the backend:', error);
        }
      };
  
      if (!coursesData) {
        fetchData();
      } else {
        fetchData();
      }
    }, [settid,setteachername]); // Make sure to include tid in the dependency array if it's used in the fetchData function
  
    useEffect(() => {
      const fetchTeacherProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/teacher-profile?tid=${tid}`);
          const data = response.data.results;
          setPhoto(data.Photo);
        } catch (error) {
          console.error('Error fetching teacher profile:', error);
        }
      };
  
      fetchTeacherProfile();
    }, [tid,teachername]);
  
    // ... (rest of the code)

    const handleCourseClick = (courseId, ClassID) => {
      setcourseid(courseId);
      setclassid(ClassID);
      navigate("/teacher/coursereview");
      // You can perform additional actions based on the clicked course ID
    };
  return (
    <>
    <Header/>
    <TeacherSideBar/>
    <div style={{display:'flex'}}>
      <div>
      <h1 className="dashboard-title" style={{ '--line-width': '280px' }}>DASHBOARD</h1>
      <h1 className="dashboard-title" style={{ '--line-width': `${teachername.length * 74}px`, marginLeft: '870px' }}>
  Welcome {teachername}
</h1>
      </div>
    <div className="photo-container" style={{marginLeft:'0px',marginTop:'30px'}}>
          {photo ? (
          <div>
          <img src={`data:image/png;base64,${photo}`} alt="Teacher" className="profile-photo" style={{ marginLeft: '370px',borderRadius:'50%' }} />
          <p style={{marginTop:'0px',marginLeft:'420px',fontSize:'20px'}}>Profilephoto</p>
          </div>
          ) : (
         <p>No photo uploaded</p>
        )}
</div>

    </div>
     <h1 className='subheading'>Course Enrolled</h1>
     <hr/>
     <div className="courses-container">
      {coursesData.map(
        (course) =>
          course && (
            <Coursecard
            key={course.CourseID}
            id={course.CourseID}
            ClassID={course.ClassID}
            ClassName={course.ClassName}
            name={course.CourseName}
            description={course.CourseDesc}
            onClick={() => handleCourseClick(course.CourseID, course.ClassID)}
          />
          )
      )}
    </div>
    </>
  )
}

export default Teacher
