import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('us');           // Language state
  const [difficulty, setDifficulty] = useState('easy'); // Difficulty state

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedLang = localStorage.getItem('userLang') || 'us';
    const savedDifficulty = localStorage.getItem('userDifficulty') || 'easy';
    setLang(savedLang);
    setDifficulty(savedDifficulty);
  }, []);

  // Save settings to localStorage and navigate back to home
  const saveSettings = () => {
    localStorage.setItem('userLang', lang);
    localStorage.setItem('userDifficulty', difficulty);
    alert('✅ Settings saved successfully!');
    navigate('/');
  };

  // Clear all saved data from localStorage
  const clearStorage = () => {
    localStorage.clear();
    alert("🧹 All data has been cleared!");
    navigate('/');
  };

  return (
    <div dir="rtl" className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen p-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto flex flex-col space-y-6">
        
        {/* Header with back button */}
        <header className="flex justify-between items-center bg-slate-300 dark:bg-slate-700 p-4 rounded-lg shadow">
          <button onClick={() => navigate('/')} className="text-xl font-semibold hover:underline">
            ← Back to Home
          </button>
        </header>

        {/* Main settings form */}
        <main className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow text-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Settings</h1>

          {/* Language selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700"
            >
              <option value="us">English</option>
              <option value="es">Español</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          {/* Difficulty selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Save button */}
          <button
            onClick={saveSettings}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Settings
          </button>

          {/* Clear all data button */}
          <button
            onClick={clearStorage}
            className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Data & Reset
          </button>
        </main>
      </div>
    </div>
  );
}

export default Settings;
