const BASE_URL = 'http://localhost:8001';

window.onload = async () => {
  await loadProfileData();
};

const loadProfileData = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("กรุณาเข้าสู่ระบบก่อน");
    window.location.href = "index2(update).html"; // เปลี่ยนไปหน้าเข้าสู่ระบบหากไม่ได้ล็อกอิน
    return;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    const user = response.data;
    
    // กรอกข้อมูลใน HTML
    document.getElementById('firstname').innerText = user.firstname || 'ไม่มีชื่อ';
    document.getElementById('lastname').innerText = user.lastname || 'ไม่มีนามสกุล';
    document.getElementById('age').innerText = user.age || 'ไม่มีข้อมูลอายุ';
    document.getElementById('gender').innerText = user.gender || 'ไม่มีข้อมูลเพศ';
    
    // จัดการกับ interests ที่เป็น JSON
    if (user.interests) {
      try {
        // ถ้า interests เป็น JSON string ให้แปลงเป็น array
        let interestsArray = user.interests;
        if (typeof user.interests === 'string') {
          interestsArray = JSON.parse(user.interests);
        }
        
        // ถ้าเป็น array ให้แสดงเป็น string คั่นด้วยเครื่องหมายจุลภาค
        if (Array.isArray(interestsArray)) {
          document.getElementById('interests').innerText = interestsArray.join(', ');
        } else {
          document.getElementById('interests').innerText = String(user.interests);
        }
      } catch (e) {
        // ถ้าแปลงเป็น JSON ไม่ได้ ให้แสดงเป็น string ธรรมดา
        document.getElementById('interests').innerText = String(user.interests);
      }
    } else {
      document.getElementById('interests').innerText = 'ไม่มีข้อมูลงานอดิเรก';
    }
    
    document.getElementById('description').innerText = user.description || 'ไม่มีรายละเอียดเพิ่มเติม';
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    alert('ไม่สามารถโหลดข้อมูลได้');
  }
};
function toggleMenu() {
    const menu = document.querySelector('.menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }