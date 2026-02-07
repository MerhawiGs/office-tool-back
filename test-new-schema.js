// Quick Test Script for Updated User Schema
// Run: node test-new-schema.js

const testUsers = [
  {
    firstName: "Merhawi",
    lastName: "Tesfaye",
    username: "admin_merhawi",
    email: "merhawi@example.com",
    password: "SecurePass123!",
    officeId: "it32453",
    role: "admin"
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    username: "sarah_hr",
    email: "sarah@example.com",
    password: "SecurePass123!",
    officeId: "hr_office_001",
    role: "hr"
  },
  {
    firstName: "John",
    lastName: "Doe",
    username: "john_employee",
    email: "john@example.com",
    password: "SecurePass123!",
    officeId: "dev_office_123",
    role: "employee"
  }
];

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║     Updated User Schema Test Cases                        ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('✅ New User Structure Required Fields:');
console.log('   - firstName (required)');
console.log('   - lastName (required)');
console.log('   - username (required, unique, lowercase, min 3 chars)');
console.log('   - email (required, unique, valid format)');
console.log('   - password (required, min 8 chars with complexity)');
console.log('   - officeId (required)');
console.log('   - role (default: employee)\n');

console.log('✅ Key Changes:');
console.log('   ✓ Added username field');
console.log('   ✓ Added officeId field');
console.log('   ✓ Made firstName and lastName required');
console.log('   ✓ Account lock duration: 10 minutes (was 30 minutes)');
console.log('   ✓ Login accepts email OR username\n');

console.log('═══════════════════════════════════════════════════════════\n');
console.log('📝 Test Users to Register:\n');

testUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
  console.log(`   Username: ${user.username}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Office ID: ${user.officeId}`);
  console.log(`   Role: ${user.role}\n`);
});

console.log('═══════════════════════════════════════════════════════════\n');
console.log('🧪 Manual Testing Steps:\n');
console.log('1. Start MongoDB:');
console.log('   mongod\n');

console.log('2. Start the server:');
console.log('   npm run dev\n');

console.log('3. Register a user (email):');
console.log(`   curl -X POST http://localhost:5000/api/auth/register \\
     -H "Content-Type: application/json" \\
     -d '${JSON.stringify(testUsers[0], null, 2)}'\n`);

console.log('4. Login with email:');
console.log(`   curl -X POST http://localhost:5000/api/auth/login \\
     -H "Content-Type: application/json" \\
     -d '{"email": "${testUsers[0].email}", "password": "${testUsers[0].password}"}'\n`);

console.log('5. Login with username:');
console.log(`   curl -X POST http://localhost:5000/api/auth/login \\
     -H "Content-Type: application/json" \\
     -d '{"username": "${testUsers[0].username}", "password": "${testUsers[0].password}"}'\n`);

console.log('6. Test account locking (5 failed attempts):');
console.log(`   # Make 5 wrong password attempts
   curl -X POST http://localhost:5000/api/auth/login \\
     -H "Content-Type: application/json" \\
     -d '{"username": "${testUsers[0].username}", "password": "WrongPassword123!"}'\n`);

console.log('   Expected: Account locked for 10 minutes after 5th attempt\n');

console.log('═══════════════════════════════════════════════════════════\n');
console.log('📋 Validation Test Cases:\n');

const invalidCases = [
  {
    name: 'Missing username',
    data: { email: 'test@example.com', password: 'Pass123!', officeId: 'office1' },
    expected: 'Username is required'
  },
  {
    name: 'Missing officeId',
    data: { username: 'testuser', email: 'test@example.com', password: 'Pass123!' },
    expected: 'Office ID is required'
  },
  {
    name: 'Short username',
    data: { username: 'ab', email: 'test@example.com', password: 'Pass123!', officeId: 'office1' },
    expected: 'Username must be at least 3 characters'
  },
  {
    name: 'Invalid username chars',
    data: { username: 'user@name', email: 'test@example.com', password: 'Pass123!', officeId: 'office1' },
    expected: 'Username can only contain letters, numbers, and underscores'
  },
  {
    name: 'Weak password',
    data: { username: 'testuser', email: 'test@example.com', password: 'weak', officeId: 'office1' },
    expected: 'Password must be at least 8 characters long'
  }
];

invalidCases.forEach((tc, index) => {
  console.log(`${index + 1}. ${tc.name}`);
  console.log(`   Expected: ${tc.expected}\n`);
});

console.log('═══════════════════════════════════════════════════════════\n');
console.log('✨ Import postman_collection.json into Postman for easy testing!\n');
console.log('📚 See SCHEMA_UPDATE.md for detailed documentation\n');
