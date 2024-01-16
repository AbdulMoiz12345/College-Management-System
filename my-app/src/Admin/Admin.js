import React from 'react'
import Header from '../Header'
import AdminSideBar from './AdminSideBar'
import AdminCard from './AdminCard'
import { useContext,useEffect} from 'react';
import { idcontext } from '../Idprovider';
const Admin = () => {
  const { adminname,setadminname,setadminid } = useContext(idcontext);
  useEffect(() => {
    const name=localStorage.getItem('adminname')
    const id=localStorage.getItem('adminid')
    setadminname(name);
    setadminid(id)
  }, [setadminname]);

  const cards=[
    { name: 'ADD STUDENT', description: '', link: '/admin/add-student' },
    { name: 'UPDATE STUDENT ', description: '', link: '/admin/update-student' },
    { name: 'DELETE STUDENT ', description: '', link: '/admin/delete-student' },
    { name: 'ADD TEACHER', description: '', link: '/admin/add-teacher' },
    { name: 'UPDATE TEACHER', description: '', link: '/admin/update-teacher' },
    { name: 'DELETE TEACHER', description: '', link: '/admin/delete-teacher' },
    { name: 'Enroll Classes', description: '', link: '/admin/enroll-course' },
    { name: 'Update enrollment', description: '', link: '/admin/update-enrollment' },
    { name: 'Course Creation And Deletion', description: '', link: '/admin/course' }, 
    { name: 'Class creation and deletion', description: '', link: '/admin/class' },
]
return (
  <div>
    <Header />
    <AdminSideBar />
    <h1 className="dashboard-title" style={{ '--line-width': '360px' }}>Admin Dashboard</h1>
    <h1 className="dashboard-title" style={{ '--line-width': `${adminname.length * 41}px`, marginLeft: '870px' }}>
  Welcome {adminname}
</h1>
    <div className="dashboard" style={{marginBottom:'40px'}}>
      <div className="row">
        {cards.map((card, index) => (
          <div className="column" key={index}>
            <AdminCard {...card} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default Admin
