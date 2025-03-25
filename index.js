const BASE_URL = 'http://localhost:8000';
let mod = 'CREATE';
let selectedId = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        mod = 'EDIT';
        selectedId = id;

        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            const user = response.data;

            document.querySelector("input[name=firstname]").value = user.firstname;
            document.querySelector("input[name=lastname]").value = user.lastname;
            document.querySelector("input[name=age]").value = user.age;
            document.querySelector("textarea[name=description]").value = user.description;

            document.querySelectorAll("input[name=gender]").forEach(genderDOM => {
                if (genderDOM.value == user.gender) {
                    genderDOM.checked = true;
                }
            });

            document.querySelectorAll("input[name=interest]").forEach(interestDOM => {
                if (user.interests.includes(interestDOM.value)) {
                    interestDOM.checked = true;
                }
            });

        } catch (error) {
            console.log('error', error);
        }
    }
};

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        icon.textContent = "🙈"; // เปลี่ยนเป็นไอคอนตาปิด
    } else {
        input.type = "password";
        icon.textContent = "👁️"; // เปลี่ยนกลับเป็นไอคอนตาเปิด
    }
}
function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
  

function toggleForm(formId) {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("profileForm").style.display = "none";

    document.getElementById(formId).style.display = "block";
}

const register = async () => {
    let emailDOM = document.querySelector('#email');
    let passwordDOM = document.querySelector('#password');
    let confirmPasswordDOM = document.querySelector('#confirmPassword');
    let messageDOM = document.getElementById('message');

    if (passwordDOM.value !== confirmPasswordDOM.value) {
        messageDOM.innerText = "รหัสผ่านไม่ตรงกัน";
        messageDOM.className = 'message danger';
        return;
    }

    try {
        await axios.post(`${BASE_URL}/users`, {
            email: emailDOM.value,
            password: passwordDOM.value,
        });

        toggleForm('profileForm'); // ไปหน้ากรอกข้อมูลส่วนตัว
    } catch (error) {
        messageDOM.innerText = "เกิดข้อผิดพลาดในการสมัครสมาชิก";
        messageDOM.className = 'message danger';
    }
};

const login = async () => {
    let emailDOM = document.querySelector('#loginEmail');
    let passwordDOM = document.querySelector('#loginPassword');
    let messageDOM = document.getElementById('message');

    try {
        // ส่งข้อมูลอีเมลและรหัสผ่านไปยัง API
        const response = await axios.post(`${BASE_URL}/users/login`, {
            email: emailDOM.value,
            password: passwordDOM.value,
        });

        const userId = response.data.id; // รับ userId จากเซิร์ฟเวอร์

        // เก็บ userId ไว้ใน localStorage เพื่อใช้ในภายหลัง
        localStorage.setItem('userId', userId);

        // แสดงข้อความสำเร็จและไปยังหน้าโปรไฟล์
        messageDOM.innerText = "เข้าสู่ระบบสำเร็จ";
        messageDOM.className = 'message success';
        window.location.href = "profile.html";
    } catch (error) {
        // จัดการข้อผิดพลาด
        console.error('Error during login:', error.message);
        messageDOM.innerText = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        messageDOM.className = 'message danger';
    }
};
const logout = () => {
    localStorage.removeItem('userId'); // ลบ userId ออกจาก localStorage
    alert('ออกจากระบบสำเร็จ');
    window.location.href = "index2(update).html"; // กลับไปที่หน้า Login
};


const validateData = (userData) => {
    let errors = [];
    if (!userData.firstName) errors.push('กรุณากรอกชื่อ');
    if (!userData.lastName) errors.push('กรุณากรอกนามสกุล');
    if (!userData.age) errors.push('กรุณากรอกอายุ');
    if (!userData.gender) errors.push('กรุณาเลือกเพศ');
    if (!userData.interests.length) errors.push('กรุณาเลือกงานอดิเรก');
    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked') || null;
    let interestDOM = document.querySelectorAll('input[name=interest]:checked');
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let messageDOM = document.getElementById('message');

    try {
        let interests = Array.from(interestDOM).map(checkbox => checkbox.value).join(',');


        let userData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM ? genderDOM.value : '',
            interests: interests,
            description: descriptionDOM ? descriptionDOM.value.trim() : '',
        };

        const errors = validateData(userData);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบถ้วน', errors };
        }

        let message = 'บันทึกข้อมูลเรียบร้อย';
        if (mod === 'CREATE') {
            await axios.post(`${BASE_URL}/users`, userData);
        } else {
            await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
        }

        messageDOM.innerText = message;
        messageDOM.className = 'message success';

    } catch (error) {
        let htmlData = `<div>
            <div>${error.message}</div>
            <ul>${error.errors.map(err => `<li>${err}</li>`).join('')}</ul>
        </div>`;

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
};

document.getElementById("go-to-user").addEventListener("click", function(event) {
    event.preventDefault();
    let sushi = document.getElementById("sushi");

    sushi.style.display = "block";
    sushi.style.animation = "roll 1s linear forwards";

    setTimeout(() => {
        window.location.href = "user.html";
    }, 500);
});
