import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { idcontext } from '../Idprovider';
import Header from '../Header';
import axios from 'axios';
// import './Studentsidebar.css';
import StudentSideBar from './StudentSideBar';

const Studentquiz = () => {
  const { stid, setquizid } = useContext(idcontext);
  console.log("the student id is ")
    console.log(stid)
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getStudentQuizzes/${stid}`);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchData();
  }, [stid]);
  const isQuizEnabled = (startTime) => {
    const currentTime = new Date();
  
    // Parse startTime into a Date object
    startTime = new Date(startTime);
  
    console.log("the current time is ");
    console.log(currentTime);
    console.log("type of current time");
    console.log(typeof currentTime);
    console.log("the type of start time is now ");
    console.log(typeof startTime);
  
    // Adjust currentTime to UTC timezone
    const currentTimeUTC = new Date(currentTime.toISOString());
  
    if (currentTimeUTC >= startTime) {
      console.log("the quiz is enabled, and the current time is greater than the start time");
    }
  
    return currentTimeUTC >= startTime;
  };
  
  const isQuizEnabled1 = (startTime, endTime) => {
    const currentTime = new Date();
    startTime = new Date(startTime);
    endTime = new Date(endTime);

    const currentTimeUTC = new Date(currentTime.toISOString());

    return currentTimeUTC >= startTime && currentTimeUTC <= endTime;
  };
  const checkIfQuizTaken = async (studentId, quizId) => {
    try {
      const response = await axios.post('http://localhost:8000/checkquiztaken', {
        studentId,
        quizId,
      });
      return response.data.quizTaken; // Assuming the response contains a property indicating if the quiz is taken
    } catch (error) {
      console.error('Error checking quiz status:', error);
      return false;
    }
  };

  const handleStartQuiz = async (quizId, startTime) => {
    if (isQuizEnabled(startTime)) {
      const quizTaken = await checkIfQuizTaken(stid, quizId);
      if (quizTaken) {
        alert('You have already taken this quiz.'); // Alert if the quiz is already taken
      } else {
        setquizid(quizId);
        navigate('/Student/takequiz');
      }
    } else {
      alert('Quiz is not yet available. Please wait until the start time.');
    }
  };
  return (
    <>
      <Header />
      <StudentSideBar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

      <h1>Available Quizzes</h1>
      <div className="quiz-list" style={{ width: '50%', margin: 'auto' }}>
      {quizzes
          .filter(quiz => isQuizEnabled1(quiz.starttime, quiz.endtime)) // Filter quizzes based on end time
          .map((quiz) => (
          <div key={quiz.quizid} className="quiz-box" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
            <h2>{quiz.quizname}</h2>
            <p>{quiz.quizdescription}</p>
            <p>Start Time: {quiz.starttime}</p>
            <p>End Time: {quiz.endtime}</p>
            <button
              onClick={() => handleStartQuiz(quiz.quizid, quiz.starttime)}
              disabled={!isQuizEnabled(quiz.starttime)}
              style={{ padding: '10px', cursor: 'pointer',backgroundColor: isQuizEnabled(quiz.starttime)? 'green':'red', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  )
        };
        export default Studentquiz;