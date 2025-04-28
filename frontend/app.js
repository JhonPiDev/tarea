const authForm = document.getElementById('authForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleButton = document.getElementById('toggleButton');
const toggleText = document.getElementById('toggleText');
const formTitle = document.getElementById('formTitle');

let isLogin = true;

toggleButton.addEventListener('click', () => {
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = 'Login';
        toggleText.textContent = '¿No tienes cuenta?';
        toggleButton.textContent = 'Regístrate';
        nameInput.classList.add('hidden');
    } else {
        formTitle.textContent = 'Registro';
        toggleText.textContent = '¿Ya tienes cuenta?';
        toggleButton.textContent = 'Iniciar sesión';
        nameInput.classList.remove('hidden');
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;
    const name = nameInput.value;

    const endpoint = isLogin 
        ? 'http://localhost:3000/api/auth/login'
        : 'http://localhost:3000/api/auth/register';

    const body = isLogin 
        ? { email, password }
        : { name, email, password };

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {
        if (isLogin) {
            localStorage.setItem('user', JSON.stringify(data.user));
            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            alert('Registro exitoso, ahora inicia sesión.');
            toggleButton.click(); // Cambia automáticamente a Login
        }
    } else {
        alert(data.message);
    }
});
