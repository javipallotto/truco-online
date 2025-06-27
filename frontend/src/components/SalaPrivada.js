// frontend/src/components/SalaPrivada.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SalaPrivada() {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const ingresar = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/salas/unirse-privada', { codigo }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/sala/${res.data.sala._id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo ingresar a la sala privada');
    }
  };

  const crear = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/salas/crear', {
        privada: true,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/sala/${res.data.sala._id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo crear la sala privada');
    }
  };

  return (
    <div className="text-center mt-5">
      <h2>Ingresar a sala privada</h2>
      <input
        className="form-control mt-3"
        placeholder="Código de sala"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
      />
      <button className="btn btn-primary mt-3 me-2" onClick={ingresar}>
        Ingresar
      </button>
      <button className="btn btn-success mt-3" onClick={crear}>
        Crear nueva sala privada
      </button>
    </div>
  );
}

export default SalaPrivada;
