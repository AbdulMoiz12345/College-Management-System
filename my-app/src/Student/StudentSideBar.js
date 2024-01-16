import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Studentsidebar.css';
import image4 from 'C:/db_project_final/my-app/src/images/6pic.png';
const StudentSideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
      <header className="sidebar-header" role="banner">
      <div className="left-section" style={{ backgroundImage: `url(${image4})`,marginLeft:'60px',marginBottom:'20px' }}>
        </div>
        <div className="nav-wrap">
          <nav className="main-nav" role="navigation">
            <ul className="unstyled list-hover-slide">
              <li>
                <Link to="/student">
                  <a>DASHBOARD</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/profile">
                  <a>PROFILE</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/view">
                  <a>COURSES</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/attendence">
                  <a>ATTENDANCE</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/assignment">
                  <a>Assignment</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/complainpage">
                  <a>RequestPage</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/studentquiz">
                  <a>Givequiz</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/marks">
                  <a>Marks</a>
                </Link>
              </li>
              <li>
                <Link to="/Student/complainpage">
                  <a>Complain</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default StudentSideBar;