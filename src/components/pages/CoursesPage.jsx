import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../services/courseService';
import '../styles/CoursesPage.css'; 
import NavBar from '../NavBars/NavBar';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch courses
        const coursesData = await fetchCourses(token);
        setCourses(coursesData);
        setIsLoading(false);
      } catch (error) {
        setError("Could not fetch courses.");
        setIsLoading(false);
        console.error("Courses fetch error:", error);
      }
    };

    loadCourses();
  }, [navigate]);

  const handleEnroll = async (courseId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You need to be logged in to enroll in a course');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8089/enroll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  
        },
        body: JSON.stringify({ id: courseId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to enroll in the course');
      }
  
      const data = await response.json();
      alert(`Successfully enrolled in ${data.course.courseName}`);
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to enroll in the course');
    }
  };
  // const handleEnroll = async (courseId) => {
  //   const token = localStorage.getItem('authToken');
  //   const studentId = localStorage.getItem('studentId'); // Assuming the student ID is stored in localStorage
  //   const grade = ''; // Default value, you can add logic to choose grade if needed
  
  //   const enrollment = {
  //     student: { id: studentId },  // Sending student as an object with id field
  //     course: { id: courseId },  // Sending course as an object with id field
  //     grade,  // You can update this field with the grade value if required
  //   };
  
  //   try {
  //     const response = await fetch(`http://localhost:8089/enrollment`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(enrollment),  // Send the enrollment object
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to enroll in the course');
  //     }
  
  //     alert('Successfully enrolled in the course!');
  //   } catch (err) {
  //     console.error('Enrollment error:', err);
  //     alert('Failed to enroll in the course.');
  //   }
  // };
  

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="courses-page-wrapper">
      <NavBar handleLogout={handleLogout} />
      <div className="courses-table-wrapper">
        {error && (
          <div className="error-alert">
            <p className="error-message">{error}</p>
          </div>
        )}
        {courses.length === 0 ? (
          <p className="no-courses-message">No courses available.</p>
        ) : (
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.courseName}</td>
                  <td>{course.department}</td>
                  <td>{course.semester}</td>
                  <td>{course.credits}</td>
                  <td>
                    <button
                      className="action-button enroll-btn"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchCourses } from '../services/courseService';
// import '../styles/CoursesPage.css'; 
// import NavBar from '../NavBars/NavBar';

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadCourses = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         // Fetch courses
//         const coursesData = await fetchCourses(token);
//         setCourses(coursesData);
//         setIsLoading(false);
//       } catch (error) {
//         setError("Could not fetch courses.");
//         setIsLoading(false);
//         console.error("Courses fetch error:", error);
//       }
//     };

//     loadCourses();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate('/login');
//   };

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <p>Loading courses...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="courses-page-wrapper">
//       <NavBar handleLogout={handleLogout} />
//       <div className="courses-table-wrapper">
//         {error && (
//           <div className="error-alert">
//             <p className="error-message">{error}</p>
//           </div>
//         )}
//         {courses.length === 0 ? (
//           <p className="no-courses-message">No courses available.</p>
//         ) : (
//           <table className="courses-table">
//             <thead>
//               <tr>
//                 <th>Course Name</th>
//                 <th>Department</th>
//                 <th>Semester</th>
//                 <th>Credits</th>
//                 {/* <th>Actions</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {courses.map((course) => (
//                 <tr key={course.id}>
//                   <td>{course.courseName}</td>
//                   <td>{course.department}</td>
//                   <td>{course.semester}</td>
//                   <td>{course.credits}</td>
//                   {/* <td>
//                     <button className="action-button view-btn">View</button>
//                     <button className="action-button edit-btn">Edit</button>
//                     <button className="action-button delete-btn">Delete</button>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;
