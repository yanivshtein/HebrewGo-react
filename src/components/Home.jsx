import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div dir="rtl" className="w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-6 p-4">


        {/* לוגו */}
        <img src={logo} alt="Hebrew Go Logo" className="h-40" />

        {/* כפתורי ניווט */}
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">בית</button>
          <button onClick={() => navigate('/questions')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">שאלון</button>
          <button onClick={() => navigate('/settings')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">הגדרות</button>
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">התחברות</button>
        </div>

        {/* טקסט ברוכים הבאים */}
        <p className="text-lg">🎓 ברוכים הבאים לאפליקציית הלמידה <strong>Hebrew Go</strong></p>
        <p>התחילו את המסע שלכם על ידי מעבר למסך ההגדרות או התחברות למערכת.</p>
      </div>
    </div>
  );
}

export default Home;
