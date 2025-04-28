const user = JSON.parse(localStorage.getItem('user'));
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDescription = document.getElementById('taskDescription');
const taskList = document.getElementById('taskList');
const editModal = document.getElementById('editModal');
const editTaskForm = document.getElementById('editTaskForm');
const editTaskId = document.getElementById('editTaskId');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDescription = document.getElementById('editTaskDescription');
const cancelEdit = document.getElementById('cancelEdit');
const logoutButton = document.getElementById('logoutButton');

if (!user) {
    window.location.href = 'index.html';
}

async function cargarTareas() {
    try {
        const res = await fetch(`http://localhost:3000/api/users/tasks/${user.id}`);
        if (!res.ok) {
            throw new Error('Error al cargar las tareas');
        }
        const tasks = await res.json();
        taskList.innerHTML = '';
        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-start py-2';
            li.innerHTML = `
                <div>
                    <span class="font-medium">${t.title}</span>
                    ${t.description ? `<p class="text-gray-600 text-sm">${t.description}</p>` : ''}
                </div>
                <div class="space-x-2">
                    <button class="edit-btn bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200" data-id="${t.id}" data-title="${t.title}" data-description="${t.description || ''}">Editar</button>
                    <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200" data-id="${t.id}">Eliminar</button>
                </div>
            `;
            taskList.appendChild(li);
        });

        // Añadir event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.dataset.id;
                const title = e.target.dataset.title;
                const description = e.target.dataset.description;
                editTaskId.value = taskId;
                editTaskTitle.value = title;
                editTaskDescription.value = description;
                editModal.classList.remove('hidden');
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const taskId = e.target.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                    try {
                        const res = await fetch(`http://localhost:3000/api/users/tasks/${taskId}`, {
                            method: 'DELETE'
                        });
                        if (!res.ok) {
                            throw new Error('Error al eliminar la tarea');
                        }
                        cargarTareas();
                    } catch (error) {
                        console.error(error);
                        alert(error.message);
                    }
                }
            });
        });
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las tareas');
    }
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value;
    const description = taskDescription.value;
    if (!title) return;

    try {
        const res = await fetch('http://localhost:3000/api/users/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, title, description })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Error al agregar la tarea');
        }

        taskInput.value = '';
        taskDescription.value = '';
        cargarTareas();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

editTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskId = editTaskId.value;
    const title = editTaskTitle.value;
    const description = editTaskDescription.value;

    try {
        const res = await fetch(`http://localhost:3000/api/users/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Error al actualizar la tarea');
        }

        editModal.classList.add('hidden');
        cargarTareas();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

cancelEdit.addEventListener('click', () => {
    editModal.classList.add('hidden');
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

cargarTareas();