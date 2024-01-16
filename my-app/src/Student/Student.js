import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Header from '../Header';
import StudentSideBar from './StudentSideBar';
import { useNavigate } from 'react-router-dom';
import StudentCoursecard from './StudentCard';

const Student = () => {
  const [photo, setPhoto] = useState(null);
  const { stid, studentname,setstid,setstudentname } = useContext(idcontext);
  const { setcourseid, setclassid } = useContext(idcontext);
  const [coursesData, setCoursesData] = useState([]);
  const [linewidth, setLinewidth] = useState(null);

  useEffect(() => {
    const storedStid = localStorage.getItem('stid');
      const storedName = localStorage.getItem('studentname');
      setstid(storedStid);
      setstudentname(storedName);
    const fetchData = async () => {
      try {
        
          const response = await axios.post('http://localhost:8000/Student', { stid });
          setCoursesData(response.data.courses);
          setLinewidth(studentname ? `${studentname.length * 10}px` : '0px');
          localStorage.setItem('coursesDatastudent', JSON.stringify(response.data.courses))
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };
    if (!coursesData) {
      fetchData();
    } else {
      fetchData();
    }
    console.log(coursesData)
   
  }, [setstid,setstudentname]);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/student-profile?stid=${stid}`);
        const data = response.data.results;
        setPhoto(data.Photo);
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
      }
    };

    fetchStudentProfile();
  }, [stid, studentname]);

  const navigate = useNavigate();

  const handleCourseClick = (courseId, ClassID) => {
    setcourseid(courseId);
    setclassid(ClassID);
    navigate('/Student/review');
  };

  return (
    <>
      <Header />
      <StudentSideBar />
      <div style={{ display: 'flex' }}>
        <div>
          <h1 className="dashboard-title" style={{ '--line-width': '280px' }}>
            DASHBOARD
          </h1>
          <h1 className="dashboard-title" style={{ '--line-width': `${studentname.length * 74}px`, marginLeft: '870px' }}>
  Welcome {studentname}
</h1>
        </div>
        <div className="photo-container" style={{ marginLeft: '0px', marginTop: '30px' }}>
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
      <h1 className="subheading">Course Enrolled</h1>
      <hr />
      <div className="courses-container">
        {coursesData.map(
          (course) =>
            course && (
              <StudentCoursecard
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
  );
};

export default Student;

