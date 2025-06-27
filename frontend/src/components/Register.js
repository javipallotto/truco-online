import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error en el registro');
    }
  };

  return (
    <div className="card p-4">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Usuario" onChange={e => setUsername(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-success w-100" type="submit">Registrarse</button>
      </form>
      <div className="mt-2 text-success">{msg}</div>
      <Link to="/" className="btn btn-link mt-3">Volver a login</Link>
    </div>
  );
}
export default Register;