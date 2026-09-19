const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'codeforge_fallback_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const registerUser = async ({ name, username, email, password }) => {
  // Check if username or email already exists
  const [existingUsers] = await pool.query(
    'SELECT id, username, email FROM users WHERE username = ? OR email = ?',
    [username, email]
  );

  if (existingUsers.length > 0) {
    const isUsername = existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
    const isEmail = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

    const error = new Error(
      isUsername && isEmail
        ? 'Username and email are already in use.'
        : isUsername
        ? 'Username is already taken.'
        : 'Email is already registered.'
    );
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insert user
  const [result] = await pool.query(
    'INSERT INTO users (name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [name, username, email, passwordHash, 'USER']
  );

  const newUser = {
    id: result.insertId,
    name,
    username,
    email,
    role: 'USER'
  };

  const token = generateToken(newUser);

  return {
    user: newUser,
    token
  };
};

const loginUser = async ({ identifier, password }) => {
  const [users] = await pool.query(
    'SELECT id, name, username, email, password_hash, role FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  );

  if (users.length === 0) {
    const error = new Error('Invalid username/email or password.');
    error.statusCode = 401;
    throw error;
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    const error = new Error('Invalid username/email or password.');
    error.statusCode = 401;
    throw error;
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role
  };

  const token = generateToken(userPayload);

  return {
    user: userPayload,
    token
  };
};

const getCurrentUser = async (userId) => {
  const [users] = await pool.query(
    'SELECT id, name, username, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (users.length === 0) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return users[0];
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
