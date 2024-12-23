const BASE_URL = 'http://localhost:8000'; 

window.onload = async () => {
    await loadData();
}
    const loadData = async () => {
        console.log("User page loaded");
        // 1. โหลด user ทั้งหมดจาก API
        const response = await axios.get(`${BASE_URL}/users`);
        console.log(response.data);

        const userDOM = document.getElementById('users');

        // 2. แสดง user ใน HTML
        let htmlData = '<div>';
        response.data.forEach(user => {
            htmlData += `<div>'
                    ${user.id} ${user.firstname} ${user.lastname}
                    <a href='index2(update).html?id=${user.id}'><button>Edit</button>
                    <button class='delete' data-id='${user.id}'>Delete</button>
                    </div>`;
        });
        htmlData += '</div>';
        userDOM.innerHTML = htmlData;

        // 3. ลบ user
        const deleteDOM = document.getElementsByClassName('delete');
        for (let i = 0; i < deleteDOM.length; i++) {
            deleteDOM[i].addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                try {
                    await axios.delete(`${BASE_URL}/users/${id}`);
                    loadData();
                } catch (error) {
                    console.error('Delete error:', error);
                }
            })
        }
    }
