import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const DeleteInstructor = () => {
  const [instructorId, setInstructorId] = useState('');
  const [error, setError] = useState(null);

  const handleInstructorIdChange = (e) => {
    setInstructorId(e.target.value);
  };

  const handleSearchClick = async () => {
    try {
      await axios.get(`http://localhost:8000/delete-instructor/${instructorId}`);
      setError(null);
      alert('Instructor deleted successfully');
      setInstructorId(''); // Set the state to empty after successful deletion
    } catch (error) {
      setError('No instructor found with this ID');
    }
  };

  return (
    <div>
      <Header />
      <AdminSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '330px' }}>Delete Instructor</h1>
      <div className="container" style={{ marginLeft: '620px' }}>
        <h1>
          <b>Delete Instructor</b>
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
      </div>
    </div>
  );
};

export default DeleteInstructor;
