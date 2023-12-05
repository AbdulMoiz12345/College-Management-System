import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Coursecard from './Cards';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import TeacherSideBar from './TeacherSideBar';

const Assignment = () => {
    const { tid, settid } = useContext(idcontext);
  const { courseid, setcourseid } = useContext(idcontext);
  const { classid, setclassid } = useContext(idcontext);
  const [CoursesData, setCoursesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/teacheratt', { tid });
        setCoursesData(response.data.courses); // Log the state inside useEffect
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
    console.log('CoursesData:', CoursesData);
  }, [tid]);
  const handleCourseClick = (courseId, ClassID) => {
    setcourseid(courseId);
    setclassid(ClassID);
    navigate('/teacher/giveassignment');
    // You can perform additional actions based on the clicked course ID
  };
  return (
    <>
      <Header />
      <TeacherSideBar />
      <h1 className='heading'>Assignment</h1>
    <hr/>
      <div className="courses-container">

        {CoursesData.map(
          (course) =>
            course && (
              <Coursecard
                key={course.CourseID}
                id={course.CourseID}
                ClassID={course.ClassID}
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

export default Assignment
