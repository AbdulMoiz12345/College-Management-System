import React from 'react';

const AttendancePage = ({ course_name, class_name, present_days, total_days }) => {
  // Calculate attendance percentage
  const attendancePercentage = (present_days / total_days) * 100;

  // Determine the color based on attendance percentage
  const progressColor = attendancePercentage < 75 ? 'red' : 'green';

  return (
    <div className="attendance-container">
      <p><strong>Course ID:</strong> {course_name}</p>
      <p><strong>Class ID:</strong> {class_name}</p>

      <div className="attendance-info">
        <p><strong>Attendance:</strong></p>
        <div className="attendance-bar">
          <div
            className="attendance-progress"
            style={{
              width: `${attendancePercentage}%`,
              backgroundColor: progressColor, // Set the background color based on the condition
            }}
          >
            <span >{attendancePercentage.toFixed(2)}%</span>
          </div>
        </div>
        <p>{present_days} days present out of {total_days} total days</p>
      </div>
    </div>
  );
};

export default AttendancePage;
