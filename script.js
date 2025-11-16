// script.js

// --- 1. Estado Global da Aplicação (Simulação de Dados) ---
let AGENTE_LOGADO = 'Não Logado';
let ticketsData = [
    { id: 1001, paciente: 'João Silva', canal: 'WhatsApp', setor: 'AGENDAMENTO', prioridade: 'Alta', status: 'Aberto', mensagem: 'Preciso remarcar minha teleconsulta com urgência!', tempoEspera: 15 },
    { id: 1002, paciente: 'Maria Santos', canal: 'WebChat', setor: 'FINANCEIRO', prioridade: 'Média', status: 'Aberto', mensagem: 'Dúvida sobre o boleto do convênio.', tempoEspera: 10 },
    { id: 1003, paciente: 'Pedro Oliveira', canal: 'Email', setor: 'RESULTADOS', prioridade: 'Baixa', status: 'Aberto', mensagem: 'Quero meu laudo de exames.', tempoEspera: 5 },
    { id: 1004, paciente: 'Lucia Gomes', canal: 'Telegram', setor: 'GERAL', prioridade: 'Média', status: 'Aberto', mensagem: 'Quais são os horários de funcionamento?', tempoEspera: 8 },
    { id: 1005, paciente: 'Carlos Lima', canal: 'WhatsApp', setor: 'AGENDAMENTO', prioridade: 'Alta', status: 'Aberto', mensagem: 'Minha mãe precisa de uma consulta urgente com cardiologista.', tempoEspera: 20 }
];

// --- 2. Elementos do DOM ---
const ticketGrid = document.getElementById('ticket-grid');
const agenteInfo = document.getElementById('agente-info');
const systemStatus = document.getElementById('system-status');

// --- 3. Funções Utilitárias ---

// Atualiza a informação do agente no cabeçalho
function updateAgenteInfo() {
    agenteInfo.innerHTML = `Agente: <strong>${AGENTE_LOGADO}</strong>`;
}

// Exibe uma mensagem de status temporária
function showSystemStatus(message, isError = false) {
    systemStatus.textContent = message;
    systemStatus.style.color = isError ? 'var(--danger-color)' : 'var(--success-color)';
    setTimeout(() => {
        systemStatus.textContent = 'Fila atualizada.';
        systemStatus.style.color = 'var(--primary-color)';
    }, 4000);
}

// --- 4. Funções de Ação do Agente ---

// Simula o login do agente
function logarAgente() {
    const novoAgente = prompt("Digite seu nome para iniciar a sessão:");
    if (novoAgente && novoAgente.trim() !== "") {
        AGENTE_LOGADO = novoAgente.trim();
        updateAgenteInfo();
        showSystemStatus(`Agente ${AGENTE_LOGADO} logado com sucesso.`);
    } else {
        alert("O nome do agente não pode ser vazio.");
    }
}

// Simula o início do atendimento de um ticket
function iniciarAtendimento(id) {
    if (AGENTE_LOGADO === 'Não Logado') {
        alert("Por favor, identifique-se clicando em 'Trocar Agente' antes de iniciar o atendimento.");
        return;
    }

    const ticketIndex = ticketsData.findIndex(t => t.id === id);
    if (ticketIndex !== -1 && ticketsData[ticketIndex].status === 'Aberto') {
        // Atualiza o estado simulado
        ticketsData[ticketIndex].status = 'Em Atendimento';
        ticketsData[ticketIndex].agente = AGENTE_LOGADO;
        ticketsData[ticketIndex].prioridade = 'Baixa'; // Assume que um ticket em atendimento tem prioridade visual menor na fila
        
        showSystemStatus(`Ticket #${id} iniciado por ${AGENTE_LOGADO}.`);
        carregarTickets(); // Redesenha a interface
    }
}

// Simula o fechamento do ticket
function fecharTicket(id) {
    const confirmacao = confirm(`Tem certeza que deseja fechar e remover o Ticket #${id}?`);
    if (confirmacao) {
        // Remove o ticket do array
        ticketsData = ticketsData.filter(t => t.id !== id);
        showSystemStatus(`Ticket #${id} encerrado com sucesso.`);
        carregarTickets();
    }
}

