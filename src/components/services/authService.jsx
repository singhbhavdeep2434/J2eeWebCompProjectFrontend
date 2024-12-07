// Login function remains the same
export const loginUser = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8089/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login request failed');
    }

    // Return the plain text token
    return await response.text();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// New Signup function
export const signupUser = async (username, email, password, name, role) => {
  try {
    const response = await fetch('http://localhost:8089/user', { // Ensure this endpoint is correct
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, name, role }), // Pass name and role as well
    });

    if (!response.ok) {
      throw new Error('Sign-up request failed');
    }

    // Assuming the response contains user data (id, name, username, email, role)
    return await response.json(); // Adjust this based on your API's response format
  } catch (error) {
    console.error('Sign-up error:', error);
    throw error;
  }
};

