// ComplainPage.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import Header from '../Header';
import StudentSideBar from './StudentSideBar';
import { idcontext } from '../Idprovider';

const ComplainPage = () => {
  const { stid, studentname } = useContext(idcontext);
  const [complaintPurpose, setComplaintPurpose] = useState('');
  const [complaintText, setComplaintText] = useState('');

  const handlePurposeChange = (event) => {
    setComplaintPurpose(event.target.value);
  };

  const handleComplaintTextChange = (event) => {
    setComplaintText(event.target.value);
  };

  const submitComplaint = async () => {
    try {
      const response = await axios.post('http://localhost:8000/complain', {
        id: stid,
        name: studentname,
        purpose: complaintPurpose,
        text: complaintText,
      });

      // Handle the response as needed
      console.log('Response:', response.data);
      alert("Request has been sent")
      setComplaintPurpose("")
      setComplaintText("")
    } catch (error) {
      // Handle errors
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <>
      <Header />
      <StudentSideBar />
      <div className="complain-container">
        <h2>Complaint Page</h2>
        <label htmlFor="purpose">Purpose of Complaint:</label>
        <input
          type="text"
          id="purpose"
          value={complaintPurpose}
          onChange={handlePurposeChange}
          placeholder="Enter the purpose of your complaint"
        />

        <label htmlFor="complaint">Complaint:</label>
        <textarea
          id="complaint"
          className="complaint"
          value={complaintText}
          onChange={handleComplaintTextChange}
          placeholder="Enter your complaint here..."
        />

        <button onClick={submitComplaint}>Submit Complaint</button>
      </div>
    </>
  );
};

export default ComplainPage;
