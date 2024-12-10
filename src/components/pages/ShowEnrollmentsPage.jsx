import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowEnrollments.css'; 
import NavBar from '../NavBars/NavBar';

const ShowEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div className="container">
        <NavBar/>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Enrollments</h2>
        </div>
        <div className="card-content">
          {isLoading ? (
            <p>Loading enrollments...</p>
          ) : error ? (
            <div className="alert">{error}</div>
          ) : enrollments.length === 0 ? (
            <p>No enrollments found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Course Name</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.id}</td>
                    <td>{enrollment.student.name}</td>
                    <td>{enrollment.course.courseName}</td>
                    <td>{enrollment.grade}</td>
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
