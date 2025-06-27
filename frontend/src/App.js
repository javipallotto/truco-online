import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import SalasLobby from './components/SalasLobby';
import SeleccionSala from './components/SeleccionSala';
import SalaPrivada from './components/SalaPrivada';
import SalaPublica from './components/SalaPublica';
import Navbar from './components/Navbar'; 

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/salas" element={<SalasLobby />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/seleccion-sala" element={<SeleccionSala />} />
          <Route path="/sala-privada" element={<SalaPrivada />} />
          <Route path="/sala-publica" element={<SalaPublica />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
