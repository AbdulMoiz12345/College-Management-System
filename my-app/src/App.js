// Import necessary libraries and components
//hello this is moiz
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Homepage from './Home'; // Assuming this is the correct path to your Homepage component
import IdContextProvider from './Idprovider';
import Login from './Login';
import Teacher from './Teacher/Teacher';
import Student from './Student/Student';
import ViewCourses from './Teacher/ViewCourses';
import Teachercourseopen from './Teacher/Teachercourseopen';
import Attendence from './Teacher/Attendence';
import Takeattendance from './Teacher/Takeattendence';
import Assignment from './Teacher/Assignment';
import Giveassignment from './Teacher/Giveassignment';
import TeacherProfile from './Teacher/Teacherprofile';
import Assignmentschecking from './Teacher/Assignmentschecking';
import Studentreview from './Student/Studentreview';
import StudentViewCourses from './Student/Stview';
import Stassignment from './Student/Stassignment';
import Stgiveassignment from './Student/Stgiveassignment';
import Studentprofile from './Student/Studentprofile';
import StudentAttendence from './Student/StudentAttendence';
import Attendencedetails from './Student/Attendencedetails';
import Admin from './Admin/Admin';
import AddStudent from './Admin/AddStudent';
import UpdateStudent from './Admin/UpdateStudent';
import DeleteStudents from './Admin/DeleteStudents';
import EnrollClasses from './Admin/EnrollClasses';
import AddInstructor from './Admin/AddInstructor';
import UpdateTeacher from './Admin/UpdateTeacher';
import DeleteInstructor from './Admin/DeleteInstructor';
import CourseFunction from './Admin/CourseFunction';
import UpdateEnrollment from './Admin/UpdateEnrollment';
import ClassFunctions from './Admin/ClassFunctions';
import AllStudents from './Admin/AllStudents';
import AllTeacher from './Admin/AllTeacher';
import AllCourses from './Admin/AllCourses';
import UpdateAttendence from './Teacher/UpdateAttendence';
import UpdateAttendenceForm from './Teacher/UpdateAttendenceForm';
import ComplainPage from './Student/ComplainPage';
import Admincomplain from './Admin/Admincomplaints';
import Viewcomplaint from './Admin/Viewcomplaint';
import Quiz from './Teacher/Quiz';
import Givequiz from './Teacher/Givequiz';
import Studentquiz from './Student/Studentquiz';
import Takequiz from './Student/Takequiz';
import AdminProfile from './Admin/AdminProfile';
import Marks from './Student/Marks';

// Your main App component
const App = () => {
  return (
    <>
    <IdContextProvider>
    <Router>
    <Routes>
    <Route exact path="/login" element={<Login/>} />
      <Route exact path="/" element={<Homepage/>} />

      <Route exact path="/admin" element={<Admin/>} />
      <Route exact path="/admin/add-student" element={<AddStudent/>} />
      <Route exact path="/admin/update-student" element={<UpdateStudent/>} />
      <Route exact path="/admin/delete-student" element={<DeleteStudents/>}/>
      <Route exact path="/admin/enroll-course" element={<EnrollClasses/>}/>
      <Route exact path="/admin/add-teacher" element={<AddInstructor/>}/>
      <Route exact path="/admin/update-teacher" element={<UpdateTeacher/>}/>
      <Route exact path="/admin/delete-teacher" element={<DeleteInstructor/>}/>
      <Route exact path="/admin/course" element={<CourseFunction/>}/>
      <Route exact path="/admin/update-enrollment" element={<UpdateEnrollment/>}/>
      <Route exact path="/admin/class" element={<ClassFunctions/>}/>
      <Route exact path="/admin/all-students" element={<AllStudents/>}/>
      <Route exact path="/admin/all-teachers" element={<AllTeacher/>}/>
      <Route exact path="/admin/all-courses" element={<AllCourses/>}/>
      <Route exact path="/admin/admincomplaint" element={<Admincomplain/>}/>
      <Route exact path="/viewcomplain" element={<Viewcomplaint/>}/>
      <Route exact path="/adminprofile" element={<AdminProfile/>}/>


      <Route exact path="/student" element={<Student/>} />
      <Route exact path="/Student/review" element={<Studentreview/>} />
      <Route exact path="/Student/view" element={<StudentViewCourses/>} />
      <Route exact path="/Student/assignment" element={<Stassignment/>} />
      <Route exact path="/Student/giveassignment" element={<Stgiveassignment/>} />
      <Route exact path="/Student/profile" element={<Studentprofile/>} />
      <Route exact path="/Student/attendence" element={<StudentAttendence/>} />
      <Route exact path="/Student/viewattendence" element={<Attendencedetails/>} />
      <Route exact path="/Student/complainpage" element={<ComplainPage/>} />
      <Route exact path="/Student/studentquiz" element={<Studentquiz/>} />
      <Route exact path="/Student/takequiz" element={<Takequiz/>} />
      <Route exact path="/Student/marks" element={<Marks/>} />
  

      <Route exact path="/teacher" element={<Teacher/>} />
      <Route exact path="/teacher/view" element={<ViewCourses/>} />
      <Route exact path="/teacher/coursereview" element={<Teachercourseopen/>} />
      <Route exact path="/teacher/attendence" element={<Attendence/>} />
      <Route exact path="/teacher/takeattendence" element={<Takeattendance/>} />
      <Route exact path="/teacher/assignment" element={<Assignment/>} />
      <Route exact path="/teacher/giveassignment" element={<Giveassignment/>} />
      <Route exact path="/teacher/profile" element={<TeacherProfile/>} />
      <Route exact path="/teacher/assignmentchecking" element={<Assignmentschecking/>} />
      <Route exact path="/teacher/updateattendence" element={<UpdateAttendence/>} />
      <Route exact path="/teacher/Updateattendenceform" element={<UpdateAttendenceForm/>} />
      <Route exact path="/teacher/quiz" element={<Quiz/>} />
      <Route exact path="/teacher/givequiz" element={<Givequiz/>} />



    </Routes>
  </Router>
    </IdContextProvider>
    </>
  );
};

export default App;
