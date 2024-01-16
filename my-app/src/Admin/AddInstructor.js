import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const AddInstructor = () => {
  const [instructorId, setinstructorId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [domicile, setDomicile] = useState('');
  const [password, setPassword] = useState('');
  const [qualification, setQualification] = useState('PhD'); // Default to PhD
  const [experience, setExperience] = useState(0);
  const [coursesTaught, setCoursesTaught] = useState('');
  const [officeHours, setOfficeHours] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = {
        instructor_id: instructorId,
        first_name: firstName,
        last_name: lastName,
        cnic: cnic,
        email: email,
        gender: gender,
        phone_number: phoneNumber,
        domicile: domicile,
        password: password,
        qualification: qualification,
        experience: experience,
        coursesTaught: coursesTaught,
        officeHours: officeHours,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        'http://localhost:8000/add-instructor',
        formData,
        config
      );

      if (response.data.status === 'success') {
        // Show an alert
        alert('Instructor added successfully');

        // Reset form fields
        setinstructorId('');
        setFirstName('');
        setLastName('');
        setCnic('');
        setEmail('');
        setGender('male');
        setPhoneNumber('');
        setDomicile('');
        setPassword('');
        setQualification('PhD');
        setExperience(0);
        setCoursesTaught('');
        setOfficeHours('');
      } else {
        // Handle failure case if needed
      }
    } catch (error) {
      // Handle error if needed
    }
  };

  return (
    <>
    <Header/>
    <AdminSideBar/>
    <h1 className="dashboard-title" style={{ '--line-width': '300px' }}>Add Instructor</h1>
      <div className="container" style={{marginLeft:'620px'}}>
      <h1>
        <b>ADD Instructor</b>
      </h1>
      <form onSubmit={onSubmit}>
      <label>Instructor ID</label>
        <input
          type="text"
          name="instructor_id"
          placeholder="Instructor ID"
          value={instructorId}
          onChange={(e) => setinstructorId(e.target.value)}
        />

        {/* FIRST NAME */}
        <label>FIRST NAME</label>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        {/* LAST NAME */}
        <label>LAST NAME</label>
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        {/* EMAIL */}
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* CNIC */}
        <label>CNIC</label>
        <input
          type="text"
          name="cnic"
          placeholder="CNIC"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
        />

        {/* PHONE NUMBER */}
        <label>PHONE NUMBER</label>
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        {/* DOMICILE */}
        <label>DOMICILE</label>
        <input
          type="text"
          name="domicile"
          placeholder="Domicile"
          value={domicile}
          onChange={(e) => setDomicile(e.target.value)}
        />

        {/* PASSWORD */}
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* GENDER */}
        <label>Gender</label>
        <select
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">MALE</option>
          <option value="female">FEMALE</option>
          <option value="others">OTHERS</option>
        </select>

        {/* QUALIFICATION */}
        <label>Qualification</label>
        <select
          name="qualification"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
        >
          <option value="PhD">PhD</option>
          <option value="Master's">Master's</option>
          <option value="Bachelor's">Bachelor's</option>
        </select>

        {/* EXPERIENCE */}
        <label>Experience (in years)</label>
        <input
          type="number"
          name="experience"
          placeholder="Experience (in years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        {/* COURSES TAUGHT */}
        <label>Courses Taught</label>
        <input
          type="text"
          name="coursesTaught"
          placeholder="Courses Taught"
          value={coursesTaught}
          onChange={(e) => setCoursesTaught(e.target.value)}
        />

        {/* OFFICE HOURS */}
        <label>Office Hours</label>
        <input
          type="text"
          name="officeHours"
          placeholder="Office Hours"
          value={officeHours}
          onChange={(e) => setOfficeHours(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
    </>
   
  );
};

export default AddInstructor;
