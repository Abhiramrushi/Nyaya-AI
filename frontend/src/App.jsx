import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import JudgmentView from './components/JudgmentView';
import { Scale } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="logo">
              <Scale size={32} color="#3b82f6" />
              <span>NyayaFlow AI</span>
            </div>
          </Link>
          <div style={{ color: 'var(--text-secondary)' }}>
            Decision Intelligence Portal
          </div>
        </header>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/judgment/:id" element={<JudgmentView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
