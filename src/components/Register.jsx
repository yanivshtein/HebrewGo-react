// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('other');
  const [lang, setLang] = useState('us');
  const navigate = useNavigate();

  const defaultProgress = {
    us: { easy: [], medium: [], hard: [] },
    es: { easy: [], medium: [], hard: [] },
    ru: { easy: [], medium: [], hard: [] }
  };

  const handleRegister = async () => {
    if (!userName || !password) {
      alert('אנא מלא שם משתמש וסיסמה.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          password,
          gender,
          progress: defaultProgress
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`שגיאה בהרשמה: ${data.error || res.statusText}`);
      } else {
        alert('✅ נרשמת בהצלחה!');
        localStorage.setItem('userName', userName);
        localStorage.setItem('userLang', lang);
        localStorage.setItem('userDifficulty', 'easy'); // ברירת מחדל
        navigate('/placement');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('שגיאה בשרת.');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md transition-colors duration-300">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          הרשמה
        </h1>

        <div className="space-y-5">

          <div>
            <label className="block mb-1">שם משתמש</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1">מין</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">שפה מועדפת</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="us">English</option>
              <option value="es">Español</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            הירשם
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 text-sm text-blue-600 hover:underline text-center"
          >
            כבר יש לי משתמש ← התחבר
          </button>

        </div>
      </div>
    </div>
  );
}

export default Register;
