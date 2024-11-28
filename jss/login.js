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

// Função para verificar se já existem registros no objectStore
async function hasGestores(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("gestores", "readonly");
        const store = transaction.objectStore("gestores");
        const countRequest = store.count();

        countRequest.onsuccess = () => resolve(countRequest.result > 0);
        countRequest.onerror = () => reject(countRequest.error);
    });
}

// Função para adicionar gestores ao banco
async function populateGestores() {
    const db = await initIndexedDB();
    const hasData = await hasGestores(db);

    if (hasData) {
        console.log("Gestores já existentes. Nenhum dado foi adicionado.");
        return;
    }

    const transaction = db.transaction("gestores", "readwrite");
    const store = transaction.objectStore("gestores");

    const gestores = [
        { nome: "Gestor 1", senha: "senha1", email: "", numero: "" },
        { nome: "Gestor 2", senha: "senha2", email: "", numero: "" },
        { nome: "Gestor 3", senha: "senha3", email: "", numero: "" },
        { nome: "Gestor 4", senha: "senha4", email: "", numero: "" },
        { nome: "Gestor 5", senha: "senha5", email: "", numero: "" },
        { nome: "Gestor 6", senha: "senha6", email: "", numero: "" },
        { nome: "Gestor 7", senha: "senha7", email: "", numero: "" },
        { nome: "Gestor 8", senha: "senha8", email: "", numero: "" },
        { nome: "Gestor 9", senha: "senha9", email: "", numero: "" },
        { nome: "Gestor 10", senha: "senha10", email: "", numero: "" },
    ];

    gestores.forEach((gestor) => store.add(gestor));

    transaction.oncomplete = () => console.log("Gestores adicionados com sucesso!");
    transaction.onerror = () => console.error("Erro ao adicionar gestores:", transaction.error);
}

// Função para buscar dados do gestor logado
async function loadGestorPerfil() {
    const db = await initIndexedDB();
    const transaction = db.transaction("gestores", "readonly");
    const store = transaction.objectStore("gestores");

    // Simulação: Carregar o primeiro gestor
    const gestor = await new Promise((resolve, reject) => {
        const request = store.get(1); // Simulando gestor com ID 1
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    if (gestor) {
        document.getElementById("profile-name").textContent = gestor.nome;
        document.getElementById("profile-id").textContent = `ID: ${gestor.id}`;
    }
}

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        const username = document.getElementById('id-gestor').value; // id-gestor (nome de usuário)
        const password = document.getElementById('senha').value; // Senha

        // Abrindo o banco de dados IndexedDB
        const request = indexedDB.open("gestoresDB", 1);

        request.onerror = function(event) {
            console.error("Erro ao abrir o banco de dados:", event.target.error);
            document.getElementById('message').textContent = 'Erro ao acessar os dados do banco de dados.';
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction("gestores", "readonly");
            const objectStore = transaction.objectStore("gestores");

            // Criando um índice para procurar pelo nome do gestor
            const index = objectStore.index("nome");

            // Buscando o gestor pelo nome (id-gestor)
            const getRequest = index.get(username);

            getRequest.onerror = function() {
                console.error("Erro ao acessar o índice para buscar o gestor.");
                document.getElementById('message').textContent = 'Erro ao acessar os dados do gestor.';
            };

            getRequest.onsuccess = function() {
                const gestor = getRequest.result;

                // Verificando se o gestor foi encontrado e a senha corresponde
                if (gestor) {
                    if (gestor.senha === password) {
                        // Salva o estado de autenticação no localStorage
                        localStorage.setItem("isAuthenticated", "true");
                        localStorage.setItem("gestorNome", gestor.nome);
                        localStorage.setItem("gestorId", gestor.id);

                        // Redirecionar para a nova página
                        window.location.href = "../index.html"; // Caminho correto para a página desejada
                    } else {
                        document.getElementById('message').textContent = 'Credenciais inválidas. Tente novamente.';
                    }
                } else {
                    document.getElementById('message').textContent = 'Gestor não encontrado.';
                }
            };
        };
    });// Inicializar o banco e carregar o perfil
    document.addEventListener("DOMContentLoaded", async () => {
        event.preventDefault();
        await populateGestores(); // Preencher com dados de exemplo
        await loadGestorPerfil(); // Carregar o gestor logado
    });