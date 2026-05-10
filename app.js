/**
 * Poder & Decisão: Simulador Político Brasileiro
 * Arquivo: app.js
 * Descrição: Motor principal do jogo, gerenciamento de estado, eventos,
 * matemática parlamentar e animações de UI.
 */

// ==========================================
// 1. BANCO DE DADOS E ESTADO INICIAL (MOCK)
// ==========================================
const GAME_DATA = {
    parties:[
        { id: 'pt', name: 'PT', spectrum: 'left', seatsDep: 68, seatsSen: 9, affinity: 15, base: 'opp' },
        { id: 'pl', name: 'PL', spectrum: 'right', seatsDep: 99, seatsSen: 13, affinity: 85, base: 'gov' },
        { id: 'mdb', name: 'MDB', spectrum: 'center', seatsDep: 42, seatsSen: 10, affinity: 55, base: 'ind' },
        { id: 'psd', name: 'PSD', spectrum: 'center', seatsDep: 42, seatsSen: 11, affinity: 60, base: 'gov' },
        { id: 'pp', name: 'PP', spectrum: 'center', seatsDep: 47, seatsSen: 7, affinity: 50, base: 'ind' },
        { id: 'uniao', name: 'União', spectrum: 'center-right', seatsDep: 59, seatsSen: 7, affinity: 45, base: 'ind' },
        { id: 'psdb', name: 'PSDB', spectrum: 'center', seatsDep: 13, seatsSen: 4, affinity: 30, base: 'opp' },
        { id: 'psol', name: 'PSOL', spectrum: 'left', seatsDep: 12, seatsSen: 0, affinity: 5, base: 'opp' },
        { id: 'outros', name: 'Outros', spectrum: 'mixed', seatsDep: 131, seatsSen: 20, affinity: 40, base: 'ind' }
    ],
    stf:[
        { id: 'mendes', name: 'Gilmar Mendes', profile: 'Garantista', appointedBy: 'Anterior', status: 'active' },
        { id: 'moraes', name: 'Alexandre de Moraes', profile: 'Punitivista', appointedBy: 'Anterior', status: 'active' },
        { id: 'barroso', name: 'Luís Roberto Barroso', profile: 'Progressista', appointedBy: 'Anterior', status: 'active' },
        { id: 'fachin', name: 'Edson Fachin', profile: 'Garantista', appointedBy: 'Anterior', status: 'active' },
        { id: 'fux', name: 'Luiz Fux', profile: 'Punitivista', appointedBy: 'Anterior', status: 'active' },
        { id: 'zanin', name: 'Cristiano Zanin', profile: 'Garantista', appointedBy: 'Você', status: 'active' },
        { id: 'mendonca', name: 'André Mendonça', profile: 'Conservador', appointedBy: 'Você', status: 'active' },
        { id: 'nunes', name: 'Kassio Nunes', profile: 'Garantista', appointedBy: 'Você', status: 'active' },
        { id: 'carmen', name: 'Cármen Lúcia', profile: 'Moderada', appointedBy: 'Anterior', status: 'active' },
        { id: 'toffoli', name: 'Dias Toffoli', profile: 'Garantista', appointedBy: 'Anterior', status: 'active' },
        { id: 'vaga_1', name: 'Cadeira Vaga', profile: 'Aguardando Indicação', appointedBy: 'N/A', status: 'vacant' }
    ],
    ministers:[
        { id: 'fazenda', role: 'Fazenda', name: 'Carlos Figueiredo', party: 'MDB', status: 'active' },
        { id: 'saude', role: 'Saúde', name: 'Dra. Ana Lúcia', party: 'PT', status: 'active' },
        { id: 'justica', role: 'Justiça', name: 'Sérgio Ramos', party: 'Sem Partido', status: 'active' },
        { id: 'educacao', role: 'Educação', name: 'Roberto Almeida', party: 'PSD', status: 'active' }
    ],
    laws:[
        { id: 'pec45', title: 'PEC 45 - Reforma Tributária', author: 'Executivo', impact: 'PIB e Aprovação', status: 'pending', votesNeeded: 308, type: 'PEC' },
        { id: 'pl102', title: 'PL 102 - Aumento Fundo Eleitoral', author: 'Legislativo', impact: 'Capital Político', status: 'pending', votesNeeded: 257, type: 'PL' },
        { id: 'pl304', title: 'PL 304 - Marco do Saneamento', author: 'Executivo', impact: 'Infraestrutura', status: 'pending', votesNeeded: 257, type: 'PL' }
    ],
    eventsDatabase:[
        {
            id: 'escandalo_obras',
            tag: 'Escândalo de Corrupção',
            tagClass: 'accent-red',
            icon: 'fa-triangle-exclamation',
            title: 'Vazamento de Áudios no Ministério da Infraestrutura',
            desc: 'A imprensa acaba de vazar áudios do seu Ministro negociando propina em obras de rodovias federais. O Congresso ameaça abrir uma CPI se nada for feito.',
            actions:[
                { label: 'Demitir o Ministro', class: 'btn-danger', icon: 'fa-user-xmark', effect: { cap: -10, app: +5, parties: -10 } },
                { label: 'Proteger o Aliado', class: 'btn-warning', icon: 'fa-shield-halved', effect: { cap: -30, app: -15, parties: +5 } }
            ]
        },
        {
            id: 'desastre_sul',
            tag: 'Desastre Natural',
            tagClass: 'accent-blue',
            icon: 'fa-cloud-showers-water',
            title: 'Enchentes Históricas na Região Sul',
            desc: 'Fortes chuvas destruíram a infraestrutura de dezenas de cidades. A população exige apoio federal emergencial imediato.',
            actions:[
                { label: 'Liberar R$ 5 Bilhões', class: 'btn-success', icon: 'fa-money-bill-wave', effect: { pib: -0.2, app: +8, cap: -15 } },
                { label: 'Apenas Visitar a Região', class: 'btn-neutral', icon: 'fa-plane', effect: { app: -5, cap: 0 } },
                { label: 'Ignorar Apelo', class: 'btn-danger', icon: 'fa-eye-slash', effect: { app: -15, parties: -5 } }
            ]
        }
    ]
};

