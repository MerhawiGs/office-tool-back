# Updated User Schema Structure

## ✅ Schema Changes Implemented

### New User Structure:
```javascript
{
  firstName: "Merhawi",
  lastName: "Tesfaye",
  username: "admin_merhawi",
  email: "merhawi@example.com",
  password: "hashed_password",
  role: "employee" | "hr" | "finance" | "owner" | "admin",
  isActive: true,
  officeId: "it32453"
}
```

### Key Changes:
1. ✅ Added **username** field (required, unique, lowercase, min 3 chars)
2. ✅ Added **officeId** field (required)
3. ✅ Made **firstName** and **lastName** required
4. ✅ **Account lock duration**: Changed from 30 minutes to **10 minutes**
5. ✅ Login now accepts **email OR username**

---

## 📡 Updated API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Merhawi",
    "lastName": "Tesfaye",
    "username": "admin_merhawi",
    "email": "merhawi@example.com",
    "password": "SecurePass123!",
    "officeId": "it32453",
    "role": "admin"
  }'
```

### Login with Email
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "merhawi@example.com",
    "password": "SecurePass123!"
  }'
```

### Login with Username
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_merhawi",
    "password": "SecurePass123!"
  }'
```

---

## 🔒 Security Features

### Account Locking:
- **Trigger**: 5 failed login attempts
- **Lock Duration**: **10 minutes** (updated from 30 minutes)
- **Message**: "Account locked due to multiple failed login attempts. Please try again after 10 minutes."

### Validation Rules:
- **firstName**: Required, min 2 characters
- **lastName**: Required, min 2 characters
- **username**: Required, unique, min 3 characters, alphanumeric + underscore only
- **email**: Required, unique, valid email format
- **password**: Min 8 chars, uppercase, lowercase, number, special character
- **officeId**: Required

---

## 📋 Registration Example (Postman/Thunder Client)

```json
POST http://localhost:5000/api/auth/register

{
  "firstName": "Merhawi",
  "lastName": "Tesfaye",
  "username": "admin_merhawi",
  "email": "merhawi@example.com",
  "password": "SecurePass123!",
  "officeId": "it32453",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65d1a2b3c4e5f6789abcdef0",
      "firstName": "Merhawi",
      "lastName": "Tesfaye",
      "username": "admin_merhawi",
      "email": "merhawi@example.com",
      "officeId": "it32453",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1..."
  }
}
```

---

## 🧪 Testing Account Lock (10 minutes)

1. **Make 5 failed login attempts:**
```bash
# Attempt 1-5 with wrong password
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_merhawi",
    "password": "WrongPassword123!"
  }'
```

2. **After 5th attempt, account is locked:**
```json
{
  "success": false,
  "message": "Account locked due to multiple failed login attempts. Please try again after 10 minutes."
}
```

3. **Wait 10 minutes, then account is automatically unlocked.**

---

## ✨ JWT Token Payload

After login, your access token contains:
```javascript
{
  id: "user_id",
  username: "admin_merhawi",
  email: "merhawi@example.com",
  role: "admin",
  iat: 1707324567,
  exp: 1707325467
}
```

---

## 🔧 Database Indexes

Ensure these indexes exist for performance:
```javascript
// Automatic via schema
- username: unique, indexed
- email: unique, indexed

// Recommended manual indexes
db.users.createIndex({ officeId: 1 })
db.users.createIndex({ role: 1 })
db.users.createIndex({ isActive: 1 })
```

---

## 📝 Migration Notes

If you have existing users without `username` or `officeId`, you need to:

1. **Add migration script** (optional):
```javascript
// migration.js
const User = require('./models/user.model');

async function migrateUsers() {
  const users = await User.find({});
  
  for (const user of users) {
    if (!user.username) {
      // Generate username from email
      user.username = user.email.split('@')[0];
    }
    if (!user.officeId) {
      user.officeId = 'default_office';
    }
    await user.save();
  }
}

migrateUsers();
```

2. **Or start fresh** (for development):
```bash
# Drop users collection
mongo office_tool_db --eval "db.users.drop()"
```

---

## ✅ Validation Error Examples

### Missing Required Fields:
```json
{
  "success": false,
  "errors": [
    {
      "field": "firstName",
      "message": "First name is required"
    },
    {
      "field": "username",
      "message": "Username is required"
    },
    {
      "field": "officeId",
      "message": "Office ID is required"
    }
  ]
}
```

### Invalid Username:
```json
{
  "success": false,
  "errors": [
    {
      "field": "username",
      "message": "Username can only contain letters, numbers, and underscores"
    }
  ]
}
```

### Duplicate Username:
```json
{
  "success": false,
  "message": "Username already taken"
}
```

---

**All changes are backward compatible with existing authentication flow!** 🚀
