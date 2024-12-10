import axios from 'axios';

const API_BASE_URL = "http://localhost:8089";

export const fetchUserEnrollments = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/my-enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Returns only the user's enrollments
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    throw error;
  }
};
