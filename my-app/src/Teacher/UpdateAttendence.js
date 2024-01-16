import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Coursecard from './Cards';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import TeacherSideBar from './TeacherSideBar';

const UpdateAttendence = () => {
  const { tid, settid } = useContext(idcontext);
  const { courseid, setcourseid } = useContext(idcontext);
  const { classid, setclassid } = useContext(idcontext);
  const [CoursesData, setCoursesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/get-courses-teacher', { tid });
        setCoursesData(response.data.courses); // Log the state inside useEffect
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
    console.log('CoursesData:', CoursesData);
  }, [tid]); // Make sure to include tid in the dependency array if it's used in the fetchData function

  const handleCourseClick = (courseId, ClassID) => {
    setcourseid(courseId);
    setclassid(ClassID);
    navigate('/teacher/Updateattendenceform');
    // You can perform additional actions based on the clicked course ID
  };

  return (
    <>
      <Header />
      <TeacherSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '280px',fontSize:'46px' }}>Attendence</h1>
    <hr/>
      <div className="courses-container">
        {CoursesData.map(
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
  );
};

export default UpdateAttendence;
