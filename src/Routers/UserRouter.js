
import express from 'express';
import UserController from '../Controllers/UserControllers.js';

const router = express.Router();

// Authentication routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

// User CRUD routes
router.get('/getAll', UserController.getAllUsers);
router.get('/filter', UserController.getUsersWithFilter);
router.post('/create', UserController.createUser);
router.get('/get/:id', UserController.getUserById);
router.put('/update/:id', UserController.updateUser);
router.delete('/delete/:id', UserController.deleteUser);

export default router;