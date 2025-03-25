const loadProfileData = async () => {
    const userId = localStorage.getItem('userId');
    console.log('UserId:', userId); // ตรวจสอบว่า userId คืออะไร
    if (!userId) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        window.location.href = "index2(update).html";
        return;
    }

    try {
        const response = await axios.get(`${BASE_URL}/users/${userId}`);
        console.log('API Response:', response.data); // ตรวจสอบข้อมูลที่ดึงมา
        const user = response.data;

        document.getElementById('firstname').innerText = user.firstname || 'ไม่มีชื่อ';
        document.getElementById('lastname').innerText = user.lastname || 'ไม่มีนามสกุล';
        document.getElementById('age').innerText = user.age || 'ไม่มีข้อมูลอายุ';
        document.getElementById('gender').innerText = user.gender || 'ไม่มีข้อมูลเพศ';
        document.getElementById('interests').innerText = user.interests ? user.interests.join(', ') : 'ไม่มีข้อมูลงานอดิเรก';
        document.getElementById('description').innerText = user.description || 'ไม่มีรายละเอียดเพิ่มเติม';
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        alert('ไม่สามารถโหลดข้อมูลได้');
    }
};
