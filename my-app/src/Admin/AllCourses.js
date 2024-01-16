import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css'; // Import your CSS file
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch course data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/All_Courses');
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching course data:', error.message);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  // Filter courses based on the search term
  const filteredCourses = courses.filter(course =>
    course.CourseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Header/>
    <AdminSideBar/>
    <div className="all-students-container">
      <h1 className="dashboard-title" style={{ '--line-width': '250px', marginLeft: '600px' }}>All Courses</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by course name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* Display courses in a tabular form */}
      <table>
        <thead>
          <tr>
            <th className="table-heading" style={{backgroundColor:'green'}}>Course ID</th>
            <th className="table-heading" style={{backgroundColor:'green'}}>Course Name</th>
            <th className="table-heading" style={{backgroundColor:'green'}}>Course Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map(course => (
            <tr key={course.CourseID}>
              <td>{course.CourseID}</td>
              <td>{course.CourseName}</td>
              <td>{course.CourseDesc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
    
  );
};

export default AllCourses;

