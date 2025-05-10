import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Home from './components/Home.jsx';
import Questions from './components/Questions.jsx';
import Settings from './components/Settings.jsx';
import Login from './components/Login.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} /> {/* ← נטען בכניסה ל־"/" */}
          <Route path="questions" element={<Questions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
