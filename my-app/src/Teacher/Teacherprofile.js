import React, { useState, useEffect, useContext } from 'react';
import './Sidebar.css';
import Header from '../Header';
import TeacherSideBar from './TeacherSideBar';
import axios from 'axios';
import { idcontext } from '../Idprovider';

const TeacherProfile = () => {
  const { tid,settid } = useContext(idcontext);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    instructorId: '',
    number: '',
    experience: '',
    officeHours: '',
    gender: '',
    domicile: '',
    qualification: '',
    cnic: '',
    photo: null,
  });

  useEffect(() => {
    // Initialize tid with the value from localStorage
    const storedTid = localStorage.getItem('tid');
    console.log(storedTid)
    if (storedTid) {
      settid(storedTid);
    }
  }, [settid]);

  // Fetch teacher's profile data function
  const fetchTeacherProfile = async () => {
    try {
      // Fetch teacher's profile data from the backend using the latest tid
      const response = await axios.get(`http://localhost:8000/teacher-profile?tid=${tid}`);
      const data = response.data.results;

      setProfileData({
        firstName: data.FirstName,
        lastName: data.LastName,
        instructorId: data.InstructorID,
        number: data.phoneNumber,
        experience: data.experience,
        officeHours: data.officeHours,
        gender: data.gender,
        domicile: data.domicile,
        qualification: data.qualification,
        cnic: data.cnic,
        photo: data.Photo,
      });
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
    }
  };

  // Call fetchTeacherProfile whenever tid changes
  useEffect(() => {
    fetchTeacherProfile();
  }, [profileData]);

  const handlePhotoUpload = async (e) => {
    const uploadedPhoto = e.target.files[0];

    // Create a FormData object
    const formData = new FormData();
    formData.append('tid', tid);
    formData.append('photo', uploadedPhoto);

    try {
      // Send a POST request to the backend
      const response = await axios.post('http://localhost:8000/upload-photo', formData, {
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
      <TeacherSideBar />
      <div className="profile-container">
        <h1 className="profheader">Teacher Profile</h1>
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
            <strong>Instructor ID:</strong> {profileData.instructorId}
          </p>
          <p>
            <strong>Phone Number:</strong> {profileData.number}
          </p>
          <p>
            <strong>Experience:</strong> {profileData.experience}
          </p>
          <p>
            <strong>Office Hours:</strong> {profileData.officeHours}
          </p>
          <p>
            <strong>Gender:</strong> {profileData.gender}
          </p>
          <p>
            <strong>Domicile:</strong> {profileData.domicile}
          </p>
          <p>
            <strong>Qualification:</strong> {profileData.qualification}
          </p>
          <p>
            <strong>CNIC:</strong> {profileData.cnic}
          </p>
          </div>
          
          {/* Display Photo */}
          <div className="photo-container">
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

export default TeacherProfile;
