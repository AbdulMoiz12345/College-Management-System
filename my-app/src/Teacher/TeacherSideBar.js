import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'
import image4 from 'C:/db_project_final/my-app/src/images/6pic.png';
const TeacherSideBar = () => {
    return (
        <header class="sidebar-header" role="banner">
        <div style={{width:'200px',display:'flex',textAlign:'center',marginLeft:'60px',marginBottom:'30px'}}>
        <div className="left-section" style={{ backgroundImage: `url(${image4})` }}>
        </div>
        </div>
            <div class="nav-wrap">
                <nav class="main-nav" role="navigation">
                    <ul class="unstyled list-hover-slide">
                        <li><Link to="/teacher"><a>DASHBOARD</a></Link></li>
                        <li><Link to="/teacher/profile"><a>PROFILE</a></Link></li>
                        <li><Link to="/teacher/view"><a>VIEW COURSES</a></Link></li>
                        <li><Link to="/teacher/attendence"><a>ADD ATTENDANCE</a></Link></li>
                        <li><Link to="/teacher/assignment"><a>Give Assignment</a></Link></li>
                        <li><Link to="/teacher/updateattendence"><a>Update Attendence</a></Link></li>
                        <li><Link to="/teacher/quiz"><a>Give Quiz</a></Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default TeacherSideBar