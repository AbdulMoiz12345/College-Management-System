import React, { useContext, useState, useEffect } from 'react';
// import './Takequiz.css'; // Add your styles
import Header from '../Header';
import StudentSideBar from './StudentSideBar';
import { idcontext } from '../Idprovider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Takequiz = () => {
  const { quizid, stid, courseid, classid } = useContext(idcontext);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [marks, setMarks] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getQuizQuestions/${quizid}`);
        setQuizQuestions(response.data);
        console.log(response.data);
        console.log(quizQuestions)
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
      }
    };

    fetchQuizQuestions();
  }, [quizid]);

  const handleAnswerSelect = (questionId, selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmitMCQ = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    var userAnswer = userAnswers[currentQuestion.QuestionID];
    if(userAnswer=='Option1')
    {
        userAnswer=quizQuestions[currentQuestionIndex].Option1;
    }  
    if(userAnswer=='Option2')
    {
        userAnswer=quizQuestions[currentQuestionIndex].Option2;
    }  
    if(userAnswer=='Option3')
    {
        userAnswer=quizQuestions[currentQuestionIndex].Option3;
    }  
    if(userAnswer=='Option4')
    {
        userAnswer=quizQuestions[currentQuestionIndex].Option4;
    }  
    console.log("your marks are");
    console.log(marks);
    console.log(userAnswer);
    console.log("difference is");
    console.log(currentQuestion.CorrectOption);
    if (userAnswer === currentQuestion.CorrectOption) {
        console.log(userAnswer)
      setMarks((prevMarks) => prevMarks + 1);
        console.log("your marks are");
    console.log(marks);
    }


    // Move to the next question
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };
  const handleFinishQuiz = async () => {
    // Prepare the data to be sent to the server
    const quizResultsData = {
      StudentID:stid /* Replace with the actual student ID */,
      QuizID: quizid/* Replace with the actual quiz ID */,
    //   CourseID: courseid/* Replace with the actual course ID */,
      Marks: marks,
      // Add other properties based on your table structure
    };
  
    try {
      // Send the quiz results to the server
      const response = await axios.post('http://localhost:8000/saveQuizResults', quizResultsData);
  
      // Check the response and handle accordingly
      console.log('Quiz results saved successfully:', response.data);
  
      // Navigate to the results page
      navigate('/Student');
    } catch (error) {
      console.error('Error saving quiz results:', error);
      // Handle error appropriately
    }
  };
  
  return (
    <div>
    <Header />
    <StudentSideBar />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <h1>Quiz Questions</h1>
      {console.log(quizQuestions)}
      {quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length ? (
        <div style={{ width: '50%', margin: 'auto', border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
          <h2>{quizQuestions[currentQuestionIndex].QuestionText}</h2>
          <form>
            {['Option1', 'Option2', 'Option3', 'Option4'].map((option, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <input
                  type="radio"
                  id={option}
                  name="options"
                  value={option}
                  checked={userAnswers[quizQuestions[currentQuestionIndex].QuestionID] === option}
                  onChange={() => handleAnswerSelect(quizQuestions[currentQuestionIndex].QuestionID, option)}
                  style={{ marginRight: '5px' }}
                />
                <label htmlFor={option}>{quizQuestions[currentQuestionIndex][option]}</label>
              </div>
            ))}
          </form>
          <button
            onClick={handleSubmitMCQ}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50', // Green color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px'
            }}
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <div style={{ width: '50%', margin: 'auto', border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
          <h2>Quiz Finished</h2>
          <p>Your Marks: {marks}</p>
          <button
            onClick={handleFinishQuiz}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#4CAF50', // Green color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '10px'
            }}
          >
            Finish Quiz
          </button>
        </div>
      )}
    </div>
    </div>
  );
  
};

export default Takequiz;


// import React, { useContext, useState, useEffect } from 'react';
// import Header from '../Header';
// import StudentSideBar from './StudentSideBar';
// import { idcontext } from '../Idprovider';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Takequiz = () => {
//   const { quizid } = useContext(idcontext);
//   const [quizQuestions, setQuizQuestions] = useState([]);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [marks, setMarks] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuizQuestions = async () => {
//       try {
//         const response = await axios.get(http://localhost:8000/getQuizQuestions/${quizid});
//         setQuizQuestions(response.data);
//         console.log(response.data);
//         console.log(quizQuestions)
//       } catch (error) {
//         console.error('Error fetching quiz questions:', error);
//       }
//     };

//     fetchQuizQuestions();
//   }, [quizid]);

//   const handleAnswerSelect = (questionId, selectedOption) => {
//     setUserAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionId]: selectedOption,
//     }));
//   };

//   const handleSubmitMCQ = () => {
//     let marksCount = 0;

//     // Iterate through questions and check answers
//     quizQuestions.forEach((question) => {
//       const userAnswer = userAnswers[question.QuestionID];
//       if (userAnswer === question.CorrectOption) {
//         marksCount += 1;
//       }
//     });

//     setMarks(marksCount);
//   };

//   const handleFinishQuiz = () => {
//     // You can perform any actions upon finishing the quiz, e.g., sending results to the server
//     // For now, let's navigate to a results page
//     navigate(/results/${marks});
//   };

//   return (
//     <div>
//       <Header />
//       <StudentSideBar />
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
//         <h1>Quiz Questions</h1>
//         {quizQuestions.length >-1 && (
//           <div style={{ width: '50%', margin: 'auto', border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
//             {quizQuestions.map((question) => (
//               <div key={question.QuestionID} style={{ marginBottom: '10px' }}>
//                 <h2>{question.QuestionText}</h2>
//                 {['Option1', 'Option2', 'Option3', 'Option4'].map((option, index) => (
//                   <div key={index} style={{ marginBottom: '10px' }}>
//                     <input
//                       type="radio"
//                       id={option}
//                       name={question_${question.QuestionID}}
//                       value={option}
//                       checked={userAnswers[question.QuestionID] === option}
//                       onChange={() => handleAnswerSelect(question.QuestionID, option)}
//                       style={{ marginRight: '5px' }}
//                     />
//                     <label htmlFor={option}>{question[option]}</label>
//                   </div>
//                 ))}
//               </div>
//             ))}
//             <button
//               onClick={handleSubmitMCQ}
//               style={{
//                 padding: '10px',
//                 cursor: 'pointer',
//                 backgroundColor: '#4CAF50', // Green color
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 marginTop: '10px',
//               }}
//             >
//               Submit Answer
//             </button>
//           </div>
//         )}
//         {quizQuestions.length === -1 && (
//           <div style={{ width: '50%', margin: 'auto', border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
//             <h2>No Quiz Questions Found</h2>
//           </div>
//         )}
//         {quizQuestions.length > 0 && (
//           <div style={{ width: '50%', margin: 'auto', border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
//             <h2>Quiz Finished</h2>
//             <p>Your Marks: {marks}</p>
//             <button
//               onClick={handleFinishQuiz}
//               style={{
//                 padding: '10px',
//                 cursor: 'pointer',
//                 backgroundColor: '#4CAF50', // Green color
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 marginTop: '10px',
//               }}
//             >
//               Finish Quiz
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Takequiz;