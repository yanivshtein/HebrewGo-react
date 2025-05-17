// ✅ Progress.jsx (updated to fetch progress from MongoDB)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lvl0 from '../images/lvl0.png'; 
import lvl1 from '../images/lvl1.png';
import lvl2 from '../images/lvl2.png';
import lvl3 from '../images/lvl3.png';

function Progress() {
  const MAX_QUESTIONS = 20;
  const [selectedLang, setSelectedLang] = useState('us');
  const [progress, setProgress] = useState({});
  const navigate = useNavigate();
  

  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${userName}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('📦 Progress from DB:', data.progress); // בדיקה
        if (data.progress) {
          setProgress(data.progress);
        }
      });
  }, [selectedLang]);

  const easy = progress[selectedLang]?.easy?.length || 0;
  const medium = progress[selectedLang]?.medium?.length || 0;
  const hard = progress[selectedLang]?.hard?.length || 0;

  const falafels = easy + medium + hard; 


  const easyDone = easy >= MAX_QUESTIONS;
  const mediumDone = medium >= MAX_QUESTIONS;
  const hardDone = hard >= MAX_QUESTIONS;

  let levelImage = lvl0;
  if (easyDone && !mediumDone) levelImage = lvl1;
  else if (easyDone && mediumDone && !hardDone) levelImage = lvl2;
  else if (easyDone && mediumDone && hardDone) levelImage = lvl3;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white p-6" dir="rtl">
      {/* בורר שפה */}
      <div className="flex justify-center mb-4">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800"
        >
          <option value="us">אנגלית</option>
          <option value="es">ספרדית</option>
          <option value="ru">רוסית</option>
        </select>
      </div>

      {/* תמונה של הרמה */}
      <div className="flex justify-center mb-6">
        <img src={levelImage} alt="רמת שחקן" className="w-48 h-auto rounded shadow-lg" />
      </div>

      <h1 className="text-2xl font-bold text-center mb-4">התקדמות שלך ({selectedLang.toUpperCase()})</h1>

      {/* סטטיסטיקה */}
      <div className="text-lg text-right space-y-2 max-w-md mx-auto text-gray-600 dark:text-gray-300 opacity-80">
        <p className="text-xl font-bold text-right">שלום, {userName} 👋</p>
        <p>🔰 קל: {easy} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - easy})</p>
        <p>⚔️ בינוני: {medium} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - medium})</p>
        <p>🔥 קשה: {hard} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - hard})</p>
        <p>🥙 פלאפלים שנאספו: {falafels}</p>
      </div>

      {/* כפתור חזרה לדף הבית */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← חזרה לדף הבית
        </button>
      </div>
    </div>
  );
}

export default Progress;
