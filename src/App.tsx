import React from 'react';
import './styles/index.css'
import { JobSearchLanding } from './pages/JobSearchLanding';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import FormData from './components/Form';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<JobSearchLanding />} />
        <Route path="form/:id" element={<FormData />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
