// src/services/courseService.js
const COURSES_URL = 'http://localhost:8089/courses';
export const fetchCourses = async (token) => {
  try {
    const response = await fetch(COURSES_URL, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // Handle unauthorized or other errors
      if (response.status === 401) {
        // Token might be expired
        localStorage.removeItem("authToken");
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch courses');
    }

    // Return the courses data
    return response.json();
  } catch (error) {
    console.error('Courses fetch error:', error);
    throw error;
  }
};
