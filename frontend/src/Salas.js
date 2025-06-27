import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Salas() {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerfil(res.data);
      } catch (err) {
        console.error('Error al obtener perfil:', err);
      }
    };
    fetchPerfil();
  }, []);

  if (!perfil) return <div>Cargando perfil...</div>;

  return (
    <div className="card p-4">
      <h2>Bienvenido, {perfil.username}</h2>
      <p>Saldo: {perfil.saldo}</p>
      <p>Partidas Jugadas: {perfil.partidasJugadas}</p>
      <p>Partidas Ganadas: {perfil.partidasGanadas}</p>
    </div>
  );
}

export default Salas;