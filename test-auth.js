/**
 * Security Test Script
 * Tests the authentication endpoints for security features
 */

const BASE_URL = 'http://localhost:5000';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

// Test cases
async function runTests() {
  console.log('\n=== Security Authentication Tests ===\n');

  // Test 1: Health Check
  log.info('Test 1: Server Health Check');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    if (data.success) {
      log.success('Server is running');
    }
  } catch (error) {
    log.error('Server is not running. Start the server first!');
    return;
  }

  // Test 2: Register with weak password (should fail)
  log.info('\nTest 2: Registration with weak password (should fail)');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'weak'
      })
    });
    const data = await response.json();
    if (!data.success && data.errors) {
      log.success('Weak password rejected ✓');
    } else {
      log.error('Weak password was accepted (security issue!)');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  // Test 3: Register with invalid email (should fail)
  log.info('\nTest 3: Registration with invalid email (should fail)');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'StrongPass123!'
      })
    });
    const data = await response.json();
    if (!data.success) {
      log.success('Invalid email rejected ✓');
    } else {
      log.error('Invalid email was accepted (validation issue!)');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  // Test 4: Register with valid credentials (should succeed)
  log.info('\nTest 4: Registration with valid credentials');
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'User'
  };
  
  let accessToken = null;
  let refreshToken = null;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await response.json();
    if (data.success && data.data.accessToken) {
      accessToken = data.data.accessToken;
      refreshToken = data.data.refreshToken;
      log.success('User registered successfully');
      log.success(`Access token received: ${accessToken.substring(0, 20)}...`);
      log.success(`Refresh token received: ${refreshToken.substring(0, 20)}...`);
    } else {
      log.error('Registration failed');
      console.log(data);
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  // Test 5: Duplicate registration (should fail)
  log.info('\nTest 5: Duplicate registration (should fail)');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await response.json();
    if (!data.success) {
      log.success('Duplicate registration prevented ✓');
    } else {
      log.error('Duplicate registration was allowed (security issue!)');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  // Test 6: Login with wrong password (should fail)
  log.info('\nTest 6: Login with wrong password (should fail)');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: 'WrongPassword123!'
      })
    });
    const data = await response.json();
    if (!data.success) {
      log.success('Wrong password rejected ✓');
      log.info(`Attempts remaining: ${data.attemptsRemaining || 'N/A'}`);
    } else {
      log.error('Wrong password was accepted (security issue!)');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  // Test 7: Login with correct credentials (should succeed)
  log.info('\nTest 7: Login with correct credentials');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    const data = await response.json();
    if (data.success && data.data.accessToken) {
      log.success('Login successful');
      accessToken = data.data.accessToken;
    } else {
      log.error('Login failed');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  // Test 8: Access protected route without token (should fail)
  log.info('\nTest 8: Access protected route without token (should fail)');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`);
    const data = await response.json();
    if (!data.success && response.status === 401) {
      log.success('Unauthorized access blocked ✓');
    } else {
      log.error('Protected route accessible without token (security issue!)');
    }
  } catch (error) {
    log.error(`Error: ${error.message}`);
  }

  // Test 9: Access protected route with valid token (should succeed)
  if (accessToken) {
    log.info('\nTest 9: Access protected route with valid token');
    try {
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success && data.data.user) {
        log.success('Protected route accessible with valid token ✓');
        log.info(`User: ${data.data.user.email}`);
      } else {
        log.error('Could not access protected route');
      }
    } catch (error) {
      log.error(`Error: ${error.message}`);
    }
  }

  // Test 10: Refresh token (should succeed)
  if (refreshToken) {
    log.info('\nTest 10: Refresh access token');
    try {
      const response = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const data = await response.json();
      if (data.success && data.data.accessToken) {
        log.success('Token refresh successful ✓');
        log.success(`New access token: ${data.data.accessToken.substring(0, 20)}...`);
      } else {
        log.error('Token refresh failed');
      }
    } catch (error) {
      log.error(`Error: ${error.message}`);
    }
  }

  // Test 11: Logout (should succeed)
  if (accessToken) {
    log.info('\nTest 11: Logout');
    try {
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        log.success('Logout successful ✓');
      } else {
        log.error('Logout failed');
      }
    } catch (error) {
      log.error(`Error: ${error.message}`);
    }
  }

  console.log('\n=== Tests Completed ===\n');
}

// Run tests
runTests().catch(console.error);
