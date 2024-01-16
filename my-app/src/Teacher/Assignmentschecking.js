import React, { useEffect, useState, useContext } from 'react';
import { idcontext } from '../Idprovider';
import axios from 'axios';
import './Sidebar.css';
import TeacherSideBar from './TeacherSideBar';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

const Assignmentschecking = () => {
  const [pdfList, setPdfList] = useState([]);

  useEffect(() => {
    const assignmentid=localStorage.getItem('assignmentid')
   axios
      .get(`http://localhost:8000/pdf-listgetass?assignmentid=${assignmentid}`)
      .then((response) => {
        setPdfList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching PDF list:', error);
      });
  }, [pdfList]);
  const viewPdf = (SubmissionID) => {
    axios
      .get(`http://localhost:8000/pdfgetass/${SubmissionID}`, { responseType: 'arraybuffer' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
      })
      .catch((error) => {
        console.error('Error fetching PDF:', error);
      });
  };


  return (
    <>
      <Header />
      <TeacherSideBar />
      <div className="pdf-list-container">
        <h1>PDF List</h1>
        <ul>
          {pdfList.map((pdf) => (
            <li className='pol'key={pdf.id} onClick={() => viewPdf(pdf.SubmissionID)}>
              {/* Display PDF item information */}
              <span>{pdf.file_name}</span>
            </li>
          ))}
        </ul>
      </div>


    </>
  );
};

export default Assignmentschecking;
