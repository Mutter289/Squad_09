// Abrir o banco de dados IndexedDB
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('CampaignDatabase', 1); // Nome do banco de dados e versão

        request.onerror = () => {
            reject('Erro ao abrir o IndexedDB');
        };

        request.onsuccess = (event) => {
            resolve(event.target.result); // Retorna a instância do banco
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('campaigns')) {
                db.createObjectStore('campaigns', { keyPath: 'id' }); // Cria o object store 'campaigns' com 'id' como chave
            }
        };
    });
}

// Função para recuperar e exibir as campanhas na home page
function displayCampaigns() {
    openDatabase().then(db => {
        const transaction = db.transaction(['campaigns'], 'readonly'); // Transação de leitura
        const objectStore = transaction.objectStore('campaigns');
        
        const request = objectStore.getAll(); // Recupera todas as campanhas

        request.onsuccess = (event) => {
            const campaigns = event.target.result;
            const campaignsContainer = document.getElementById('campaigns-container'); // Elemento para armazenar as campanhas na página

            // Limpar o conteúdo existente
            campaignsContainer.innerHTML = '';

            if (campaigns.length === 0) {
                campaignsContainer.innerHTML = '<p>Não há campanhas cadastradas.</p>';
                return;
            }

            // Exibir as campanhas
            campaigns.forEach(campaign => {
                const campaignElement = createCampaignElement(campaign);
                campaignsContainer.appendChild(campaignElement); // Adiciona cada campanha à página
            });
        };

        request.onerror = () => {
            console.error('Erro ao recuperar as campanhas');
        };
    }).catch(err => {
        console.error('Erro ao abrir o banco de dados:', err);
    });
}

// Função para carregar os dados da campanha a partir do ID da URL
function loadCampaignData() {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id'); // Obtém o ID da campanha da URL

    if (campaignId) {
        openDatabase().then(db => {
            const transaction = db.transaction(['campaigns'], 'readonly');
            const objectStore = transaction.objectStore('campaigns');
            const request = objectStore.get(Number(campaignId)); // Busca a campanha pelo ID

            request.onsuccess = (event) => {
                const campaignData = event.target.result;

                if (campaignData) {
                    // Preencher os campos do formulário com os dados da campanha
                    document.getElementById('nome').value = campaignData.nome;
                    document.getElementById('descricao').value = campaignData.descricao;
                    document.getElementById('imagem').value = campaignData.imagem || '';

                    // Preencher os campos de MCCs (checkboxes)
                    campaignData.mccs.forEach(mcc => {
                        const mccItem = document.querySelector(`.MCC-dropdown .dropdown-item[data-mcc="${mcc}"]`);
                        if (mccItem) {
                            const checkbox = mccItem.querySelector('input[type="checkbox"]');
                            if (checkbox) checkbox.checked = true;
                        }
                    });

                    // Preencher outros campos conforme necessário
                    // (como 'cartoes', 'mecanicas', 'premios', etc)
                } else {
                    console.error('Campanha não encontrada!');
                }
            };

            request.onerror = () => {
                console.error('Erro ao carregar a campanha');
            };
        }).catch(err => {
            console.error('Erro ao abrir o banco de dados:', err);
        });
    } else {
        console.error('ID da campanha não fornecido!');
    }
}

// Função para criar o elemento HTML para cada campanha
function createCampaignElement(campanha) {
    const campaignDiv = document.createElement('div');
    campaignDiv.classList.add('campaign-item');
    campaignDiv.innerHTML = `
                <div class="campanha">
                    <div class="card">
                        <div class="nameDesc">
                            <h1>${campanha.nome}</h1>
                            <p>${campanha.descricao}</p>
                        </div>
                        <div class="img">
                            <img src="${campanha.imagem || 'imgs/default.jpg'}" alt="" />
                        </div>
                    </div>
                    <div class="card-buttons">
                        <button type="button" class="card-button see-details" onclick="verDetalhes('${campanha.id}')">Ver detalhes</button>
                        <button type="button" class="card-button see-report" onclick="verRelatorios('${campanha.id}')">Ver relatórios</button>
                        <button type="button" class="card-button campaign-edit" onclick="editarCampanha('${campanha.id}')">Editar Campanha</button>
                    </div>
                </div>`;
    return campaignDiv;
}

function editarCampanha(campaignId) {
    // Redireciona para a página de criação de campanha passando o ID
    window.location.href = `htmls/criar_campanha.html?id=${campaignId}`;
}

function verDetalhes(campaignId) {
    // Redireciona para a página de criação de campanha passando o ID
    window.location.href = `htmls/detalhes.html?id=${campaignId}`;
}

// Chama a função para exibir as campanhas quando a página for carregada
window.addEventListener('load', displayCampaigns);
