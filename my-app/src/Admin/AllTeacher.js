import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css'; // Import your CSS file
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const AllTeacher = () => {
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch instructor data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/All_Teachers');
        setInstructors(response.data.teachers);
      } catch (error) {
        console.error('Error fetching instructor data:', error.message);
      }
    };

    fetchData();
    console.log(instructors)
  }, []); // Run once on component mount

  // Filter instructors based on the search term
  const filteredInstructors = instructors.filter(instructor =>
    (instructor.FullName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <AdminSideBar />
      <div className="all-students-container">
        <h1 className="dashboard-title" style={{ '--line-width': '250px', marginLeft: '600px' }}>All Teachers</h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {/* Display instructors in a tabular form */}
        <table>
          <thead>
            <tr>
              <th className="table-heading" style={{backgroundColor:'green'}}>Instructor ID</th>
              <th className="table-heading" style={{backgroundColor:'green'}}>Name</th>
              <th className="table-heading" style={{backgroundColor:'green'}}>Classes</th>
              <th className="table-heading" style={{backgroundColor:'green'}}>Classes Subject</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map(instructor => (
              <tr key={instructor.InstructorID}>
                <td>{instructor.InstructorID}</td>
                <td>{instructor.FullName}</td>
                <td>{instructor.ClassName}</td>
                <td>{instructor.coursename}</td>
                {/* Add more cells for additional columns */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllTeacher;

