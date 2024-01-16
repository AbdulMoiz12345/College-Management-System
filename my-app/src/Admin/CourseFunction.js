import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const CourseFunction = () => {
  // State for creating a course
  const [createCourse, setCreateCourse] = useState({
    name: '',
    id: '',
    description: '',
  });

  // State for deleting a course
  const [deleteCourseId, setDeleteCourseId] = useState('');

  // Event handler for creating a course
  const handleCreateCourse = async () => {
    try {
      // Send createCourse data to the backend
      await axios.post('http://localhost:8000/create-course', createCourse);

      // Reset the state after handling the creation
      setCreateCourse({
        name: '',
        id: '',
        description: '',
      });

      // Show alert after successful creation
      window.alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  // Event handler for deleting a course
  const handleDeleteCourse = async () => {
    try {
      // Send deleteCourseId to the backend
      await axios.post(`http://localhost:8000/delete-course/${deleteCourseId}`);

      // Reset the state after handling the deletion
      setDeleteCourseId('');

      // Show alert after successful deletion
      window.alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <>
      <Header />
      <AdminSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '530px',marginLeft:'750px' }}>Create and delete Courses</h1>
      <div style={{ display: 'flex', marginLeft: '450px', marginTop: '150px', width: '1200px' }}>
        {/* Box for creating a course */}
        <div className='container'>
          <h2>Create Course</h2>
          <label>Name:</label>
          <input
            type="text"
            value={createCourse.name}
            onChange={(e) => setCreateCourse({ ...createCourse, name: e.target.value })}
          />
          <label>ID:</label>
          <input
            type="text"
            value={createCourse.id}
            onChange={(e) => setCreateCourse({ ...createCourse, id: e.target.value })}
          />
          <label>Description:</label>
          <input
            type="text"
            value={createCourse.description}
            onChange={(e) => setCreateCourse({ ...createCourse, description: e.target.value })}
          />
          <button onClick={handleCreateCourse}>Create Course</button>
        </div>

        {/* Box for deleting a course */}
        <div className='container'>
          <h2>Delete Course</h2>
          <label>ID:</label>
          <input
            type="text"
            value={deleteCourseId}
            onChange={(e) => setDeleteCourseId(e.target.value)}
          />
          <button onClick={handleDeleteCourse}>Delete Course</button>
        </div>
      </div>
    </>
  );
};

export default CourseFunction;
