import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { idcontext } from './Idprovider';
export default function Login() {

    const {stid, setstid } = useContext(idcontext);
    const {adminid, setadminid } = useContext(idcontext);
    const { tid,settid } = useContext(idcontext);
    const { setadminname,setteachername,setstudentname } = useContext(idcontext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('admin');
    const [curr, setCurr] = useState('admin');
    const adminButtonRef = useRef(null);
    const teacherButtonRef = useRef(null);
    const studentButtonRef = useRef(null);
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (userType === "admin") {
          try {
            // Admin login logic
            const response = await axios.post('http://localhost:8000/loginadmin', {
              email: email,
              password: password,
            });
      
            // Handle the response for admin login
            localStorage.setItem('adminid', response.data.user.id);
            setadminid(response.data.user.id);
            localStorage.setItem('adminname', response.data.user.name);
            setadminname(response.data.user.name);
            navigate('/admin');
          } catch (error) {
            alert('Admin login failed');
            console.error('Admin login failed:', error.message);
          }
        } else if (userType === 'student') {
          try {
            // Student login logic
            const response = await axios.post('http://localhost:8000/loginst', {
              email: email,
              password: password,
            });
      
            // Handle the response for student login
            localStorage.setItem('stid', response.data.user.id);
            setstid(response.data.user.id);
            localStorage.setItem('studentname', response.data.user.name);
            setstudentname(response.data.user.name);
            navigate('/student');
          } catch (error) {
            alert('Student login failed');
            console.error('Student login failed:', error.message);
          }
        } else if (userType === 'teacher') {
          try {
            // Teacher login logic
            const response = await axios.post('http://localhost:8000/loginte', {
              email: email,
              password: password,
            });
      
            // Handle the response for teacher login
            localStorage.setItem('tid', response.data.user.id);
            settid(response.data.user.id);
            localStorage.setItem('teachername', response.data.user.name);
            setteachername(response.data.user.name);
            navigate('/teacher');
          } catch (error) {
            alert('Teacher login failed');
            console.error('Teacher login failed:', error.message);
          }
        }
      };
      

  
    const switchTabs = (e, tab) => {
      if (tab === 'admin') {
        setUserType('admin');
        setCurr('admin');
      } else if (tab === 'student') {
        setUserType('student');
        setCurr('student');
      } else if (tab === 'teacher') {
        setUserType('teacher');
        setCurr('teacher');
      }
    };
  
    // Update button styles based on the current state
    const updateButtonStyles = () => {
      adminButtonRef.current.style.backgroundColor = curr === 'admin' ? 'green' : '';
      teacherButtonRef.current.style.backgroundColor = curr === 'teacher' ? 'green' : '';
      studentButtonRef.current.style.backgroundColor = curr === 'student' ? 'green' : '';
    };
  
    useEffect(() => {
      // Call the function to update button styles whenever the state changes
      updateButtonStyles();
    }, [curr]);
  
    // ... (your existing code)
  
    return (
      <div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
          <div>
            <div className="login_signUp_toggle">
              <p onClick={(e) => switchTabs(e, "admin")} ref={adminButtonRef}>Admin</p>
              <p onClick={(e) => switchTabs(e, "teacher")} ref={teacherButtonRef}>Teacher</p>
              <p onClick={(e) => switchTabs(e, "student")} ref={studentButtonRef}>Student</p>
            </div>
          </div>
          
  
                    <form className="loginForm"  onSubmit={handleSubmit}>
                      <div className="loginEmail">
                        <MailOutlineIcon />
                          <input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={handleEmailChange}
                              className="input-field"
                          />
                          
                      </div>
                      <div className="loginPassword">
                        <LockOpenIcon />
                        <input
                          type="password"
                          placeholder="Password"
                          required
                          value={password}
                          onChange={ handlePasswordChange}
                        />
                      </div>
                      <input type="submit" value="Login" className="loginBtn" />
                    </form>
        </div>
      </div>
    );
  };