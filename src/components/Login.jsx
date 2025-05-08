// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with', username, password);
    navigate('/questions');
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2" htmlFor="userInput">Username or Email</label>
        <input
          type="text"
          id="userInput"
          className="w-full p-2 border rounded mb-4"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2" htmlFor="passInput">Password</label>
        <input
          type="password"
          id="passInput"
          className="w-full p-2 border rounded mb-4"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>

        <button
          type="button"
          className="block text-center w-full p-3 mt-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          onClick={() => navigate('/register')}
        >
          Register
        </button>

        <button
          type="button"
          className="block text-right mt-4 text-blue-500 hover:underline"
          onClick={() => alert('Forgot password functionality to be implemented.')}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
}

export default Login;
