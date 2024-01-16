import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { idcontext } from '../Idprovider';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import TeacherSideBar from './TeacherSideBar';

// Custom hook for handling state for each row
const useRowState = (initialState) => {
  const [state, setState] = useState(initialState);
  return [state, setState];
};

const UpdateAttendenceForm = () => {
  const { courseid, setcourseid } = useContext(idcontext);
  const { classid, setclassid } = useContext(idcontext);
  const [studentId, setStudentId] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleSearchClick = async () => {
    if (studentId) {
      try {
        const response = await axios.get(`http://localhost:8000/get-student-attendance`, {
          params: { classid, courseid, studentId },
        });

        // Assign unique IDs to each attendance item for better tracking
        const formattedData = response.data.map((item, index) => ({
          ...item,
          id: index,
        }));

        setAttendanceData(formattedData);
        setError(null);
      } catch (error) {
        setError('No student found with this ID');
        setAttendanceData([]);
      }
    }
  };

  const handleAttendanceButtonClick = (id) => {
    // Toggle the attendance for the selected row
    const updatedAttendanceData = attendanceData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          is_present: item.is_present === 'P' ? 'A' : 'P', // Toggle between 'P' and 'A'
        };
      }
      return item;
    });

    setAttendanceData(updatedAttendanceData);
  };

  const handleSaveClick = async () => {
    try {
      // Send the modified attendance data to the backend
      const formattedData = attendanceData.map((item) => ({
        date: item.date,
        is_present: item.is_present,
      }));

      await axios.post(`http://localhost:8000/update-student-attendance`, {
        classid,
        courseid,
        studentId,
        attendanceData: formattedData,
      });

      alert('Attendance data has been updated successfully');
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Error updating attendance');
    }
  };

  return (
    <>
      <Header />
      <TeacherSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '390px' }}>
        Update Attendance
      </h1>
      <div className="container" style={{ marginLeft: '620px' }}>
        <h1>
          <b>Search STUDENT</b>
        </h1>
        <label>Enter Student ID:</label>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={handleStudentIdChange}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>
      {attendanceData.length > 0 && (
        <div className="container" style={{ marginLeft: '620px' }}>
          <h2>Attendance Data:</h2>
          <table style={{ width: '100%', maxWidth: '1000px' }}>
            <thead>
              <tr>
                <th style={{ width: '50%' }}>Date</th>
                <th style={{ width: '50%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: '50%' }}>{item.date}</td>
                  <td style={{ width: '50%' }}>
                    <button
                      style={buttonStyle(item.is_present)} 
                      onClick={() => handleAttendanceButtonClick(item.id)}
                    >
                      {item.is_present === 'P' ? 'Present' : 'Absent'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveClick}>Save Attendance</button>
        </div>
      )}
    </>
  );
};
const buttonStyle = (isPresent) => ({
    padding: '8px 16px',
    backgroundColor: isPresent === 'P' ? '#4caf50' : '#f44336', // Green for Present, Red for Absent
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  });
  
export default UpdateAttendenceForm;
