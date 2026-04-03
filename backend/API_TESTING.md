# API Testing Examples

This file contains curl commands to test all endpoints. Replace the values with your actual data.

## Authentication

### 1. Signup - Create New User
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "Tenant"
  }'
```

### 2. Signup - Property Owner
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "9876543210",
    "role": "Property Owner"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get User Profile
```bash
curl -X GET http://localhost:5000/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Update User Profile
```bash
curl -X PUT http://localhost:5000/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Updated",
    "phone": "9999999999",
    "address": "456 Oak Street"
  }'
```

## Properties

### 1. Get All Properties (with filters)
```bash
# Get all properties
curl -X GET http://localhost:5000/properties

# With filters
curl -X GET "http://localhost:5000/properties?location=Downtown&minPrice=1000&maxPrice=3000&propertyType=Apartment"

# With pagination
curl -X GET "http://localhost:5000/properties?page=1&limit=10"

# With sorting
curl -X GET "http://localhost:5000/properties?sortBy=low-to-high"
```

### 2. Add New Property (Owner only)
```bash
curl -X POST http://localhost:5000/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN" \
  -d '{
    "title": "Beautiful 2BHK Apartment",
    "description": "Spacious apartment with modern amenities, close to public transport",
    "propertyType": "Apartment",
    "location": "Downtown City",
    "address": "123 Main Street, City Center",
    "price": 1500,
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "amenities": ["WiFi", "Kitchen", "Parking", "AC", "Hot Water", "Gym"],
    "image": "https://example.com/property1.jpg"
  }'
```

### 3. Get Property Details
```bash
curl -X GET http://localhost:5000/properties/PROPERTY_ID_HERE
```

### 4. Update Property (Owner only)
```bash
curl -X PUT http://localhost:5000/properties/PROPERTY_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN" \
  -d '{
    "price": 1600,
    "description": "Updated description"
  }'
```

### 5. Delete Property (Owner only)
```bash
curl -X DELETE http://localhost:5000/properties/PROPERTY_ID_HERE \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"
```

### 6. Get My Properties (Owner only)
```bash
curl -X GET http://localhost:5000/properties/my-properties \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"
```

### 7. Search Properties (Advanced)
```bash
curl -X GET "http://localhost:5000/properties/search?location=Downtown&minPrice=1000&maxPrice=3000&propertyType=Apartment&bedrooms=2"
```

## Bookings

### 1. Request Booking (Tenant only)
```bash
curl -X POST http://localhost:5000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN" \
  -d '{
    "propertyId": "PROPERTY_ID_HERE",
    "checkInDate": "2024-05-01",
    "checkOutDate": "2024-05-30",
    "numberOfTenants": 2,
    "message": "Looking for a comfortable place for my family"
  }'
```

### 2. Get Tenant Bookings (Tenant only)
```bash
curl -X GET http://localhost:5000/bookings/tenant/my-bookings \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN"
```

### 3. Get Owner Booking Requests (Owner only)
```bash
curl -X GET http://localhost:5000/bookings/owner/requests \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"
```

### 4. Get Booking Details
```bash
curl -X GET http://localhost:5000/bookings/BOOKING_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Accept Booking (Owner only)
```bash
curl -X PUT http://localhost:5000/bookings/BOOKING_ID_HERE/accept \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"
```

### 6. Reject Booking (Owner only)
```bash
curl -X PUT http://localhost:5000/bookings/BOOKING_ID_HERE/reject \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"
```

### 7. Cancel Booking (Tenant only)
```bash
curl -X PUT http://localhost:5000/bookings/BOOKING_ID_HERE/cancel \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN"
```

## Wishlist

### 1. Add Property to Wishlist (Tenant only)
```bash
curl -X POST http://localhost:5000/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN" \
  -d '{
    "propertyId": "PROPERTY_ID_HERE"
  }'
```

### 2. Get Wishlist (Tenant only)
```bash
curl -X GET http://localhost:5000/wishlist \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN"
```

### 3. Check if in Wishlist (Tenant only)
```bash
curl -X GET "http://localhost:5000/wishlist/check?propertyId=PROPERTY_ID_HERE" \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN"
```

### 4. Remove from Wishlist (Tenant only)
```bash
curl -X DELETE http://localhost:5000/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN" \
  -d '{
    "propertyId": "PROPERTY_ID_HERE"
  }'
```

### 5. Clear Wishlist (Tenant only)
```bash
curl -X DELETE http://localhost:5000/wishlist/clear \
  -H "Authorization: Bearer YOUR_TENANT_TOKEN"
```

## Admin

### 1. Get All Users (Admin only)
```bash
curl -X GET http://localhost:5000/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Filter by role
curl -X GET "http://localhost:5000/admin/users?role=Tenant" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2. Block User (Admin only)
```bash
curl -X PUT http://localhost:5000/admin/users/USER_ID_HERE/block \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Unblock User (Admin only)
```bash
curl -X PUT http://localhost:5000/admin/users/USER_ID_HERE/unblock \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Delete User (Admin only)
```bash
curl -X DELETE http://localhost:5000/admin/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 5. Get Pending Properties (Admin only)
```bash
curl -X GET http://localhost:5000/admin/properties/pending \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 6. Approve Property (Admin only)
```bash
curl -X PUT http://localhost:5000/admin/properties/PROPERTY_ID_HERE/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 7. Remove Property (Admin only)
```bash
curl -X DELETE http://localhost:5000/admin/properties/PROPERTY_ID_HERE \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 8. Get Platform Statistics (Admin only)
```bash
curl -X GET http://localhost:5000/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Health Check

```bash
curl -X GET http://localhost:5000/health
```

---

## Notes:

1. Replace `YOUR_TOKEN_HERE` with actual JWT token received from login/signup
2. Replace `YOUR_OWNER_TOKEN` with token from a Property Owner account
3. Replace `YOUR_TENANT_TOKEN` with token from a Tenant account
4. Replace `YOUR_ADMIN_TOKEN` with token from an Admin account
5. Replace IDs (PROPERTY_ID_HERE, USER_ID_HERE, etc.) with actual MongoDB ObjectIds
6. Ensure MongoDB is running before testing
7. Use the token returned from /auth/login or /auth/signup in the Authorization header
