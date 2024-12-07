import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../services/courseService';
import '../styles/CoursesPage.css';  

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
      <div className="container">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Courses</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="card-content">
          {error && (
            <div className="alert">
              <p className="alert-description">{error}</p>
            </div>
          )}

          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <div className="grid">
              {courses.map((course) => (
                <div key={course.id} className="course-card">
                  <h3>{course.courseName}</h3>
                  <p>{course.department}</p>
                  <p>{course.semester}</p>
                  <p>Credits: {course.credits}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
