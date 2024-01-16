import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(intervalId);
  }, []);

  const logoutHandler = () => {
    navigate('/');
  };

  return (
    <div className="header">
      <div className="header-left">
        <h1 className="logo">NUST</h1>
      </div>
      <div className="header-center">
        <div className="time">{currentTime}</div>
      </div>
      <div className="header-right">
        <button className="logout" onClick={logoutHandler}>
          LOG OUT
        </button>
      </div>
    </div>
  );
};

export default Header;
