import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import UpdateStudentForm from './UpdateStudentForm';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const DeleteStudents = () => {
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState(null);
    const handleStudentIdChange = (e) => {
        setStudentId(e.target.value);
      };
    
    const handleSearchClick =async () => {
        if (studentId) {
            try {
                await axios.get(`http://localhost:8000/delete-student/${studentId}`);
                setError(null);
              } catch (error) {
                setError('No student found with this ID');
              }
        }
        alert("Student data has been deleted");
        setStudentId("");
      };
  return (
    <div>
      <Header />
      <AdminSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '300px' }}>Delete Student</h1>
      <div className="container" style={{marginLeft:'620px'}}>
        <h1>
          <b>Delete STUDENT</b>
        </h1>
        <label>Enter Student ID:</label>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={handleStudentIdChange}
        />
        <button onClick={handleSearchClick}>Search</button>

        {error && <p>{error}</p>}

       
      </div>
    </div>
  )
}

export default DeleteStudents
