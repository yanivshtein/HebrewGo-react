import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from './questions.json';

function Questions() {
  const navigate = useNavigate();
  const lang = 'us';
  const difficulty = 'easy';
  const questionsList = questionsData[lang][difficulty];

  const [questionIndex, setQuestionIndex] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [time, setTime] = useState(0);
  const [toast, setToast] = useState(null); // ✅ טוסט

  useEffect(() => {
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const getNextQuestionIndex = () => {
    if (seen.size >= questionsList.length) return null;
    let index;
    do {
      index = Math.floor(Math.random() * questionsList.length);
    } while (seen.has(index));
    return index;
  };

  const loadNextQuestion = () => {
    const nextIndex = getNextQuestionIndex();
    if (nextIndex === null) {
      alert(`סיימת את כל השאלות! צברת ${correctCount} פלאפלים 🧆`);
      navigate('/');
    } else {
      setSeen((prev) => new Set(prev).add(nextIndex));
      setQuestionIndex(nextIndex);
      setSelected(null);
      setShowHint(false);
    }
  };

  useEffect(() => {
    loadNextQuestion();
  }, []);

  if (questionIndex === null) return <div className="p-4">טוען שאלה...</div>;
  const question = questionsList[questionIndex];

  const handleAnswerClick = (idx) => {
    if (selected !== null) return;

    setSelected(idx);

    if (idx === question.correct) {
      setCorrectCount((c) => c + 1);
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

  return (
    <div dir="rtl" className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col p-4 space-y-4">
        
        {/* Header */}
        <header className="flex flex-row-reverse justify-between items-center bg-slate-300 dark:bg-slate-700 p-4 rounded-lg shadow">
          <button onClick={() => navigate('/')} className="text-xl font-semibold hover:underline">← חזרה לעמוד ראשי</button>
          <div className="bg-white text-blue-600 py-1 px-3 rounded shadow dark:bg-gray-100">
            {formatTime(time)}
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

          {/* Hint button */}
          <button
            className="mt-6 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
            onClick={() => setShowHint(true)}
          >
            הצג רמז
          </button>
          {showHint && (
            <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900 rounded text-right">
              💡 {question.hint}
            </div>
          )}

          {/* Next button (לא נדרש כי יש מעבר אוטומטי) */}
        </main>

        {/* Falafel counter */}
        <footer className="text-right text-lg mt-4">
          סך הכל פלאפלים שצברת: {correctCount} 🧆
        </footer>
      </div>

      {/* Toast הודעה */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-xl text-lg transition-opacity duration-300 z-50
            ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Questions;
