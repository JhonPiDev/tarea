const user = JSON.parse(localStorage.getItem('user'));
const userList = document.getElementById('userList');
const logoutButton = document.getElementById('logoutButton');

if (!user || user.role !== 'admin') {
    window.location.href = 'index.html';
}

async function cargarUsuarios() {
    try {
        const res = await fetch(`${window.API_URL}/api/admin/users`);
        if (!res.ok) {
            throw new Error('Error al cargar los usuarios');
        }
        const users = await res.json();
        userList.innerHTML = '';
        users.forEach(u => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center py-2';
            li.innerHTML = `
                <span>${u.name} - ${u.email} (${u.role})</span>
                ${u.id !== user.id ? `
                    <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200" data-id="${u.id}">Eliminar</button>
                ` : ''}
            `;
            userList.appendChild(li);
        });

        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                    try {
                        const res = await fetch(`${window.API_URL}/api/admin/users/${userId}`, {
                            method: 'DELETE'
                        });
                        if (!res.ok) {
                            const data = await res.json();
                            throw new Error(data.message || 'Error al eliminar el usuario');
                        }
                        cargarUsuarios();
                    } catch (error) {
                        console.error(error);
                        alert(error.message);
                    }
                }
            });
        });
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los usuarios');
    }
}

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

cargarUsuarios();