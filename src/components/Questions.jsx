import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from './questions.json';

function Questions() {
  const navigate = useNavigate();

  // קריאת הגדרות מה-localStorage עם ברירת מחדל
  const name = localStorage.getItem('userName') || 'אורח';
  const lang = localStorage.getItem('userLang') || 'us';
  const difficulty = localStorage.getItem('userDifficulty') || 'easy';
  const questionsList = questionsData[lang][difficulty];

  const [questionIndex, setQuestionIndex] = useState(null);
  const [seen, setSeen] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showAutoHint, setShowAutoHint] = useState(false);
  const [showHintButton, setShowHintButton] = useState(false);
  const [removedAnswers, setRemovedAnswers] = useState([]);
  const [time, setTime] = useState(30);
  const [toast, setToast] = useState(null);

  const generateHintIndexes = (correctIdx, total) => {
    const all = [...Array(total).keys()];
    all.splice(correctIdx, 1);
    return all.sort(() => 0.5 - Math.random()).slice(0, 2);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        if (t === 1) {
          clearInterval(interval);
          setToast(null);
          loadNextQuestion();
        } else if (t === 11 && !showAutoHint) {
          setShowAutoHint(true);
          setToast({ message: '💡 קבל רמז על חשבון משרד הקליטה!', type: 'info' });
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questionIndex]);

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
      const finalCount = selected === questionsList[questionIndex].correct ? correctCount + 1 : correctCount;
      alert(`סיימת את כל השאלות! צברת ${finalCount} פלאפלים 🧆`);
      navigate('/');
      return;
    } else {
      setSeen((prev) => new Set(prev).add(nextIndex));
      setQuestionIndex(nextIndex);
      setSelected(null);
      setShowAutoHint(false);
      setShowHintButton(false);
      setRemovedAnswers([]);
      setTime(30);
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

  const translateLanguage = (code) => {
    switch (code) {
      case 'us': return 'אנגלית';
      case 'es': return 'ספרדית';
      case 'ru': return 'רוסית';
      default: return code;
    }
  };

  const translateDifficulty = (level) => {
    switch (level) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      default: return level;
    }
  };

  return (
    <div dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col p-4 space-y-4">

        {/* Header */}
        <header className="flex flex-row-reverse justify-between items-center bg-slate-300 dark:bg-slate-700 p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-xl font-semibold hover:underline">
              חזור לעמוד הבית
            </button>
            <span className="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-200">!Hebrew Go</span>
          </div>
          <div className="bg-white text-blue-600 py-1 px-3 rounded shadow dark:bg-gray-100">
            {formatTime(time)}
          </div>
        </header>

        {/* Question Section */}
        <main className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow text-lg flex-grow">

          {/* ברכה אישית */}
          <h2 className="text-xl text-right mb-4">
            שלום {name}, רמת קושי: {translateDifficulty(difficulty)} | שפה: {translateLanguage(lang)}
          </h2>

          <h2 className="text-2xl font-bold mb-4 text-right">{question.question}</h2>

          <ul className="space-y-2 text-right list-none p-0 m-0">
            {question.answers.map((ans, idx) => {
              if (removedAnswers.includes(idx)) return null;

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

          {/* Hint Button */}
          {!showHintButton && (
            <button
              className="mt-6 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
              onClick={() => {
                setShowHintButton(true);
                const toRemove = generateHintIndexes(question.correct, question.answers.length);
                setRemovedAnswers(toRemove);
              }}
            >
              הצג רמז
            </button>
          )}

          {/* Auto Hint */}
          {showAutoHint && (
            <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900 rounded text-right">
              💡 {question.hint}
            </div>
          )}
        </main>

        {/* Falafel Counter */}
        <footer className="text-right text-lg mt-4">
          סך הכל פלאפלים שצברת: {correctCount} 🧆
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-xl text-lg z-50 animate-toast
            ${toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Questions;
