# 🎴 Truco Online - Proyecto Multiplayer con Salas Públicas y Privadas

Este proyecto es una plataforma online para jugar al Truco argentino en salas públicas o privadas. Está desarrollado con **React.js (frontend)** y **Node.js + Express + MongoDB (backend)**.

## 📁 Estructura del Proyecto

```
Truco/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── .env (no incluido en Git)
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Requisitos Previos

- Node.js y npm
- MongoDB Atlas (o local)
- Git
- Vercel (si se desea desplegar el frontend)

---

## 🚀 Instrucciones para levantar el proyecto

### 🔙 Backend

```bash
cd backend
npm install
# Crear el archivo .env con el siguiente contenido:
MONGO_URI=TU_MONGO_URI
JWT_SECRET=supersecreto123
node server.js
```

### 🔜 Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Variables de Entorno

Crear archivo `.env` dentro de `/backend/` con:

```env
MONGO_URI=mongodb+srv://... (tu conexión MongoDB)
JWT_SECRET=supersecreto123
```

---

## 🧩 Tecnologías Utilizadas

- React.js (con React Router)
- Node.js + Express
- MongoDB + Mongoose
- Bootstrap 5 (para el diseño)
- JWT (para autenticación)
- Axios (para llamadas HTTP)

---

## 🔮 Funcionalidades Actuales

- Registro e inicio de sesión de usuario
- Navbar dinámico que muestra el nombre del usuario y su saldo
- Salas públicas (matchmaking automático)
- Salas privadas (acceso por código)
- Redirección tras login a selección de sala
- Almacenamiento de token JWT y datos del usuario en `localStorage`

---

## 🔧 Próximos pasos

- Integración de WebSockets con Socket.IO para la partida
- Lógica completa del Truco (tantos, envido, truco, flor)
- Animaciones y sonidos
- Historial de partidas
- Carga de saldo real

---

## 🤝 Cómo colaborar (instrucciones para tu compañero)

```bash
# Clonar el proyecto
git clone https://github.com/TU_USUARIO/Truco.git
cd Truco

# Crear una nueva rama para trabajar
git checkout -b nombre-de-la-rama

# Subir cambios
git add .
git commit -m "Descripción"
git push origin nombre-de-la-rama
```

---

## 📩 Contacto

Proyecto creado por **Javier Pallotto**  
Telegram: @Javote22  
GitHub: [github.com/TU_USUARIO](https://github.com/TU_USUARIO)