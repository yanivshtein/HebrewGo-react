// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import Questions from './components/Questions';
import Settings from './components/Settings';
import Progress from './components/Progress';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/Progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
