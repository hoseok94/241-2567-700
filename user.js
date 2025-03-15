const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        const userList = document.getElementById('user-list');

        let htmlData = '';
        response.data.forEach(user => {
            htmlData += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td class="button-container">
                        <a href='index2(update).html?id=${user.id}' class="edit-btn">Edit</a>
                        <button class="delete-btn" data-id="${user.id}">Delete</button>
                    </td>
                </tr>
            `;
        });

        userList.innerHTML = htmlData;

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ ID ${id}?`)) {
                    try {
                        await axios.delete(`${BASE_URL}/users/${id}`);
                        loadData(); // Refresh data
                    } catch (error) {
                        console.error('Error deleting user', error);
                        alert('ลบข้อมูลไม่สำเร็จ');
                    }
                }
            });
        });

    } catch (error) {
        console.error('Error fetching user data', error);
    }
};

// Search user function
document.getElementById('search').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
    });
});
