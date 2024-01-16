import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Header from '../Header';
import StudentSideBar from './StudentSideBar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const Marks = () => {
  const { stid } = useContext(idcontext);
  const [courseNames, setCourseNames] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getmarks/${stid}`);
        setCourseData(response.data);
        const uniqueCourses = [...new Set(response.data.map(course => course.coursename))];
        setCourseNames(uniqueCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [stid]);

  const handleCourseClick = (courseName) => {
    setSelectedCourse(courseName);
  };

  return (
    <>
      <Header />
      <StudentSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '240px' }}>Quiz Marks</h1>
      <div style={{ textAlign: 'center', marginLeft: '400px',marginRight:'60px',marginTop:'100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {courseNames.map((course, index) => (
            <div
              key={index}
              onClick={() => handleCourseClick(course)}
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: selectedCourse === course ? '#e0e0e0' : 'white',
              }}
            >
              {course}
            </div>
          ))}
        </div>

        {selectedCourse && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h6" gutterBottom>
              {selectedCourse}
            </Typography>
            {courseData
              .filter((course) => course.coursename === selectedCourse)
              .map((course, index) => (
                <Paper key={index} elevation={3} style={{ padding: '10px', marginTop: '10px' }}>
                  <Typography variant="subtitle1">Quiz ID: {course.quizid}</Typography>
                  <Typography variant="subtitle1">Marks: {course.marks}</Typography>
                </Paper>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Marks;
