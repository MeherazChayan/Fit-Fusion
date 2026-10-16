const express = require('express');
const {
    createUser,
    loginUser,
    getUserProfile,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
} = require('../controller/UserController'); // <- keep "controller", not "controllers"
const authMiddleware = require('../middleware/AuthMiddleware');
const adminOnly = require('../middleware/AdminMiddleware');

const router = express.Router();

// PUBLIC ROUTES
// signup
router.post('/', createUser);        // frontend create-account form posts here
router.post('/create', createUser);  // legacy alias
// login
router.post('/login', loginUser);

// LOGGED-IN USER ROUTES
router.get('/me', authMiddleware, getUserProfile);
router.put('/update', authMiddleware, updateUser);
router.delete('/delete', authMiddleware, deleteUser);

// ADMIN-ONLY ROUTES
router.get('/all', authMiddleware, adminOnly, getAllUsers);
router.get('/:id', authMiddleware, adminOnly, getUserById);
router.put('/:id', authMiddleware, adminOnly, updateUserById);
router.delete('/:id', authMiddleware, adminOnly, deleteUserById);

module.exports = router;
