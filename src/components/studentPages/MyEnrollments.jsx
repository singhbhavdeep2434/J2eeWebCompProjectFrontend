// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchEnrollments } from '../services/enrollmentService'; // Assuming this service fetches enrolled courses
// import '../styles/MyEnrollments.css';
// import NavBar from '../NavBars/NavBar';

// const MyEnrollments = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadEnrollments = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         // Fetch enrolled courses
//         const enrollmentsData = await fetchEnrollments(token);
//         setEnrollments(enrollmentsData);
//         setIsLoading(false);
//       } catch (error) {
//         setError("Could not fetch enrollments.");
//         setIsLoading(false);
//         console.error("Enrollments fetch error:", error);
//       }
//     };

//     loadEnrollments();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate('/login');
//   };

//   if (isLoading) {
//     return (
//       <div className="container">
//         <p>Loading enrollments...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <NavBar handleLogout={handleLogout} />
//       <div className="card">
//         <div className="card-header">
//           <h2 className="card-title">My Enrollments</h2>
//         </div>
//         <div className="card-content">
//           {error && (
//             <div className="alert">
//               <p className="alert-description">{error}</p>
//             </div>
//           )}

//           {enrollments.length === 0 ? (
//             <p>You have not enrolled in any courses yet.</p>
//           ) : (
//             <table className="enrollments-table">
//               <thead>
//                 <tr>
//                   <th>Course Name</th>
//                   <th>Department</th>
//                   <th>Credits</th>
//                   <th>Semester</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {enrollments.map((course) => (
//                   <tr key={course.courseId}>
//                     <td>{course.courseName}</td>
//                     <td>{course.department}</td>
//                     <td>{course.credits}</td>
//                     <td>{course.semester}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyEnrollments;



import React, { useEffect, useState } from "react";
import { fetchUserEnrollments } from "../services/enrollmentService"; // Assume you have this service
import NavBarStudent from "../NavBars/NavBarStudent";
import '../styles/MyEnrollments.css';

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          // Redirect to login if no token exists
          return;
        }

        const data = await fetchUserEnrollments(token); // Fetch enrollments for logged-in user
        setEnrollments(data);
      } catch (error) {
        console.error("Failed to load enrollments:", error);
        setError("Could not load enrollments.");
      }
    };

    loadEnrollments();
  }, []);

  return (
    <div>
      <NavBarStudent />
      <div className="container">
        <h1>My Enrollments</h1>
        {error && <p>{error}</p>}
        {enrollments.length === 0 ? (
          <p>No enrollments found.</p>
        ) : (
          <table className="enrollment-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>{enrollment.course.courseName}</td>
                  <td>{enrollment.course.department}</td>
                  <td>{enrollment.course.semester}</td>
                  <td>{enrollment.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;
