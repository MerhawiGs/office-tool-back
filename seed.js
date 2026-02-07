require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

// Sample users matching the new schema
const sampleUsers = [
  {
    firstName: "Merhawi",
    lastName: "Tesfaye",
    username: "admin_merhawi",
    email: "merhawi@example.com",
    password: "SecurePass123!",
    officeId: "it32453",
    role: "admin",
    isActive: true
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    username: "sarah_hr",
    email: "sarah@company.com",
    password: "SecurePass123!",
    officeId: "hr_office_001",
    role: "hr",
    isActive: true
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    username: "michael_finance",
    email: "michael@company.com",
    password: "SecurePass123!",
    officeId: "finance_dept_02",
    role: "finance",
    isActive: true
  },
  {
    firstName: "David",
    lastName: "Williams",
    username: "david_owner",
    email: "david@company.com",
    password: "SecurePass123!",
    officeId: "executive_001",
    role: "owner",
    isActive: true
  },
  {
    firstName: "Emma",
    lastName: "Brown",
    username: "emma_employee",
    email: "emma@company.com",
    password: "SecurePass123!",
    officeId: "dev_office_123",
    role: "employee",
    isActive: true
  },
  {
    firstName: "James",
    lastName: "Davis",
    username: "james_dev",
    email: "james@company.com",
    password: "SecurePass123!",
    officeId: "dev_office_123",
    role: "employee",
    isActive: true
  },
  {
    firstName: "Olivia",
    lastName: "Martinez",
    username: "olivia_design",
    email: "olivia@company.com",
    password: "SecurePass123!",
    officeId: "design_office_45",
    role: "employee",
    isActive: true
  },
  {
    firstName: "Robert",
    lastName: "Garcia",
    username: "robert_marketing",
    email: "robert@company.com",
    password: "SecurePass123!",
    officeId: "marketing_dept_10",
    role: "employee",
    isActive: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully\n');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Database Seeding...\n');

    // Optional: Clear existing users (comment out if you want to keep existing data)
    const deleteResult = await User.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing users\n`);

    console.log('📝 Creating sample users...\n');

    // Create users one by one to show progress
    let successCount = 0;
    let errorCount = 0;

    for (const userData of sampleUsers) {
      try {
        const user = await User.create(userData);
        successCount++;
        console.log(`✅ Created: ${user.firstName} ${user.lastName} (@${user.username}) - ${user.role}`);
      } catch (error) {
        errorCount++;
        console.log(`❌ Failed: ${userData.username} - ${error.message}`);
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`\n✨ Seeding Complete!`);
    console.log(`   ✅ Successfully created: ${successCount} users`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} users`);
    }
    console.log('\n' + '═'.repeat(60));

    // Display created users
    console.log('\n📋 All Users in Database:\n');
    const allUsers = await User.find({}).select('-password -refreshToken');
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Office ID: ${user.officeId}`);
      console.log(`   Status: ${user.isActive ? 'Active' : 'Inactive'}`);
      console.log('');
    });

    console.log('═'.repeat(60));
    console.log('\n🔑 Login Credentials (All passwords: SecurePass123!):\n');
    
    allUsers.forEach((user) => {
      console.log(`${user.role.toUpperCase().padEnd(10)} | Username: ${user.username.padEnd(20)} | Email: ${user.email}`);
    });
    
    console.log('\n' + '═'.repeat(60));
    console.log('\n🚀 You can now login with any of these users!');
    console.log('\nExample Login (with username):');
    console.log(`  curl -X POST http://localhost:5000/api/auth/login \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"username": "admin_merhawi", "password": "SecurePass123!"}'`);
    
    console.log('\nExample Login (with email):');
    console.log(`  curl -X POST http://localhost:5000/api/auth/login \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"email": "merhawi@example.com", "password": "SecurePass123!"}'`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedDatabase();
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

// Execute
runSeeder();
