# 🎬 CYNIX API

**CYNIX API** es el backend que impulsa la plataforma CYNIX, una simulación completa de un sistema moderno de cine. Proporciona toda la lógica de negocio necesaria para gestionar usuarios, autenticación, cartelera, funciones, asientos y tickets.

Construido con **Node.js + Express + MongoDB**, este servicio está diseñado con un enfoque en **escalabilidad, automatización y claridad estructural**.

---

## 🔗 Frontend

Este backend está conectado al frontend de CYNIX:

👉 https://github.com/AndrewDrko/cynix-frontend

---

## ✨ Características

- 🔐 Autenticación de usuarios (registro / login)
- 👤 Gestión de perfiles
- 🎥 Manejo de películas (cartelera)
- 🕒 Gestión de funciones (showtimes)
- 🪑 Control de disponibilidad de asientos
- 🎟️ Generación de tickets
- ⚙️ API REST estructurada y escalable

---

## 🤖 Automatización (Cron Jobs)

El sistema incluye procesos automáticos para simular un entorno real:

- ⏰ Generación automática de funciones (showtimes)
- 🧹 Limpieza de datos innecesarios o expirados
- 🔄 Mantenimiento de consistencia en la base de datos

Esto permite que la aplicación se mantenga dinámica sin intervención manual.

---

## 🛠️ Tecnologías usadas

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **Postman (para pruebas)**
- **JWT (Authentication)**
- **Cron Jobs**
- **REST API**
- **Git / GitHub**

---

## 🧱 Arquitectura

El backend está organizado siguiendo buenas prácticas:

- Separación por capas (routes, controllers, models)
- Uso de **Mongoose** para modelado de datos
- Manejo de errores centralizado
- Middleware para autenticación
- Estructura preparada para escalar

---

## 📦 Endpoints principales

### 🔐 Auth

- `POST /user/signup`
- `POST /user/login`

### 👤 Usuario

- `GET /me` → información del usuario, tickets y favoritos

### 🎥 Películas

- `GET /movies`

### 🕒 Funciones

- `GET /showtimes`

### 🎟️ Tickets

- `POST /tickets`
- `GET /tickets`

---

## 🧠 Objetivo del proyecto

CYNIX API fue desarrollada para simular un backend real de una plataforma de cine, enfocándose en:

- Modelado de datos complejo
- Relaciones entre entidades (usuarios, tickets, funciones)
- Automatización de procesos
- Diseño de APIs escalables
