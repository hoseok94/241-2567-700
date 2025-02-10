const http = require('http'); //เรียกใช้งาน http module
const host = 'localhost'; //กำหนด host
const port = 8000; //กำหนด port

//เมื่อเปิด เว็บไปที่ http://localhost:8000/ จะเรียกใช้งาน function requestListener
const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('My first server!');
}
const server = http.createServer(requestListener); //สร้าง server ด้วย http.createServer โดยใช้ requestListener
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
}); //เริ่มต้น server ด้วย server.listen โดยใช้ port 8000 และ host localhost
