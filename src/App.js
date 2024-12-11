import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/NavBar';
import Wordlist from '../src/components/wordlist';
import AddWord from './components/adding';
import Word from './components/word'
import Daily from './components/daily';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Signing from './components/register';
import UnitPage from './components/unit';
import UnitUpdate from './components/unitUpdate';
import Grammar from './components/grammar';
import TestPage from './components/test';
function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/daily" element={<Daily/>} />
          <Route path="/" element={<Signing/>} />
          <Route path="/wordlist" element={<Wordlist/>} />
          <Route path="/grammar" element={<Grammar/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/add" element={<AddWord/>} />
          <Route path="/word/:id" element={<Word />} /> 
          <Route path="/unit/:id" element={<UnitPage />} /> 
          <Route path="/update/:id" element={<UnitUpdate />} /> 
          <Route path="/test/:slug" element={<TestPage />} /> 
          </Routes>
      </div>
    </Router>
  );
}

export default App;
