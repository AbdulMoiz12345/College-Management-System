// ComplaintList.js
import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';
const Admincomplain = () => {
  const [complaints, setComplaints] = useState([]);
  const { setComplaintid } = useContext(idcontext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8000/admincomplaints'); // Replace with your API endpoint
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);
 const handleclick=(complaint_id)=>{
    setComplaintid(complaint_id)
    navigate('/viewcomplain')
 }
 return (
    <>
    <Header/>
    <AdminSideBar/>
    <div className="complaint-list-container">
      <h2>Complaints List</h2>
      <ul className="complaint-list">
        {complaints.map((complaint) => (
          <li key={complaint.complaint_id} className="complaint-item" onClick={() => handleclick(complaint.complaint_id)}>
            <div>
              <strong>Purpose:</strong> {complaint.purpose},{' '}
              <strong>Date:</strong> {complaint.submission_date},{' '}
              <strong>Submitted by:</strong> {complaint.StudentID}
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
    
  );
};

export default Admincomplain;

