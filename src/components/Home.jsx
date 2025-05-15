import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.activeElement.blur();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div dir="rtl" tabIndex={-1} className="w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-6 p-4">

        {/* לוגו */}
        <img src={logo} alt="Hebrew Go Logo" className="h-80" />

        {/* כפתורי ניווט */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/questions')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            התחל משחק
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            הגדרות
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            צפייה בהתקדמות
          </button>

          {/* התחברות */}
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            התחברות
          </button>
        </div>

        {/* טקסט ברוכים הבאים */}
        <p className="text-lg">
          🎓 ברוכים הבאים לאפליקציית הלמידה <strong>Hebrew Go</strong>
        </p>
        <p>כדי להתחיל, אנא התחבר במסך ההתחברות והזינו את שם המשתמש והרשומות הרצויות.</p>
      </div>
    </div>
  );
}

export default Home;
