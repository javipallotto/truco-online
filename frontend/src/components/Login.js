import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // ⬅️ importante para animaciones

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: res.data.username,
        saldo: res.data.saldo
      }));

      setMsg(res.data.message);
      navigate('/seleccion-sala');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error en login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 login-card fade-in">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Usuario"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Contraseña"
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>
      {loading && (
        <div className="spinner mt-3 text-center"></div>
      )}
      <div className="mt-2 text-danger">{msg}</div>
      <Link to="/register" className="btn btn-link mt-3">
        Crear cuenta nueva
      </Link>
    </div>
  );
}

export default Login;
