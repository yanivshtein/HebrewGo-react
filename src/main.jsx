import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import Questions from './components/Questions';
import Settings from './components/Settings';
import Progress from './components/Progress';
import Login from './components/Login';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        {/* Game screens */}
        <Route path="/questions" element={<Questions />} />
        <Route path="/settings" element={<Settings />} />
        {/* Note: lowecase `/progress` to match `navigate('/progress')` in code */}
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
