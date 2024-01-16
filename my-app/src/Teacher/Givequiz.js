import react, { useContext } from 'react'
import './Sidebar.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { idcontext } from '../Idprovider';
import Header from '../Header';
import TeacherSideBar from './TeacherSideBar';

const Givequiz = () => {
    const {tid, courseid,coursename,classid,quizid,setquizid}=useContext(idcontext);
    const [quizname, setquizname] = useState('');
    const [quizdesc, setquizdesc] = useState('');
    const [quizstarttime, setquizstarttime] = useState('');
    const [quizendtime, setquizendtime] = useState('');
    const[numquestions,setnumquestions]=useState('');
    const[thebool,setthebool]=useState(false);
    const navigate = useNavigate();
    const [McqData, setMcqData] = useState([]);
    
  const handleQuiznameChange = (event) => {
    setquizname(event.target.value);
  };

  const handleQuizdescChange = (event) => {
    setquizdesc(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setquizstarttime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setquizendtime(event.target.value);
  };

  // Add your submission logic here

  const handle_make_quiz = async (event) => {
    event.preventDefault();
    setthebool(true);

    try {
      const response = await axios.post('http://localhost:8000/makequiz', {
        classid,
        courseid,
        tid,
        quizname,
        quizdesc,
        quizstarttime,
        quizendtime,
        // Add other parameters as needed
      });

      console.log(response.data);
      console.log(response.data.quizId);
      setquizid(response.data.quizId);
      console.log(quizid);
      
    } catch (error) {
      console.error('Error making quiz:', error);
    }
  };

  const handleNumQuestionsChange = (event) => {
    setnumquestions(event.target.value);
  };
  const handleNumQuestionsSubmit = (event) => {
    event.preventDefault();

    // Create an array to hold MCQ data based on the number of questions
    const newMcqData = Array.from({ length: parseInt(numquestions, 10) }, (_, index) => ({
      questionText: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctOption: '',
    }));
    
    setMcqData(newMcqData);
  };

  const handleMcqDataChange = (event, questionIndex, key) => {
    const updatedMcqData = [...McqData];

    updatedMcqData[questionIndex][key] = event.target.value;
    setMcqData(updatedMcqData);
  };

  const handleSaveMcqData = async () => {
    try {
      // Make API call to save MCQ data
      const response = await axios.post('http://localhost:8000/savemcqdata', {
        quizid,
        McqData,
      });
      alert('Quiz submitted')
      console.log(response.data);
      // Optionally, you can reset the state or navigate to another page
    } catch (error) {
      console.error('Error saving MCQ data:', error);
    }
  };




  return (
    <div>
      <Header />
      <TeacherSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '250px',fontSize:'46px' }}>Give Quiz</h1>
      <div style={{marginLeft:'300px'}}>
      <form className="quiz-form" onSubmit={handle_make_quiz}>
  <div style={{display:'flex'}}>
  <label className="quiz-input" style={{marginTop:'5px'}}>
    Quiz Name:
    <input type="text" value={quizname} onChange={handleQuiznameChange} className="input-field" />
  </label>

  <label className="quiz-input" style={{marginLeft:'30px'}}>
    Quiz Description:
    <textarea value={quizdesc} onChange={handleQuizdescChange} className="input-field" />
  </label>

  <label className="quiz-input">
    Start Time:
    <input type="datetime-local" value={quizstarttime} onChange={handleStartTimeChange} className="input-field" />
  </label>

  <label className="quiz-input">
    End Time:
    <input type="datetime-local" value={quizendtime} onChange={handleEndTimeChange} className="input-field" />
  </label>
  </div>
  
  <br />
  {/* Add other input fields as needed */}
  <button type="submit" className="submit-button">Start Making Quiz</button>
</form>
<br />
<div>
  {thebool ? (
    <div>
      {/* Number of MCQ Questions */}
      <label className="num-questions">
        Number of MCQ Questions:
        <input type="number" value={numquestions} onChange={handleNumQuestionsChange} className="input-field" />
        <button type="submit" onClick={handleNumQuestionsSubmit} className="submit-button">
          Set Questions
        </button>
      </label>
      {McqData.map((mcq, index) => (
        <div key={index}>
          <label>
            Question {index + 1}:
            <input
              type="text"
              value={mcq.questionText}
              onChange={(event) => handleMcqDataChange(event, index, 'questionText')}
              className="input-field"
            />
          </label>

          {/* Options */}
          <label>
            Option 1:
            <input
              type="text"
              value={mcq.option1}
              onChange={(event) => handleMcqDataChange(event, index, 'option1')}
              className="input-field"
            />
          </label>

          <label>
            Option 2:
            <input
              type="text"
              value={mcq.option2}
              onChange={(event) => handleMcqDataChange(event, index, 'option2')}
              className="input-field"
            />
          </label>

          <label>
            Option 3:
            <input
              type="text"
              value={mcq.option3}
              onChange={(event) => handleMcqDataChange(event, index, 'option3')}
              className="input-field"
            />
          </label>

          <label >
            Option 4:
            <input
              type="text"
              value={mcq.option4}
              onChange={(event) => handleMcqDataChange(event, index, 'option4')}
              className="input-field"
            />
          </label>

          {/* Correct Option */}
          <label>
            Correct Option:
            <input
              type="text"
              value={mcq.correctOption}
              onChange={(event) => handleMcqDataChange(event, index, 'correctOption')}
              className="input-field"
            />
          </label>
        </div>
      ))}

      <button type="button" onClick={handleSaveMcqData} className="submit-button">
        Save MCQ Data
      </button>

    </div>
  ) : null}
</div>
        
      </div>
     
    </div>
  );
  
};

export default Givequiz;