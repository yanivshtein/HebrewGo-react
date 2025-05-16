import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

function Home() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.activeElement.blur();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userLang');
    localStorage.removeItem('userDifficulty');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/');
    }, 2500); // מציג את הטוסט ל-2.5 שניות ואז מנווט
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 relative">
      <div dir="rtl" tabIndex={-1} className="w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-6 p-4">

        {/* לוגו */}
        <img src={logo} alt="Hebrew Go Logo" className="h-80" />

        {/* כפתורי ניווט */}
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/questions')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            התחל משחק
          </button>
          <button onClick={() => navigate('/settings')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            הגדרות
          </button>
          <button onClick={() => navigate('/progress')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            צפייה בהתקדמות
          </button>
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            התחברות
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
            התנתק
          </button>
        </div>

        <p className="text-lg">
          🎓 ברוכים הבאים לאפליקציית הלמידה <strong>Hebrew Go</strong>
        </p>
        <p>כדי להתחיל, אנא התחבר במסך ההתחברות והזינו את שם המשתמש והרשומות הרצויות.</p>
      </div>

      {/* ✅ טוסט הודעה */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg text-lg z-50 transition-opacity duration-300">
          התנתקת בהצלחה!
        </div>
      )}
    </div>
  );
}

export default Home;