// ==========================================
// 2. CLASSE PRINCIPAL DO MOTOR DO JOGO
// ==========================================
class PoliticalSimulator {
    constructor() {
        // Estado mutável do jogo
        this.state = {
            turn: 17,
            maxTurns: 48,
            playerRole: 'power', // 'power' ou 'opposition'
            stats: {
                approval: 54,
                politicalCapital: 320,
                pib: 2.1,
                inflation: 6.4,
                unemployment: 8.9,
                risk: 250,
                security: 45,
                health: 30,
                education: 55
            },
            congress: {
                deputies: { gov: 260, ind: 153, opp: 100, total: 513 },
                senate: { gov: 41, ind: 15, opp: 25, total: 81 }
            },
            activeEvents: [...GAME_DATA.eventsDatabase], // Copia para manipular
            lawsQueue:[...GAME_DATA.laws]
        };

        this.init();
    }

    // Inicialização
    init() {
        this.bindEvents();
        this.recalculateCongressBase();
        this.updateDashboardUI();
        this.renderCongressVisuals();
        this.renderParties();
        this.renderSTF();
        this.renderCabinet();
        this.renderEvents();
        this.renderLawsQueue();
    }

    // Bind de Listeners (Eventos de clique, botões)
    bindEvents() {
        // Toggle de Módulo (No Poder / Oposição)
        document.getElementById('btn-mod-power').addEventListener('click', () => this.setRole('power'));
        document.getElementById('btn-mod-opposition').addEventListener('click', () => this.setRole('opposition'));

        // Avançar Turno
        document.getElementById('btn-next-turn').addEventListener('click', () => this.advanceTurn());

        // Botões de Modal
        document.getElementById('btn-start-vote-anim').addEventListener('click', () => this.runVotingAnimation());
        document.getElementById('btn-start-election-anim').addEventListener('click', () => this.runElectionAnimation());

        // Submissões de Formulários (Evitar reload)
        document.getElementById('form-propose-law').addEventListener('submit', (e) => {
            e.preventDefault();
            this.proposeNewLaw();
        });
    }

    // ==========================================
    // LÓGICA DE TURNOS E ESTADO
    // ==========================================
    setRole(role) {
        this.state.playerRole = role;
        // A lógica de UI para ocultar mostrar elementos foi mantida do script inline original
        // mas aqui poderíamos re-renderizar componentes baseados no papel.
        this.updateDashboardUI();
    }

