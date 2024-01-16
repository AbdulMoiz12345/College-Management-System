import React, { useEffect, useState, useContext } from 'react';
import { idcontext } from '../Idprovider';
import axios from 'axios';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import StudentSideBar from './StudentSideBar';

const Stgiveassignment = () => {
  const { courseid, coursename,stid } = useContext(idcontext);
  const [pdfList, setPdfList] = useState([]);
  const [file, setFile] = useState(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deadlinePassed, setDeadlinePassed] = useState([]);
  const navigate = useNavigate();
  const { classid, setclassid } = useContext(idcontext);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/pdf-listass?courseid=${courseid}&classid=${classid}`)
      .then((response) => {
        setPdfList(response.data);

        // Check if the deadline has passed for each assignment
        const currentDate = new Date();
        const passedDeadlines = response.data.filter(pdf => new Date(pdf.deadline_date) < currentDate);
        setDeadlinePassed(passedDeadlines.map(pdf => pdf.AssignmentID));
      })
      .catch((error) => {
        console.error('Error fetching PDF list:', error);
      });
  }, [pdfList]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleUpload = async (AssignmentID) => {
    try {
      const formData = new FormData();
      formData.append('course_id', courseid);
      formData.append('class_id', classid);
      formData.append('file', file);
      formData.append('formName', formName);
      formData.append('AssignmentID', AssignmentID);
      formData.append('student_id', stid);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
      formData.append('date', formattedDate);
      const response = await axios.post('http://localhost:8000/submitass', formData);
      alert('Assignment Submitted')
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const viewPdf = (AssignmentID) => {
    axios
      .get(`http://localhost:8000/pdfass/${AssignmentID}`, { responseType: 'arraybuffer' })
      .then((response) => {
        console.log(response.data);
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
      <StudentSideBar />
      <h1 className="dashboard-title" style={{ '--line-width': '450px',fontSize:'46px' }}>Submit Assignment</h1>
      <hr />
      <div className="pdf-list-container">
        {pdfList.length === 0 ? (
          <h1 style={{marginLeft:'650px'}}>No assignments have been uploaded</h1>
        ) : (
          <ul className="pdf-list">
            {pdfList.map((pdf) => (
              <React.Fragment key={pdf.id}>
                <div className="assignment-details">
                  <div className="date">
                    Uploaded on: {pdf.date ? new Date(pdf.date).toLocaleString() : 'N/A'} ||
                    Deadline: {pdf.deadline_date ? new Date(pdf.deadline_date).toLocaleString() : 'N/A'}
                  </div>
                  <div className="pdf-list-item" onClick={() => viewPdf(pdf.AssignmentID)}>
                    <div style={{ color: 'black', display: 'flex', marginLeft: '70px' }}>
                      <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '5px',color:'red' }} />
                      <span>{pdf.file_name}</span>&nbsp;&nbsp;
                      <p style={{ color: 'gray', margin: 0, fontWeight: 'lighter' }}>PDF Document</p>
                    </div>
                  </div>
                </div>
                <div className="button-container">
                  {deadlinePassed.includes(pdf.AssignmentID) ? (
                    <p style={{ color: 'red' }}>Deadline has passed</p>
                  ) : (
                    <>
                      <div className="file-upload-container1">
                        <input type="file" onChange={handleFileChange} />
                        <input type="text" placeholder="Form Name" onChange={handleFormNameChange} />
                      </div>
                      <div className="upload-button-container1">
                        <button className="upload-button1" onClick={() => handleUpload(pdf.AssignmentID)}>
                          Upload
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Stgiveassignment;
