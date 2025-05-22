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
  const [trueLevel, setTrueLevel] = useState('easy'); // Real difficulty level
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${userName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.progress) setProgress(data.progress);
        if (data.gender) setGender(data.gender);
      });

    // Load real difficulty level from localStorage
    const storedLevel = localStorage.getItem('userDifficulty') || 'easy';
    setTrueLevel(storedLevel);
  }, [selectedLang]);

  const levelLabels = {
    easy: 'קל',
    medium: 'בינוני',
    hard: 'קשה',
  };

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

  const getPercent = (val) => `${(val / MAX_QUESTIONS) * 100}%`;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white p-6" dir="rtl">
      
      {/* Level Image with real level text */}
      <div className="flex flex-col items-center mb-6">
        <img src={levelImage} alt="רמת שחקן" className="w-48 h-auto rounded-full border-4 border-blue-300 shadow-xl" />
        <p className="text-xl mt-1 font-bold text-indigo-700 dark:text-indigo-300">
          הרמה הנבחרה היא: {levelLabels[trueLevel]}
        </p>
      </div>

      {/* Title */}
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-6">
        {gender === 'female' ? 'ברוכה הבאה' : 'ברוך הבא'}, {userName} 👋
      </p>

      {/* Progress cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Easy */}
        <div className="p-4 bg-green-100 dark:bg-green-800 rounded shadow text-center">
          <p className="font-bold text-lg">🔰 קל</p>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mt-2">
            <div className="h-3 bg-green-500 rounded" style={{ width: getPercent(easy) }}></div>
          </div>
          <p className="mt-2">{easy} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - easy})</p>
        </div>

        {/* Medium */}
        <div className="p-4 bg-yellow-100 dark:bg-yellow-700 rounded shadow text-center">
          <p className="font-bold text-lg">⚔️ בינוני</p>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mt-2">
            <div className="h-3 bg-yellow-500 rounded" style={{ width: getPercent(medium) }}></div>
          </div>
          <p className="mt-2">{medium} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - medium})</p>
        </div>

        {/* Hard */}
        <div className="p-4 bg-red-100 dark:bg-red-700 rounded shadow text-center">
          <p className="font-bold text-lg">🔥 קשה</p>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mt-2">
            <div className="h-3 bg-red-500 rounded" style={{ width: getPercent(hard) }}></div>
          </div>
          <p className="mt-2">{hard} מתוך {MAX_QUESTIONS} (נותרו {MAX_QUESTIONS - hard})</p>
        </div>
      </div>

      {/* Falafel count */}
      <div className="text-center mt-6 text-lg text-gray-700 dark:text-gray-300">
        🥙 סה"כ פלאפלים שנאספו: <span className="font-bold">{falafels}</span>
      </div>

      {/* All levels complete badge */}
      {easyDone && mediumDone && hardDone && (
        <div className="mt-6 max-w-md mx-auto p-4 bg-green-200 dark:bg-green-700 rounded text-center shadow text-xl font-semibold text-green-900 dark:text-green-100">
          🏆 כל הכבוד! השלמת את כל השלבים!
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center mt-10">
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
