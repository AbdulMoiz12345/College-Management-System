import React from "react";
import Coursecard from "./Cards";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { idcontext } from "../Idprovider";
import Header from "../Header";
import TeacherSideBar from "./TeacherSideBar";
import { useNavigate } from "react-router-dom";


const Quiz = () => {
    const { tid, settid } = useContext(idcontext);
    const { courseid, setcourseid } = useContext(idcontext);
    const { classid, setclassid } = useContext(idcontext);
    const [CoursesData, setCoursesData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("http://localhost:8000/get-courses-teacher", { tid });
                setCoursesData(response.data.courses); // Log the state inside useEffect
            } catch (error) {
                console.error("Error fetching data from the backend:", error);
            }
        };

        fetchData();
        console.log("CoursesData:", CoursesData);
    }, [tid]);


    const handleCourseClick = (courseId, ClassID) => {  

        setcourseid(courseId);
        setclassid(ClassID);
        navigate("/teacher/givequiz");
        // You can perform additional actions based on the clicked course ID
    };


    return (
        <>
        <Header />
        <TeacherSideBar />
        <h1 className='heading'>Quiz</h1>
      <hr/>
        <div className="courses-container">
  
          {CoursesData.map(
            (course) =>
              course && (
                <Coursecard
                key={course.CourseID}
                id={course.CourseID}
                ClassID={course.ClassID}
                ClassName={course.ClassName}
                name={course.CourseName}
                description={course.CourseDesc}
                onClick={() => handleCourseClick(course.CourseID, course.ClassID)}
              />
              )
          )}
        </div>
      </>
    );

};
export default Quiz;