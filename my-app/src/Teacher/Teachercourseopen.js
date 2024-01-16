import React, { useEffect, useState,useContext } from 'react';
import { idcontext } from '../Idprovider';
import axios from 'axios';
import './Sidebar.css';
import TeacherSideBar from './TeacherSideBar';
import Header from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf,faTrash } from '@fortawesome/free-solid-svg-icons';
const Teachercourseopen = () => {
  const { courseid, coursename } = useContext(idcontext);
  const [pdfList, setPdfList] = useState([]);
  const [file, setFile] = useState(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('');
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
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('course_id', courseid);
      formData.append('class_id', classid); // Include class_id in the formData
      formData.append('file', file);
      formData.append('formName', formName);
  
      // Format the date without the 'Z' to avoid datetime-related issues
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
  
      formData.append('date', formattedDate);
  
      // Change the URL to your Express.js server endpoint
      const response = await axios.post('http://localhost:8000/upload', formData);
  
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const handleDelete = async (fileId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/pdf-delete/${fileId}`);
      console.log(response.data);
      // Remove the deleted file from the state
      setPdfList((prevPdfList) => prevPdfList.filter(pdf => pdf.file_id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

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
      <TeacherSideBar />
      <h1 style={{ color: 'black', marginLeft: '950px' }}>{coursename}</h1>
      <div className="content_main">
        <h1>Upload Content</h1>
        <div className="file-upload-container">
          <input type="file" onChange={handleFileChange} />
          <input type="text" placeholder="Form Name" onChange={handleFormNameChange} />
          <input type="text" placeholder="Form Type" onChange={handleFormTypeChange} />
        </div>
        <div className="upload-button-container">
          <button className="upload-button" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
      <div className="pdf-list-container">
      <h1 className="dashboard-title" style={{ '--line-width': '370px',marginLeft:"600px" }}>Uploaded Content</h1>
  <hr/>
  <ul className="pdf-list">
    {pdfList.map((pdf) => (
      <div style={{display:'flex'}}>
<li key={pdf.id} className="pdf-list-item" onClick={() => viewPdf(pdf.file_id)} style={{width:'600px'}}>
        <div className='date'>
          Uploaded on: {pdf.date ? new Date(pdf.date).toLocaleString() : 'Date Not Available'}
        </div>
        <div style={{ color: 'black', display: 'flex',marginLeft:'70px'}}>
          <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '5px',color:'red'}} />
          <span>{pdf.file_name}</span>&nbsp;&nbsp;
          <p style={{ color: 'gray', margin: 0, fontWeight: 'lighter' }}>PDF Document</p>
        </div>
      </li>
      <div>
      <button onClick={() => handleDelete(pdf.file_id)} style={{marginTop:'80px',marginLeft:'200px'}}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
       </div>
      </div>
      
    ))}
  </ul>
</div>
    </>
  );
};

export default Teachercourseopen;
