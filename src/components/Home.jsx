import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import wavingFlagGif from '../images/waving_flag.gif';

function Home() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    document.activeElement.blur();
    
    // Prevent zoom with keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault();
      }
    };

    // Prevent zoom with mouse wheel
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleWheel, { passive: false });

    // Set the page scale to 90%
    document.body.style.zoom = '90%';
    document.body.style.transform = 'scale(0.9)';
    document.body.style.transformOrigin = 'top left';
    document.body.style.width = '111.11%'; // Compensate for the 90% scale

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      // Reset zoom when component unmounts
      document.body.style.zoom = '';
      document.body.style.transform = '';
      document.body.style.transformOrigin = '';
      document.body.style.width = '';
    };
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
    <div className="min-h-screen relative overflow-hidden flex justify-center bg-white">
      
      {/* Left side GIF */}
      <div className="fixed top-0 left-0 w-1/2 h-full z-0">
        <img
          src={wavingFlagGif}
          alt="Background animation left"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Right side GIF with delay and flipped */}
      <div className="fixed top-0 right-0 w-1/2 h-full z-0">
        <img
          src={wavingFlagGif}
          alt="Background animation right"
          className="w-full h-full object-cover"
          style={{ animationDelay: '5s', transform: 'scaleX(-1)' }}
        />
      </div>

      {/* Central panel */}
      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
        
        {/* Logo */}
        <img src={logo} alt="Hebrew Go Logo" className="h-80" />
        
        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {localStorage.getItem('userName') ? (
            <>
              <button onClick={() => navigate('/questions')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                התחל משחק
              </button>
              <button onClick={() => navigate('/progress')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                צפייה בהתקדמות
              </button>
              <button onClick={() => navigate('/settings')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                הגדרות
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
                התנתק
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">
              התחברות
            </button>
          )}
        </div>
        
        <p className="text-lg mt-6">
          🎓 ברוכים הבאים לאפליקציית הלמידה <strong>Hebrew Go</strong>
        </p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg text-lg z-50 transition-opacity duration-300">
          התנתקת בהצלחה!
        </div>
      )}
    </div>
  );
}

export default Home;