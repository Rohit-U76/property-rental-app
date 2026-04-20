# 🏠 Property Rental System

## 📌 Overview

The **Property Rental System** is a full-stack web application developed using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. It enables users to browse, book, and manage rental properties, while providing property owners/admins with tools to manage listings and bookings efficiently.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

* Secure user registration and login using JWT
* Role-based access (User / Owner / Admin)

### 👤 User Functionality

* Browse available rental properties
* View detailed property information
* Add/remove properties to wishlist
* Book rental properties
* Manage personal profile

### 🏢 Owner/Admin Functionality

* Add, update, and delete property listings
* Manage bookings
* Monitor platform activity

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Context API
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* JSON Web Tokens (JWT)

---

## 📂 Project Structure

```
PROPERTY_RENTAL_SYSTEM/
│
├── property-rental-app/
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── .env
│   │
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── pages/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `backend/` directory and configure the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_secret
JWT_EXPIRE=7d
```

> ⚠️ **Security Note:**
> Never expose your `.env` file or sensitive credentials. Ensure `.env` is included in `.gitignore`.

---

## 🧑‍💻 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/property-rental-system.git
cd PROPERTY_RENTAL_SYSTEM/property-rental-app
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 API Overview

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| POST   | /api/auth/register  | Register a new user     |
| POST   | /api/auth/login     | Authenticate user       |
| GET    | /api/properties     | Retrieve all properties |
| POST   | /api/properties     | Add a new property      |
| PUT    | /api/properties/:id | Update property         |
| DELETE | /api/properties/:id | Delete property         |
| POST   | /api/bookings       | Create booking          |
| GET    | /api/wishlist       | Retrieve wishlist       |

---

## 🧪 Testing

API testing can be performed using:

* Postman
* Thunder Client (VS Code Extension)

---

## 🔐 Security Best Practices

* Store sensitive data in environment variables
* Use strong JWT secrets
* Implement proper validation and error handling
* Protect routes using authentication middleware

---

## 📈 Future Enhancements

* Payment Gateway Integration
* Real-time Notifications
* Advanced Search & Filtering
* Image Upload (Cloud Storage Integration)
* Map-based Property Location

---

## 👨‍💻 Author

**Rohit Balu Umdale**

---

## 📄 License

This project is intended for academic and educational purposes.

---

