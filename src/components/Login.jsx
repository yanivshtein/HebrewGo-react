// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Default empty progress data (3 langs x 3 difficulties)
  const defaultProgress = {
    us: { easy: [], medium: [], hard: [] },
    es: { easy: [], medium: [], hard: [] },
    ru: { easy: [], medium: [], hard: [] }
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  if (!userName || !password) {
    alert('אנא מלא שם משתמש וסיסמה.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`התחברות נכשלה: ${data.error || res.statusText}`);
    } else {
      // Optionally save token or user data in context/localStorage here
      alert('התחברות הצליחה!');
      navigate('/');
      localStorage.setItem('userName', userName)
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('שגיאה בשרת במהלך התחברות.');
  }
};


  const handleRegister = async () => {
    if (!userName || !password) {
      alert('אנא מלא שם משתמש וסיסמה לפני הרשמה.');
      return;
    }
    setIsRegistering(true);
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password, progress: defaultProgress })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Registration failed: ${data.error || res.statusText}`);
      } else {
        alert('Registration successful!');
        // Optionally auto-login:
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('Server error during registration.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">{isRegistering ? 'הרשמה' : 'התחברות'}</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="userInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">שם משתמש או מייל</label>
            <input
              type="text"
              id="userInput"
              placeholder="הקלד כאן"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="passInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">סיסמה</label>
            <input
              type="password"
              id="passInput"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login & Register side by side */}
          <div className="mt-6 flex space-x-4 rtl:space-x-reverse">
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
            >
              התחבר
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition-colors duration-200"
            >
              הרשמה
            </button>
          </div>
        </form>

        {/* Back to Home button */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            ← חזרה לדף הבית
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
