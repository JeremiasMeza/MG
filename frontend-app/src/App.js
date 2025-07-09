import React from 'react';
import AppRoutes from './hocs/routes'; 
import './styles/index.css'; 
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>  
      <div className="app">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;