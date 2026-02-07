# Office Collaboration & Attendance System - Backend

A secure and scalable backend API for office collaboration, attendance tracking, and internal communication.

## 🔐 Security Features

- **Secure Authentication**: JWT-based authentication with access and refresh tokens
- **Password Security**: 
  - Bcrypt hashing with salt rounds
  - Strong password requirements (min 8 chars, uppercase, lowercase, number, special char)
  - Password change tracking
- **Account Protection**:
  - Account locking after 5 failed login attempts (10-minute lockout)
  - Failed login attempt tracking
- **Rate Limiting**:
  - API rate limiting (100 requests per 15 minutes)
  - Auth endpoint limiting (5 attempts per 15 minutes)
  - Registration limiting (3 accounts per hour per IP)
- **Security Headers**: Helmet.js for HTTP security headers
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configurable CORS policies
- **Role-Based Access Control**: Support for employee, hr, finance, owner, admin roles

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   cd office-tool-back
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Strong secret key (min 32 characters)
   - `JWT_REFRESH_SECRET`: Different strong secret key
   - `ALLOWED_ORIGINS`: Your frontend URLs

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Seed sample users (Optional)**
   ```bash
   npm run seed
   ```
   This creates 8 sample users with different roles. See [SAMPLE_USERS.md](SAMPLE_USERS.md) for credentials.

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "officeId": "it32453",
  "role": "employee"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "username": "john_doe",
      "email": "user@example.com",
      "officeId": "it32453",
      "role": "employee"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Login (with email or username)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
Or use username:
```http
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

## 🛡️ Security Best Practices Implemented

1. **Environment Variables**: Sensitive data stored in .env (never committed)
2. **Password Hashing**: Bcrypt with 12 salt rounds
3. **JWT Tokens**: 
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
4. **Rate Limiting**: Prevents brute force attacks
5. **Input Validation**: All inputs validated and sanitized
6. **Error Handling**: Secure error messages (no sensitive data exposure)
7. **HTTPS**: Configure in production
8. **MongoDB Security**: Use authentication and connection string security
9. **Helmet**: Security headers automatically set
10. **Account Locking**: Prevents credential stuffing attacks

## 📁 Project Structure

```
office-tool-back/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   └── auth.controller.js    # Authentication logic
├── middleware/
│   ├── authMiddleware.js     # JWT verification & authorization
│   ├── rateLimiter.js        # Rate limiting configuration
│   └── validation.js         # Input validation rules
├── models/
│   └── user.model.js         # User schema
├── routes/
│   └── auth/
│       └── auth.routes.js    # Auth routes
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
└── server.js                 # Application entry point
```

## 🔧 Configuration

### User Roles
- `employee`: Basic user
- `hr`: Human Resources
- `finance`: Finance department
- `owner`: Business owner
- `admin`: System administrator

### Rate Limits (Configurable in .env)
- General API: 100 requests / 15 minutes
- Authentication: 5 attempts / 15 minutes
- Registration: 3 accounts / hour per IP

## 🧪 Testing

Test the API using:
- **Postman**: Import the collection (create one)
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

### Example cURL Request:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "username": "test_user",
    "email": "test@example.com",
    "password": "TestPass123!",
    "officeId": "it32453"
  }'
```

## 🚨 Production Checklist

Before deploying to production:

- [ ] Change all JWT secrets to strong random values
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Configure proper ALLOWED_ORIGINS
- [ ] Enable HTTPS
- [ ] Set up MongoDB authentication
- [ ] Configure backup strategy
- [ ] Set up logging service
- [ ] Configure monitoring (e.g., PM2, New Relic)
- [ ] Review and adjust rate limits
- [ ] Set up error tracking (e.g., Sentry)

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development/production |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection | mongodb://localhost:27017/office_tool_db |
| JWT_SECRET | JWT signing secret | min 32 characters |
| JWT_EXPIRES | Access token expiry | 15m |
| JWT_REFRESH_SECRET | Refresh token secret | min 32 characters |
| JWT_REFRESH_EXPIRES | Refresh token expiry | 7d |
| ALLOWED_ORIGINS | CORS allowed origins | http://localhost:3000 |

## 🤝 Contributing

1. Follow the existing code style
2. Add appropriate validation
3. Update README if adding features
4. Test thoroughly before committing

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For issues and questions, contact the development team.

---

**Happy Coding! 🚀**