// --- 5. Renderização (Desenho da Interface) ---

function renderizarTickets() {
    ticketGrid.innerHTML = ''; 

    if (ticketsData.length === 0) {
        ticketGrid.innerHTML = '<p>🎉 **Ótimo!** Nenhuma fila de espera. Bom trabalho!</p>';
        return;
    }

    // Ordena para que os tickets 'Abertos' e de 'Alta' prioridade venham primeiro
    const sortedTickets = [...ticketsData].sort((a, b) => {
        // Prioriza 'Aberto' sobre 'Em Atendimento'
        if (a.status === 'Aberto' && b.status === 'Em Atendimento') return -1;
        if (a.status === 'Em Atendimento' && b.status === 'Aberto') return 1;

        // Dentro do mesmo status, prioriza por tempo de espera (maior tempo primeiro)
        return b.tempoEspera - a.tempoEspera;
    });

    sortedTickets.forEach(ticket => {
        const card = document.createElement('div');
        // Adiciona classes para estilos de Prioridade e Canal
        card.classList.add('ticket-card', `priority-${ticket.prioridade}`);
        
        const statusClass = `status-${ticket.status.replace(' ', '')}`;
        let buttonHTML = '';
        
        if (ticket.status === 'Aberto') {
            buttonHTML = `<button onclick="iniciarAtendimento(${ticket.id})" class="btn-primary">Iniciar Atendimento</button>`;
        } else if (ticket.status === 'Em Atendimento') {
            buttonHTML = `<button onclick="fecharTicket(${ticket.id})" class="btn-danger">Encerrar Chat (por ${ticket.agente})</button>`;
        }

        card.innerHTML = `
            <h4>
                Ticket #${ticket.id} 
                <span class="channel-tag channel-${ticket.canal}">${ticket.canal}</span>
            </h4>
            <p><strong>Paciente:</strong> ${ticket.paciente}</p>
            <p><strong>Setor:</strong> ${ticket.setor}</p>
            <p><strong>Mensagem:</strong> <em>"${ticket.mensagem.substring(0, 50)}${ticket.mensagem.length > 50 ? '...' : ''}"</em></p>
            <p><strong>Tempo em Fila:</strong> ${ticket.tempoEspera} min</p>
            <p><strong>Status:</strong> <span class="status ${statusClass}">${ticket.status}</span></p>
            
            ${buttonHTML}
        `;
        ticketGrid.appendChild(card);
    });
}

// Função para simular novos tickets e atualizar a tela
function carregarTickets() {
    // Simula o envelhecimento dos tickets na fila
    ticketsData.forEach(t => t.tempoEspera += Math.floor(Math.random() * 5)); 
    
    // Simula a chegada de um novo ticket aleatoriamente
    if (Math.random() < 0.4) {
        const newId = Math.max(...ticketsData.map(t => t.id)) + 1;
        const canais = ['WhatsApp', 'Telegram', 'WebChat', 'Email'];
        const setores = ['AGENDAMENTO', 'FINANCEIRO', 'RESULTADOS', 'GERAL'];
        const prioridades = ['Alta', 'Média', 'Baixa'];
        
        ticketsData.push({
            id: newId,
            paciente: 'Novo Paciente ' + newId,
            canal: canais[Math.floor(Math.random() * canais.length)],
            setor: setores[Math.floor(Math.random() * setores.length)],
            prioridade: prioridades[Math.floor(Math.random() * prioridades.length)],
            status: 'Aberto',
            mensagem: 'Nova mensagem de contato.',
            tempoEspera: 0
        });
        showSystemStatus(`Chegou 📢 Novo ticket #${newId} adicionado à fila.`);
    } else {
        showSystemStatus('Fila atualizada. Sem novos tickets.');
    }

    renderizarTickets();
}

// --- 6. Inicialização ---
window.onload = () => {
    updateAgenteInfo();
    renderizarTickets();
};
