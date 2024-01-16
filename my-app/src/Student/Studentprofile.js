import React, { useState, useEffect, useContext } from 'react';
import Header from '../Header';
import StudentSideBar from './StudentSideBar';
import axios from 'axios';
import { idcontext } from '../Idprovider';

const Studentprofile = () => {
  const { stid,setstid } = useContext(idcontext);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    number: '',
    gender: '',
    domicile: '',
    cnic: '',
    photo: null,
  });

  useEffect(() => {
    // Initialize tid with the value from localStorage
    const storedTid = localStorage.getItem('stid');
    console.log(storedTid)
    if (storedTid) {
      setstid(storedTid);
    }
  }, [setstid]);

  // Fetch teacher's profile data function
  const fetchStudentProfile = async () => {
    try {
      // Fetch teacher's profile data from the backend using the latest tid
      const response = await axios.get(`http://localhost:8000/student-profile?stid=${stid}`);
      const data = response.data.results;

      setProfileData({
        firstName: data.FirstName,
        lastName: data.LastName,
        studentId: data.StudentID,
        number: data.phoneNumber,     
        gender: data.gender,
        domicile: data.domicile,
        cnic: data.cnic,
        photo: data.Photo,
      });
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
    }
  };

  // Call fetchTeacherProfile whenever tid changes
  useEffect(() => {
    fetchStudentProfile();
  }, [profileData]);

  const handlePhotoUpload = async (e) => {
    console.log('Uploading photo...');
    const uploadedPhoto = e.target.files[0];
  
    // Create a FormData object
    const formData = new FormData();
    formData.append('stid', stid);
    formData.append('photo', uploadedPhoto);
  
    try {
      // Send a POST request to the backend
      const response = await axios.post('http://localhost:8000/upload-photo-student', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data); // Log the response from the backend
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };
  

  return (
    <>
      <Header />
      <StudentSideBar/>
      <div className="profile-container" >
      <h1 className="profheader">Student Profile</h1>
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
            <strong>Instructor ID:</strong> {profileData.studentId}
          </p>
          <p>
            <strong>Phone Number:</strong> {profileData.number}
          </p>
          <p>
            <strong>Gender:</strong> {profileData.gender}
          </p>
          <p>
            <strong>Domicile:</strong> {profileData.domicile}
          </p>
          <p>
            <strong>CNIC:</strong> {profileData.cnic}
          </p>
        </div>

        {/* Display Photo */}
        <div className="photo-container" >
          {profileData.photo ? (
  <img src={`data:image/png;base64,${profileData.photo}`} alt="Teacher" className="profile-photo" />
) : (
  <p>No photo uploaded</p>
)}
          </div>

          {/* Upload Photo */}
          <div className="upload-photo-container">
            <label htmlFor="photoInput">Upload Photo:</label>
            <input
              type="file"
              id="photoInput"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
        </div>
  </>
  );
};

export default Studentprofile;
