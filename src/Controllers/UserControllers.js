
import User from '../Entitys/User.js';
import { getAllDocs, addDoc, getDocById, updateDocById, deleteDocById, getAllWithFilter } from '../Services/Commonserve.js';
import bcrypt from 'bcrypt';

// Get all users
const getAllUsers = async (req, res) => {
  const result = await getAllDocs(User);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: result.error
    });
  }

  if (result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No users found",
      data: []
    });
  }

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    count: result.data.length,
    data: result.data
  });
};

// Create a new user
const createUser = async (req, res) => {
  const result = await addDoc(req.body, User);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: result.error
    });
  }

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: result.data
  });
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  const result = await getDocById(id, User);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: result.error
    });
  }

  if (!result.data) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: result.data
  });
};

// Update user by ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const result = await updateDocById(id, req.body, User);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Failed to update user",
      error: result.error
    });
  }

  if (!result.data) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: result.data
  });
};

// Delete user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await deleteDocById(id, User);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: result.error
    });
  }

  if (!result.data) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: result.data
  });
};

// Get users with filter and pagination
const getUsersWithFilter = async (req, res) => {
  const { page = 1, limit = 10, ...filterFields } = req.query;

  // Build filter object from query params
  const filter = {};
  if (filterFields.username) filter.username = { $regex: filterFields.username, $options: 'i' };
  if (filterFields.email) filter.email = { $regex: filterFields.email, $options: 'i' };
  if (filterFields.role) filter.role = filterFields.role;
  if (filterFields.status) filter.status = filterFields.status;
  if (filterFields.phone) filter.phone = { $regex: filterFields.phone, $options: 'i' };
  if (filterFields.address) filter.address = { $regex: filterFields.address, $options: 'i' };
  if (filterFields.userId) filter.userId = filterFields.userId;

  const result = await getAllWithFilter(filter, page, limit, User);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: result.error
    });
  }

  if (result.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No users found with the given filters",
      data: [],
      pagination: result.pagination
    });
  }

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    count: result.data.length,
    data: result.data,
    pagination: result.pagination
  });
};
// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email only (without password in query)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null
      });
    }

    // Compare provided password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null
      });
    }

    // Remove password from response data for security
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userWithoutPassword
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};
// User logout
const logout = async (req, res) => {
  // Logout logic here
  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};
// User registration
const register = async (req, res) => {
  const { email, password, phone, } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
        data: null
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Prepare user data with hashed password
    const userData = {
      email,
      password: hashedPassword,
      phone,
    };

    // Use CommonServe addDoc to create user with unique ID
    const result = await addDoc(userData, User);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Failed to register user",
        error: result.error
      });
    }

    // Remove password from response data for security
    const { password: _, ...userWithoutPassword } = result.data.toObject();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: userWithoutPassword
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export default {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersWithFilter,
  login,
  logout,
  register
};