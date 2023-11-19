import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  '../styles/registrationPage.css';
import { NavLink, Link } from "react-router-dom";
import {Button} from 'react-bootstrap'

function RegistrationPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const baseURL =  process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate(); // Access the navigation function

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const newUser = { ...formData };

  async function handleSubmit (event)  {
    event.preventDefault();
    // You can add your authentication logic here.
    // Typically, you would send a POST request to your server to validate the user's credentials.
    // For this example, let's assume a successful login redirects to a dashboard page.
    // You should replace this with your actual authentication logic.
    const registrationURL = baseURL + "/register"
    await fetch(registrationURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
      .catch(error => {
        window.alert(error);
        return;
      });
      

 
  };

  return (

    <body id="login-page">
      <div className="login-page">
            <h2 className="text-white">Inventory Management System Sign Up</h2>
      <form className="login-container"  onSubmit={handleSubmit}>
      <h2><b>Register</b></h2>
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
        <div className="form-group" style={{paddingBottom:50}}>
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
        <Button type="submit" className="login-button">Sign Up</Button>
        <p className="register-text">
        Already have an account?{' '}
          <Link to="/login">Login here</Link>
        </p>
      </form>
      </div>
    </body>
  );
}

export default RegistrationPage;