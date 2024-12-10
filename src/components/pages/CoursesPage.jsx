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
                    <button className="action-button view-btn">View</button>
                    <button className="action-button edit-btn">Edit</button>
                    <button className="action-button delete-btn">Delete</button>
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
