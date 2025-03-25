const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());
let conn = null;

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8821
    });
};

app.get('/users', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM users');
        res.json(results[0]);
    } catch (error) {
        console.error('Error: ', error.message);
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});

app.post('/users', async (req, res) => {
    try {
        const user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', user);
        res.json({
            message: 'Create user successfully',
            data: results[0]
        });
    } catch (error) {
        console.error('Error: ', error.message);
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id);
        if (results[0].length > 0) {
            res.json(results[0][0]);
        } else {
            throw { status: 404, message: 'User not found' };
        }
    } catch (error) {
        console.error('Error: ', error.message);
        let statusCode = error.status || 500;
        res.status(statusCode).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});

app.put('/users/:id', async (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    try {
        const [result] = await conn.query(
            'UPDATE users SET ? WHERE id = ?', 
            [updateUser, id]
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

app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const results = await conn.query('DELETE FROM users WHERE id = ?', id);    
        res.json({
            message: 'Delete user successfully',
            data: results[0]
        });
    } catch (error) {
        console.log('Error: ', error.message);
        res.status(500).json({
            message: 'Something went wrong',
            errorMessage: error.message
        });
    }
});

app.listen(port, async () => {
    await initMySQL();
    console.log('Http Server is running on port ' + port);
});
