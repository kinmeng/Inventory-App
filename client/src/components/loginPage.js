
import React, { useState } from 'react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import classes from '../styles/loginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Access the navigation functiond  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const baseURL =  process.env.REACT_APP_BASE_URL;

  async function handleSubmit (event) {
    event.preventDefault();

    const baseURL = "http://localhost:5000"
    // You can add your authentication logic here.
    // Typically, you would send a POST request to your server to validate the user's credentials.
   
    try{
        const response = await fetch(`${baseURL}/login`, {
          method: 'POST', // Change the request method to POST
          headers: {
            'Content-Type': 'application/json',// Include the token in the Authorization header
          },
          body: JSON.stringify({ username: formData.username, password: formData.password }), // Send the username and password as JSON data

        });
      
        if (response.ok) {
          const data = await response.json();
          const token = data.token;
    
          // Store the token in localStorage
          localStorage.setItem('token', token);
    
          // Now, make a request to /products/ with the token in the headers
          const productsResponse = await fetch(`${baseURL}/products/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            navigate('/products');
          }

        }
    }



  catch (error) {
    console.error('Error during login:', error);
  }

  };

  return (
<body id="login-page">
    <div className="login-page">
            <h2 className="text-white">Inventory Management System</h2>
            {error && <p className="error-message">{error}</p>}
      <form className="login-container" onSubmit={handleSubmit}>
        <h2><b>Login</b></h2>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <div className="line"></div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="line"></div>
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className="register-text">
        Don't have an account?{' '}
        <Link to="/register">Register here</Link>
      </p>
      </form>
   
    </div>
    </body>
  );
}

export default LoginPage;