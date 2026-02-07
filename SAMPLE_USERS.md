# Sample Users - Quick Reference

## 🔑 Login Credentials
**All passwords:** `SecurePass123!`

---

## 👥 Available Users

### 1. **Admin User**
- **Name:** Merhawi Tesfaye
- **Username:** `admin_merhawi`
- **Email:** `merhawi@example.com`
- **Role:** `admin`
- **Office ID:** `it32453`

### 2. **HR Manager**
- **Name:** Sarah Johnson
- **Username:** `sarah_hr`
- **Email:** `sarah@company.com`
- **Role:** `hr`
- **Office ID:** `hr_office_001`

### 3. **Finance Manager**
- **Name:** Michael Chen
- **Username:** `michael_finance`
- **Email:** `michael@company.com`
- **Role:** `finance`
- **Office ID:** `finance_dept_02`

### 4. **Owner**
- **Name:** David Williams
- **Username:** `david_owner`
- **Email:** `david@company.com`
- **Role:** `owner`
- **Office ID:** `executive_001`

### 5. **Employee (Dev)**
- **Name:** Emma Brown
- **Username:** `emma_employee`
- **Email:** `emma@company.com`
- **Role:** `employee`
- **Office ID:** `dev_office_123`

### 6. **Employee (Dev)**
- **Name:** James Davis
- **Username:** `james_dev`
- **Email:** `james@company.com`
- **Role:** `employee`
- **Office ID:** `dev_office_123`

### 7. **Employee (Design)**
- **Name:** Olivia Martinez
- **Username:** `olivia_design`
- **Email:** `olivia@company.com`
- **Role:** `employee`
- **Office ID:** `design_office_45`

### 8. **Employee (Marketing)**
- **Name:** Robert Garcia
- **Username:** `robert_marketing`
- **Email:** `robert@company.com`
- **Role:** `employee`
- **Office ID:** `marketing_dept_10`

---

## 🚀 Quick Login Examples

### Login with Username:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin_merhawi", "password": "SecurePass123!"}'
```

### Login with Email:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "merhawi@example.com", "password": "SecurePass123!"}'
```

---

## 🔄 Re-seed Database

To clear and recreate all sample users:
```bash
npm run seed
```

Or:
```bash
node seed.js
```

---

## 📊 User Distribution by Role

- **Admin:** 1 user
- **HR:** 1 user
- **Finance:** 1 user
- **Owner:** 1 user
- **Employee:** 4 users

**Total:** 8 users

---

## 📍 Office Distribution

- `it32453` - 1 user (Admin)
- `hr_office_001` - 1 user (HR)
- `finance_dept_02` - 1 user (Finance)
- `executive_001` - 1 user (Owner)
- `dev_office_123` - 2 users (Emma, James)
- `design_office_45` - 1 user (Olivia)
- `marketing_dept_10` - 1 user (Robert)

---

## 🧪 Testing Scenarios

### Test Role-Based Access:
1. Login as `admin_merhawi` (admin privileges)
2. Login as `sarah_hr` (HR privileges)
3. Login as `emma_employee` (basic employee)

### Test Username vs Email Login:
- Username: `{"username": "james_dev", "password": "SecurePass123!"}`
- Email: `{"email": "james@company.com", "password": "SecurePass123!"}`

### Test Account Locking:
Make 5 failed attempts with any user to trigger 10-minute lock.

---

**Last Updated:** February 7, 2026
