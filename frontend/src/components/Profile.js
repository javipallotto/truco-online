import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No estás autenticado");
      return;
    }

    axios.get('http://localhost:5000/api/auth/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => setPerfil(res.data))
      .catch(err => setError(err.response?.data?.error || 'Error al cargar perfil'));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!perfil) return <div>Cargando perfil...</div>;

  return (
    <div className="card p-3">
      <h2>Mi Perfil</h2>
      <p><strong>Usuario:</strong> {perfil.username}</p>
      <p><strong>Saldo:</strong> {perfil.saldo} créditos</p>
      <p><strong>Partidas jugadas:</strong> {perfil.partidasJugadas}</p>
      <p><strong>Partidas ganadas:</strong> {perfil.partidasGanadas}</p>
    </div>
  );
}

export default Profile;
