import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Particle from './particle';
import { siteConfig } from './siteConfig';
const Signing = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '', 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const toggleVisibility = () => setIsVisible(!isVisible);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignUp ? siteConfig.links.signup: siteConfig.links.signin;

    const requestBody = isSignUp
      ? {
          username: formData.username,
          
          email: formData.email,
          
          password: formData.password,
        }
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      if (data.token) {
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('words', JSON.stringify(data.words));
        localStorage.setItem('units', JSON.stringify(data.units));
        localStorage.setItem('lang', 'eng');
        navigate('/dashboard'); // Using react-router-dom for redirection
      }

      if (isSignUp) setIsSignUp(!isSignUp);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen ">
        <Particle/>
      <div className="flex flex-col w-[90%] h-fit max-w-md p-5 mx-auto shadow-lg border rounded-lg backdrop-blur-md">
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" className="m-3" alt="Logo" width={50} height={50} />
          <h2 className="text-yellow-500">
            MY  <span className="text-cyan-500">WORDS</span>
          </h2>
          <div className="flex space-x-2 mt-4">
            <button
              className={`px-4 py-2 ${isSignUp ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setIsSignUp(true)}
              disabled={isSignUp}
            >
              Sign Up
            </button>
            <button
              className={`px-4 py-2 ${!isSignUp ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setIsSignUp(false)}
              disabled={!isSignUp}
            >
              Sign In
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-center">{error}</div>}
          {isSignUp ? (
            <>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type={isVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                className="text-sm text-blue-500"
                onClick={toggleVisibility}
              >
                {isVisible ? 'Hide Password' : 'Show Password'}
              </button>
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type={isVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                className="text-sm text-blue-500"
                onClick={toggleVisibility}
              >
                {isVisible ? 'Hide Password' : 'Show Password'}
              </button>
            </>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signing;
