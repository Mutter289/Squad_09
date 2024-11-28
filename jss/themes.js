const themeToggleBtn = document.getElementById('theme-toggle'); // Botão de alternância do tema
const body = document.body;
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('img') : null; // Ícone no botão (se existir)
const themeSelect = document.getElementById('theme-perfil'); // Select para escolha do tema (se existir)

// Função para aplicar o tema com base no valor
function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        if (themeIcon) themeIcon.src = '../imgs/dark_mode.png'; // Ícone para tema claro
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        if (themeIcon) themeIcon.src = '../imgs/light_mode.png'; // Ícone para tema escuro
        localStorage.setItem('theme', 'dark');
    }

    // Sincronizar o select, se existir
    if (themeSelect) {
        themeSelect.value = theme;
    }
}

// Inicializar tema ao carregar a página
const savedTheme = localStorage.getItem('theme') || 'dark'; // Padrão para 'dark' caso não esteja no localStorage
applyTheme(savedTheme);

// Alternar tema ao clicar no botão de alternância (se existir)
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(currentTheme);
    });
}

// Alterar tema ao mudar o select (se existir)
if (themeSelect) {
    themeSelect.addEventListener('change', (event) => {
        applyTheme(event.target.value);
    });
}
