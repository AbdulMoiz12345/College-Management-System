import React, { useState } from 'react';
import axios from 'axios';
import UpdateenrollmentForm from './UpdateenrollmentForm';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const UpdateEnrollment = () => {
  const [classID, setClassID] = useState('');
  const [enrollmentData, setEnrollmentData] = useState(null);

  const handleClassIDChange = (e) => {
    setClassID(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the classID to the backend
      const response = await axios.get(`http://localhost:8000/update-enrollment/${classID}`);
      
      // Update state with received data
      setEnrollmentData(response.data);

    } catch (error) {
      console.error('Error fetching enrollment data:', error);
    }
  };

  return (
    <>
    <Header/>
    <AdminSideBar/>
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Class ID:
          <input
            type="text"
            value={classID}
            onChange={handleClassIDChange}
          />
        </label>
        <button type="submit">Fetch Enrollment Data</button>
      </form>

      {enrollmentData && (
        <UpdateenrollmentForm key={enrollmentData}
        initialData={enrollmentData} />
      )}
    </div>
    </>
    
  );
};

export default UpdateEnrollment;

