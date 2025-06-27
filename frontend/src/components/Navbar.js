// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [username, setUsername] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setSaldo(user.saldo);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand">🎴 Truco Online</span>

      {isLoggedIn && (
        <>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
              <li className="nav-item text-light">
                👤 <strong>{username}</strong>
              </li>
              <li className="nav-item text-success">
                💰 ${saldo}
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-success btn-sm w-100"
                  onClick={() => alert('Función cargar saldo próximamente')}
                >
                  Cargar saldo
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-info btn-sm w-100"
                  onClick={() => alert('Configuración próximamente')}
                >
                  Configuración
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
