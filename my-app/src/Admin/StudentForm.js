import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';

const StudentForm = () => {
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [interMarks, setInterMarks] = useState('');
  const [gender, setGender] = useState('male');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [domicile, setDomicile] = useState('');
  const [password, setPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/class');
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = {
        student_id: studentId,
        first_name: firstName,
        last_name: lastName,
        cnic: cnic,
        email: email,
        inter_marks: interMarks,
        gender: gender,
        phone_number: phoneNumber,
        domicile: domicile,
        password: password,
        selected_class: selectedClass,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        'http://localhost:8000/add-student',
        formData,
        config
      );

      if (response.data.status === 'success') {
        // Show an alert
        alert('Student added successfully');

        // Reset form fields
        setStudentId('');
        setFirstName('');
        setLastName('');
        setCnic('');
        setEmail('');
        setInterMarks('');
        setGender('male');
        setPhoneNumber('');
        setDomicile('');
        setPassword('');
        setSelectedClass('');

        // Optionally, fetch classes again in case they have changed
        const updatedClassesResponse = await axios.get('http://localhost:8000/class');
        setClasses(updatedClassesResponse.data.classes);
      } else {
        // Handle failure case if needed
      }
    } catch (error) {
      // Handle error if needed
    }
  };

  return (
    <div className="container" style={{marginLeft:'630px'}}>
      <h1 style={{marginLeft:'380px'}}>
        <b>ADD STUDENT</b>
      </h1>
      <form onSubmit={onSubmit}>
        {/* STUDENT ID */}
        <label>Student ID</label>
        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
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

        {/* INTER MARKS */}
        <label>INTER MARKS</label>
        <input
          type="text"
          name="inter_marks"
          placeholder="Intermediate Marks"
          value={interMarks}
          onChange={(e) => setInterMarks(e.target.value)}
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

        {/* SELECTED CLASS */}
        <label>Class Attained</label>
        <select
          name="selectedClass"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="" disabled>Select a class</option>
          {classes.map((classItem) => (
            <option key={classItem.classID} value={classItem.classID}>
              {classItem.className}
            </option>
          ))}
        </select>

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

        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default StudentForm;
