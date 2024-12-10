import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBars/NavBar';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  
  // State to handle form inputs
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [credits, setCredits] = useState(0);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    const courseDetails = {
      courseCode,
      courseName,
      department,
      semester,
      credits,
    };

    try {
      const response = await fetch('http://localhost:8089/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      const data = await response.json();
      setCourseData(data); // Set the response data
      setIsLoading(false);
    } catch (error) {
      setError('Error creating course');
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <NavBar/>
      <h1>Create a New Course</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Credits"
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          {isLoading ? 'Creating Course...' : 'Create Course'}
        </button>
      </form>

      {courseData && (
        <div style={{ marginTop: '20px' }}>
          <h3>Course Created Successfully</h3>
          <p><strong>Course Code:</strong> {courseData.courseCode}</p>
          <p><strong>Course Name:</strong> {courseData.courseName}</p>
          <p><strong>Department:</strong> {courseData.department}</p>
          <p><strong>Semester:</strong> {courseData.semester}</p>
          <p><strong>Credits:</strong> {courseData.credits}</p>
        </div>
      )}
    </div>
  );
};

// Styles for form and button
const inputStyle = {
  padding: '10px',
  margin: '10px 0',
  width: '200px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  marginTop: '10px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
};

export default CreateCoursePage;