    advanceTurn() {
        if (this.state.turn >= this.state.maxTurns) {
            alert("Mandato finalizado! As eleições gerais vão começar.");
            document.querySelector('[data-target="view-elections"]').click();
            return;
        }

        // Incrementa o turno
        this.state.turn++;
        
        // Flutuação natural da economia e aprovação
        this.state.stats.pib += (Math.random() * 0.4 - 0.2);
        this.state.stats.inflation += (Math.random() * 0.6 - 0.3);
        this.state.stats.approval += (Math.random() * 4 - 2); // Pode subir ou descer 2%
        
        // Regeneração de Capital Político
        this.state.stats.politicalCapital += Math.floor(this.state.stats.approval / 2);

        // Limites
        this.state.stats.approval = Math.max(0, Math.min(100, this.state.stats.approval));
        this.state.stats.politicalCapital = Math.max(0, this.state.stats.politicalCapital);

        // Possibilidade de gerar novo evento aleatório (Mock simples)
        if (Math.random() > 0.5 && this.state.activeEvents.length < 5) {
            const randomEvent = GAME_DATA.eventsDatabase[Math.floor(Math.random() * GAME_DATA.eventsDatabase.length)];
            // Clona o evento com um ID único para permitir múltiplos do mesmo tipo
            this.state.activeEvents.push({...randomEvent, id: 'evt_' + Date.now()});
        }

        this.updateDashboardUI();
        this.renderEvents();
        
        // Animação visual no botão
        const btn = document.getElementById('btn-next-turn');
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processando...`;
        setTimeout(() => {
            btn.innerHTML = `Avançar Turno <i class="fa-solid fa-forward-step"></i>`;
            // Notificação visual
            this.showToast(`Turno ${this.state.turn} iniciado.`);
        }, 800);
    }

    applyEventEffects(effectObj, eventId) {
        if (effectObj.app) this.state.stats.approval += effectObj.app;
        if (effectObj.cap) this.state.stats.politicalCapital += effectObj.cap;
        if (effectObj.pib) this.state.stats.pib += effectObj.pib;
        
        // Remove evento da fila
        this.state.activeEvents = this.state.activeEvents.filter(e => e.id !== eventId);
        
        this.updateDashboardUI();
        this.renderEvents();
        this.closeAllModals();
    }

    // ==========================================
    // RENDERIZADORES DE INTERFACE (UI)
    // ==========================================
    
    updateDashboardUI() {
        // Barras Superiores
        document.getElementById('approval-bar').style.width = `${this.state.stats.approval}%`;
        document.getElementById('approval-bar').parentElement.nextElementSibling.innerText = `${this.state.stats.approval.toFixed(1)}%`;
        
        // Cor da barra de aprovação
        const appBar = document.getElementById('approval-bar');
        appBar.className = 'progress-bar';
        if (this.state.stats.approval > 60) appBar.classList.add('fill-green');
        else if (this.state.stats.approval > 35) appBar.classList.add('fill-yellow');
        else appBar.classList.add('fill-red');

        document.getElementById('political-capital').innerHTML = `${Math.floor(this.state.stats.politicalCapital)} pt`;

        // Textos de Turno
        document.querySelector('.turn-counter').innerHTML = `Turno <span class="font-orbitron">${this.state.turn}</span> / ${this.state.maxTurns}`;

        // Badge de Eventos
        const badge = document.getElementById('badge-events');
        badge.innerText = this.state.activeEvents.length;
        badge.style.display = this.state.activeEvents.length > 0 ? 'inline-block' : 'none';

        // Atualizar DOMElements socioeconômicos (Requer mapeamento se formos atualizar todos, aqui farei mock)
        // No HTML, criamos indicadores estáticos. Em um app real, colocaríamos IDs neles.
    }

    renderCongressVisuals() {
        // Função utilitária para gerar os "pontinhos" coloridos
        const drawChamber = (containerId, total, gov, ind, opp) => {
            const container = document.getElementById(containerId);
            container.innerHTML = ''; // Limpa
            
            // Criamos pequenos blocos flex para simular o plenário
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('div');
                dot.className = 'plot-dot'; // Classe CSS que será um pequeno círculo
                
                // Distribuição de cores
                if (i < gov) dot.classList.add('dot-gov'); // CSS: bg-green
                else if (i < gov + ind) dot.classList.add('dot-ind'); // CSS: bg-yellow
                else dot.classList.add('dot-opp'); // CSS: bg-red
                
                container.appendChild(dot);
            }
        };

        const dep = this.state.congress.deputies;
        const sen = this.state.congress.senate;

        drawChamber('deputies-plot', dep.total, dep.gov, dep.ind, dep.opp);
        drawChamber('senate-plot', sen.total, sen.gov, sen.ind, sen.opp);
    }

    renderParties() {
        const tbody = document.getElementById('parties-table-body');
        tbody.innerHTML = '';

        GAME_DATA.parties.forEach(party => {
            let barColor = 'fill-yellow';
            if (party.affinity >= 60) barColor = 'fill-green';
            if (party.affinity <= 30) barColor = 'fill-red';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${party.name}</strong></td>
                <td><span class="ideology ${party.spectrum}">${party.spectrum.toUpperCase()}</span></td>
                <td>${party.seatsDep}</td>
                <td>${party.seatsSen}</td>
                <td>
                    <div class="affinity-bar tooltip-container">
                        <div class="glass-progress"><div class="progress-bar ${barColor}" style="width: ${party.affinity}%;"></div></div>
                        <span>${party.affinity}%</span>
                    </div>
                </td>
                <td><button class="glass-btn btn-small" onclick="alert('Negociações abertas com ${party.name}')"><i class="fa-solid fa-comments"></i> Negociar</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    renderSTF() {
        const container = document.getElementById('stf-container');
        container.innerHTML = '';

        GAME_DATA.stf.forEach(minister => {
            const div = document.createElement('div');
            
            if (minister.status === 'active') {
                div.className = 'minister-supreme-card';
                div.innerHTML = `
                    <div class="supreme-avatar"><i class="fa-solid fa-gavel"></i></div>
                    <div class="supreme-info">
                        <h4>Min. ${minister.name}</h4>
                        <span class="supreme-tag ideol-${minister.profile.toLowerCase()}">Perfil: ${minister.profile}</span>
                        <span class="supreme-tag text-muted">Indicação: ${minister.appointedBy}</span>
                    </div>
                    <div class="supreme-actions">
                        <button class="glass-btn btn-small btn-danger" onclick="document.getElementById('modals-overlay').classList.remove('hidden'); document.getElementById('modal-impeachment').classList.add('active');"><i class="fa-solid fa-ban"></i> Pedir Impeachment</button>
                    </div>
                `;
            } else {
                div.className = 'minister-supreme-card vacant-seat';
                div.innerHTML = `
                    <div class="supreme-avatar empty"><i class="fa-solid fa-user-plus"></i></div>
                    <div class="supreme-info">
                        <h4 class="text-muted">${minister.name}</h4>
                        <span class="supreme-tag text-muted">${minister.profile}</span>
                    </div>
                    <div class="supreme-actions executive-only">
                        <button class="glass-btn btn-small btn-success" onclick="document.getElementById('modals-overlay').classList.remove('hidden'); document.getElementById('modal-appoint-stf').classList.add('active');"><i class="fa-solid fa-pen-nib"></i> Indicar Ministro</button>
                    </div>
                `;
            }
            container.appendChild(div);
        });
    }

    renderCabinet() {
        const container = document.getElementById('cabinet-container');
        container.innerHTML = '';

        GAME_DATA.ministers.forEach(minister => {
            const div = document.createElement('div');
            div.className = 'minister-card';
            div.innerHTML = `
                <div class="minister-avatar"><i class="fa-solid fa-user-tie"></i></div>
                <div class="minister-info">
                    <span class="ministry-name">${minister.role}</span>
                    <span class="minister-name">${minister.name}</span>
                    <span class="minister-party text-blue">${minister.party}</span>
                </div>
                <button class="glass-btn btn-icon" title="Demitir Ministro" onclick="alert('Ministro ${minister.name} demitido!')"><i class="fa-solid fa-user-xmark"></i></button>
            `;
            container.appendChild(div);
        });
    }

    renderEvents() {
        const container = document.getElementById('events-container');
        container.innerHTML = '';

        if (this.state.activeEvents.length === 0) {
            container.innerHTML = `<div class="text-center p-4 text-muted"><i class="fa-solid fa-check-double icon-xl"></i><br>Nenhum evento pendente. O país está em paz.</div>`;
            return;
        }

        this.state.activeEvents.forEach(evt => {
            const div = document.createElement('div');
            div.className = `glass-card event-card ${evt.id.includes('escandalo') ? 'critical-event' : ''}`;
            
            // Gera os botões baseados no array de ações do objeto
            let actionsHTML = evt.actions.map((act, index) => {
                // Serializa o efeito para passar via inline JS ou adiciona listener via DOM
                return `<button class="glass-btn ${act.class} action-btn" data-eventid="${evt.id}" data-actionidx="${index}"><i class="fa-solid ${act.icon}"></i> ${act.label}</button>`;
            }).join('');

            div.innerHTML = `
                <div class="event-icon"><i class="fa-solid ${evt.icon} ${evt.tagClass.replace('accent-', 'text-')}"></i></div>
                <div class="event-content">
                    <span class="event-tag ${evt.tagClass}">${evt.tag}</span>
                    <h3>${evt.title}</h3>
                    <p>${evt.desc}</p>
                    <div class="event-actions">
                        ${actionsHTML}
                    </div>
                </div>
            `;
            container.appendChild(div);
        });

        // Adiciona listeners para os botões recém renderizados
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.currentTarget.getAttribute('data-eventid');
                const actionIdx = e.currentTarget.getAttribute('data-actionidx');
                const eventObj = this.state.activeEvents.find(ev => ev.id === eventId);
                const effect = eventObj.actions[actionIdx].effect;
                
                this.applyEventEffects(effect, eventId);
            });
        });
    }

    renderLawsQueue() {
        const tbody = document.getElementById('laws-table-body');
        tbody.innerHTML = '';

        this.state.lawsQueue.forEach(law => {
            const tr = document.createElement('tr');
            
            let actionHtml = '';
            if (law.status === 'pending') {
                actionHtml = `<button class="glass-btn btn-small btn-primary" onclick="window.simulator.openVotingModal('${law.id}')"><i class="fa-solid fa-play"></i> Pautar Votação</button>`;
            } else if (law.status === 'approved') {
                actionHtml = `<span class="status-badge approved"><i class="fa-solid fa-check"></i> Aprovada</span>`;
            } else {
                actionHtml = `<span class="status-badge rejected"><i class="fa-solid fa-xmark"></i> Rejeitada</span>`;
            }

            tr.innerHTML = `
                <td><strong>${law.title}</strong><br><span class="text-small text-muted">Tipo: ${law.type} | Necessário: ${law.votesNeeded} votos</span></td>
                <td>${law.author}</td>
                <td>${law.impact}</td>
                <td>${actionHtml}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // ==========================================
    // LÓGICA PARLAMENTAR E MATEMÁTICA
    // ==========================================
    recalculateCongressBase() {
        // Calcula a base com base na afinidade dos partidos
        let govDep = 0, indDep = 0, oppDep = 0;
        let govSen = 0, indSen = 0, oppSen = 0;

        GAME_DATA.parties.forEach(party => {
            if (party.affinity >= 60) {
                govDep += party.seatsDep; govSen += party.seatsSen;
                party.base = 'gov';
            } else if (party.affinity >= 40) {
                indDep += party.seatsDep; indSen += party.seatsSen;
                party.base = 'ind';
            } else {
                oppDep += party.seatsDep; oppSen += party.seatsSen;
                party.base = 'opp';
            }
        });

        this.state.congress.deputies = { gov: govDep, ind: indDep, opp: oppDep, total: 513 };
        this.state.congress.senate = { gov: govSen, ind: indSen, opp: oppSen, total: 81 };
    }

    proposeNewLaw() {
        // Reduz capital político e adiciona lei na pauta
        if (this.state.stats.politicalCapital < 150) {
            alert("Capital Político Insuficiente!");
            return;
        }

        this.state.stats.politicalCapital -= 150;
        
        const inputTitle = document.querySelector('#form-propose-law input').value;
        const newLaw = {
            id: 'lei_' + Date.now(),
            title: inputTitle || 'Projeto de Lei Genérico',
            author: this.state.playerRole === 'power' ? 'Executivo' : 'Legislativo',
            impact: 'Diversos',
            status: 'pending',
            votesNeeded: 257, // Maioria simples (Mock)
            type: 'PL'
        };

        this.state.lawsQueue.push(newLaw);
        
        this.updateDashboardUI();
        this.renderLawsQueue();
        this.closeAllModals();
        this.showToast("Lei enviada ao Congresso com sucesso!");
    }

    // ==========================================
    // ANIMAÇÕES: VOTAÇÃO (CÂMARA)
    // ==========================================
    
    // Invocado via HTML inline pelo mock ou via renderLawsQueue
    openVotingModal(lawId) {
        this.currentVotingLawId = lawId;
        const law = this.state.lawsQueue.find(l => l.id === lawId);
        
        document.querySelector('.voting-law-title').innerText = law.title;
        
        // Reseta UI do Modal
        document.getElementById('vote-yes').style.width = '0%';
        document.getElementById('vote-no').style.width = '0%';
        document.getElementById('vote-abs').style.width = '0%';
        document.getElementById('count-yes').innerText = '0';
        document.getElementById('count-no').innerText = '0';
        document.getElementById('count-abs').innerText = '0';
        document.getElementById('voting-final-result').classList.add('hidden');
        document.getElementById('btn-start-vote-anim').classList.remove('hidden');

        document.getElementById('modals-overlay').classList.remove('hidden');
        document.getElementById('modal-voting-animation').classList.add('active');
    }

    runVotingAnimation() {
        document.getElementById('btn-start-vote-anim').classList.add('hidden');
        const law = this.state.lawsQueue.find(l => l.id === this.currentVotingLawId);
        
        const totalVotes = 513; // Focando na câmara
        
        // Calcula a probabilidade de aprovação baseada na base
        // Base gov = 90% sim, Ind = 50% sim, Opp = 10% sim
        const dep = this.state.congress.deputies;
        let expectedYes = (dep.gov * 0.9) + (dep.ind * 0.5) + (dep.opp * 0.1);
        
        // Introduz RNG (Fator aleatório)
        let actualYes = Math.floor(expectedYes + (Math.random() * 40 - 20)); 
        let abs = Math.floor(Math.random() * 20); // Abstenções
        let actualNo = totalVotes - actualYes - abs;

        // Validação de limites
        actualYes = Math.max(0, Math.min(totalVotes, actualYes));
        actualNo = Math.max(0, Math.min(totalVotes, actualNo));

        // Setup Animação
        let currentYes = 0, currentNo = 0, currentAbs = 0;
        let counted = 0;

        const interval = setInterval(() => {
            // Adiciona votos em blocos para ser rápido porém visível
            let chunk = Math.floor(Math.random() * 15) + 5;
            if (counted + chunk > totalVotes) chunk = totalVotes - counted;

            for(let i=0; i<chunk; i++) {
                // Distribui os votos do chunk ponderadamente
                let rand = Math.random();
                let probYes = actualYes / totalVotes;
                let probNo = actualNo / totalVotes;

                if (rand < probYes && currentYes < actualYes) currentYes++;
                else if (rand < probYes + probNo && currentNo < actualNo) currentNo++;
                else currentAbs++;
                counted++;
            }

            // Atualiza UI
            document.getElementById('count-yes').innerText = currentYes;
            document.getElementById('count-no').innerText = currentNo;
            document.getElementById('count-abs').innerText = currentAbs;

            document.getElementById('vote-yes').style.width = `${(currentYes / totalVotes) * 100}%`;
            document.getElementById('vote-no').style.width = `${(currentNo / totalVotes) * 100}%`;
            document.getElementById('vote-abs').style.width = `${(currentAbs / totalVotes) * 100}%`;

            if (counted >= totalVotes) {
                clearInterval(interval);
                this.finalizeVoting(law, currentYes);
            }
        }, 50); // Roda a cada 50ms
    }

    finalizeVoting(law, totalYes) {
        const resultDiv = document.getElementById('voting-final-result');
        resultDiv.classList.remove('hidden');

        if (totalYes >= law.votesNeeded) {
            resultDiv.innerHTML = `<h1 class="text-green"><i class="fa-solid fa-check-circle"></i> PROJETO APROVADO</h1>`;
            law.status = 'approved';
            this.state.stats.approval += 2; // Bônus de vitória
        } else {
            resultDiv.innerHTML = `<h1 class="text-red"><i class="fa-solid fa-circle-xmark"></i> PROJETO REJEITADO</h1>`;
            law.status = 'rejected';
            this.state.stats.politicalCapital -= 20; // Penalidade de derrota
        }

        this.renderLawsQueue();
        this.updateDashboardUI();
    }

    // ==========================================
    // ANIMAÇÕES: ELEIÇÕES (URNAS)
    // ==========================================
    
    runElectionAnimation() {
        document.getElementById('btn-start-election-anim').classList.add('hidden');
        document.getElementById('election-winner-div').classList.add('hidden');
        
        let urnasApuradas = 0;
        // Simulando votos totais ~ 120.000.000
        const totalVoters = 120000000;
        
        // Chance de vitória baseada na aprovação do jogador
        // Se aprovação > 50, jogador tem vantagem.
        let probPlayer = (this.state.stats.approval / 100) + 0.05; // Pequeno bônus de reeleição
        
        let playerVotes = 0;
        let oppVotes = 0;

        const interval = setInterval(() => {
            urnasApuradas += (Math.random() * 2 + 1); // Avança 1 a 3% por tick
            if (urnasApuradas >= 100) urnasApuradas = 100;

            document.getElementById('urnas-percent').innerText = `${urnasApuradas.toFixed(2)}%`;
            document.getElementById('urnas-bar').style.width = `${urnasApuradas}%`;

            // Adiciona votos em proporção
            let chunkVotes = totalVoters * (urnasApuradas / 100) - (playerVotes + oppVotes);
            
            // Flutuação ao longo da apuração (efeito nordeste/sul clássico do BR)
            let currentProb = probPlayer + (Math.random() * 0.1 - 0.05);
            
            let newPlayerVotes = Math.floor(chunkVotes * currentProb);
            let newOppVotes = chunkVotes - newPlayerVotes;

            playerVotes += newPlayerVotes;
            oppVotes += newOppVotes;

            let totalCurrent = playerVotes + oppVotes;
            let playerPerc = ((playerVotes / totalCurrent) * 100).toFixed(2);
            let oppPerc = ((oppVotes / totalCurrent) * 100).toFixed(2);

            // Atualiza UI
            document.getElementById('cand1-perc').innerText = `${playerPerc}%`;
            document.getElementById('cand1-bar').style.width = `${playerPerc}%`;
            document.getElementById('cand1-abs').innerText = `${playerVotes.toLocaleString('pt-BR')} votos`;

            document.getElementById('cand2-perc').innerText = `${oppPerc}%`;
            document.getElementById('cand2-bar').style.width = `${oppPerc}%`;
            document.getElementById('cand2-abs').innerText = `${oppVotes.toLocaleString('pt-BR')} votos`;

            if (urnasApuradas >= 100) {
                clearInterval(interval);
                const winner = playerVotes > oppVotes ? "João Silva (Você)" : "Candidato da Oposição (PT)";
                const winnerDiv = document.getElementById('election-winner-div');
                winnerDiv.classList.remove('hidden');
                document.getElementById('winner-name').innerText = winner;
                
                if (playerVotes > oppVotes) {
                    winnerDiv.querySelector('h2').style.color = 'var(--color-green)';
                } else {
                    winnerDiv.querySelector('h2').style.color = 'var(--color-red)';
                    setTimeout(() => alert("Você perdeu as eleições. Game Over!"), 2000);
                }
            }
        }, 150); // Tick speed
    }

    // ==========================================
    // UTILITÁRIOS
    // ==========================================
    
    closeAllModals() {
        document.getElementById('modals-overlay').classList.add('hidden');
        document.querySelectorAll('dialog').forEach(m => m.classList.remove('active'));
    }

    showToast(message) {
        // Cria um elemento toast simples dinamicamente
        const toast = document.createElement('div');
        toast.className = 'glass-card toast-message';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        toast.style.borderLeft = '4px solid var(--color-green)';
        toast.style.animation = 'slideIn 0.5s ease-out forwards';
        toast.innerHTML = `<i class="fa-solid fa-bell"></i> ${message}`;
        
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

// Inicializa o jogo e expõe para o window para que os onClick no HTML consigam acessar
window.addEventListener('DOMContentLoaded', () => {
    window.simulator = new PoliticalSimulator();
});
