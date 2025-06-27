import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SalasLobby() {
  const [salas, setSalas] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [msg, setMsg] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get('http://localhost:5000/api/salas/abiertas')
      .then(res => setSalas(res.data))
      .catch(err => setMsg('Error al cargar salas'));
  }, []);

  const unirseASala = (salaId) => {
    axios.post('http://localhost:5000/api/salas/unirse', { salaId, userId })
      .then(res => setMsg('Unido a sala'))
      .catch(err => setMsg(err.response?.data?.error || 'Error al unirse a sala'));
  };

  const unirsePorCodigo = () => {
    if (!codigo) return setMsg('Ingresá un código');
    axios.post('http://localhost:5000/api/salas/unirse', { codigo, userId })
      .then(res => setMsg('Unido a sala privada'))
      .catch(err => setMsg(err.response?.data?.error || 'Error al unirse a sala privada'));
  };

  return (
    <div className="container mt-4">
      <h2>Salas abiertas</h2>
      {salas.length === 0 && <p>No hay salas abiertas</p>}
      {salas.map(sala => (
        <div key={sala._id} className="card mb-2 p-2">
          <strong>{sala.nombre}</strong>
          <p>Jugadores: {sala.jugadores.length}/{sala.maxJugadores}</p>
          <button className="btn btn-primary" onClick={() => unirseASala(sala._id)}>Unirse</button>
        </div>
      ))}

      <hr />
      <h4>Ingresar a sala privada</h4>
      <input className="form-control mb-2" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código de sala" />
      <button className="btn btn-secondary" onClick={unirsePorCodigo}>Ingresar</button>

      {msg && <div className="mt-3 alert alert-info">{msg}</div>}
    </div>
  );
}

export default SalasLobby;
