// Função para inicializar o IndexedDB e criar a tabela 'gestores'
function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("gestoresDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("gestores")) {
                const store = db.createObjectStore("gestores", { keyPath: "id", autoIncrement: true });
                store.createIndex("nome", "nome", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Função para buscar dados do gestor logado pelo ID
async function loadGestorPerfil() {
    const db = await initIndexedDB();
    const transaction = db.transaction("gestores", "readonly");
    const store = transaction.objectStore("gestores");

    // Pegando o ID do gestor do localStorage
    const gestorId = localStorage.getItem("gestorId");

    if (gestorId) {
        // Buscando o gestor pelo ID
        const gestor = await new Promise((resolve, reject) => {
            const request = store.get(parseInt(gestorId)); // Garantir que o ID seja inteiro
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (gestor) {
            // Atualizando os campos do perfil com as informações do gestor
            document.getElementById("profile-name").textContent = gestor.nome;
            document.getElementById("profile-id").textContent = `ID: ${gestor.id}`;
            document.getElementById("profile-email").textContent = `Email: ${gestor.email || "Não definido"}`; // Exemplo, caso o campo email esteja presente no banco
        } else {
            console.error("Gestor não encontrado.");
            document.getElementById("profile-name").textContent = "Gestor não encontrado.";
        }
    } else {
        console.error("ID do gestor não encontrado no localStorage.");
        document.getElementById("profile-name").textContent = "Usuário não autenticado.";
    }
}

// Inicializar a página de perfil
document.addEventListener("DOMContentLoaded", async () => {
    await loadGestorPerfil(); // Carregar o perfil do gestor logado
});

// Logout
document.getElementById("logoutButton").addEventListener("click", function() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("gestorId"); // Remover o ID do gestor ao sair
    window.location.href = "login.html"; // Redirecionar para a tela de login
});

// Máscara para o campo de telefone
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value;

    // Remover tudo que não for número
    value = value.replace(/\D/g, '');

    // Formatar o valor conforme a máscara (XX) XXXXX-XXXX
    if (value.length <= 2) {
        // Formatar a parte do código de área (XX)
        value = `(${value}`;
    } else if (value.length <= 6) {
        // Adicionar o primeiro espaço depois do código de área
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
        // Adicionar o traço depois dos 5 primeiros números
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else {
        // Limitar a entrada a 11 dígitos
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
    }

    // Atualizar o valor no campo de input
    e.target.value = value;
});

// Seleciona os elementos do DOM
const editButton = document.getElementById("editButton");
const menu = document.getElementById("menu");
const removePhotoButton = document.getElementById("removePhoto");
const choosePhotoButton = document.getElementById("choosePhoto");
const profilePicture = document.getElementById("profilePicture");
const fileInput = document.getElementById("fileInput");

// Caminho da foto padrão
const defaultPhoto = "../imgs/perfil/logousuario.png";

// Ao carregar a página, verifica o LocalStorage para carregar uma foto salva
window.onload = () => {
    const savedPhoto = localStorage.getItem("profilePhoto");
    if (savedPhoto) {
        profilePicture.src = savedPhoto; // Atualiza a imagem de perfil se houver foto salva
    }
};

// Abre ou fecha o menu ao clicar no botão de edição
editButton.addEventListener("click", () => {
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block"; // Exibe o menu
    } else {
        menu.style.display = "none"; // Esconde o menu
    }
});

// Remove a foto e volta para a foto padrão
removePhotoButton.addEventListener("click", () => {
    profilePicture.src = defaultPhoto; // Restaura a foto padrão
    localStorage.removeItem("profilePhoto"); // Remove a foto do LocalStorage
    menu.style.display = "none"; // Fecha o menu
});

// Abre o seletor de arquivos para escolher uma nova foto
choosePhotoButton.addEventListener("click", () => {
    fileInput.click(); // Aciona o input de arquivo
    menu.style.display = "none"; // Fecha o menu
});

// Substitui a foto de perfil pela escolhida e salva no LocalStorage
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0]; // Pega o arquivo selecionado
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profilePicture.src = e.target.result; // Atualiza a imagem de perfil
            localStorage.setItem("profilePhoto", e.target.result); // Salva no LocalStorage
        };
        reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    }
});