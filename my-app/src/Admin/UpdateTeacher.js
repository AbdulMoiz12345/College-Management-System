import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import UpdateTeacherForm from './UpdateTeacherForm';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const UpdateTeacher = () => {
  const [instructorId, setInstructorId] = useState('');
  const [instructorData, setInstructorData] = useState(null);
  const [error, setError] = useState(null);

  const fetchInstructorData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/get-instructor/${instructorId}`);
      setInstructorData(response.data.instructor);
      setError(null);
    } catch (error) {
      setInstructorData(null);
      setError('No instructor found with this ID');
    }
  };

  const handleInstructorIdChange = (e) => {
    setInstructorId(e.target.value);
  };

  const handleSearchClick = () => {
    if (instructorId) {
      fetchInstructorData();
    }
  };

  return (
    <div>
      <Header />
      <AdminSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '350px' }}>Update Instructor</h1>
      <div className="container" style={{marginLeft:'620px'}}>
        <h1>
          <b>UPDATE Instructor</b>
        </h1>
        <label>Enter Instructor ID:</label>
        <input
          type="text"
          placeholder="Instructor ID"
          value={instructorId}
          onChange={handleInstructorIdChange}
        />
        <button onClick={handleSearchClick}>Search</button>

        {error && <p>{error}</p>}

        {instructorData && (
          <UpdateTeacherForm
            key={instructorData.InstructorID} // Add key attribute
            instructorId={instructorData.InstructorID}
            firstName={instructorData.FIrstName}
            lastName={instructorData.LastName}
            cnic={instructorData.cnic}
            email={instructorData.Email}
            gender={instructorData.gender}
            phoneNumber={instructorData.phonenumber}
            domicile={instructorData.domicile}
            password={instructorData.Password}
            qualification={instructorData.qualification}
            experience={instructorData.experience}
            coursesTaught={instructorData.coursesTaught}
            officeHours={instructorData.officeHours}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateTeacher;
