const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 8001;

app.use(express.json());
app.use(cors());

let conn = null;

// 🔹 เชื่อมต่อ MySQL
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8821
    });
};

// ✅ ลงทะเบียนผู้ใช้
app.post('/users', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' });
    }

    try {
        const [userResults] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userResults.length > 0) {
            return res.status(400).json({ message: 'Email นี้ถูกใช้งานแล้ว' });
        }

        const [results] = await conn.query(
            'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
            [firstname, lastname, email, password]
        );

        res.json({ message: 'ลงทะเบียนสำเร็จ', userId: results.insertId });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// 🔑 เข้าสู่ระบบ
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'กรุณากรอก Email และรหัสผ่าน' });
    }

    try {
        const [userResults] = await conn.query(
            'SELECT * FROM users WHERE email = ? AND password = ?', 
            [email, password]
        );

        if (userResults.length === 0) {
            return res.status(401).json({ message: 'Email หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const user = userResults[0];
        res.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// 🔍 ดึงข้อมูลผู้ใช้ทั้งหมด
app.get('/users', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT id, firstname, lastname, email FROM users');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// 🔍 ดึงข้อมูลผู้ใช้ตาม ID
// ดึงข้อมูลผู้ใช้ตาม ID
app.get('/users/:id', async (req, res) => {
    try {
      let id = req.params.id;
      const [results] = await conn.query(
        'SELECT id, firstname, lastname, email, age, gender, interests, description FROM users WHERE id = ?', 
        [id]
      );
      
      if (results.length > 0) {
        if (results[0].interests && typeof results[0].interests === 'string') {
          try {
            results[0].interests = JSON.parse(results[0].interests);
          } catch (e) {
            // ถ้าแปลงไม่ได้ ให้ใช้ค่าเดิม
          }
        }
        
        res.json(results[0]);
      } else {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
      }
    } catch (error) {
      res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
  });

// 🔄 อัปเดตข้อมูลผู้ใช้
app.put('/users/:id', async (req, res) => {
    let id = req.params.id;
    let { firstname, lastname, email } = req.body;
    
    if (!firstname || !lastname || !email) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    try {
        const [result] = await conn.query(
            'UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?',
            [firstname, lastname, email, id]
        );

        res.json({ message: 'อัปเดตข้อมูลสำเร็จ' });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// ❌ ลบผู้ใช้
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        await conn.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'ลบผู้ใช้สำเร็จ' });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// 🚀 เริ่มเซิร์ฟเวอร์
app.listen(port, async () => {
    await initMySQL();
    console.log(`Server is running on port ${port}`);
});
