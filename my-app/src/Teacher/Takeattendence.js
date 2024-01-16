import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import Attendancesheet from './Attendencesheet';
import Header from '../Header';
import TeacherSideBar from './TeacherSideBar';
import { useNavigate } from 'react-router-dom';

const Takeattendence = () => {
  const { courseid, setcourseid } = useContext(idcontext);
  const { classid, setclassid } = useContext(idcontext);
  const [studentlist, setStudentList] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8000/takeatt', { courseid, classid });
        setStudentList(response.data.students);
        // Initialize attendanceData with the initial data
        const initialAttendanceData = response.data.students.map(student => ({
          studentId: student.studentID,
          courseid,
          classid,
          date: new Date().toISOString().split('T')[0],
          ispresent: 'P',
        }));
        setAttendanceData(initialAttendanceData);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, [courseid, classid]);

  const handleCourseClick = (studentId) => {
    // Toggle ispresent between 'P' and 'A' for the clicked student
    setAttendanceData((prevData) =>
      prevData.map((data) =>
        data.studentId === studentId
          ? { ...data, ispresent: data.ispresent === 'P' ? 'A' : 'P' }
          : data
      )
    );
  };

  const handleSaveClick = async () => {
    try {
      // Send all updated attendance data to the backend in a single request
      const response = await axios.post('http://localhost:8000/saveattendance', {
        attendanceData,
      });

      // Handle the response as needed, e.g., show a success message
      console.log('Attendance saved successfully:', response.data);

      // You can redirect or update the UI as needed
      alert("Attendance saved "); // Replace with your actual success page path
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  return (
    <>
      <Header />
      <TeacherSideBar />
      <div className="courses-container" style={containerStyle}>
        <h2 style={titleStyle}>Take Attendance</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentlist.map((student) => (
              student && (
                <Attendancesheet
                  key={student.studentID}
                  id={student.studentID}
                  name={student.firstName}
                  date={new Date().toISOString().split('T')[0]}
                  ispresent={'P'} // Initial value set to 'P'
                  onClick={() => handleCourseClick(student.studentID)}
                />
              )
            ))}
          </tbody>
        </table>
        <button style={saveButtonStyle} onClick={handleSaveClick}>
          Save
        </button>
      </div>
    </>
  );
};

// Styles
const containerStyle = {
  border: '2px solid #ddd',
  padding: '20px',
  borderRadius: '8px',
  marginRight:'60px'
};

const titleStyle = {
  fontSize: '28px',
  marginBottom: '20px',
  color: '#333',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
};

const tableHeaderStyle = {
  width: '200px',
  backgroundColor: '#f2f2f2',
  padding: '12px',
  borderBottom: '1px solid #ddd',
};

const saveButtonStyle = {
  marginTop: '20px',
  width: '100px',
  height: '40px',
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
export default Takeattendence;
