import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowEnrollments.css'; 
import NavBar from '../NavBars/NavBar';

const ShowEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editedGrades, setEditedGrades] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login'); // Redirect to login if token is not available
        return;
      }

      try {
        const response = await fetch('http://localhost:8089/enrollments', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch enrollments');
        }

        const data = await response.json();
        setEnrollments(data);
        setIsLoading(false);
      } catch (err) {
        setError('Unable to fetch enrollments');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchEnrollments();
  }, [navigate]);

  const handleGradeChange = (id, newGrade) => {
    setEditedGrades((prev) => ({
      ...prev,
      [id]: newGrade,
    }));
  };

  const handleSave = async (id) => {
    const token = localStorage.getItem('authToken');
    const updatedGrade = editedGrades[id];

    if (!updatedGrade) return; // Skip if no change

    try {
      const response = await fetch(`http://localhost:8089/enrollment/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade: updatedGrade }),
      });

      if (!response.ok) {
        throw new Error('Failed to update grade');
      }

      // Update the local state
      setEnrollments((prev) =>
        prev.map((enrollment) =>
          enrollment.id === id
            ? { ...enrollment, grade: updatedGrade }
            : enrollment
        )
      );

      // Clear the editedGrades for this ID
      setEditedGrades((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      alert('Grade updated successfully!');
    } catch (err) {
      console.error('Error updating grade:', err);
      alert('Failed to update grade.');
    }
  };

  return (
    <div className="enrollments-page">
      <NavBar />
      <div className="cardd">
        <div className="card-header">
          <h2 className="card-title">Enrollments</h2>
        </div>
        <div className="card-body">
          {isLoading ? (
            <div className="loading-indicator">Loading enrollments...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : enrollments.length === 0 ? (
            <p className="no-enrollments-message">No enrollments found.</p>
          ) : (
            <table className="enrollment-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Course Name</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.id}</td>
                    <td>{enrollment.student.name}</td>
                    <td>{enrollment.course.courseName}</td>
                    <td>
                      <input
                        type="text"
                        value={
                          editedGrades[enrollment.id] !== undefined
                            ? editedGrades[enrollment.id]
                            : enrollment.grade
                        }
                        onChange={(e) =>
                          handleGradeChange(enrollment.id, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="action-btn save-btn"
                        onClick={() => handleSave(enrollment.id)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowEnrollmentsPage;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/ShowEnrollments.css'; 
// import NavBar from '../NavBars/NavBar';

// const ShowEnrollmentsPage = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEnrollments = async () => {
//       const token = localStorage.getItem('authToken');

//       if (!token) {
//         navigate('/login'); // Redirect to login if token is not available
//         return;
//       }

//       try {
//         const response = await fetch('http://localhost:8089/enrollments', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch enrollments');
//         }

//         const data = await response.json();
//         setEnrollments(data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Unable to fetch enrollments');
//         setIsLoading(false);
//         console.error(err);
//       }
//     };

//     fetchEnrollments();
//   }, [navigate]);

//   return (
//     <div className="enrollments-page">
//       <NavBar />  
//       <div className="cardd">
//         <div className="card-header">
//           <h2 className="card-title">Enrollments</h2>
//         </div>
//         <div className="card-body">
//           {isLoading ? (
//             <div className="loading-indicator">Loading enrollments...</div>
//           ) : error ? (
//             <div className="error-message">{error}</div>
//           ) : enrollments.length === 0 ? (
//             <p className="no-enrollments-message">No enrollments found.</p>
//           ) : (
//             <table className="enrollment-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Student Name</th>
//                   <th>Course Name</th>
//                   <th>Grade</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {enrollments.map((enrollment) => (
//                   <tr key={enrollment.id}>
//                     <td>{enrollment.id}</td>
//                     <td>{enrollment.student.name}</td>
//                     <td>{enrollment.course.courseName}</td>
//                     <td>{enrollment.grade}</td>
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

// export default ShowEnrollmentsPage;




