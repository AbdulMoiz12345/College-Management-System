const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON in the request body
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for handling file buffers
const upload = multer({ storage: storage });
const db = mysql.createPool({
  connectionLimit: 10, // adjust as needed
  host: "localhost",
  user: "root",
  password: "Student@123",
  database: "lms",
  waitForConnections: true,
});
//app listen
app.listen(8000, () => {
  console.log("Server is running on port 8000");
})
// Login Portion
//_____________________________________________________________________________________________________

//login admin 
app.post('/loginadmin', (req, res) => {
  const { email, password } = req.body;

  // Use a try-catch block for better error handling
  try {
      // Call the teacher_login stored procedure
      const query = 'CALL admin_login(?, ?)';
      db.query(query, [email, password], (err, results) => {
          if (err) {
              console.error('Database query error:', err.message);
              return res.status(500).json({ message: 'Internal server error' });
          }

          // Assuming the stored procedure returns an array of result sets
          const userResults = results[0];

          if (userResults && userResults.length > 0) {
              // Extract only the necessary data from the first result set
              const user = userResults[0];

              // Send the extracted data in the response
              const responseData = {
                  message: 'Login successful',
                  user: { email: email, id: user.AdminID, name: user.FirstName }
              };

              res.json(responseData);
          } else {
              // No user found with the given credentials
              res.status(401).json({ message: 'Invalid credentials' });
          }
      });
  } catch (error) {
      console.error('Internal server error:', error.message);
      res.status(500).json({ message: 'Internal server error' });
  }
});


//login student

app.post('/loginst', (req, res) => {
  const { email, password } = req.body;
  // Find the user in the sample data
  const query = 'CALL student_login(?, ?)';
  db.query(query, [email, password], (err, results) => {
      if (err) {
          console.error('Database query error:', err.message);
          res.status(500).json({ message: 'Internal server error' });
      } else {
          // Assuming the stored procedure returns an array of result sets
          const userResults = results[0];

          if (userResults && userResults.length > 0) {
              // Extract only the necessary data from the first result set
              const user = userResults[0];

              // Send the extracted data in the response
              const responseData = { message: 'Login successful', user: { id: user.StudentID, name: user.FirstName } };
              res.json(responseData); // Send the response here
          } else {
              res.status(401).json({ message: 'Invalid credentials' });
          }
      }
  });
});



//login teacher

app.post('/loginte', (req, res) => {
  const { email, password } = req.body;

  // Use a try-catch block for better error handling
  try {
      // Call the teacher_login stored procedure
      const query = 'CALL teacher_login(?, ?)';
      db.query(query, [email, password], (err, results) => {
          if (err) {
              console.error('Database query error:', err.message);
              return res.status(500).json({ message: 'Internal server error' });
          }

          // Assuming the stored procedure returns an array of result sets
          const userResults = results[0];

          if (userResults && userResults.length > 0) {
              // Extract only the necessary data from the first result set
              const user = userResults[0];

              // Send the extracted data in the response
              const responseData = {
                  message: 'Login successful',
                  user: { email: email, id: user.InstructorID, name: user.FirstName }
              };

              res.json(responseData);
          } else {
              // No user found with the given credentials
              res.status(401).json({ message: 'Invalid credentials' });
          }
      });
  } catch (error) {
      console.error('Internal server error:', error.message);
      res.status(500).json({ message: 'Internal server error' });
  }
});

//__________________________________________________________________________________________________


//Teacher Portion 

//_________________________________________________________________________________________________

//for the viewing of courses for now this has no function as i have used the attendence one 


