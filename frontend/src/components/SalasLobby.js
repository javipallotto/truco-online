// frontend/src/components/SalasLobby.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SalasLobby() {
  const [salas, setSalas] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/salas/activas', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSalas(res.data.salas))
      .catch(err => setMsg('Error al cargar salas activas'));
  }, []);

  const unirseASala = async (salaId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/salas/unirse-publica', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/sala/${res.data.sala._id}`);
    } catch (err) {
      setMsg('Error al unirse a la sala');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lobby de Salas Activas</h2>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <div className="row">
        {salas.map(sala => (
          <div className="col-md-4 mb-3" key={sala._id}>
            <div className="card p-3">
              <h5>Tipo: {sala.tipo}</h5>
              <p><strong>Jugadores:</strong> {sala.jugadores.map(j => j.username).join(', ')}</p>
              {sala.tipo === 'privada' && sala.codigo && (
                <p><strong>Código:</strong> {sala.codigo}</p>
              )}
              <button className="btn btn-primary w-100" onClick={() => unirseASala(sala._id)}>
                Unirse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalasLobby;
