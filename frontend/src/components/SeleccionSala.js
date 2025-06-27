// frontend/src/components/SalaPublica.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SeleccionSala() {
  const [codigoPrivado, setCodigoPrivado] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const unirseSalaAbierta = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/salas/unirse-publica', {}, config);
      navigate(`/sala/${res.data.sala._id}`);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al unirse a sala abierta');
    }
  };

  const unirseSalaPrivada = async () => {
    if (!codigoPrivado) {
      setMsg('Ingresá el código de sala');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/salas/unirse', { codigo: codigoPrivado }, config);
      navigate(`/sala/${res.data.sala._id}`);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al unirse a sala privada');
    }
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3">Seleccionar tipo de sala</h3>

      <button className="btn btn-success mb-3" onClick={unirseSalaAbierta}>
        Unirse a sala pública
      </button>

      <hr />

      <div className="mb-2">
        <label>Código de sala privada:</label>
        <input
          type="text"
          className="form-control"
          value={codigoPrivado}
          onChange={e => setCodigoPrivado(e.target.value)}
          placeholder="Ej: ABC123"
        />
      </div>
      <button className="btn btn-primary" onClick={unirseSalaPrivada}>
        Unirse a sala privada
      </button>

      {msg && <div className="mt-3 text-danger">{msg}</div>}
    </div>
  );
}

export default SeleccionSala;
