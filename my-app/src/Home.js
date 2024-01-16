import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import "./App.css"
import image4 from 'C:/db_project_final/my-app/src/images/6pic.png';

const Homepage = () => {
  const photoUrls = [
    'https://nstp.pk/wp-content/uploads/2019/05/nust3.jpg',
    'https://media.istockphoto.com/id/1344939844/photo/hand-holding-drawing-virtual-lightbulb-with-brain-on-bokeh-background-for-creative-and-smart.jpg?s=612x612&w=0&k=20&c=2GLUy6eqCSr0NFRO8CHm8_PUMy9Qc8ryqcsRoe0DEYM=',
    'https://thoughtsfromthehorizon.files.wordpress.com/2014/10/top-of-the-mountain.jpg' // Add more image URLs as needed
  ];
  const text = [
    'Welcome to Our college',
    'where we teach innovation',
    'And reach new heights',
  ];
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    // Function to update the current photo index every 5 seconds
    const intervalId = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);
    }, 3000);

    // Clear the interval when the component unmounts or when the index changes
    return () => clearInterval(intervalId);
  }, [currentPhotoIndex]);

  const photoStyle = {
    backgroundImage: `url(${photoUrls[currentPhotoIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    /* Additional styles for the photo div if needed */
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '700px', // Adjust the height as needed
    color: '#fff', // Text color on the photo
  };

  return (
    <>
      <nav className="navbar">
        <div style={{width:'300px',display:'flex',textAlign:'center'}}>
        <div className="left-section" style={{ backgroundImage: `url(${image4})` }}>
        </div>
        <div style={{marginLeft:'10px',marginTop:'15px'}}><h2>Our College</h2></div>
        </div>
        <div className="right-section">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <Link className="login-button" to="/login">
            Login
          </Link>
        </div>
      </nav>
      <div className="photo" style={photoStyle}>
        <h1>{text[currentPhotoIndex]}</h1>
      </div>
      <div className='Aboutus'>
        <h1>About us</h1>
        <div className='pa'>
        <p>Welcome to Moiz and sons, where education meets innovation, and every student embarks on a journey of intellectual growth and personal development. Nestled in a vibrant community, our college is dedicated to fostering a dynamic learning environment that goes beyond traditional boundaries. At Moiz and sons, we believe in equipping our students with the knowledge, skills, and values necessary to thrive in an ever-changing world. Our esteemed faculty members are passionate about imparting not just academic expertise but also instilling a sense of curiosity and critical thinking in every student. With state-of-the-art facilities, cutting-edge programs, and a commitment to diversity, our college provides a platform for students to explore their passions and unlock their full potential. Join us on this exciting educational voyage, where excellence is not just a goal but a way of life. Welcome to a place where dreams are nurtured, aspirations are realized, and lifelong connections are forged. Welcome to Moiz and sons, where your future begins!</p>
        </div>
      </div>
      <div className='cour'>
        <h1>COURSES</h1>
        <div className='courses'>
        <div className="course-box">
    <h2>A Levels</h2>
    <p>Prepare for higher education with our rigorous A Levels program, offering a comprehensive curriculum and personalized guidance.</p>
  </div>

  <div className="course-box">
    <h2>Matriculation</h2>
    <p>Build a strong foundation with our Matriculation program, tailored to provide a solid academic base and holistic development.</p>
  </div>

  <div className="course-box">
    <h2>Arts Subjects</h2>
    <p>Explore your creative side with our Arts Subjects program, where you can delve into a variety of disciplines and express your unique talents.</p>
  </div>
        </div>
  
</div>
<footer className="footer">
  <div className="social-media">
    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faFacebook} />
    </a>
    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faInstagram} />
    </a>
    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faTwitter} />
    </a>
    {/* Add more social media icons and links as needed */}
  </div>
</footer>

    </>
  );
};

export default Homepage;
