// src/components/Progress.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import lvl0 from '../images/lvl0.png';
import lvl1 from '../images/lvl1.png';
import lvl2 from '../images/lvl2.png';
import lvl3 from '../images/lvl3.png';

import lvl0girl from '../images/lvl0girl.png';
import lvl1girl from '../images/lvl1girl.png';
import lvl2girl from '../images/lvl2girl.png';
import lvl3girl from '../images/lvl3girl.png';

function Progress() {
  const MAX_QUESTIONS = 20;
  const [selectedLang, setSelectedLang] = useState('us');
  const [progress, setProgress] = useState({});
  const [gender, setGender] = useState('other');
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${userName}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('📦 Progress from DB:', data.progress);
        if (data.progress) {
          setProgress(data.progress);
        }
        if (data.gender) {
          setGender(data.gender);
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

  let levelImage;

  if (gender === 'female') {
    if (easyDone && mediumDone && hardDone) levelImage = lvl3girl;
    else if (easyDone && mediumDone) levelImage = lvl2girl;
    else if (easyDone) levelImage = lvl1girl;
    else levelImage = lvl0girl;
  } else {
    if (easyDone && mediumDone && hardDone) levelImage = lvl3;
    else if (easyDone && mediumDone) levelImage = lvl2;
    else if (easyDone) levelImage = lvl1;
    else levelImage = lvl0;
  }

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

      {/* תמונת רמה לפי מין */}
      <div className="flex justify-center mb-6">
        <img src={levelImage} alt="רמת שחקן" className="w-48 h-auto rounded shadow-lg" />
      </div>

      {/* כותרת */}
      <h1 className="text-2xl font-bold text-center mb-4">
        ההתקדמות שלך ({selectedLang.toUpperCase()})
      </h1>

      {/* נתוני סטטיסטיקה */}
      <div className="text-lg text-right space-y-2 max-w-md mx-auto text-gray-600 dark:text-gray-300 opacity-80">
        <p className="text-xl font-bold text-right">
          {gender === 'female' ? 'ברוכה הבאה' : 'ברוך הבא'}, {userName} 👋
        </p>
        <p>🔰 קל: {easy} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - easy})</p>
        <p>⚔️ בינוני: {medium} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - medium})</p>
        <p>🔥 קשה: {hard} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - hard})</p>
        <p>🥙 פלאפלים שנאספו: {falafels}</p>
      </div>

      {/* כפתור חזרה */}
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
