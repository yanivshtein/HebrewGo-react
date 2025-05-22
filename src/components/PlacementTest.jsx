// src/components/PlacementTest.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from './placementQuestions.json';

function PlacementTest() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const navigate = useNavigate();
  const userLang = localStorage.getItem('userLang') || 'us';
  const userName = localStorage.getItem('userName');
  const testQuestions = questionsData[userLang]?.easy || [];

  const handleAnswer = (index) => {
    setSelected(index);
    if (index === testQuestions[current].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowHint(false);
    if (current + 1 < testQuestions.length) {
      setCurrent(current + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setCompleted(true);
    let difficulty = 'easy';
    if (score == 5) difficulty = 'hard';
    else if (score >= 3) difficulty = 'medium';

    localStorage.setItem('userDifficulty', difficulty);

    try {
      await fetch(`http://localhost:5000/api/user/${userName}/difficulty`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang: userLang, difficulty })
      });
    } catch (err) {
      console.error('Error saving difficulty:', err);
    }

    setTimeout(() => navigate('/'), 2000);
  };

  if (!userName) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-600">
        <p>אנא התחבר לפני תחילת המבחן.</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h1 className="text-2xl font-bold">מבחן רמת התחלה - {userLang.toUpperCase()}</h1>

        {!completed ? (
          <>
            <p className="text-lg">שאלה {current + 1} מתוך {testQuestions.length}</p>
            <p className="text-xl font-semibold">{testQuestions[current].question}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {testQuestions[current].answers.map((ans, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`p-3 rounded border text-right hover:bg-blue-100 dark:hover:bg-gray-700 transition ${
                    selected === i
                      ? i === testQuestions[current].correct
                        ? 'bg-green-200 dark:bg-green-700'
                        : 'bg-red-200 dark:bg-red-700'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {ans}
                </button>
              ))}
            </div>

            {selected !== null && (
              <>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="mt-4 px-4 py-2 bg-yellow-300 rounded hover:bg-yellow-400"
                >
                  {showHint ? 'הסתר רמז' : 'הצג רמז'}
                </button>
                {showHint && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">💡 {testQuestions[current].hint}</p>}

                <button
                  onClick={nextQuestion}
                  className="block mx-auto mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  לשאלה הבאה →
                </button>
              </>
            )}
          </>
        ) : (
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            סיימת את המבחן! רמתך הנוכחית: {score >= 15 ? 'קשה' : score >= 8 ? 'בינוני' : 'קל'}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacementTest;
