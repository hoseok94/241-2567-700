const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8000;
app.use(bodyParser.json());

let users = [];
let counter = 1;
let conn = null;
const initMYSQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8830
        
    })
/*app.get('/testdbnew', async (req, res) => {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'webdb',
            port: 8830
        });
        const [results] = await conn.query('SELECT * FROM users');
        res.json(results[0]);
    } catch (error) {
        console.log('error', error.message);
        res.status(500).json({ error: 'Error fetching users' });
    }
}); */

/*
GET /users สำหรับแสดงข้อมูล users ทั้งหมดที่บันทึกไว้
POST /user สำหรับสร้างข้อมูล users ใหม่บันทึกเข้าไป
GET /user/:id สำหรับดึง users รายคนออกมา
PUT /user/:id สำหรับแก้ไขusers รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /user/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', async(req, res) => {
   /* const filterUsers = users.map(user => {
        return {
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.firstname + ' ' + user.lastname
        };
    });
    res.json(filterUsers);*/
    const result = await conn.query('SELECT * FROM users');
    res.json(result[0])
});

// path = POST /user สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', async (req, res) => {
    let user = req.body;
    user.id = counter;
    const result = await conn.query('INSERT INTO users SET?',user)
    console.log('results',results)

    res.json({
        message: 'Create new user successfully',
        data:results[0]
    })
})

// path = GET /user/:id สำหรับ get users รายคนที่บันทึกไว้
app.get('/user/:id', (req, res) => {
    let id = req.params.id;
    //ค้นหา user ที่ต้องการดึงข้อมูล
    let selectedIndex = users.findIndex(user => user.id == id);
    res.json(users[selectedIndex]);
});

//path: PUT /user/:id ใช้สำหรับแก้ไขข้อมูล user ที่มี id ตามที่ระบุ
app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    // ค้นหา user ที่ต้องการแก้ไข
    let selectedIndex = users.findIndex(user => user.id == id);

        users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname;
        users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname;
        users[selectedIndex].age = updateUser.age || users[selectedIndex].age;
        users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender;

    res.json({
        message: 'Update user successfully',
        data: {
            user: updateUser,
            indexUpdated: selectedIndex
        }
    })
})

// path: DELETE /user/:id ใช้สำหรับลบข้อมูล user ที่มี id ตามที่ระบุ
app.delete('/users/:id', (req, res) => {
    let id = req.params.id;
    // หา index ของ user ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id);
    //ลบ
    users.splice(selectedIndex, 1);
    res.json({
        message: 'Delete user successfully',
        indexDeleted: selectedIndex
    });
});

app.listen(port, async () => {
    await initMYSQL();
    console.log('Http Server is running on port ' + port);
})}
