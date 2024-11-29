// Configura os inputs e validações
const startInputs = {
    day: document.getElementById('start-day'),
    month: document.getElementById('start-month'),
    year: document.getElementById('start-year')
};
const endInputs = {
    day: document.getElementById('end-day'),
    month: document.getElementById('end-month'),
    year: document.getElementById('end-year')
};

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

function isAnoBissexto(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function validateDay(day, month, year) {
    if (isNaN(day) || day < 1 || day > 31) return false;
    if (month === 2) return day <= (isAnoBissexto(year) ? 29 : 28);
    if ([4, 6, 9, 11].includes(month)) return day <= 30;
    return true;
}

function validateMonth(month) {
    return month >= 1 && month <= 12;
}

function validateYear(year) {
    return year >= currentYear;
}

function isDateValid(day, month, year) {
    if (year === currentYear) {
        if (month < currentMonth) return false;
        if (month === currentMonth && day < currentDay) return false;
    }
    const inputDate = new Date(year, month - 1, day);
    return inputDate >= today;
}

document.addEventListener('DOMContentLoaded', function() {
    const dropdownIds = {
        'mcc-dropdown': 'selected-items-mcc',
        'entrada-dropdown': 'selected-items-entrada',
        'presencial-dropdown': 'selected-items-presencial'
    };

    Object.keys(dropdownIds).forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;  // Verifica se o dropdown existe antes de continuar

        const checkboxes = dropdown.querySelectorAll('.dropdown-item input[type="checkbox"]');
        const selectedItems = document.getElementById(dropdownIds[dropdownId]);

        if (!selectedItems) return;  // Verifica se a lista de itens selecionados existe

        // Função para atualizar o parágrafo "Selecionados"
        const updateParagraph = () => {
            let paragraph = selectedItems.previousElementSibling;
            if (!paragraph || paragraph.tagName !== "P") {
                paragraph = document.createElement('p');
                paragraph.textContent = "Selecionados:";
                selectedItems.parentNode.insertBefore(paragraph, selectedItems);
            }
            paragraph.style.display = selectedItems.children.length > 0 ? "block" : "none";
        };

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const dropdownItem = this.closest('.dropdown-item');
                const itemText = dropdownItem.querySelector('span').textContent.trim();

                if (this.checked) {
                    // Adiciona item à lista, caso ainda não esteja
                    if (!selectedItems.querySelector(`li[data-value="${itemText}"]`)) {
                        const listItem = document.createElement('li');
                        listItem.setAttribute('data-value', itemText);
                        listItem.innerHTML = `${itemText} <span class="remove-item" style="color: red; cursor: pointer;">&times;</span>`;

                        // Evento para remover item ao clicar no "x"
                        listItem.querySelector('.remove-item').addEventListener('click', function() {
                            checkbox.checked = false;
                            selectedItems.removeChild(listItem);
                            updateParagraph();
                        });

                        selectedItems.appendChild(listItem);
                        updateParagraph();
                    }
                } else {
                    // Remove item desmarcado da lista
                    const listItemToRemove = selectedItems.querySelector(`li[data-value="${itemText}"]`);
                    if (listItemToRemove) {
                        selectedItems.removeChild(listItemToRemove);
                    }
                    updateParagraph();
                }
            });
        });
    });
    // Função de validação de data
    const setupDateValidation = (inputGroup, errorPrefix) => {
        const dayInput = inputGroup.day;
        const monthInput = inputGroup.month;
        const yearInput = inputGroup.year;

        // Restringe entrada para números
        [dayInput, monthInput, yearInput].forEach(input => {
            input.addEventListener('keydown', function(event) {
                if (!/\d/.test(event.key) && !['Backspace', 'Delete', 'Tab'].includes(event.key)) {
                    event.preventDefault();
                }
            });
        });

        // Validações de data
        const validateInputs = () => {
            const day = parseInt(dayInput.value);
            const month = parseInt(monthInput.value);
            const year = parseInt(yearInput.value);
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = today.getMonth() + 1;
            const currentDay = today.getDate();

            // Limpa erros anteriores
            document.getElementById(`${errorPrefix}-day-error`).textContent = '';
            document.getElementById(`${errorPrefix}-month-error`).textContent = '';
            document.getElementById(`${errorPrefix}-year-error`).textContent = '';

            let isValid = true;

            if (day < 1 || day > 31 || (month === 2 && day > 29) || ([4, 6, 9, 11].includes(month) && day > 30)) {
                document.getElementById(`${errorPrefix}-day-error`).textContent = 'Dia inválido para o mês.';
                isValid = false;
            }

            if (month < 1 || month > 12) {
                document.getElementById(`${errorPrefix}-month-error`).textContent = 'Mês inválido (1-12).';
                isValid = false;
            }

            if (year < currentYear || (year === currentYear && (month < currentMonth || (month === currentMonth && day < currentDay)))) {
                document.getElementById(`${errorPrefix}-day-error`).textContent = 'Data não pode ser anterior a hoje.';
                isValid = false;
            }

            return isValid;
        };

        // Eventos de input e validação
        dayInput.addEventListener('input', validateInputs);
        monthInput.addEventListener('input', validateInputs);
        yearInput.addEventListener('input', validateInputs);
    };

    // Configuração dos inputs de data
    setupDateValidation({
        day: document.getElementById('start-day'),
        month: document.getElementById('start-month'),
        year: document.getElementById('start-year')
    }, 'start');

    setupDateValidation({
        day: document.getElementById('end-day'),
        month: document.getElementById('end-month'),
        year: document.getElementById('end-year')
    }, 'end');

    // Função para alternar cor do parágrafo com o switch
    window.toggleCartao = function(paragraphId, toggleSwitch) {
        const switchTexto = document.getElementById(paragraphId);
        switchTexto.style.color = toggleSwitch.checked ? '#fff' : 'black';
    };
});
// Função para alternar a exibição das opções de crédito em fatura
function toggleCreditOption() {
    const toggle10 = document.getElementById('toggle10');
    const toggle11 = document.getElementById('toggle11');
    const creditOptions = document.getElementById('credit-options');
    const liveloPointsContainer = document.getElementById('livelo-points-container');
    const creditInputContainer = document.getElementById('credit-input-container');
    const creditTitle = document.getElementById('10');
    const liveloTitle = document.getElementById('11');
    
    if (toggle10.checked) {
        toggle11.checked = false; // Desmarca Pontos Livelo se Desconto em Fatura for selecionado
        creditOptions.style.display = 'block';
        liveloPointsContainer.style.display = 'none';
        creditTitle.style.color = 'white';
        liveloTitle.style.color = 'black';
        
    } else {
        // Esconde o input de crédito e as opções de tipo
        creditInputContainer.style.display = 'none';
        creditOptions.style.display = 'none';
        creditOptions.style.display = 'none';
        creditTitle.style.color = 'black';
    }

}

let tipoCreditoSelecionado = ''; // Variável global para armazenar o tipo de crédito selecionado

// Função para selecionar o tipo de crédito em fatura
function selecionarTipoCredito(tipo) {
    const creditInputContainer = document.getElementById('credit-input-container');
    const creditInput = document.getElementById('credit-input');
    const creditInputLabel = document.getElementById('credit-input-label');
    const tipoCreditoInput = document.getElementById('tipo-credito'); // Agora estamos acessando o input oculto para armazenar o tipo
    // Remove a classe 'selected' de todos os botões
    const buttons = document.querySelectorAll('#credit-options button');
    buttons.forEach(button => button.classList.remove('selected'));

    // Adiciona a classe 'selected' ao botão clicado
    if (tipo === 'valor-fixo') {
        document.getElementById('valor-fixo-btn').classList.add('selected');
    } else if (tipo === 'percentual-compra') {
        document.getElementById('percentual-compra-btn').classList.add('selected');
    }

    // Exibir o campo de input para valor ou percentual dependendo da escolha
    if (tipo === 'valor-fixo') {
        creditInputContainer.style.display = 'block';
        creditInput.disabled = false;
        creditInputLabel.innerText = 'Valor Fixo';
        tipoCreditoInput.value = 'valor-fixo';  // Atualiza o tipo selecionado no input oculto
    } else if (tipo === 'percentual-compra') {
        creditInputContainer.style.display = 'block';
        creditInput.disabled = false;
        creditInputLabel.innerText = 'Percentual da Compra';
        tipoCreditoInput.value = 'percentual-compra';  // Atualiza o tipo selecionado no input oculto
    }

    // Resetar o campo de entrada quando não for uma opção selecionada
    if (tipo === '') {
        creditInputContainer.style.display = 'none';
        creditInput.disabled = true;
        tipoCreditoInput.value = '';  // Remove a seleção de tipo
    }
}




// Função para alternar a exibição da opção de Pontos Livelo
function toggleLiveloPoints() {
    const toggle10 = document.getElementById('toggle10');
    const toggle11 = document.getElementById('toggle11');
    const liveloPointsContainer = document.getElementById('livelo-points-container');
    const liveloTitle = document.getElementById('11');
    const creditTitle = document.getElementById('10');
    const liveloPointsInput = document.getElementById('livelo-points');

    if (toggle11.checked) {
        toggle10.checked = false; // Desmarca Desconto em Fatura se Pontos Livelo for selecionado
        liveloPointsContainer.style.display = 'block';
        liveloTitle.style.color = 'white';
        creditTitle.style.color = 'black';
        liveloPointsInput.disabled = false;
        liveloPointsInput.required = true;
    } else {
        liveloPointsContainer.style.display = 'none';
        liveloTitle.style.color = 'black';
        liveloPointsInput.disabled = true;
        liveloPointsInput.required = false;
    }

    // Limpa a seleção anterior do tipo de crédito
    clearCreditSelection();
}

// Limpa a seleção de tipo de crédito
function clearCreditSelection() {
    const creditInputContainer = document.getElementById('credit-input-container');
    const creditOptions = document.getElementById('credit-options');

    // Esconde o input de crédito e as opções de tipo
    creditInputContainer.style.display = 'none';
    creditOptions.style.display = 'none';
}

