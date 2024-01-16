import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import UpdateStudentForm from './UpdateStudentForm';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const UpdateStudent = () => {
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/get-student/${studentId}`);
      setStudentData(response.data.student);
      setError(null);
    } catch (error) {
      setStudentData(null);
      setError('No student found with this ID');
    }
    console.log(studentData)
  };

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleSearchClick = () => {
    if (studentId) {
      fetchStudentData();
    }
  };

  return (
    <div>
      <Header />
      <AdminSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '425px' }}>Update Student Form</h1>
      <div className="container" style={{marginLeft:'650px'}}>
        <h1>
          <b>UPDATE STUDENT</b>
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

        {studentData && (
  <UpdateStudentForm
    key={studentData.StudentID} // Add key attribute
    studentId={studentData.StudentID}
    firstName={studentData.FirstName}
    lastName={studentData.LastName}
    cnic={studentData.cnic}
    email={studentData.Email}
    interMarks={studentData.inter_marks}
    gender={studentData.gender}
    phoneNumber={studentData.phoneNumber}
    domicile={studentData.domicile}
    password={studentData.Password}
    selectedClass={studentData.ClassID}
  />
)}
      </div>
    </div>
  );
};

export default UpdateStudent;
