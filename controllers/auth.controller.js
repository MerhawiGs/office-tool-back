const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Helper function to generate access token
const generateAccessToken = (userId, username, email, role) => {
  return jwt.sign(
    { id: userId, username, email, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '15m' }
  );
};

// Helper function to generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
};


// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, username, officeId, role } = req.body;

    // Check if user already exists (email or username)
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: existingUser.email === email ? "User with this email already exists" : "Username already taken"
      });
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
      officeId,
      role: role || 'employee' // Default to employee if not specified
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id, newUser.username, newUser.email, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);

    // Save refresh token to database
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({ 
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username,
          email: newUser.email,
          officeId: newUser.officeId,
          role: newUser.role
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('firstName lastName username email officeId role isActive lastLogin createdAt');
        res.json({ 
            success: true,
            data: { users }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Find user by email or username and explicitly select password field
    const user = await User.findOne({ 
      $or: [{ email: email || '' }, { username: username || '' }]
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const lockTimeRemaining = Math.ceil((user.accountLockedUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({ 
        success: false,
        message: `Account is locked. Please try again in ${lockTimeRemaining} minutes.`
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: "Your account has been deactivated. Please contact administrator."
      });
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Lock account after 5 failed attempts for 10 minutes
      if (user.failedLoginAttempts >= 5) {
        user.accountLockedUntil = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        
        return res.status(403).json({ 
          success: false,
          message: "Account locked due to multiple failed login attempts. Please try again after 10 minutes."
        });
      }

      await user.save();

      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password",
        attemptsRemaining: 5 - user.failedLoginAttempts
      });
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = undefined;
    user.lastLogin = new Date();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.username, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          officeId: user.officeId,
          role: user.role,
          lastLogin: user.lastLogin
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: "Refresh token is required" 
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token matches
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid refresh token" 
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.username, user.email, user.role);

    res.json({ 
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid or expired refresh token" 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error during token refresh',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// LOGOUT
exports.logout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove refresh token from database
    await User.findByIdAndUpdate(userId, { 
      refreshToken: null 
    });

    res.json({ 
      success: true,
      message: "Logged out successfully" 
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({ 
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          officeId: user.officeId,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
