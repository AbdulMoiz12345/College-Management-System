import React, { useEffect, useState, useContext } from 'react';
import { idcontext } from '../Idprovider';
import axios from 'axios';
import Header from '../Header';
import StudentSideBar from './StudentSideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const Studentreview = () => {
  const { courseid, coursename } = useContext(idcontext);
  const [pdfList, setPdfList] = useState([]);
  const { classid, setclassid } = useContext(idcontext);

  useEffect(() => {
    // Fetch PDF list from your backend
    axios.get(`http://localhost:8000/pdf-list?courseid=${courseid}&classid=${classid}`)
      .then(response => {
        setPdfList(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching PDF list:', error);
      });
  }, [pdfList]);

  const viewPdf = (fileId) => {
    // Fetch the PDF content as arraybuffer
    axios.get(`http://localhost:8000/pdf/${fileId}`, { responseType: 'arraybuffer' })
      .then(response => {
        // Create a Blob from the arraybuffer
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Use the Blob URL to open the PDF
        const pdfUrl = URL.createObjectURL(blob);
        window.open(pdfUrl, '_blank');
      })
      .catch(error => {
        console.error('Error fetching PDF:', error);
      });
  };

  return (
    <>
      <Header />
      <StudentSideBar />
      <div className="pdf-list-container">
      <h1 className="dashboard-title" style={{ '--line-width': '370px',marginLeft:"600px" }}>Uploaded Content</h1>
        <hr />
        <ul className="pdf-list">
          {pdfList.map((pdf) => (
            <li key={pdf.id} className="pdf-list-item" onClick={() => viewPdf(pdf.file_id)}>
            <div className='date'>
              Uploaded on: {pdf.date ? new Date(pdf.date).toLocaleString() : 'Date Not Available'}
            </div>
            <div style={{ color: 'black', display: 'flex',marginLeft:'70px'}}>
              <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '5px',color:'red'}} />
          
              <span>{pdf.file_name}</span>&nbsp;&nbsp;
              <p style={{ color: 'gray', margin: 0, fontWeight: 'lighter' }}>PDF Document</p>
            </div>
          </li>
          
          ))}
        </ul>
      </div>
    </>
  );
};

export default Studentreview;
