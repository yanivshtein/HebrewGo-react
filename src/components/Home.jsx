import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

function Home() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const userName = localStorage.getItem('userName');
  const userGender = localStorage.getItem('userGender'); 
  const welcomeMessage = userGender === 'female' ? 'ברוכה הבאה' : 'ברוך הבא';


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
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full bg-blue-100 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 flex items-center justify-center">
      <div
        dir="rtl"
        className="w-full max-w-4xl px-6 py-6 flex flex-col items-center text-center space-y-6"
      >
        {/* לוגו מוקטן מעט */}
        <img
          src={logo}
          alt="Hebrew Go Logo"
          className="h-60 sm:h-64 md:h-72 bg-white p-4 rounded-xl shadow-lg transition-transform duration-500 hover:scale-105"
/>

    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
      {userName ? (
    <>
      {welcomeMessage} <span className=" dark:text-blue-400">{userName} 🎓</span>
    </>
  ) : (
    <>
      ברוך הבא ל־<span className="text-blue-700 dark:text-blue-400">Hebrew Go 🎓</span>
    </>
  )}
    </p>


        {/* כפתורים */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {localStorage.getItem('userName') ? (
            <>
              <button
                onClick={() => navigate('/progress')}
                className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                📊 צפייה בהתקדמות
              </button>
              <button
                onClick={() => navigate('/questions')}
                className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                🚀 התחל משחק
              </button>
              <button
                onClick={handleLogout}
                className="w-full h-16 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                🔒 התנתק
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="w-full h-16 bg-yellow-400 hover:bg-yellow-500 text-white text-lg font-semibold rounded-xl shadow-md transition-all"
              >
                ⚙️ הגדרות
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white text-lg font-semibold rounded-xl shadow-md transition-all col-span-1 sm:col-span-2"
            >
              🔑 התחברות
            </button>
          )}
        </div>
      </div>

      {/* טוסט הודעה */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg text-lg z-50">
          ✅ התנתקת בהצלחה!
        </div>
      )}
    </div>
  );
}

export default Home;
