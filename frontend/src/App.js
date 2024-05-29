
import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './components/Home.js'
import Login from './components/Login.js';
import ProtectedRoute from './lib/AuthContext.js';
import MFA from './components/MFA.js'

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login/>}/>
     
      <Route element={<ProtectedRoute/>}>
              <Route path='/' element={<Home/>}/>
              <Route path="/mfa" element={<MFA/>}/>
          </Route>
    </Routes>
    </Router> 
  );
}

export default App;
