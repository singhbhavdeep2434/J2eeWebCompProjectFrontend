// src/services/usersService.js
const USERS_URL = 'http://localhost:8089/users';
export const fetchUsers = async (token) => {
  try {
    const response = await fetch(USERS_URL, {
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
      throw new Error('Failed to fetch Users');
    }

    // Return the users data
    return response.json();
  } catch (error) {
    console.error('Users fetch error:', error);
    throw error;
  }
};
