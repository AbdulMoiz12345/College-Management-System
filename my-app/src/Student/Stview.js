import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import StudentSideBar from './StudentSideBar';
import StudentCoursecard from './StudentCard';

const StudentViewCourses = () => {
  const navigate = useNavigate();
  const { stid, settid } = useContext(idcontext);
  const { courseid, setcourseid } = useContext(idcontext);
  const { setcoursename } = useContext(idcontext);
  const { classid, setclassid } = useContext(idcontext);
  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/Student', { stid });
        setCoursesData(response.data.courses);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, [stid]);

  const handleCourseClick = (courseId, ClassID) => {
    setcourseid(courseId);
    setclassid(ClassID);
    navigate('/Student/review');
  };


  return (
    <>
      <Header />
      <StudentSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '220px', fontSize: '46px' }}>
        Courses
      </h1>
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

export default StudentViewCourses;
