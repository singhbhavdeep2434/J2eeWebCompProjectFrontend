import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../styles/CoursesPage.css';
import '../styles/CoursesPageStudent.css';
import NavBar from '../NavBars/NavBar';

const CoursesPageStudent = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8089/courses', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
        setIsLoading(false);
      } catch (err) {
        setError('Unable to fetch courses');
        setIsLoading(false);
        console.error(err);
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
  

  return (
    <div className="container">
        <NavBar/>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Courses</h2>
        </div>
        <div className="card-content">
          {isLoading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <div className="alert">{error}</div>
          ) : courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <div className="grid">
              {courses.map((course) => (
                <div key={course.id} className="course-card">
                  <h3>{course.courseName}</h3>
                  <p>{course.department}</p>
                  <p>{course.semester}</p>
                  <p>Credits: {course.credits}</p>
                  <button
                    className="enroll-button"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPageStudent;
