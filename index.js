const BASE_URL = 'http://localhost:8000'; 
let mod = 'CREATE';
let selectedId = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);

    if (id) {
        mod = 'EDIT';
        selectedId = id;

        // 1. ดึง user ที่ต้องการแก้ไข
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            console.log('data', response.data);
            const user = response.data;

            // 2. นำข้อมูล user ที่ดึงมา ใส่ใน input ที่มี
            let firstNameDOM = document.querySelector("input[name=firstname]");
            let lastNameDOM = document.querySelector("input[name=lastname]");
            let ageDOM = document.querySelector("input[name=age]");
            let descriptionDOM = document.querySelector("textarea[name=description]");

            firstNameDOM.value = user.firstname;
            lastNameDOM.value = user.lastname;
            ageDOM.value = user.age;
            descriptionDOM.value = user.description;

            let genderDOM = document.querySelectorAll("input[name=gender]");
            let interestDOM = document.querySelectorAll("input[name=interest]");

            for (let i = 0; i < genderDOM.length; i++) {
                if (genderDOM[i].value == user.gender) {
                    genderDOM[i].checked = true;
                }
            }

            for (let i = 0; i < interestDOM.length; i++) {
                if (user.interests.includes(interestDOM[i].value)) {
                    interestDOM[i].checked = true;
                }
            }

        } catch (error) {
            console.log('error', error);
        }
    }
};

const validateData = (userData) => {
    let errors = [];
    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ');
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกงานอดิเรก');
    }
    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked') || null;
    let interestDOM = document.querySelectorAll('input[name=interest]:checked') || [];
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let messageDOM = document.getElementById('message');
    
    try {
        
        let interests = '';
        for (let i = 0; i < interestDOM.length; i++) {
            interests += interestDOM[i].value;
            if (i !== interestDOM.length - 1) {
                interests += ',';
            }
        }

        let userData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            interests: interests,
            description: descriptionDOM ? descriptionDOM.value.trim() : '',
        };

        console.log('submitData', userData);

        // Validate data
        const errors = validateData(userData);
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
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
        console.log('error message', error.message);
        console.log('error', error.errors);

        let htmlData = '<div>'; 
        htmlData += '<div>' + error.message + '</div>';
        htmlData += '<ul>';
        
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += '<li>' + error.errors[i] + '</li>';
        }
        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
}
