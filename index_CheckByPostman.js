const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8000;

app.use(bodyParser.json());

let users = []
let counter = 1

/*
GET /users สำหรับแสดงข้อมูล user ทั้งหมดที่บันทึกไว้
POST /user สำหรับสร้างข้อมูล user ใหม่บันทึกเข้าไป
GET /user/:id สำหรับดึง user รายคนออกมา
PUT /user/:id สำหรับแก้ไขuser รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /user/:id สำหรับลบ user รายคน (ตาม id ที่บันทึกเข้าไป)
*/

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', (req, res) => {
    res.json(users);
})

// path = POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1 //ทุกครั้งที่มีการสร้าง user ใหม่ ให้ counter บวก 1
    users.push(user);
    res.json({
        message: 'Create new user successfully',
        user: user
    });
})

//path: PUT /users/:id ใช้สำหรับแก้ไขข้อมูล user ที่มี id ตามที่ระบุ
app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body; 
    // ค้นหา user ที่ต้องการแก้ไข
    let selectedIndex = users.findIndex(user => user.id == id)

     // แก้ไขข้อมูล user 
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname
    }
    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname
    }

    res.json({
        message: 'Update user successfully',
        data: {
            user: updateUser,
            indexUpdated: selectedIndex
        }
    })
})

// path: DELETE /user/:id ใช้สำหรับลบข้อมูล user ที่มี id ตามที่ระบุ
app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    // หา index ของ user ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id)

    //ลบ
    users.splice(selectedIndex, 1)
    res.json({
        message: 'Delete user successfully',
        indexDeleted: selectedIndex
    })
})

app.listen(port, (req, res) => {
    console.log('Http Server is running on post' + port)
});