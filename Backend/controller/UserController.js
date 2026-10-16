const jwt = require('jsonwebtoken');
const User = require('../models/UserModel'); // if your folder is different, adjust this path

// Helper to generate a JWT
function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id,
            isAdmin: user.isAdmin || false,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// POST /api/users/  (public)
// Create new user (signup)
const createUser = async (req, res) => {
    try {
        const {
            username,
            name,
            email,
            phoneNumber,
            phone,
            password,
            dob,
            dateOfBirth,
            height,
            weight,
        } = req.body;

        // normalize possible field names from frontend
        const finalUsername = username || name;
        const finalPhone = phoneNumber || phone;
        const finalDob = dob || dateOfBirth;

        // required fields
        if (!finalUsername || !email || !finalPhone || !password || !finalDob) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // check duplicates
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingPhone = await User.findOne({ phoneNumber: finalPhone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already in use' });
        }

        const existingUsername = await User.findOne({ username: finalUsername });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        // create user
        const newUser = new User({
            username: finalUsername,
            email,
            phoneNumber: finalPhone,
            password,                // will be hashed by pre('save') in model
            dob: new Date(finalDob), // ensure Date type
            height: height || undefined,
            weight: weight || undefined,
            // isAdmin defaults to false
        });

        await newUser.save();

        return res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                isAdmin: newUser.isAdmin || false,
            },
        });
    } catch (err) {
        console.error('createUser error:', err);

        // duplicate key or validation style errors
        if (err && err.code === 11000) {
            return res.status(400).json({
                message: 'Account already exists (duplicate key)',
            });
        }

        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: 'Server error while creating user' });
    }
};

// POST /api/users/login  (public)
// Log in and return token + profile info
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // check password
        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // sign token
        const token = generateToken(user);

        // send back full info the dashboard might need
        return res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                dob: user.dob,
                height: user.height,
                weight: user.weight,
                isAdmin: user.isAdmin || false,

                age: user.age,            // virtuals from model
                BMI: user.BMI,
                calories: user.calories,
            },
        });
    } catch (err) {
        console.error('loginUser error:', err);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

// GET /api/users/me   (auth required)
// Return the logged-in user's profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dob: user.dob,
            height: user.height,
            weight: user.weight,
            isAdmin: user.isAdmin || false,

            age: user.age,
            BMI: user.BMI,
            calories: user.calories,

            createdAt: user.createdAt,
        });
    } catch (err) {
        console.error('getUserProfile error:', err);
        return res.status(500).json({ message: 'Server error getting profile' });
    }
};

// PUT /api/users/update   (auth required)
// Update the logged-in user's own info
const updateUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, phoneNumber, height, weight } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username !== undefined) user.username = username;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (height !== undefined) user.height = height;
        if (weight !== undefined) user.weight = weight;

        await user.save();

        return res.json({
            message: 'Profile updated',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                height: user.height,
                weight: user.weight,
                isAdmin: user.isAdmin || false,
            },
        });
    } catch (err) {
        console.error('updateUser error:', err);
        return res.status(500).json({ message: 'Server error updating profile' });
    }
};

// DELETE /api/users/delete   (auth required)
// Delete your own account
const deleteUser = async (req, res) => {
    try {
        const userId = req.userId;

        const deleted = await User.findByIdAndDelete(userId);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'Account deleted' });
    } catch (err) {
        console.error('deleteUser error:', err);
        return res.status(500).json({ message: 'Server error deleting account' });
    }
};

// ADMIN-TYPE (should require adminOnly in routes)

// GET /api/users/all
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.json(users);
    } catch (err) {
        console.error('getAllUsers error:', err);
        return res.status(500).json({ message: 'Server error fetching users' });
    }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const targetId = req.params.id;
        const user = await User.findById(targetId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    } catch (err) {
        console.error('getUserById error:', err);
        return res.status(500).json({ message: 'Server error getting user' });
    }
};

// PUT /api/users/:id
const updateUserById = async (req, res) => {
    try {
        const targetId = req.params.id;
        const updates = req.body;

        const updated = await User.findByIdAndUpdate(
            targetId,
            updates,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({
            message: 'User updated',
            user: updated,
        });
    } catch (err) {
        console.error('updateUserById error:', err);
        return res.status(500).json({ message: 'Server error updating user' });
    }
};

// DELETE /api/users/:id
const deleteUserById = async (req, res) => {
    try {
        const targetId = req.params.id;

        const deleted = await User.findByIdAndDelete(targetId);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'User deleted' });
    } catch (err) {
        console.error('deleteUserById error:', err);
        return res.status(500).json({ message: 'Server error deleting user' });
    }
};

// export everything for routes
module.exports = {
    createUser,
    loginUser,
    getUserProfile,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};
