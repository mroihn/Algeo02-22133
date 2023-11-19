import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import About from './components/About';
import HowToUse from './components/HowToUse';
import LandingPage from './components/LandingPage';
import Concept from './components/Concept';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/image-retrieval" element={<Home />} />
          <Route path="/concept" element={<Concept />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
    </Router>
  );
}

export default App;

