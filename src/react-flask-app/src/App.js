import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Mengganti 'Switch' dengan 'Routes'
import Home from './components/Home';
import About from './components/About';
import HowToUse from './components/HowToUse';

function App() {
  return (
    <Router>
        <Routes> {/* Mengganti 'Switch' dengan 'Routes' */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-use" element={<HowToUse />} />
        </Routes>
    </Router>
  );
}

export default App;
