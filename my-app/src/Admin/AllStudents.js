import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css'; // Import your CSS file
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch student data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/All_Students');
        setStudents(response.data.students);
      } catch (error) {
        console.error('Error fetching student data:', error.message);
      }
    };

    fetchData();
  }, []); // Run once on component mount

  // Filter students based on the search term
  const filteredStudents = students.filter(student =>
    student.FullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Header/>
    <AdminSideBar/>
    <div className="all-students-container">
    <h1 className="dashboard-title" style={{ '--line-width': '250px',marginLeft:'600px' }}>All Students</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {/* Display students in a tabular form */}
      <table>
        <thead>
          <tr>
          <th className="table-heading" style={{backgroundColor:'green'}}>Student ID</th>
              <th className="table-heading" style={{backgroundColor:'green'}}>Name</th>
              <th className="table-heading" style={{backgroundColor:'green'}}>Class</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.StudentID}>
              <td>{student.StudentID}</td>
              <td>{student.FullName}</td>
              <td>{student.ClassName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
    
  );
};

export default AllStudents;
