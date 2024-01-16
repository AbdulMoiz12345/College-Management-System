import React, { useState, useEffect } from 'react';
import './Form.css';
import axios from 'axios';

const UpdateenrollmentForm = ({ initialData }) => {
  const [numberOfSubjects, setNumberOfSubjects] = useState(initialData.length || 0);
  const [sections, setSections] = useState(initialData || []);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const updateSectionData = (index, key, value) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[index] = {
        ...updatedSections[index],
        [key]: value,
      };
  
      // Conditionally add the 'class' property
      if (key !== 'CourseID' && key !== 'InstructorID') {
        updatedSections[index].class = selectedClass;
      }
  
      return updatedSections;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedSections = sections.map((section) => ({
        ClassID: section.ClassID,
        InstructorID: section.InstructorID,
        CourseID: section.CourseID,
      }));

      // Send the updatedSections to the backend
      const response = await axios.post('http://localhost:8000/updateadd-enrollment', updatedSections);

      console.log('Enrollment updated:', response.data);
    } catch (error) {
      console.error('Error updating enrollment:', error);
    }
    alert("Data has been updated")
    setSections([]);
    setNumberOfSubjects(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/class');
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching class data from the backend:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/courses');
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching course data from the backend:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/instructor');
        setInstructors(response.data.instructor);
      } catch (error) {
        console.error('Error fetching instructor data from the backend:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="container">
        <h2>Update Enrollment</h2>
        <form onSubmit={handleSubmit}>

          {/* Display options for each subject */}
          {[...Array(Number(numberOfSubjects))].map((_, index) => (
            <div key={index} style={{ display: 'flex' }}>
              {/* Select Course */}
              <label style={{ marginTop: '20px', fontWeight: 'bold', marginRight: '20px', marginLeft: '20px' }}>
                Course
              </label>
              <select
                value={sections[index]?.CourseID || ''}
                onChange={(e) => updateSectionData(index, 'CourseID', e.target.value)}
                required
                style={{ width: '300px' }}
              >
                <option value="" disabled>Select a course</option>
                {courses.map((course) => (
                  <option key={course.CourseID} value={course.CourseID}>
                    {course.CourseName}
                  </option>
                ))}
              </select>

              {/* Select Instructor */}
              <label style={{ marginTop: '20px', fontWeight: 'bold', marginRight: '20px', marginLeft: '20px' }}>
                Instructor
              </label>
              <select
                value={sections[index]?.InstructorID || ''}
                onChange={(e) => updateSectionData(index, 'InstructorID', e.target.value)}
                required
                style={{ width: '300px' }}
              >
                <option value="" disabled>Select an instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.InstructorID} value={instructor.InstructorID}>
                    {instructor.Name}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Submit Button */}
          <button type="submit" onClick={handleSubmit}>Update</button>
        </form>
      </div>
    </>
  );
};

export default UpdateenrollmentForm;
