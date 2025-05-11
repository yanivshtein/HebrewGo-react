import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from './questions.json';

import ball0 from '../images/ball0.png';
import ball1 from '../images/ball1.png';
import ball2 from '../images/ball2.png';
import ball3 from '../images/ball3.png';
import ball4 from '../images/ball4.png';
import ball5 from '../images/ball5.png';
import ball6 from '../images/ball6.png';
import ball7 from '../images/ball7.png';
import ball8 from '../images/ball8.png';
import ball9 from '../images/ball9.png';
import ball10 from '../images/ball10.png';

function Questions() {
  const MAX_QUESTIONS = 10;
  const MAX_QUESTIONS_PER_CATEGORY = 20;
  const navigate = useNavigate();

  const lang = localStorage.getItem('userLang');
  const difficulty = localStorage.getItem('userDifficulty');
  const questionsList = questionsData[lang][difficulty];
  const storageKey = `correct_${lang}_${difficulty}`;

  const [locked, setLocked] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [time, setTime] = useState(30);
  const [toast, setToast] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [correctIndexes, setCorrectIndexes] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setSeen(new Set());
  }, [lang, difficulty]);

  const currentNumber = seen.size;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (!locked) {
            setLocked(true);
            setToast({ message: '❌ תם הזמן!', type: 'error' });
            setTimeout(() => {
              setToast(null);
              loadNextQuestion();
              setLocked(false);
            }, 1000);
          }
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [questionIndex, locked]);

  const getNextQuestionIndex = () => {
    const correctSet = new Set(correctIndexes);
    if (seen.size >= MAX_QUESTIONS) return null;

    let index, attempts = 0;
    do {
      index = Math.floor(Math.random() * questionsList.length);
      attempts++;
      if (attempts > 1000) return null;
    } while (correctSet.has(index) || seen.has(index));

    return index;
  };

  const loadNextQuestion = () => {
    if (correctIndexes.length === MAX_QUESTIONS_PER_CATEGORY) {
      const restart = window.confirm(
        "✔️ סיימת את כל השאלות בקטגוריה הזאת!\n\n" +
        "האם תרצה להתחיל את השלב מחדש?\n\n" +
        "שים לב: אם תבחר להתחיל מחדש, ההתקדמות שלך תימחק."
      );

      if (restart) {
        localStorage.removeItem(storageKey);
        window.location.reload();
      } else {
        navigate('/');
      }
      return;
    }

    const nextIndex = getNextQuestionIndex();
    if (nextIndex === null) {
      setShowEndModal(true);
    } else {
      setSeen((prev) => new Set(prev).add(nextIndex));
      setQuestionIndex(nextIndex);
      setSelected(null);
      setShowHint(false);
      setTime(30);
    }
  };

  useEffect(() => {
    loadNextQuestion();
  }, []);

  const handleAnswerClick = (idx) => {
    if (selected !== null) return;
    setSelected(idx);

    if (idx === question.correct) {
      setCorrectCount((c) => c + 1);
      setCorrectIndexes((prev) => {
        const updated = [...prev, questionIndex];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });
      setToast({ message: '✅ תשובה נכונה!', type: 'success' });
    } else {
      setToast({ message: '❌ תשובה שגויה!', type: 'error' });
    }

    setTimeout(() => {
      setToast(null);
      loadNextQuestion();
    }, 1500);
  };

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  const getResultImage = () => {
    return [
      ball0, ball1, ball2, ball3, ball4,
      ball5, ball6, ball7, ball8, ball9, ball10
    ][correctCount] || ball0;
  };

  if (questionIndex === null) return <div className="p-4">טוען שאלה...</div>;
  const question = questionsList[questionIndex];

  return (
    <div dir="rtl" className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className={`relative z-10 ${showEndModal ? 'pointer-events-none filter blur-sm' : ''}`}>
        <div className="max-w-4xl mx-auto flex flex-col p-4 space-y-4">

          {/* Header */}
          <header className="flex flex-row-reverse justify-between items-center bg-slate-300 dark:bg-slate-700 p-4 rounded-lg shadow">
            <button onClick={() => navigate('/')} className="text-xl font-semibold hover:underline">← חזרה לעמוד ראשי</button>
            <div className="flex items-center mx-3 gap-2">
              <span className="text-base font-semibold text-gray-700 dark:text-gray-300">שאלה</span>
              <span className="bg-blue-500 text-white rounded-full px-3 py-1 shadow-md">{currentNumber}</span>
            </div>
            <div className="bg-white py-1 px-3 rounded shadow dark:bg-gray-100">
              <span className={time <= 5 ? 'text-red-600 font-bold' : 'text-blue-600'}>
                {formatTime(time)}
              </span>
            </div>
          </header>

          {/* Question Section */}
          <main className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow text-lg flex-grow">
            <h2 className="text-2xl font-bold mb-4 text-right">{question.question}</h2>

            <ul className="space-y-2 text-right list-none p-0 m-0">
              {question.answers.map((ans, idx) => {
                const isCorrect = idx === question.correct;
                const isSelected = idx === selected;
                let bg = "bg-white dark:bg-gray-600";
                if (selected !== null) {
                  if (isSelected && isCorrect) bg = "bg-green-400";
                  else if (isSelected && !isCorrect) bg = "bg-red-400";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(idx)}
                    className={`w-full text-right p-3 rounded cursor-pointer hover:bg-blue-100 ${bg}`}
                  >
                    {ans}
                  </button>
                );
              })}
            </ul>

            {/* Hint + Falafel Row */}
            <div className="mt-6 flex items-center justify-between">
              <button
                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                onClick={() => setShowHint(true)}
              >
                הצג רמז
              </button>
              <div className="text-lg text-gray-700 dark:text-gray-200 flex items-center gap-1">
                <span>{correctCount}</span>
                <span className="text-xl"> X 🧆 </span>
              </div>
            </div>

            {/* Hint Text */}
            {showHint && (
              <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900 rounded text-right">
                💡 {question.hint}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-xl text-lg transition-opacity duration-300 z-50
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}

      {/* End Game Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-md">
            <img src={getResultImage()} alt="תוצאה" className="w-32 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">סיימת את המשחק!</h2>
            <p className="text-lg mb-4">צברת {correctCount} פלאפלים 🧆</p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              חזרה לעמוד הראשי
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Questions;
