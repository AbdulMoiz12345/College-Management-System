import React, { useState, useEffect, useContext } from 'react';
import Header from '../Header';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import AdminSideBar from './AdminSideBar';

const AdminProfile = () => {
  const { adminid,setstid } = useContext(idcontext);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    AdminId: '',
    number: '',
    gender: '',
    domicile: '',
    cnic: '',
  });


  // Fetch teacher's profile data function
  const fetchStudentProfile = async () => {
    try {
      // Fetch teacher's profile data from the backend using the latest tid
      const response = await axios.get(`http://localhost:8000/admin-profile?adminid=${adminid}`);
      const data = response.data.results;

      setProfileData({
        firstName: data.FirstName,
        lastName: data.LastName,
        adminId: data.AdminID,
        number: data.phoneNumber,     
        gender: data.gender,
        domicile: data.domicile,
        cnic: data.cnic,
      });
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
    }
  };

  // Call fetchTeacherProfile whenever tid changes
  useEffect(() => {
    fetchStudentProfile();
  }, [profileData]);
  

  return (
    <>
      <Header />
      <AdminSideBar/>
      <div className="profile-container" >
      <h1 className="profheader">Admin Profile</h1>
        <hr />
        <div className="profile-info">
        <div>
          <p>
            <strong>First Name:</strong> {profileData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {profileData.lastName}
          </p>
          <p>
            <strong>Instructor ID:</strong> {profileData.adminId}
          </p>
          <p>
            <strong>Phone Number:</strong> {profileData.number}
          </p>
          <p>
            <strong>Gender:</strong> {profileData.gender}
          </p>
          <p>
            <strong>CNIC:</strong> {profileData.cnic}
          </p>
        </div>
        </div>
        </div>
  </>
  );
};

export default AdminProfile;
