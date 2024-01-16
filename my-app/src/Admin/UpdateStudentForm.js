import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Form.css';
import { useNavigate } from 'react-router-dom';
const UpdateStudentForm = (props) => {
  const [studentId, setStudentId] = useState(props.studentId || '');
  const [firstName, setFirstName] = useState(props.firstName || '');
  const [lastName, setLastName] = useState(props.lastName || '');
  const [cnic, setCnic] = useState(props.cnic || '');
  const [email, setEmail] = useState(props.email || '');
  const [interMarks, setInterMarks] = useState(props.interMarks || '');
  const [gender, setGender] = useState(props.gender || 'male');
  const [phoneNumber, setPhoneNumber] = useState(props.phoneNumber || '');
  const [domicile, setDomicile] = useState(props.domicile || '');
  const [password, setPassword] = useState(props.password || '');
  const [selectedClass, setSelectedClass] = useState(props.selectedClass || '');
  const [selectedname,setSelectedName]=useState();
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/class');
        setClasses(response.data.classes);
        const class1=response.data.classes;
        // Find the class object based on selectedClass
        console.log(class1);
        const selectedClassObject = class1.find(
          (classItem) => classItem.classID === props.selectedClass
        );
        console.log(props.selectedClass)
        // Set the selected name to the class name (or an empty string if not found)
        const name = selectedClassObject ? selectedClassObject.className : '';
        console.log(name);
        setSelectedName(name);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };
  
    fetchData();
  }, [props.selectedClass]);
  // Rest of the code...


  const onSubmit = async (e) => {
    e.preventDefault();
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
        selected_class: selectedClass, // Send the class ID, not the class name
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      console.log(formData)
      const response = await axios.post(
        'http://localhost:8000/update-student',
        formData,
        config
      );
       
      if (response.data.status === 'success') {
        alert('Student updated successfully')
        navigate('/admin/update-student')
      } else {
        // Handle failure case if needed
      }
    } catch (error) {
      // Handle error if needed
    }
  };
  const setclass = (e) => {
    const selectedClassname = e.target.value;
    setSelectedName(selectedClassname);

    // Find the selected class object based on the ID
    console.log(selectedClassname)
    const selectedClassObject = classes.find(
      (classItem) => classItem.className === selectedClassname
    );

    // Set the selected name to the class name (or an empty string if not found)
    const id = selectedClassObject ? selectedClassObject.classID : '';
    setSelectedClass(id);
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        {/* STUDENT ID */}
        <label>Student ID</label>
        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={studentId}
          readOnly
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
        <select
  name="selectedClass"
  value={selectedname}
  onChange={setclass}
>
  <option value="" disabled>Select a class</option>
  {classes.map((classItem) => (
    <option key={classItem.classID} value={classItem.className}>
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

        <input type="submit" value="Update" />
      </form>
    </div>
  );
};

export default UpdateStudentForm;