app.post('/teacherco', async (req, res) => {
    const teacherId = req.body.tid; // Assuming stid is the correct key in req.body
    try {
        // First query to get course IDs
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT CourseID FROM class_course WHERE InstructorID=?", [teacherId], (err, results) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Extracting course IDs without using map
        const courseIds = results.map(result => result.CourseID);

        // Second query to get course details
        const courses = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM courses WHERE CourseID IN (?)", [courseIds], (err, courses) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                } else {
                    resolve(courses);
                }
            });
        });

        res.json({ courses });
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//for  pdf upload
app.post('/upload', upload.single('file'), (req, res) => {
    try {
      const course_id = req.body.course_id;
      const class_id=req.body.class_id;
      const fileBuffer = req.file.buffer; // Ensure that req.file is defined
      const formName = req.body.formName;
      const date = req.body.date;
  
      // Save the fileBuffer, formName, and formType to MySQL
      const sql = 'INSERT INTO contents (course_id, file_data, file_name, date,class_id) VALUES (?, ?, ?, ?,?)';
      db.query(sql, [course_id, fileBuffer, formName, date,class_id], (err, result) => {
        if (err) {
          console.error('Error inserting file data into MySQL:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ message: 'File uploaded successfully' });
        }
      });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  //for pdf viewing
  
  app.get('/pdf-list', (req, res) => {
    const courseId = req.query.courseid;
    const classId=req.query.classid;
    const sql = 'SELECT file_id, file_name,date FROM contents WHERE course_id=(?) and class_id=(?)';
    db.query(sql, [courseId,classId], (err, result) => {
      if (err) {
        console.error('Error retrieving PDF list from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  });
  
  app.get('/pdf/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    console.log('File ID:', fileId);
  
    const sql = 'SELECT file_data FROM contents WHERE file_id = ?';
    db.query(sql, [fileId], (err, result) => {
      if (err) {
        console.error('Error retrieving PDF from MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (result.length > 0) {
          const fileBuffer = result[0].file_data;
  
          // Log the length of the file buffer and the first 10 bytes
          console.log('File Buffer Length:', fileBuffer.length);
          console.log('First 10 bytes of File Buffer:', fileBuffer.slice(0, 10).toString('hex'));
  
          // Send the PDF content as a buffer
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${fileId}.pdf"`);
          res.send(fileBuffer);
        } else {
          res.status(404).json({ error: 'PDF not found' });
        }
      }
    });
  });

//delete the content
app.delete('/pdf-delete/:fileId', (req, res) => {
  const fileId = req.params.fileId;

  const sql = 'DELETE FROM contents WHERE file_id = ?';
  db.query(sql, [fileId], (err, result) => {
    if (err) {
      console.error('Error deleting PDF from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: 'PDF file deleted successfully' });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    }
  });
});


  
  //for attendence
  //showing the classes the attendnec can be took
  app.post('/get-courses-teacher', async (req, res) => {
    const teacherId = req.body.tid;
    try {
        // First query to get course IDs
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT Distinct CourseID,ClassID FROM class_course WHERE InstructorID=?", [teacherId], (err, results) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        // Extracting course IDs without using map
        const courseIds = results.map(result => ({ CourseID: result.CourseID, ClassID: result.ClassID }));

// Extracting CourseID and ClassID arrays
const courseIdsArray = courseIds.map(item => item.CourseID);
const classIdsArray = courseIds.map(item => item.ClassID);
// Second query to get course details
const courses = await new Promise((resolve, reject) => {
    db.query(
        "SELECT * FROM courses c JOIN class_course cc ON c.CourseID=cc.CourseID join class l on l.classid=cc.classid WHERE cc.CourseID IN (?) AND cc.ClassID IN (?) AND InstructorID=(?)",
        [courseIdsArray, classIdsArray,teacherId],
        (err, courses) => {
            if (err) {
                console.error('Database query error:', err.message);
                reject(err);
            } else {
                resolve(courses);
            }
        }
    );
   });

        res.json({ courses });
    } catch (error) {
        console.error('Internal server error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

//taking attendence
// and then saving that attendence

app.post('/takeatt', async (req, res) => {
  try {
    const courseId = req.body.courseid;
    const classId = req.body.classid;

    // Assuming db.query returns a promise
    const result = await new Promise((resolve, reject) => {
      db.query('CALL GetStudentsForAttendance(?, ?)', [courseId, classId], (err, result) => {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Extracting the list of students from the stored procedure result set
    const students = result[0].map((student) => ({
      studentID: student.StudentID,
      firstName: student.FullName,
    }));

    // Sorting the list of students based on the name
    students.sort((a, b) => a.firstName.localeCompare(b.firstName));

    // Sending the sorted list of students to the frontend
    res.json({ success: true, students });
    console.log(students);
  } catch (error) {
    console.error('Error fetching and sorting student list:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.post('/saveattendance', async (req, res) => {
  try {
    const { attendanceData } = req.body;

    // Assuming you have a table named 'attendance' in your database
    // with columns: studentID, courseID, classID, date, isPresent

    // Loop through the attendanceData and insert/update records in the database
    for (const data of attendanceData) {
      const { studentId, courseid, classid, date, ispresent } = data;

      // Check if a record already exists for the student, course, class, and date
      const existingRecord =db.query(
        'SELECT * FROM attendence WHERE student_id = ? AND course_id = ? AND class_id= ? AND date = ?',
        [studentId, courseid, classid, date]
      );

      if (existingRecord.length > 0) {
        // If a record exists, update it
        db.query(
          'UPDATE attendence SET isPresent = ? WHERE student_id= ? AND course_id = ? AND class_id = ? AND date = ?',
          [ispresent, studentId, courseid, classid, date]
        );
      } else {
        // If a record doesn't exist, insert a new one
        db.query(
          'INSERT INTO attendence (student_id, course_id, class_id, date, is_present) VALUES (?, ?, ?, ?, ?)',
          [studentId, courseid, classid, date, ispresent]
        );
      }
    }

    res.json({ success: true, message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendence:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
// for the updation of attendence
app.get('/get-student-attendance', async (req, res) => {
  const { classid, courseid, studentId } = req.query;

  try {
    // Assuming you have a table named 'student_attendance' with columns 'date' and 'is_present'
    db.query(
      'SELECT date, is_present FROM attendence WHERE class_id = ? AND course_id = ? AND student_Id = ?',
      [classid, courseid, studentId],
      (error, results) => {
        if (error) {
          console.error('Error fetching student attendance:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.json(results);
      }
    );
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/update-student-attendance', async (req, res) => {
  const { classid, courseid, studentId, attendanceData } = req.body;

  try {
    // Assuming db.query returns a promise
    const result = await new Promise((resolve, reject) => {
      db.query(
        'CALL UpdateStudentAttendance(?, ?, ?, ?)',
        [classid, courseid, studentId, JSON.stringify(attendanceData)],
        (err, result) => {
          if (err) {
            console.error('Error updating student attendance:', err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    res.json({ message: 'Attendance data has been updated successfully' });
  } catch (error) {
    console.error('Error updating student attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Assignment upload

app.post('/uploadass', upload.single('file'), (req, res) => {
  try {
    const course_id = req.body.course_id;
    const class_id=req.body.class_id;
    const fileBuffer = req.file.buffer; // Ensure that req.file is defined
    const formName = req.body.formName;
    const date = req.body.date;
    const deadline=req.body.deadline;

    // Save the fileBuffer, formName, and formType to MySQL
    const sql = 'INSERT INTO assignment (ClassID,CourseID,file_data,file_name,date,deadline_date) VALUES (?, ?, ?, ?,?,?)';
    db.query(sql, [class_id,course_id, fileBuffer, formName, date,deadline], (err, result) => {
      if (err) {
        console.error('Error inserting file data into MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'File uploaded successfully' });
      }
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assignment view


app.get('/pdf-listass', (req, res) => {
  const courseId = req.query.courseid;
  const classId=req.query.classid;
  const sql = 'SELECT AssignmentID, file_name,date,deadline_date FROM assignment WHERE CourseID=(?) and ClassID=(?)';
  db.query(sql, [courseId,classId], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF list from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/pdfass/:AssignmentID', (req, res) => {
  const fileId = req.params.AssignmentID;
  console.log('File ID:', fileId);

  const sql = 'SELECT file_data FROM assignment WHERE AssignmentID = ?';
  db.query(sql, [fileId], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        const fileBuffer = result[0].file_data;

        // Log the length of the file buffer and the first 10 bytes
        console.log('File Buffer Length:', fileBuffer.length);
        console.log('First 10 bytes of File Buffer:', fileBuffer.slice(0, 10).toString('hex'));

        // Send the PDF content as a buffer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileId}.pdf"`);
        res.send(fileBuffer);
      } else {
        res.status(404).json({ error: 'PDF not found' });
      }
    }
  });
});

// Assignment collection
app.get('/pdf-listgetass', (req, res) => {
  const AssignmentID = req.query.assignmentid;
  const sql = 'SELECT SubmissionID,file_name FROM assignmentsubmission WHERE AssignmentID =(?)';
  db.query(sql, [AssignmentID], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF list from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);

    }
  });
});

app.get('/pdfgetass/:SubmissionID', (req, res) => {
  const fileId = req.params.SubmissionID;
  console.log('File ID:', fileId);

  const sql = 'SELECT file_data FROM assignmentsubmission WHERE SubmissionID = ?';
  db.query(sql, [fileId], (err, result) => {
    if (err) {
      console.error('Error retrieving PDF from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        const fileBuffer = result[0].file_data;

        // Log the length of the file buffer and the first 10 bytes
        console.log('File Buffer Length:', fileBuffer.length);
        console.log('First 10 bytes of File Buffer:', fileBuffer.slice(0, 10).toString('hex'));

        // Send the PDF content as a buffer
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileId}.pdf"`);
        res.send(fileBuffer);
      } else {
        res.status(404).json({ error: 'PDF not found' });
      }
    }
  });
});


app.delete('/delete-assignment/:AssignmentID', (req, res) => {
  const AssignmentID = req.params.AssignmentID;

  const sql = 'DELETE FROM assignment WHERE AssignmentID= ?';
  db.query(sql, [AssignmentID], (err, result) => {
    if (err) {
      console.error('Error deleting PDF from MySQL:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: 'PDF file deleted successfully' });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    }
  });
});
//profile teacher
app.get('/teacher-profile', (req, res) => {
  const tid = req.query.tid;

  // Call the stored procedure
  const sql = 'CALL GetTeacherProfile(?)';

  db.query(sql, [tid], (err, results) => {
    if (err) {
      console.error('Error fetching teacher profile from database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Assuming the stored procedure returns a single result for the teacher with the specified ID
      const teacherProfile = results[0][0]; // Extract the first element from the first result set

      // Check if the teacher has a photo
      const hasPhoto = teacherProfile && teacherProfile.Photo;

      // Send the combined data to the frontend
      res.json({
        results: {
          InstructorID: teacherProfile.InstructorID,
          FirstName: teacherProfile.FirstName,
          LastName: teacherProfile.LastName,
          phoneNumber: teacherProfile.phoneNumber,
          cnic: teacherProfile.cnic,
          experience: teacherProfile.experience,
          officeHours: teacherProfile.officeHours,
          gender: teacherProfile.gender,
          domicile: teacherProfile.domicile,
          qualification: teacherProfile.qualification,
          Photo: hasPhoto ? teacherProfile.Photo.toString('base64') : null,
          // Include other fields from the stored procedure as needed
        },
      });
    }
  });
});


app.post('/upload-photo', upload.single('photo'), async (req, res) => {
  const tid = req.body.tid;

  if (!tid) {
    return res.status(400).json({ error: 'Instructor ID is required' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded' });
  }

  const photoData = req.file.buffer;

  // Check if the instructor with the provided tid exists in the database
  const checkIfExistsSQL = 'SELECT * FROM InstructorPhotos WHERE InstructorID = ?';

  db.query(checkIfExistsSQL, [tid], (err, results) => {
    if (err) {
      console.error('Error checking if instructor exists:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      // If no instructor found, it's the first time, so insert a new record
      const insertSQL = 'INSERT INTO InstructorPhotos (InstructorID, photo) VALUES (?, ?)';

      db.query(insertSQL, [tid, photoData], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting photo into database:', insertErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Photo uploaded successfully' });
      });
    } else {
      // If instructor found, update the existing record
      const updateSQL = 'UPDATE InstructorPhotos SET photo = ? WHERE InstructorID = ?';

      db.query(updateSQL, [photoData, tid], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating photo in database:', updateErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Photo updated successfully' });
      });
    }
  });
});

//_____________________________________________________________________________________________________________________


//Student section

//__________________________________________________________________________________________________________________

app.post('/Student', async (req, res) => {
  const studentId = req.body.stid;
  try {
      // First query to get course IDs
      const results = await new Promise((resolve, reject) => {
          db.query("SELECT c.CourseID,c.ClassID FROM student s join enrollment e on s.StudentID=e.StudentID join class_course c on c.ClassID=e.ClassID WHERE s.StudentID=?", [studentId], (err, results) => {
              if (err) {
                  console.error('Database query error:', err.message);
                  reject(err);
              } else {
                  resolve(results);
              }
          });
      });
      // Extracting course IDs without using map
      const courseIds = results.map(result => ({ CourseID: result.CourseID, ClassID: result.ClassID }));

// Extracting CourseID and ClassID arrays
const courseIdsArray = courseIds.map(item => item.CourseID);
const classIdsArray = courseIds.map(item => item.ClassID);
// Second query to get course details
const courses = await new Promise((resolve, reject) => {
  db.query(
      "SELECT * FROM courses c JOIN class_course cc ON c.CourseID=cc.CourseID join class l on l.classid=cc.classid WHERE cc.CourseID IN (?) AND cc.ClassID IN (?)",
      [courseIdsArray, classIdsArray],
      (err, courses) => {
          if (err) {
              console.error('Database query error:', err.message);
              reject(err);
          } else {
              resolve(courses);
          }
      }
  );
 });

      res.json({ courses });
  } catch (error) {
      console.error('Internal server error:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

//give assignment
app.post('/submitass', upload.single('file'), (req, res) => {
  try {
    const course_id = req.body.course_id;
    const class_id = req.body.class_id;
    const fileBuffer = req.file.buffer; // Ensure that req.file is defined
    const formName = req.body.formName;
    const date = req.body.date;
    const AssignmentID = req.body.AssignmentID;
    const student_id = req.body.student_id; // Assuming student_id is available in the request body
    console.log(student_id)
    // Check if the submission already exists for the student and assignment
    const checkIfExistsQuery = 'SELECT * FROM assignmentsubmission WHERE AssignmentID = ? AND student_id = ?';
    db.query(checkIfExistsQuery, [AssignmentID, student_id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking existing submission:', checkErr);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (checkResult.length > 0) {
          // If submission exists, update the existing record
          const updateQuery = 'UPDATE assignmentsubmission SET class_id = ?, course_id = ?, file_data = ?, file_name = ?, date_of_submission = ? WHERE AssignmentID = ? AND student_id = ?';
          db.query(updateQuery, [class_id, course_id, fileBuffer, formName, date, AssignmentID, student_id], (updateErr, updateResult) => {
            if (updateErr) {
              console.error('Error updating file data in MySQL:', updateErr);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'File updated successfully' });
            }
          });
        } else {
          // If submission doesn't exist, insert a new record
          const insertQuery = 'INSERT INTO assignmentsubmission (AssignmentID, class_id, course_id, file_data, file_name, date_of_submission, student_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
          db.query(insertQuery, [AssignmentID, class_id, course_id, fileBuffer, formName, date, student_id], (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error inserting file data into MySQL:', insertErr);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'File uploaded successfully' });
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//attendence student
app.post('/Student/attendence', async (req, res) => {
  const studentId = req.body.stid;

  try {
    // Assuming db.query returns a promise
    const results = await new Promise((resolve, reject) => {
      db.query('CALL GetStudentAttendance(?)', [studentId], (err, results) => {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Assuming you want to send the attendance data back to the client
    res.json({ attendance: results[0] });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/Student/attendencereview', async (req, res) => {
  const studentId = req.body.stid;
  const course_id=req.body.courseid
  const class_id=req.body.classid
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('select is_present,date from attendence where class_id=(?) and course_id=(?) and student_id=(?)', [class_id,course_id,studentId], (err, results) => {
        if (err) {
          console.error('Database query error:', err.message);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    // Assuming you want to send the attendance data back to the client
    res.json({ attendance: results });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//student profile
app.get('/student-profile', (req, res) => {
  const stid = req.query.stid;

  // Call the stored procedure
  const sql = 'CALL GetStudentProfile(?)';

  db.query(sql, [stid], (err, results) => {
    if (err) {
      console.error('Error fetching student profile from database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Assuming the stored procedure returns a single result for the teacher with the specified ID
      const StudentProfile = results[0][0]; // Extract the first element from the first result set
       
      // Check if the teacher has a photo
      const hasPhoto = StudentProfile  && StudentProfile .Photo;

      // Send the combined data to the frontend
      res.json({
        results: {
          StudentID: StudentProfile .StudentID,
          FirstName: StudentProfile .FirstName,
          LastName: StudentProfile .LastName,
          phoneNumber: StudentProfile .phoneNumber,
          cnic: StudentProfile .cnic,          
          gender: StudentProfile .gender,
          domicile: StudentProfile .domicile,
          Photo: hasPhoto ? StudentProfile .Photo.toString('base64') : null,
          // Include other fields from the stored procedure as needed
        },
      });
    }
  });
});

//photo upload for student

app.post('/upload-photo-student', upload.single('photo'), async (req, res) => {
  const stid = req.body.stid;
  if (!stid ) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No photo uploaded' });
  }

  const photoData = req.file.buffer;

  // Check if the instructor with the provided tid exists in the database
  const checkIfExistsSQL = 'SELECT * FROM StudentPhotos WHERE StudentID = ?';

  db.query(checkIfExistsSQL,[stid ], (err, results) => {
    if (err) {
      console.error('Error checking if instructor exists:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      // If no instructor found, it's the first time, so insert a new record
      const insertSQL = 'INSERT INTO StudentPhotos (StudentID, photo) VALUES (?, ?)';

      db.query(insertSQL, [stid , photoData], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting photo into database:', insertErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Photo uploaded successfully' });
      });
    } else {
      // If instructor found, update the existing record
      const updateSQL = 'UPDATE StudentPhotos SET photo = ? WHERE StudentID = ?';

      db.query(updateSQL, [photoData, stid], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating photo in database:', updateErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({ message: 'Photo updated successfully' });
      });
    }
  });
});

//__________________________________________________________________________________________________________________

//admin  Portion
 
//__________________________________________________________________________________________________________________________

app.get('/class', async (req, res) => {
  try {
    // Assuming db.query accepts a callback
    db.query("SELECT ClassID, ClassName FROM class", (error, result) => {
      if (error) {
        throw error;
      }
      
      const classes = result.map((row) => ({
        classID: row.ClassID,
        className: row.ClassName
      }));

      res.json({ classes });
      const selectedClassObject = classes.find(
        (classItem) => classItem.classID === 2
      );

      // Set the selected name to the class name (or an empty string if not found)

    });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});
//submit data
// ...

app.post('/add-student', async (req, res) => {
  try {
      const {
          student_id,
          first_name,
          last_name,
          cnic,
          email,
          gender,
          phone_number,
          domicile,
          password,
          selected_class,
      } = req.body;

      const sql = 'CALL AddStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

      const values = [
          student_id,
          first_name,
          last_name,
          cnic,
          email,
          gender,
          phone_number,
          domicile,
          password,
          selected_class,
      ];

      db.query(sql, values, (error, result) => {
          if (error) {
              console.error('Error calling stored procedure:', error);
              res.status(500).json({ status: 'error', message: 'Internal server error' });
              return;
          }

          console.log('Student added to the database');
          res.json({ status: 'success', message: 'Student added successfully' });
      });
  } catch (error) {
      console.error('Internal server error:', error.message);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// ...


//update student
app.get('/get-student/:studentId', (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Implement your logic to fetch student data from the database based on studentId
    const sql = 'SELECT * FROM student s join enrollment e on s.StudentID=e.StudentID join student_login_detail l on s.StudentID=l.StudentID join student_contact_detail k on k.StudentID=s.StudentID WHERE s.StudentID = ?';
    db.query(sql, [studentId], (error, result) => {
      if (error) {
        console.error('Error fetching student data:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.length > 0) {
        res.json({ student: result[0] });
      } else {
        res.status(404).json({ message: 'No student found with this ID' });
      }
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
});
app.post('/update-student', async (req, res) => {
  try {
    const {
      student_id,
      first_name,
      last_name,
      cnic,
      email,
      gender,
      phone_number,
      domicile,
      password,
      selected_class,
    } = req.body;

    const updateStudentProcedure = 'CALL UpdateStudent(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const updateStudentValues = [
      student_id,
      first_name,
      last_name,
      cnic,
      gender,
      phone_number,
      domicile,
      email,
      password,
      selected_class,
    ];

    db.query(updateStudentProcedure, updateStudentValues, (error, result) => {
      if (error) {
        console.error('Error calling stored procedure:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
        return;
      }

      console.log('Student updated in the database');
      res.json({ status: 'success', message: 'Student updated successfully' });
    });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


//delete student
app.get('/delete-student/:studentId', (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Check if the student with the given ID exists
    const checkStudentQuery = 'SELECT * FROM student WHERE StudentID = ?';
    db.query(checkStudentQuery, [studentId], (checkError, checkResults) => {
      if (checkError) {
        console.error('Error checking student existence:', checkError);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // If no student is found, return an error
      if (checkResults.length === 0) {
        return res.status(404).json({ message: 'No student found with this ID' });
      }

      // If the student is found, proceed with deletion
      const deleteQueries = [
        'DELETE FROM attendence WHERE student_id = ?',
        'DELETE FROM enrollment WHERE StudentID = ?',
        'DELETE FROM student_login_detail WHERE StudentID = ?',
        'DELETE FROM student_contact_detail WHERE studentid = ?',
        'DELETE FROM student_quiz_marks WHERE StudentID = ?'
      ];

      const executeDeleteQueries = (index) => {
        if (index === deleteQueries.length) {
          // All child data deleted, proceed to delete from student table
          db.query('DELETE FROM student WHERE StudentID = ?', [studentId], (deleteError, deleteResult) => {
            if (deleteError) {
              console.error('Error deleting student data:', deleteError);
              return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(200).json({ message: 'Student deleted successfully' });
          });
          return;
        }

        const query = deleteQueries[index];
        db.query(query, [studentId], (error, result) => {
          if (error) {
            console.error(`Error deleting data from ${query}:`, error);
            return res.status(500).json({ message: 'Internal server error' });
          }
          executeDeleteQueries(index + 1); // Move to the next query
        });
      };

      executeDeleteQueries(0); // Start executing delete queries for child tables
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// courses enroll
app.get('/instructor', async (req, res) => {
  try {
    // Assuming db.query accepts a callback
    db.query("SELECT InstructorID,LastName FROM instructor", (error, result) => {
      if (error) {
        throw error;
      }
      
      const instructor = result.map((row) => ({
        InstructorID: row.InstructorID,
        Name: row.LastName
      }));

      res.json({ instructor });
    });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/courses', async (req, res) => {
  try {
    // Assuming db.query accepts a callback
    db.query("SELECT CourseID,CourseName FROM courses", (error, result) => {
      if (error) {
        throw error;
      }
      
      const courses = result.map((row) => ({
        CourseID: row.CourseID,
        CourseName: row.CourseName
      }));

      res.json({ courses});
    });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/enroll',(req,res)=>{
  try {
    const enrollmentData = req.body;

    // Insert enrollment data into MySQL
    const query = 'INSERT INTO class_course (ClassID, CourseID, InstructorID) VALUES ?';
    const values = enrollmentData.map((enrollment) => [
      enrollment.class,
      enrollment.course,
      enrollment.instructor,
    ]);

    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        return;
      }

      res.status(201).json({ success: true, result });
    });
  } catch (error) {
    console.error('Error saving enrollment data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
})


// add instructor
app.post('/add-instructor', async (req, res) => {
  try {
    const {
      instructor_id,
      first_name,
      last_name,
      cnic,
      email,
      gender,
      phone_number,
      domicile,
      password,
      qualification,
      experience,
      coursesTaught,
      officeHours,
    } = req.body;

    const addInstructorProcedure = 'CALL AddInstructor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const addInstructorValues = [
      instructor_id,
      first_name,
      last_name,
      cnic,
      email,
      gender,
      phone_number,
      domicile,
      password,
      qualification,
      experience,
      coursesTaught,
      officeHours,
    ];

    db.query(addInstructorProcedure, addInstructorValues, (error, result) => {
      if (error) {
        console.error('Error calling stored procedure:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
        return;
      }

      console.log('Instructor added to the database');
      res.json({ status: 'success', message: 'Instructor added successfully' });
    });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

app.get('/get-instructor/:instructorId', (req, res) => {
  try {
    const instructorId = req.params.instructorId;

    // Implement your logic to fetch student data from the database based on studentId
    const sql = 'SELECT * FROM instructor i join teacher_login_detail l on i.InstructorID=l.InstructorID where i.InstructorID=?';
    db.query(sql, [instructorId], (error, result) => {
      if (error) {
        console.error('Error fetching student data:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.length > 0) {
        res.json({ instructor: result[0] });
      } else {
        res.status(404).json({ message: 'No student found with this ID' });
      }
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
});


app.post('/update-instructor', async (req, res) => {
  try {
    const {
      instructor_id,
      first_name,
      last_name,
      cnic,
      email,
      gender,
      phone_number,
      domicile,
      password,
      qualification,
      experience,
      coursesTaught,
      officeHours,
    } = req.body;

    const updateInstructorProcedure = 'CALL UpdateInstructor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const updateInstructorValues = [
      instructor_id,
      first_name,
      last_name,
      cnic,
      email,
      gender,
      phone_number,
      domicile,
      password,
      qualification,
      experience,
      coursesTaught,
      officeHours,
    ];

    db.query(updateInstructorProcedure, updateInstructorValues, (error, result) => {
      if (error) {
        console.error('Error calling stored procedure:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
        return;
      }

      console.log('Instructor updated in the database');
      res.json({ status: 'success', message: 'Instructor updated successfully' });
    });
  } catch (error) {
    console.error('Internal server error:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


//delete instructor

app.get('/delete-instructor/:instructorid', (req, res) => {
  try {
    const instructorId = req.params.instructorid;

    // Check if the instructor with the given ID exists
    const checkInstructorQuery = 'SELECT * FROM instructor WHERE InstructorID = ?';
    db.query(checkInstructorQuery, [instructorId], (checkError, checkResults) => {
      if (checkError) {
        console.error('Error checking instructor existence:', checkError);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // If no instructor is found, return an error
      if (checkResults.length === 0) {
        return res.status(404).json({ message: 'No instructor found with this ID' });
      }

      // If the instructor is found, proceed with deletion

      const deleteQueries = [
        'DELETE FROM `class_course` WHERE InstructorID = ?',
        'DELETE FROM teacher_login_detail WHERE InstructorID = ?',
        'DELETE FROM instructorphotos WHERE InstructorID = ?',
        'DELETE FROM instructor WHERE InstructorID = ?'
      ];

      const executeDeleteQueries = (index) => {
        if (index === deleteQueries.length) {
          // All related data deleted, respond with success message
          return res.status(200).json({ message: 'Instructor deleted successfully' });
        }

        const query = deleteQueries[index];
        db.query(query, [instructorId], (error, result) => {
          if (error) {
            console.error(`Error deleting data from ${query}:`, error);
            return res.status(500).json({ message: 'Internal server error' });
          }
          executeDeleteQueries(index + 1); // Move to the next query
        });
      };

      executeDeleteQueries(0); // Start executing delete queries for associated data
    });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//course making
app.post('/create-course', (req, res) => {
  const { name, id, description } = req.body;

  const createCourseQuery = 'INSERT INTO courses (CourseName, CourseID, CourseDesc) VALUES (?, ?, ?)';
  const createCourseValues = [name, id, description];

  db.query(createCourseQuery, createCourseValues, (error, result) => {
    if (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    } else {
      res.json({ status: 'success', message: 'Course created successfully' });
    }
  });
});

// Endpoint for deleting a course
app.post('/delete-course/:courseId', (req, res) => {
  const courseId = req.params.courseId;
  
  // Delete from student_quiz_marks
  const deleteStudentQuizMarksQuery = 'DELETE FROM student_quiz_marks WHERE CourseID = ?';
  db.query(deleteStudentQuizMarksQuery, [courseId], (errorStudentQuizMarks, resultStudentQuizMarks) => {
    if (errorStudentQuizMarks) {
      console.error('Error deleting student_quiz_marks:', errorStudentQuizMarks);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
      return;
    }

    // Delete from quiz
    const deleteQuizQuery = 'DELETE FROM quiz WHERE CourseID = ?';
    db.query(deleteQuizQuery, [courseId], (errorQuiz, resultQuiz) => {
      if (errorQuiz) {
        console.error('Error deleting quiz:', errorQuiz);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
        return;
      }

      // Delete from contents
      db.query('DELETE FROM contents where course_id=?', [courseId], (errorContents, resultContents) => {
        if (errorContents) {
          console.error('Error deleting contents:', errorContents);
          res.status(500).json({ status: 'error', message: 'Internal server error' });
          return;
        }

        // Delete from class_course
        db.query('DELETE FROM class_course where CourseID=?', [courseId], (errorClassCourse, resultClassCourse) => {
          if (errorClassCourse) {
            console.error('Error deleting class_course:', errorClassCourse);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
            return;
          }

          // Delete from courses
          const deleteCourseQuery = 'DELETE FROM courses WHERE CourseID = ?';
          db.query(deleteCourseQuery, [courseId], (errorDeleteCourse, resultDeleteCourse) => {
            if (errorDeleteCourse) {
              console.error('Error deleting course:', errorDeleteCourse);
              res.status(500).json({ status: 'error', message: 'Internal server error' });
              return;
            }

            res.json({ status: 'success', message: 'Course deleted successfully' });
          });
        });
      });
    });
  });
});
// delete class
app.post('/delete-class/:classId', (req, res) => {
  const classId = req.params.classId;

  // Delete from quiz
  db.query('DELETE FROM quiz WHERE ClassID=?', [classId], (errorQuiz, resultQuiz) => {
    if (errorQuiz) {
      console.error('Error deleting from quiz:', errorQuiz);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
      return;
    }

    // Delete from class_course (enrollment)
    db.query('DELETE FROM class_course WHERE ClassID=?', [classId], (errorClassCourse, resultClassCourse) => {
      if (errorClassCourse) {
        console.error('Error deleting from class_course:', errorClassCourse);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
        return;
      }

      // Delete from attendance
      db.query('DELETE FROM attendence WHERE Class_ID=?', [classId], (errorAttendance, resultAttendance) => {
        if (errorAttendance) {
          console.error('Error deleting from attendance:', errorAttendance);
          res.status(500).json({ status: 'error', message: 'Internal server error' });
          return;
        }

        // Delete from assignment
        db.query('DELETE FROM assignment WHERE ClassID=?', [classId], (errorAssignment, resultAssignment) => {
          if (errorAssignment) {
            console.error('Error deleting from assignment:', errorAssignment);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
            return;
          }

          // Delete from assignment_submission
          db.query('DELETE FROM assignmentsubmission WHERE Class_ID=?', [classId], (errorAssignmentSubmission, resultAssignmentSubmission) => {
            if (errorAssignmentSubmission) {
              console.error('Error deleting from assignment_submission:', errorAssignmentSubmission);
              res.status(500).json({ status: 'error', message: 'Internal server error' });
              return;
            }

            // Finally, delete from class
            db.query('DELETE FROM class WHERE ClassID=?', [classId], (errorClass, resultClass) => {
              if (errorClass) {
                console.error('Error deleting from class:', errorClass);
                res.status(500).json({ status: 'error', message: 'Internal server error' });
                return;
              }

              res.json({ status: 'success', message: 'Class deleted successfully' });
            });
          });
        });
      });
    });
  });
});

//update enrollment
app.get('/update-enrollment/:classID', (req, res) => {
  const { classID } = req.params;

  const query = `
    SELECT *
    FROM class_course
    WHERE ClassID = ?;
  `;

  db.query(query, [classID], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(results)

    res.json(results);
  });
});

app.post('/updateadd-enrollment', (req, res) => {
  try {
    const enrollmentData = req.body;
    const classid = req.body[0]?.ClassID; // Extract the first ClassID, assuming all entries have the same ClassID

    // Check if classid is valid
    if (classid === undefined || classid === null) {
      res.status(400).json({ success: false, error: 'Invalid ClassID' });
      return;
    }

    // Insert enrollment data into MySQL
    const query = 'INSERT INTO class_course (ClassID, CourseID, InstructorID) VALUES ?';
    const values = enrollmentData.map((enrollment) => [
      enrollment.ClassID,
      enrollment.CourseID,
      enrollment.InstructorID,
    ]);

    // Delete existing data for the given ClassID
    const deleteQuery = `DELETE FROM class_course WHERE ClassID=${classid}`;

    db.query(deleteQuery, (err, deleteResult) => {
      if (err) {
        console.error('Error deleting data from MySQL:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        return;
      }

      // Insert new enrollment data
      db.query(query, [values], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting data into MySQL:', insertErr);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
          return;
        }

        res.status(201).json({ success: true, result: insertResult });
      });
    });
  } catch (error) {
    console.error('Error saving enrollment data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// class functions
app.post('/create-class', (req, res) => {
  const { name, id} = req.body;

  const createClassQuery = 'INSERT INTO class (ClassName,ClassID) VALUES (?, ?)';
  const createClassValues = [name, id];

  db.query(createClassQuery, createClassValues , (error, result) => {
    if (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    } else {
      res.json({ status: 'success', message: 'Course created successfully' });
    }
  });
});


// all students
// API endpoint to get student summary data
app.get('/All_Students', (req, res) => {
  db.query('SELECT * FROM student_summary_view', (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json({ students: results });
    }
  });
});
app.get('/All_Teachers', (req, res) => {
  db.query('SELECT * FROM teacher_summary_view', (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json({ teachers: results });
    }
  });
});
app.get('/All_Courses', (req, res) => {
  db.query('SELECT * FROM courses', (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json({ courses: results });
    }
  });
});

//_________________________________________________________________________________________________________________________________

// complain section 

//_______________________________________________________________________________________________________

app.post('/complain', (req, res) => {
  const { id, name, purpose, text } = req.body;

  // Insert the complaint into the MySQL database
  const query = 'INSERT INTO complaints (studentid,studentname, purpose, text) VALUES (?, ?, ?,?)';
  db.query(query, [id,name, purpose, text], (err, result) => {
    if (err) {
      console.error('Error inserting complaint into database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Complaint inserted successfully');
      res.status(200).send('Complaint submitted successfully');
    }
  });
});
app.get('/admincomplaints', (req, res) => {
  const query = 'SELECT * FROM complaints';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(result);
    }
  });
});
app.get('/viewcomplaint/:complaintid', (req, res) => {
  const id = req.params.complaintid;
  const query = 'SELECT * FROM complaints WHERE complaint_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching complaint:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result);
      console.log(result)
    }
  });
});
app.post('/markasviewed/:complaintid', (req, res) => {
  const id = req.params.complaintid;
  console.log(id)
  const query = 'DELETE FROM complaints WHERE complaint_id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting complaint:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Complaint marked as viewed and deleted successfully' });
    }
  });
});
//admin profile
app.get('/admin-profile', (req, res) => {
  const adminid = req.query.adminid;

  // Call the stored procedure
  const sql = 'CALL GetAdminProfile(?)';

  db.query(sql, [adminid], (err, results) => {
    if (err) {
      console.error('Error fetching student profile from database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Assuming the stored procedure returns a single result for the teacher with the specified ID
      const AdminProfile = results[0][0]; // Extract the first element from the first result set
       
      res.json({
        results: {
          AdminID: AdminProfile .AdminID,
          FirstName: AdminProfile.FirstName,
          LastName: AdminProfile.LastName,
          phoneNumber: AdminProfile .PhoneNumber,
          cnic: AdminProfile .cnic,          
          gender: AdminProfile .gender,
          // Include other fields from the stored procedure as needed
        },
      });
    }
  });
});
//__________________________________________________________________________________________________________________


// Quiz portion 
//_________________________________________________________________________________________________________________________


app.post('/makequiz', (req, res) => {
  const { classid,courseid,tid,quizname, quizdesc, quizstarttime, quizendtime } = req.body;

  const createQuizQuery = 'INSERT INTO quiz (ClassID, CourseID, InstructorID, QuizName, QuizDescription, StartTime, EndTime) VALUES (?, ?, ?, ?, ?, ?, ?)';
const createQuizValues = [classid, courseid, tid, quizname, quizdesc, quizstarttime, quizendtime];

db.query(createQuizQuery, createQuizValues, (error, result) => {
  if (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  } else {
    const quizId = result.insertId;
    console.log(quizId) // Retrieve the last inserted ID
    res.json({ status: 'success', message: 'Quiz created successfully', quizId });
  }
});
});

// Backend route for saving MCQ data
app.post('/savemcqdata', (req, res) => {
  const { quizid, McqData } = req.body;
  console.log("the quiz id is ");
console.log(quizid)
  // Assuming mcqData is an array of objects containing questionText, Option1, Option2, Option3, Option4, and CorrectOption

  // Construct the SQL query for inserting MCQ data
  const insertMcqQuery = 'INSERT INTO quiz_question (QuizID, QuestionText, Option1, Option2, Option3, Option4, CorrectOption) VALUES (?, ?, ?, ?, ?, ?, ?)';

  // Execute the query for each MCQ entry
  McqData.forEach(async (mcq) => {
    const insertMcqValues = [quizid, mcq.questionText, mcq.option1, mcq.option2, mcq.option3, mcq.option4, mcq.correctOption];

    db.query(insertMcqQuery, insertMcqValues, (error, result) => {
      if (error) {
        console.error('Error inserting MCQ data:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
      }
    });
  });

  res.json({ status: 'success', message: 'MCQ data saved successfully' });
});


//student quiz


app.get('/getStudentQuizzes/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  console.log(studentId)
  const query = `
    SELECT q.quizid, q.quizname, q.quizdescription, q.starttime, q.endtime
    FROM student s
    JOIN enrollment e ON s.studentid = e.studentid
    JOIN class_course cc ON e.classid = cc.classid
    JOIN quiz q ON cc.courseid = q.courseid
    WHERE s.studentid = ?
  `;

  db.execute(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching quiz data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
      console.log(results)
    }
  });
});
app.get('/getQuizQuestions/:quizid', (req, res) => {
  const quizId = req.params.quizid;

  const query = `
    SELECT * FROM quiz_question
    WHERE QuizID = ?
  `;

  db.execute(query, [quizId], (error, rows) => {
    if (error) {
      console.error('Error fetching quiz questions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});


app.post('/saveQuizResults', (req, res) => {
  const quizResultsData = req.body;
  let CourseID = 0; // Initialize CourseID

  // Assuming your database connection supports parameterized queries
  const insertQuery = `
    INSERT INTO student_quiz_marks (StudentID, QuizID, CourseID, Marks)
    VALUES (?, ?, ?, ?)
  `;

  const fetchCourseIdQuery = `
    SELECT CourseID FROM quiz WHERE QuizID = ?
  `;

  // Fetch CourseID based on QuizID
  db.execute(fetchCourseIdQuery, [quizResultsData.QuizID], (error, result) => {
    if (error) {
      console.error('Error fetching CourseID from the database:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    } else {
      if (result.length > 0) {
        CourseID = result[0].CourseID;

        // Now that we have the CourseID, we can execute the insert query
        const { StudentID, QuizID, Marks } = quizResultsData;

        db.execute(insertQuery, [StudentID, QuizID, CourseID, Marks], (insertError, insertResult) => {
          if (insertError) {
            console.error('Error inserting quiz results into the database:', insertError);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
          } else {
            res.json({ success: true, message: 'Quiz results saved successfully' });
          }
        });
      } else {
        res.status(404).json({ success: false, message: 'Course not found for the given QuizID' });
      }
    }
  });
});


//check quiz taken


app.post('/checkquiztaken', (req, res) => {
  const { studentId, quizId } = req.body;

  // Assuming db.query accepts a callback function with (error, rows) signature
  db.query('SELECT * FROM student_quiz_marks WHERE studentid = ? AND quizid = ?', [studentId, quizId], (error, rows) => {
    if (error) {
      console.error('Error checking quiz status:', error);
      res.status(500).json({ error: 'An error occurred while checking quiz status' });
      return;
    }

    if (rows.length > 0) {
      // If there is a record, the student has taken the quiz
      res.json({ quizTaken: true });
    } else {
      // If no record found, the student hasn't taken the quiz
      res.json({ quizTaken: false });
    }
  });
});
app.get('/getmarks/:stid', (req, res) => {
  const studentId = req.params.stid;

  const query = `
    SELECT m.marks, m.quizid, c.coursename 
    FROM student_quiz_marks m 
    JOIN courses c ON c.courseid = m.courseid 
    WHERE m.studentid = ?
  `;

  db.execute(query, [studentId], (error, rows) => {
    if (error) {
      console.error('Error fetching student marks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log(rows);
      console.log("gave no results");
      res.json(rows);
    }
  });
});
//________________________________________________________________________________________________________________________________