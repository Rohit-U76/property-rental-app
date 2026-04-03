# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start MongoDB
```bash
mongod
```

### Step 3: Run Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

✅ Server is now running on `http://localhost:5000`

---

## 🧪 Quick Test

### Create Your First Account (Tenant)
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "Tenant"
  }'
```

**Copy the `token` from the response** ↗ You'll need this for protected routes!

### Create Property Owner Account
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "securepassword123",
    "role": "Property Owner"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "securepassword123"
  }'
```

---

## 📁 Project Structure

```
backend/
├── models/                    # Database Schemas
│   ├── User.js               # User with roles (Tenant, Owner, Admin)
│   ├── Property.js           # Property listings
│   ├── Booking.js            # Booking requests
│   └── Wishlist.js           # Saved properties
│
├── controllers/              # Business Logic
│   ├── authController.js     # Auth & profile management
│   ├── propertyController.js # Property CRUD & search
│   ├── bookingController.js  # Booking operations
│   ├── wishlistController.js # Wishlist management
│   └── adminController.js    # Admin operations
│
├── routes/                   # API Endpoints
│   ├── authRoutes.js         # /auth/*
│   ├── propertyRoutes.js     # /properties/*
│   ├── bookingRoutes.js      # /bookings/*
│   ├── wishlistRoutes.js     # /wishlist/*
│   └── adminRoutes.js        # /admin/*
│
├── middleware/               # Request Processing
│   └── authMiddleware.js     # JWT verification & role checks
│
├── config/
│   └── database.js           # MongoDB connection
│
├── server.js                 # Express app initialization
├── package.json              # Dependencies
├── .env                      # Environment variables
├── README.md                 # Full documentation
├── API_TESTING.md            # Curl examples for all endpoints
└── QUICK_START.md            # This file
```

---

## 🔑 Key Features by Role

### 👤 Tenant Features
- ✅ Signup & Login
- ✅ Search & Filter Properties
- ✅ View Property Details
- ✅ Save Properties (Wishlist)
- ✅ Request Bookings
- ✅ View/Cancel Bookings

### 🏠 Property Owner Features
- ✅ Signup & Login (as Property Owner)
- ✅ Create Properties (title, desc, price, etc.)
- ✅ Edit Properties
- ✅ Delete Properties
- ✅ View Booking Requests
- ✅ Accept/Reject Bookings

### 🛡️ Admin Features
- ✅ View All Users
- ✅ Block/Unblock Users
- ✅ Approve/Remove Properties
- ✅ View Platform Statistics

---

## 📡 Most Important Endpoints

### Authentication
- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `GET /auth/profile` - Get Profile
- `PUT /auth/profile` - Update Profile

### Properties
- `GET /properties` - View all properties
- `POST /properties` - Add property (Owner)
- `GET /properties/:id` - Property details
- `GET /properties/search` - Advanced search
- `PUT /properties/:id` - Update (Owner)
- `DELETE /properties/:id` - Delete (Owner)

### Bookings
- `POST /bookings` - Request booking (Tenant)
- `GET /bookings/tenant/my-bookings` - My bookings (Tenant)
- `GET /bookings/owner/requests` - Booking requests (Owner)
- `PUT /bookings/:id/accept` - Accept (Owner)
- `PUT /bookings/:id/reject` - Reject (Owner)

### Wishlist
- `GET /wishlist` - View wishlist
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist` - Remove from wishlist

---

## 🔒 Authentication

All protected routes require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from signup or login response.

---

## 📝 Database Requirements

### MongoDB Connection String Formats

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/property-rental-app
```

**MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/property-rental-app
```

---

## ⚙️ Environment Variables

Create `.env` file in backend directory:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/property-rental-app

# JWT
JWT_SECRET=your_secret_key_here_keep_it_safe
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
```

---

## 🐛 Troubleshooting

### Server won't start
- Ensure MongoDB is running: `mongod`
- Check if port 5000 is available
- Verify .env file exists with correct values

### Cannot connect to MongoDB
- Check MongoDB URI in .env
- Ensure MongoDB service is running
- For Atlas: Check IP whitelist in cluster settings

### JWT Token Expired
- Login again to get a new token
- Increase JWT_EXPIRE in .env if needed

### CORS Errors
- Backend CORS is enabled for all origins by default
- Modify in server.js if needed

---

## 📚 Full Documentation

See `README.md` for complete API documentation and examples.

---

## 🚀 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start MongoDB: `mongod`
3. ✅ Run server: `npm run dev`
4. ✅ Test endpoints using API_TESTING.md
5. ✅ Integrate with frontend

---

## 💡 Tips

- Use Postman or Thunder Client for easier API testing
- Check server console for detailed error messages
- Backend logs will help debug issues
- Always include Authorization header for protected routes

---

**Happy coding! 🎉**
