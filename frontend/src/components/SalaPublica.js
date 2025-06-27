// frontend/src/components/SalaPublica.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SalaPublica() {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const unirseSalaAbierta = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/salas/unirse-publica', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/sala/${res.data.sala._id}`);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al unirse');
    }
  };

  return (
    <div className="card p-4">
      <h3>Unirse a sala abierta</h3>
      <button className="btn btn-success" onClick={unirseSalaAbierta}>Buscar sala</button>
      {msg && <div className="mt-2 text-danger">{msg}</div>}
    </div>
  );
}

export default SalaPublica;
