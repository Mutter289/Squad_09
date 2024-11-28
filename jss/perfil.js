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