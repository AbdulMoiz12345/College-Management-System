import React, { useState, useEffect } from 'react';
import './Form.css';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';
import axios from 'axios';

const EnrollClasses = () => {
  // State variables to manage user input
  const [numberOfSubjects, setNumberOfSubjects] = useState(0);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [courses, setcourses] = useState([]);
  const[instructor,setinstructor]=useState([])
  // Function to handle form submission
 // Frontend EnrollClasses component

const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Update the class value in each object to be equal to selectedClass
      const updatedSections = sections.map((section) => ({
        ...section,
        class: selectedClass,
      }));
  
      // Send the updatedSections to the backend
      const response = await axios.post('http://localhost:8000/enroll', updatedSections);
  
      console.log('Enrollment submitted:', response.data);
    } catch (error) {
      console.error('Error submitting enrollment:', error);
    }
  };
  

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/courses');
        setcourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/instructor');
        setinstructor(response.data.instructor);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
    console.log(instructor)
  }, []);

  // Function to update the state for a specific section
  const updateSectionData = (index, key, value) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[index] = {
        ...updatedSections[index],
        class: selectedClass, // Include the selected class
        [key]: value,
      };
      return updatedSections;
    });
  };

  // Function to add a new section

  return (
    <>
      <Header />
      <AdminSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '300px' }}>Enroll Classes</h1>
      <div className="container" style={{marginLeft:'620px'}}>
        <h2>Enroll in Classes</h2>
        <form onSubmit={handleSubmit}>
          {/* Select Class */}
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

          {/* Enter Number of Subjects */}
          <div>
            <label>Number of Subjects:</label>
            <input
              type="number"
              value={numberOfSubjects}
              onChange={(e) => setNumberOfSubjects(e.target.value)}
              min="0"
              required
            />
          </div>

          {/* Display options based on the number of subjects */}
          {[...Array(Number(numberOfSubjects))].map((_, index) => (
            <div key={index} style={{ display: 'flex' }}>
              {/* Select Course */}
              <label style={{marginTop:'20px',fontWeight:'bold',marginRight:'20px',marginLeft:'20px'}}>Course</label>
              <select
                value={sections[index]?.course || ''}
                onChange={(e) => updateSectionData(index, 'course', e.target.value)}
                required
                style={{width:'300px'}}
              >
                <option value="" disabled>Select a class</option>
                 {courses.map((classItem) => (
              <option key={classItem.CourseID} value={classItem.CourseID}>
                {classItem.CourseName}
              </option>
            ))}
              </select>

              {/* Select Instructor */}
              <label style={{marginTop:'20px',fontWeight:'bold',marginRight:'20px',marginLeft:'20px'}}>Instructor</label>
              <select
                value={sections[index]?.instructor || ''}
                onChange={(e) => updateSectionData(index, 'instructor', e.target.value)}
                required
                style={{width:'300px'}}
              >
                <option value="" disabled>Select an instructor</option>
               {instructor.map((classItem) => (
              <option key={classItem.InstructorID} value={classItem.InstructorID}>
                {classItem.Name}
              </option>
            ))}
              </select>
            </div>
          ))}

          {/* Button to add a new section */}

          {/* Submit Button */}
          <button type="submit">Enroll</button>
        </form>
      </div>
    </>
  );
};

export default EnrollClasses;
