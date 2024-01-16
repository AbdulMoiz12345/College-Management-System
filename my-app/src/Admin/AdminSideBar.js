import React, { useState, useEffect,useContext } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { idcontext } from '../Idprovider';
import image4 from 'C:/db_project_final/my-app/src/images/6pic.png';
const AdminSideBar = () => {
    const [complaints, setComplaints] = useState([]);
  const { setComplaintid } = useContext(idcontext);
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8000/admincomplaints'); // Replace with your API endpoint
        setComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);
    return (
        <header class="sidebar-header" role="banner">
            <div style={{width:'200px',display:'flex',textAlign:'center',marginLeft:'60px'}}>
        <div className="left-section" style={{ backgroundImage: `url(${image4})` }}>
        </div>
        </div>
            <div class="nav-wrap">
                <nav class="main-nav" role="navigation">a
                    <ul class="unstyled list-hover-slide">
                        <li><Link to="/admin"><a>DASHBOARD</a></Link></li>
                        <li><Link to="/adminprofile"><a>PROFILE</a></Link></li>
                        <li><Link to="/admin/all-students"><a>STUDENTS</a></Link></li>
                        <li><Link to="/admin/all-teachers"><a>TEACHERS</a></Link></li>
                        <li><Link to="/admin/all-courses"><a>COURSES</a></Link></li>
                        <li><Link to="/admin/admincomplaint"><a>Complaints</a> {complaints.length > 0 && (
            <span className="complaint-badge">{complaints.length}</span>
          )}</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default AdminSideBar