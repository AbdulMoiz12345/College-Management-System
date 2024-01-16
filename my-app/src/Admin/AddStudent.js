import React from 'react'
import Header from '../Header'
import AdminSideBar from './AdminSideBar'
import StudentForm from './StudentForm'

const AddStudent = () => {
  return (
    <div>
      <Header/>
      <AdminSideBar/>
      <h1 className="dashboard-title" style={{ '--line-width': '280px',marginLeft:'950px' }}>Student Form</h1>
      <StudentForm/>
    </div>
  )
}

export default AddStudent
