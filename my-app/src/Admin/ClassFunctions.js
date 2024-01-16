import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header';
import AdminSideBar from './AdminSideBar';

const ClassFunctions = () => {
    const [createClass, setCreateClass] = useState({
        name: '',
        id: '',
      });
    
      // State for deleting a course
      const [deleteClassId, setDeleteClassId] = useState('');
    
      // Event handler for creating a course
      const handleCreateClass = async () => {
        try {
          // Send createCourse data to the backend
          await axios.post('http://localhost:8000/create-class', createClass);
    
          // Reset the state after handling the creation
          setCreateClass({
            name: '',
            id: '',
          });
    
          // Show alert after successful creation
          window.alert('Class created successfully!');
        } catch (error) {
          console.error('Error creating course:', error);
        }
      };
    
      // Event handler for deleting a course
      const handleDeleteClass = async () => {
        try {
          // Send deleteCourseId to the backend
          await axios.post(`http://localhost:8000/delete-class/${deleteClassId}`);
    
          // Reset the state after handling the deletion
          setDeleteClassId('');
    
          // Show alert after successful deletion
          window.alert('Class deleted successfully!');
        } catch (error) {
          console.error('Error deleting course:', error);
        }
      };
  return (
    <>
      <Header />
      <AdminSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '530px',marginLeft:'750px' }}>Create and delete Classes</h1>
      <div style={{ display: 'flex', marginLeft: '450px', marginTop: '150px', width: '1200px' }}>
        {/* Box for creating a course */}
        <div className='container'>
          <h2>Create Class</h2>
          <label>Name:</label>
          <input
            type="text"
            value={createClass.name}
            onChange={(e) => setCreateClass({ ...createClass, name: e.target.value })}
          />
          <label>ID:</label>
          <input
            type="text"
            value={createClass.id}
            onChange={(e) => setCreateClass({ ...createClass, id: e.target.value })}
          />
          <button onClick={handleCreateClass}>Create Class</button>
        </div>

        {/* Box for deleting a course */}
        <div className='container'>
          <h2>Delete Class</h2>
          <label>ID:</label>
          <input
            type="text"
            value={deleteClassId}
            onChange={(e) => setDeleteClassId(e.target.value)}
          />
          <button onClick={handleDeleteClass}>Delete Course</button>
        </div>
      </div>
    </>
  )
}

export default ClassFunctions
