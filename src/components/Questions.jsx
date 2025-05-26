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
import correctSound from '../sounds/right_answer.mp3';
import wrongSound from '../sounds/wrong_answer.mp3';



function Questions() {
  const MAX_QUESTIONS = 10;
  const MAX_QUESTIONS_PER_CATEGORY = 20;
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName');
  const lang = localStorage.getItem('userLang');
  const difficulty = localStorage.getItem('userDifficulty');
  const questionsList = questionsData?.[lang]?.[difficulty] || [];
  if (!lang || !difficulty || questionsList.length === 0) {
    return <div className="p-4 text-red-600">לא ניתן לטעון את השאלות. ודא שהשפה והרמה נבחרו כראוי.</div>;
  }

  const [locked, setLocked] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [seenQuestions, setSeenQuestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAutoHint, setShowAutoHint] = useState(false);
  const [time, setTime] = useState(30);
  const [toast, setToast] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [correctIndexes, setCorrectIndexes] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const initialLoadComplete = React.useRef(false);

  useEffect(() => {
    setSeenQuestions([]);
    setCurrentQuestionNumber(1);
    initialLoadComplete.current = false;
  }, [lang, difficulty]);

  useEffect(() => {
    if (!initialLoadComplete.current) {
      fetch(`http://localhost:5000/api/user/${userName}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.progress && data.progress[lang] && data.progress[lang][difficulty]) {
            setCorrectIndexes(data.progress[lang][difficulty]);
            if (data.progress[lang][difficulty].length >= MAX_QUESTIONS_PER_CATEGORY) {
              setShowRestartModal(true);
            }
          }
          setUserLoaded(true);
          initialLoadComplete.current = true;
        });
    }
  }, [difficulty, lang, userName]);

  useEffect(() => {
    if (userLoaded && !showRestartModal && questionIndex === null) {
      loadNextQuestion();
    }
  }, [userLoaded, showRestartModal]);

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
              setShowAutoHint(false);
            }, 1000);
          }
          return 30;
        }
        if (t === 11) {
          setShowAutoHint(true);
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [questionIndex, locked]);

  const getNextQuestionIndex = () => {
    const availableQuestions = [];
    for (let i = 0; i < questionsList.length; i++) {
      if (!seenQuestions.includes(i) && !correctIndexes.includes(i)) {
        availableQuestions.push(i);
      }
    }
    if (availableQuestions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  };

  const saveProgressToDB = (updatedProgress) => {
    fetch('http://localhost:5000/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userName,
        language: lang,
        difficulty,
        progress: {
          [lang]: {
            [difficulty]: updatedProgress,
          },
        },
      }),
    });
  };

  const handleRestart = () => {
    fetch('http://localhost:5000/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userName,
        language: lang,
        difficulty,
        progress: {
          [lang]: {
            [difficulty]: [],
          },
        },
      }),
    }).then(() => {
      setCorrectIndexes([]);
      setSeenQuestions([]);
      setCurrentQuestionNumber(1);
      setShowRestartModal(false);
      loadNextQuestion();
    });
  };

  const loadNextQuestion = () => {
    if (currentQuestionNumber > MAX_QUESTIONS) {
      setShowEndModal(true);
      return;
    }
    if (correctIndexes.length >= MAX_QUESTIONS_PER_CATEGORY) {
      setShowRestartModal(true);
      return;
    }
    const nextIndex = getNextQuestionIndex();
    if (nextIndex === null) {
      setSeenQuestions([]);
      setShowEndModal(true);
    } else {
      setSeenQuestions(prev => [...prev, nextIndex]);
      setQuestionIndex(nextIndex);
      setSelected(null);
      setShowHint(false);
      setShowAutoHint(false);
      setTime(30);
    }
  };

  const handleAnswerClick = (idx) => {
    if (selected !== null || locked) return;
    setSelected(idx);
    setLocked(true);

    const correctAudio = new Audio(correctSound);
    const wrongAudio = new Audio(wrongSound);

    if (idx === question.correct) {
      correctAudio.play();
      if (!correctIndexes.includes(questionIndex)) {
        const updated = [...correctIndexes, questionIndex];
        setCorrectIndexes(updated);
        saveProgressToDB(updated);
      }
      setCorrectCount((c) => c + 1);
      setToast({ message: '✅ תשובה נכונה!', type: 'success' });
    } else {
      wrongAudio.play();
      setToast({ message: '❌ תשובה שגויה!', type: 'error' });
    }

    setTimeout(() => {
      setToast(null);
      const isLastQuestion = currentQuestionNumber >= MAX_QUESTIONS;
      setCurrentQuestionNumber(prev => prev + 1);
      if (isLastQuestion) {
        setShowEndModal(true);
      } else {
        loadNextQuestion();
      }
      setLocked(false);
    }, 1500);
  };

  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  const getResultImage = () => {
    return [
      ball0, ball1, ball2, ball3, ball4,
      ball5, ball6, ball7, ball8, ball9, ball10,
    ][correctCount] || ball0;
  };

  if (questionIndex === null && !showRestartModal) return <div className="p-4">טוען שאלה...</div>;
  const question = questionsList[questionIndex] || { question: '', answers: [], hint: '', authohint: '' };

   return (
    <div dir="rtl" className="bg-blue-100 text-black dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className={`relative z-10 ${showEndModal || showRestartModal ? 'pointer-events-none filter blur-sm' : ''}`}>
        <div className="max-w-4xl mx-auto flex flex-col p-4 space-y-4">

          <header className="flex flex-row-reverse justify-between items-center bg-blue-200 dark:bg-blue-950 p-4 rounded-lg shadow">
            <button onClick={() => navigate('/')} className="text-xl font-semibold hover:underline">← חזרה לעמוד ראשי</button>
            <div className="flex items-center mx-3 gap-2">
              <span className="text-base font-semibold text-gray-700 dark:text-gray-300">שאלה</span>
              <span className="bg-blue-500 text-white rounded-full px-3 py-1 shadow-md">{currentQuestionNumber}</span>
            </div>
            <div className="bg-white py-1 px-3 rounded shadow dark:bg-gray-100">
              <span className={time <= 5 ? 'text-red-600 font-bold' : 'text-blue-600'}>
                {formatTime(time)}
              </span>
            </div>
          </header>

          <main className="bg-white/90 dark:bg-gray-800 p-6 rounded-xl shadow-lg text-lg flex-grow transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-right text-blue-800 dark:text-blue-300">{question.question}</h2>

            <ul className="space-y-2 text-right list-none p-0 m-0">
              {question.answers.map((ans, idx) => {
                const isCorrect = idx === question.correct;
                const isSelected = idx === selected;
                let bg = "bg-white dark:bg-gray-600";
                if (selected !== null) {
                  if (isSelected && isCorrect) bg = "bg-green-400";
                  else if (isSelected && !isCorrect) bg = "bg-red-400";
                  else if (isCorrect) bg = "bg-green-400";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(idx)}
                    disabled={selected !== null || locked}
                    className={`w-full text-right p-3 rounded-lg border shadow hover:bg-blue-100 ${bg} ${(selected !== null || locked) ? 'cursor-not-allowed' : ''}`}
                  >
                    {ans}
                  </button>
                );
              })}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <button
                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                onClick={() => setShowHint(true)}
                disabled={locked}
              >
                הצג רמז
              </button>
            </div>

            {showHint && (
              <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900 rounded text-right">
                💡 {question.hint}
              </div>
            )}

            {showAutoHint && question.authohint && (
              <div className="mt-2 p-3 bg-blue-100 dark:bg-blue-900 rounded text-right animate-pulse">
                🤖 {question.authohint}
              </div>
            )}
          </main>

          <footer className="text-right text-lg mt-4">
            סך כל הפלאפלים שצברת: {correctCount} 🧆
          </footer>
        </div>
      </div>

      {/* toast, modals וכו' נשארים כמו שהם */}
    </div>
  );
}

export default Questions;
