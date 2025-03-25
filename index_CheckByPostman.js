const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();


const port = 8000;

app.use(bodyParser.json());
app.use(cors());

// Initialize a variable to store the MySQL connection
let conn = null;

// Function to initialize MySQL connection
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8821
    });
};

// Route to register a new user (POST /register)
app.post('/users', async (req, res) => {
    const { firstname, lastname, email, password, age, gender, interests, description } = req.body;

    if (!firstname || !lastname || !email || !password || !age || !gender) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const [userResults] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userResults.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert the new user into the database
        const [results] = await conn.query(
            'INSERT INTO users (firstname, lastname, email, password, age, gender, interests, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                firstname,
                lastname,
                email,
                password,  // Store the plain text password
                age,
                gender,
                JSON.stringify(interests),  // Convert interests array to JSON
                description
            ]
        );

        res.json({
            message: 'User registered successfully',
            userId: results.insertId
        });
    } catch (error) {
        console.error('Error: ', error.message);
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});

// Route to login (POST /login)
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Query to check if the user exists by email
        const [userResults] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);

        if (userResults.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResults[0];

        // Compare the password with the plain text password in the database
        if (password !== user.password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Return the user data (you can exclude the password or add JWT token generation)
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                age: user.age,
                gender: user.gender,
                interests: user.interests,
                description: user.description
            }
        });
    } catch (error) {
        console.error('Error: ', error.message);
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});

// Route to get all users
app.get('/users', async (req, res) => {
    const [results] = await conn.query('SELECT * FROM users');
    res.json(results);
});

// Route to get a user by ID
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            throw { statusCode: 404, message: 'User not found' };
        }
    } catch (error) {
        console.error('Error: ', error.message);
        let statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});

// Route to update a user by ID
app.put('/users/:id', async (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    
    try {
        // Validate the presence of required fields
        if (!updateUser.firstname || !updateUser.lastname || !updateUser.email || !updateUser.password || !updateUser.age || !updateUser.gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Update the user in the database
        const [result] = await conn.query(
            'UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ?, age = ?, gender = ?, interests = ?, description = ? WHERE id = ?',
            [
                updateUser.firstname,
                updateUser.lastname,
                updateUser.email,
                updateUser.password,
                updateUser.age,
                updateUser.gender,
                JSON.stringify(updateUser.interests), // Convert interests array to JSON
                updateUser.description,
                id
            ]
        );

        res.json({
            message: 'Update user successfully',
            data: result
        });
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({
            message: "Something went wrong",
            errorMessage: error.message
        });
    }
});

// Route to delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({
            message: 'Delete user successfully',
            data: results
        });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});


// Start the server
app.listen(port, async () => {
    await initMySQL();
    console.log('Http Server is running on port ' + port);
});
