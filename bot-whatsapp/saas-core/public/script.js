const API_URL = '/api';
let authToken = localStorage.getItem('saas_token') || new URLSearchParams(window.location.search).get('token');

if (authToken) {
    localStorage.setItem('saas_token', authToken);
    document.getElementById('tokenInput').value = authToken;
    login(); // Auto-login try
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    if (res.status === 401) {
        logout();
        throw new Error('Não autorizado');
    }
    return res.json();
}

let supabaseClient = null;

// Inicializa Supabase no Frontend
async function initSupabase() {
    try {
        const res = await fetch('/api/public-config');
        const config = await res.json();
        supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
    } catch (e) {
        console.error('Erro ao iniciar Supabase', e);
    }
}
initSupabase();

async function loginWithEmail() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!email || !password) return alert('Preencha email e senha.');

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Sucesso!
        authToken = data.session.access_token;
        localStorage.setItem('saas_token', authToken);
        finishLogin();

    } catch (e) {
        alert('Erro ao logar: ' + e.message);
    }
}

async function loginWithToken() {
    const token = document.getElementById('tokenInput').value;
    if (!token) return alert('Digite o token!');

    authToken = token;
    localStorage.setItem('saas_token', token);
    finishLogin();
}

async function finishLogin() {
    try {
        await fetchStatus(true); // Se der erro 401, ele desloga
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';

        // Carregar resto
        fetchMetrics();

        // Setar data de hoje no input agenda
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('agendaDate').value = today;
        fetchAgenda(today);

    } catch (e) {
        alert('Credenciais inválidas.');
        logout();
    }
}

function logout() {
    localStorage.removeItem('saas_token');
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

async function fetchStatus(isLoginCheck = false) {
    try {
        const data = await apiCall('/status');

        // 🚀 DYNAMIC PERSONALIZATION
        if (data.botName) {
            document.getElementById('headerBotName').innerText = data.botName;
            document.title = `Painel - ${data.botName}`;
        }
        if (data.professionalName) {
            document.getElementById('headerProfName').innerText = data.professionalName;
            document.getElementById('tenantNameDisplay').innerText = `Acesso: ${data.professionalName}`;
        }

        const badge = document.getElementById('statusBadge');
        if (data.connected) {
            badge.innerText = 'Online 🟢';
            badge.className = 'status-badge connected';
        } else {
            badge.innerText = 'Desconectado 🔴';
            badge.className = 'status-badge disconnected';
        }

        const btnPause = document.getElementById('btnPause');
        if (data.paused) {
            btnPause.innerText = '▶️ Retomar Bot';
            btnPause.className = 'btn-pause paused';
        } else {
            btnPause.innerText = '⏸️ Pausar Bot';
            btnPause.className = 'btn-pause';
        }

    } catch (e) {
        if (!isLoginCheck) console.error(e);
        throw e;
    }
}

async function fetchMetrics() {
    try {
        const data = await apiCall('/dashboard/metrics?days=30');
        document.getElementById('msgCount').innerText = data.total_interactions || 0;
        document.getElementById('leadsCount').innerText = data.total_leads || 0;
        document.getElementById('uptime').innerText = '100%'; // Placeholder real
    } catch (e) {
        console.error('Erro ao buscar métricas', e);
    }
}

async function fetchAgenda(dateInput) {
    try {
        const date = dateInput || document.getElementById('agendaDate').value;
        const data = await apiCall(`/agenda?date=${date}`);
        const list = document.getElementById('agendaList');

        if (!data.appointments || data.appointments.length === 0) {
            list.innerHTML = '<p class="text-muted">Nenhum agendamento para hoje.</p>';
            return;
        }

        list.innerHTML = data.appointments.map(apt => `
            <div class="agenda-item">
                <span class="agenda-time">${new Date(apt.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span class="agenda-title">${apt.title}</span>
            </div>
        `).join('');

    } catch (e) {
        console.error('Erro na agenda', e);
    }
}

// ─── CRM LOGIC ───

function showCrm() {
    const section = document.getElementById('crmSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    if (section.style.display === 'block') {
        fetchLeads();
    }
}

let loadedLeads = [];

async function fetchLeads(filter = 'all', value = null) {
    try {
        document.getElementById('leadsList').innerHTML = '<div style="padding:1rem;">⏳ Carregando leads...</div>';
        const query = value ? `&filter=${filter}&value=${value}` : '';
        const data = await apiCall(`/crm/leads?${query}`);
        loadedLeads = data.leads || [];
        renderLeads(loadedLeads);
    } catch (e) {
        console.error('Erro ao buscar leads', e);
        document.getElementById('leadsList').innerHTML = '<div style="padding:1rem; color:red;">Erro ao carregar leads.</div>';
    }
}

function renderLeads(leads) {
    const list = document.getElementById('leadsList');
    if (leads.length === 0) {
        list.innerHTML = '<p class="text-muted">Nenhum contato encontrado.</p>';
        return;
    }

    list.innerHTML = leads.map(lead => `
        <div class="lead-item">
            <div style="display: flex; align-items: center;">
                <input type="checkbox" class="lead-check" value="${lead.phone}" checked>
                <div class="lead-info">
                    <h4>${lead.name || 'Sem nome'}</h4>
                    <p>${lead.phone} • ${new Date(lead.created_at).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="lead-tags">
                ${(lead.tags || []).map(t => `<span>${t}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// ─── BROADCAST LOGIC ───

function openBroadcastModal() {
    // Conta quantos selecionados
    const selected = document.querySelectorAll('.lead-check:checked').length;
    if (selected === 0) return alert('Selecione pelo menos um contato da lista.');

    document.getElementById('broadcastModal').style.display = 'flex';
}

function closeBroadcastModal() {
    document.getElementById('broadcastModal').style.display = 'none';
}

async function sendBroadcast() {
    const msg = document.getElementById('broadcastMsg').value;
    if (!msg) return alert('Escreva uma mensagem.');

    const checks = document.querySelectorAll('.lead-check:checked');
    const phones = Array.from(checks).map(c => c.value);

    if (confirm(`Confirmar envio para ${phones.length} pessoas?\nIsso pode demorar alguns minutos.`)) {
        try {
            await apiCall('/crm/broadcast', 'POST', { phones, message: msg });
            alert('✅ Disparo iniciado! O bot enviará em segundo plano.');
            closeBroadcastModal();
            document.getElementById('broadcastMsg').value = '';
        } catch (e) {
            alert('Erro ao iniciar disparo.');
        }
    }
}

async function togglePause() {
    const btn = document.getElementById('btnPause');
    const isPaused = btn.className.includes('paused');
    const action = isPaused ? 'resume' : 'pause';

    if (!confirm(`Deseja realmente ${isPaused ? 'retomar' : 'pausar'} o bot?`)) return;

    await apiCall(`/bot/${action}`, 'POST');
    fetchStatus();
}

// Auto-refresh status every 30s
setInterval(async () => {
    if (document.getElementById('appContainer').style.display === 'block') {
        try {
            await fetchStatus();
        } catch (e) {
            console.warn('Falha no health-check, tentando novamente em breve...');
        }
    }
}, 30000);