function previewImage(files) {
    const previewContainer = document.getElementById('preview-container');
    const preview = document.getElementById('preview');

    const file = files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}
// Função para inicializar a funcionalidade de arrastar e soltar
function initDragAndDrop() {
    const dropZone = document.getElementById('upload-container');
    const fileInput = document.getElementById('upload-image');

    // Evento para quando o arquivo é arrastado para dentro da zona
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });

    // Evento para quando o arquivo sai da zona sem soltar
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    // Evento para soltar o arquivo
    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            previewImage(files);  // Chama a função de pré-visualização da imagem
        }
    });

    // Evento de clique para abrir o seletor de arquivos
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
}

// Função para pré-visualizar a imagem
function previewImage(files) {
    const previewContainer = document.getElementById('preview-container');
    const preview = document.getElementById('preview');
    const removeImageBtn = document.getElementById('remove-image');
    const textoImagem = document.querySelector('.texto-imagem');
    const customUploadBtn = document.querySelector('.custom-upload-btn');

    const file = files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';  // Mostra a imagem
            removeImageBtn.style.display = 'block';    // Mostra o botão de remover
            textoImagem.style.display = 'none';         // Oculta o texto inicial
            customUploadBtn.style.display = 'none';     // Oculta o botão de upload
        };
        reader.readAsDataURL(file);
    }
}

// Função para remover a imagem
function removeImage() {
    event.stopPropagation(); // Impede a propagação para evitar que o seletor de arquivos seja acionado

    const previewContainer = document.getElementById('preview-container');
    const preview = document.getElementById('preview');
    const removeImageBtn = document.getElementById('remove-image');
    const textoImagem = document.querySelector('.texto-imagem');
    const customUploadBtn = document.querySelector('.custom-upload-btn');

    preview.src = '';                          // Remove a fonte da imagem
    previewContainer.style.display = 'none';   // Oculta o contêiner de pré-visualização
    removeImageBtn.style.display = 'none';     // Oculta o botão de remover
    textoImagem.style.display = 'block';       // Mostra o texto inicial
    customUploadBtn.style.display = 'inline-block'; // Mostra o botão de upload
}

// Seleciona todos os checkboxes e textos dos grupos de mecânicas e fatores
const mecanicasCheckboxes = document.querySelectorAll('.opcoes-mecanicas .opcao input[type="checkbox"]');
const fatoresCheckboxes = document.querySelectorAll('.fator_categ .opcao input[type="checkbox"]');

// Função para garantir seleção única dentro de cada grupo e mudar a cor do texto
function selecionarUnico(grupoCheckboxes, checkboxSelecionado) {
    grupoCheckboxes.forEach(checkbox => {
        const texto = checkbox.closest('.opcao').querySelector('p'); // Encontra o elemento <p> de texto
        if (checkbox === checkboxSelecionado && checkbox.checked) {
            texto.style.color = 'white';
        } else {
            checkbox.checked = false; // Desmarca os outros checkboxes
            texto.style.color = 'black'; // Reseta a cor do texto
        }
    });
}

function toggleCartao(cartaId, toggleElement) {
    // Seleciona o elemento <p> usando o id do cartão
    const pElement = document.getElementById(cartaId);
  
    // Verifica se o checkbox está marcado
    if (toggleElement.checked) {
      // Altera a cor do texto do <p> para branco quando o checkbox estiver marcado
      pElement.style.color = 'white';
    } else {
      // Restaura a cor do texto do <p> para a cor original (preta, por exemplo) quando o checkbox não estiver marcado
      pElement.style.color = 'black'; // ou a cor que você preferir
    }
  }
// Aplica a função de seleção única para os eventos de mudança nos grupos de mecânicas e fatores
mecanicasCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        selecionarUnico(mecanicasCheckboxes, this);
    });
});

fatoresCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        selecionarUnico(fatoresCheckboxes, this);
    });
});


document.getElementById('cashback-limit').addEventListener('input', function(e) {
    let value = e.target.value;

    // Remover tudo que não é número
    value = value.replace(/\D/g, '');

    // Separar parte inteira (antes da vírgula) e parte decimal (após a vírgula)
    let integerPart = value.slice(0, -2); // Parte inteira: todos os números antes dos dois últimos
    let decimalPart = value.slice(-2);    // Parte decimal: os dois últimos números

    // Adicionar os pontos a cada 3 dígitos na parte inteira
    integerPart = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    // Garantir que a parte decimal tenha sempre 2 dígitos
    //decimalPart = decimalPart.padStart(2, '0');

    // Montar o valor final no formato R$ xxx.xxx.xxx,xx
    value = 'R$ ' + integerPart + ',' + decimalPart;

    // Atualizar o valor no campo de input
    e.target.value = value;
});



// Inicializa a funcionalidade drag and drop ao carregar a página
document.addEventListener('DOMContentLoaded', initDragAndDrop);