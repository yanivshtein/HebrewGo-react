// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import flags from 'emoji-flags';


function Settings() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lang, setLang] = useState('us');
  const [difficulty, setDifficulty] = useState('easy');

  // טען נתונים מ-localStorage אם קיימים
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedLang = localStorage.getItem('userLang');
    const storedDifficulty = localStorage.getItem('userDifficulty');
    if (storedName) setName(storedName);
    if (storedLang) setLang(storedLang);
    if (storedDifficulty) setDifficulty(storedDifficulty);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('userName', name);
    localStorage.setItem('userLang', lang);
    localStorage.setItem('userDifficulty', difficulty);
    console.log('שם משתמש:', name);
    console.log('שפה:', lang);
    console.log('רמת קושי:', difficulty);
    alert('ההגדרות נשמרו בהצלחה!');
    navigate('/');
  };

  const clearStorage = () => {
  localStorage.clear();
  alert("🧹 כל הנתונים נמחקו!");
  navigate('/');
};


  return (
    <div dir="rtl" className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen p-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto flex flex-col space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-slate-300 dark:bg-slate-700 p-4 rounded-lg shadow">
          <button onClick={() => navigate('/')} className="text-xl font-semibold hover:underline">
            ← חזרה לעמוד ראשי
          </button>
        </header>

        <main className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow text-lg">
          <h1 className="text-2xl font-bold text-center mb-6">הגדרות</h1>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">שם</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded text-right bg-white dark:bg-gray-700"
              placeholder="הקלד את שמך"
            />
          </div>

          {/* Language */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">בחר שפה</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700"
            >
              <option value="us">English</option>
              <option value="es">Español</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">בחר רמת קושי</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700"
            >
              <option value="easy">קל</option>
              <option value="medium">בינוני</option>
              <option value="hard">קשה</option>
            </select>
          </div>

          <button
            onClick={saveSettings}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            שמור הגדרות
          </button>
          <button
            onClick={clearStorage}
            className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
          נקה נתונים ואפס משחק
          </button>



        </main>
      </div>
    </div>
  );
}

export default Settings;
