// Viewcomplaint.js
import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const Viewcomplaint = () => {
  const [complaint, setComplaint] = useState(null);
  const { complaintid } = useContext(idcontext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/viewcomplaint/${complaintid}`);
        if (response.data && response.data.length > 0) {
          setComplaint(response.data[0]); // Access the first element of the array
        } else {
          setComplaint(null);
        }
      } catch (error) {
        console.error('Error fetching complaint:', error);
        setComplaint(null);
      }
    };
  
    fetchComplaint();
  }, [complaintid]);
  
  

  const handleMarkAsViewed = async () => {
    try {
      await axios.post(`http://localhost:8000/markasviewed/${complaintid}`);
      navigate('/admin/admincomplaint')
      // You can optionally update the local state to mark the complaint as viewed without making another API call
    } catch (error) {
      console.error('Error marking complaint as viewed:', error);
    }
  };

  return (
    <>
    <Header/>
    <AdminSideBar/>
    <div>
      {complaint ? (
        <div className="complaint-card">
          <h2>Purpose: {complaint.purpose}</h2>
          <p><strong>Submitted By: </strong> {complaint.StudentID}</p>
          <p><strong>Name : </strong> {complaint.studentname}</p>
          <p><strong>Date : </strong> {complaint.submission_date}</p>
          <p><strong>Text: </strong></p>
          <p style={{marginLeft:'55px'}}>{complaint.text}</p>
          {!complaint.viewed && (
            <button onClick={handleMarkAsViewed}>Mark as Viewed</button>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </>
    
  );
};

export default Viewcomplaint;
