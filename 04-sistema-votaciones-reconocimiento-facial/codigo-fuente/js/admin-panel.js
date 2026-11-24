// Populate username for all displays
const adminUsername = localStorage.getItem('admin_user') || 'Admin';
document.querySelectorAll('.current-user-display').forEach(el => el.innerText = adminUsername);

// ===============================
// VARIABLES GLOBALES
// ===============================
let dashboardChart = null;
let current_election_id = null;
window.allUsers = [];

const GOVERNMENT_POSITIONS = [
    '1er Lugar',
    '2do Lugar',
    '3er Lugar',
    '4to Lugar',
    '5to Lugar',
    '6to Lugar',
    '7mo Lugar'
];

// ===============================
// NAVEGACIÃ“N
// ===============================
function switchTab(tabId) {
    document.getElementById('tab-dashboard')?.classList.add('hidden');
    document.getElementById('tab-votos-detallados')?.classList.add('hidden');
    document.getElementById('tab-candidatos')?.classList.add('hidden');
    document.getElementById('tab-admins')?.classList.add('hidden');

    const desktopTabs = ['dashboard', 'votos-detallados', 'candidatos', 'admins'];
    desktopTabs.forEach(tab => {
        const btn = document.getElementById('nav-' + tab);
        if (btn) {
            btn.className = 'w-full text-left px-4 py-3 hover:bg-gray-800 rounded-xl font-medium transition text-gray-300';
        }
    });

    document.querySelectorAll('.mobile-nav').forEach(btn => {
        btn.className = 'mobile-nav w-full text-left px-4 py-3 hover:bg-gray-800 rounded-xl font-medium transition text-gray-300';
    });

    document.getElementById('tab-' + tabId)?.classList.remove('hidden');

    const activeDesktopBtn = document.getElementById('nav-' + tabId);
    if (activeDesktopBtn) {
        activeDesktopBtn.className = 'w-full text-left px-4 py-3 bg-indigo-600 rounded-xl font-medium transition text-white';
    }

    document.querySelectorAll('.mobile-nav').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.className = 'mobile-nav w-full text-left px-4 py-3 bg-indigo-600 rounded-xl font-medium transition text-white';
        }
    });

    if (tabId === 'dashboard') loadDashboardResults();
    if (tabId === 'votos-detallados') loadUsers();
    if (tabId === 'candidatos') loadElections();
}

// ===============================
// DASHBOARD
// ===============================
async function ensureElectionSelectLoaded() {
    const select = document.getElementById('dashboard-election-select');
    if (!select) return null;

    try {
        const currentValue = select.value;

        const elRes = await fetch('api/manage_elections.php?action=get&nocache=' + Date.now());
        const elData = await elRes.json();

        select.innerHTML = '<option value="">Selecciona un Tema...</option>';

        if (elData.status === 'success' && Array.isArray(elData.data)) {
            elData.data.forEach(e => {
                const opt = document.createElement('option');
                opt.value = e.id;
                opt.text = e.titulo;
                select.appendChild(opt);
            });

            if (currentValue && [...select.options].some(o => o.value === currentValue)) {
                select.value = currentValue;
            } else if (elData.data.length > 0) {
                select.value = elData.data[0].id;
            }
        }

        return select.value;
    } catch (e) {
        console.error('Error cargando elecciones del dashboard:', e);
        return null;
    }
}

async function loadDashboardResults() {
    try {
        const userRes = await fetch('api/get_users.php?nocache=' + Date.now());
        const userResult = await userRes.json();
        const users = userResult.data || [];
        window.allUsers = users;

        document.getElementById('stat-users').innerText = users.length.toLocaleString();

        const currentElectionId = await ensureElectionSelectLoaded();
        const select = document.getElementById('dashboard-election-select');

        if (!currentElectionId) {
            document.getElementById('stat-votes').innerText = '0';
            document.getElementById('stat-votes-fraction').innerText = `de ${users.length.toLocaleString()} registrados`;
            document.getElementById('stat-pending').innerText = users.length.toLocaleString();
            document.getElementById('stat-pending-detail').innerText = 'aÃºn no han votado';
            document.getElementById('stat-participation').innerText = '0%';
            document.getElementById('stat-participation-detail').innerText = `0 de ${users.length.toLocaleString()}`;
            document.getElementById('chart-title-detail').innerText = 'Seleccione un tema';
            clearDashboardChart();
            renderGovernmentRanking([]);
            return;
        }

        const selectedText = select.options[select.selectedIndex]?.text || 'Resultados';
        document.getElementById('chart-title-detail').innerText = selectedText;

        const res = await fetch('api/get_results.php?id_eleccion=' + currentElectionId + '&nocache=' + Date.now());
        const data = await res.json();

        const candidates = (data.status === 'success' && Array.isArray(data.data)) ? data.data : [];
        const votedCount = Number(data.total_general || 0);
        const pendingCount = Math.max(users.length - votedCount, 0);

        document.getElementById('stat-votes').innerText = votedCount.toLocaleString();
        document.getElementById('stat-votes-fraction').innerText = `de ${users.length.toLocaleString()} registrados`;
        document.getElementById('stat-pending').innerText = pendingCount.toLocaleString();
        document.getElementById('stat-pending-detail').innerText = 'aÃºn no han votado en este tema';

        let participationStr = '0%';
        if (users.length > 0) {
            const pct = (votedCount / users.length) * 100;
            participationStr = pct.toFixed(2).replace(/\.?0+$/, '') + '%';
        }

        document.getElementById('stat-participation').innerText = participationStr;
        document.getElementById('stat-participation-detail').innerText = `${votedCount} de ${users.length.toLocaleString()}`;

        renderDashboardChart(candidates);
        renderGovernmentRanking(candidates);
        updateLastRefreshTime();
    } catch (e) {
        console.error('Error cargando dashboard', e);
    }
}

function renderDashboardChart(candidates) {
    const canvas = document.getElementById('resultsChart');
    if (!canvas) return;

    const labels = candidates.map(c => c.nombre);
    const votesData = candidates.map(c => Number(c.total_votos || 0));

    if (dashboardChart) dashboardChart.destroy();

    if (labels.length === 0) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const ctx = canvas.getContext('2d');
    const bgColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316'];

    dashboardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: votesData,
                backgroundColor: bgColors.slice(0, Math.max(labels.length, bgColors.length)),
                borderWidth: 0,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 25,
                        font: { family: "'Inter', sans-serif", size: 14 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const val = context.raw || 0;
                            const total = context.chart._metasets[context.datasetIndex].total || 0;
                            const pct = total > 0 ? (val / total) * 100 : 0;
                            const pctStr = pct.toFixed(2).replace(/\.?0+$/, '') + '%';
                            return ` ${label}: ${pctStr} (${val} votos)`;
                        }
                    },
                    bodyFont: { family: "'Inter', sans-serif", size: 13 },
                    padding: 12
                }
            },
            cutout: '65%'
        }
    });
}

function clearDashboardChart() {
    if (dashboardChart) {
        dashboardChart.destroy();
        dashboardChart = null;
    }

    const canvas = document.getElementById('resultsChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// ===============================
// RANKING DE PUESTOS
// ===============================
function renderGovernmentRanking(candidates) {
    const tbody = document.getElementById('government-ranking-body');
    if (!tbody) return;

    if (!Array.isArray(candidates) || candidates.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="py-8 text-center text-gray-400 text-sm">
                    No hay candidatos o todavÃ­a no hay resultados para mostrar.
                </td>
            </tr>
        `;
        return;
    }

    const ordered = [...candidates]
        .sort((a, b) => Number(b.total_votos || 0) - Number(a.total_votos || 0))
        .slice(0, 7);

    const totalVotes = ordered.reduce((acc, item) => acc + Number(item.total_votos || 0), 0);

    tbody.innerHTML = ordered.map((cand, index) => {
        const puesto = GOVERNMENT_POSITIONS[index] || `Puesto ${index + 1}`;
        const votos = Number(cand.total_votos || 0);
        const porcentaje = totalVotes > 0 ? ((votos / totalVotes) * 100).toFixed(1) : '0.0';
        const foto = cand.foto_url || cand.foto || '';
        const inicial = cand.nombre ? cand.nombre.charAt(0).toUpperCase() : '?';

        return `
            <tr class="hover:bg-gray-50 transition">
                <td class="py-3 px-3 align-middle">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                            ${index + 1}
                        </span>
                        <div class="flex flex-col">
                            <span class="font-semibold text-gray-800">${puesto}</span>
                            <span class="text-xs text-gray-400">Asignado por ranking</span>
                        </div>
                    </div>
                </td>

                <td class="py-3 px-3 align-middle">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-600">
                            ${foto
                                ? `<img src="${foto}" alt="${cand.nombre}" class="w-full h-full object-cover">`
                                : inicial}
                        </div>
                        <div>
                            <div class="font-semibold text-gray-900">${cand.nombre}</div>
                            <div class="text-xs text-gray-500">Ranking #${index + 1}</div>
                        </div>
                    </div>
                </td>

                <td class="py-3 px-3 text-right align-middle">
                    <span class="font-bold text-gray-900">${votos}</span>
                </td>

                <td class="py-3 px-3 text-right align-middle">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        ${porcentaje}%
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function updateLastRefreshTime() {
    const now = new Date();
    document.getElementById('last-update-time').innerText = now.toLocaleTimeString();
}

// ===============================
// USUARIOS
// ===============================
async function loadUsers() {
    try {
        const response = await fetch('api/get_users.php?nocache=' + Date.now());
        const result = await response.json();
        window.allUsers = result.data || [];
        renderUsersTable(window.allUsers);
    } catch (e) {
        console.error("Error loading users", e);
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('users-table-body');
    let html = '';

    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-6 text-center text-gray-400">No se encontraron votantes.</td></tr>';
        return;
    }

    users.forEach((user) => {
        const resetBtn = `<button onclick="editUser(${user.id}, '${(user.nombre || '').replace(/'/g, "\\'")}', '${(user.correo || '').replace(/'/g, "\\'")}')"
            title="Editar Usuario" class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition">âœï¸ Editar</button>`;

        let actionButton = '';
        if (user.total_votos > 0) {
            actionButton = `<div class="flex gap-2 justify-center flex-wrap">
                <button onclick="deleteVote(${user.id})" title="Borrar Votos Completos" class="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition">ðŸ—‘ï¸ Reiniciar Voto</button>
                ${resetBtn}
            </div>`;
        } else {
            actionButton = `<div class="flex gap-2 justify-center flex-wrap">${resetBtn}</div>`;
        }

        const hasFace = user.face_id ? 'âœ…' : 'âŒ';

        html += `
        <tr class="hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
            <td class="py-4 px-6 text-sm text-gray-900 font-medium">#${user.id}</td>
            <td class="py-4 px-6 text-sm text-gray-800 font-medium">
                ${user.nombre || 'Sin Nombre'}
                <div class="text-[10px] text-gray-400 mt-1">Rostro: ${hasFace}</div>
            </td>
            <td class="py-4 px-6 text-sm text-gray-600">${user.correo}</td>
            <td class="py-4 px-6 text-sm text-gray-600">${user.total_votos > 0 ? '<span class="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">' + user.total_votos + ' votos</span>' : '<span class="text-gray-500 bg-gray-100 px-2 py-1 rounded-md">0</span>'}</td>
            <td class="py-4 px-6 text-center">${actionButton}</td>
        </tr>`;
    });

    tbody.innerHTML = html;
}

function filterUsers() {
    const query = document.getElementById('search-voters').value.toLowerCase().trim();
    if (!query) {
        renderUsersTable(window.allUsers || []);
        return;
    }

    const filtered = (window.allUsers || []).filter(u => {
        const name = (u.nombre || '').toLowerCase();
        const email = (u.correo || '').toLowerCase();
        return name.includes(query) || email.includes(query);
    });

    renderUsersTable(filtered);
}

async function uploadUsersCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const confirmation = await Swal.fire({
        title: 'Â¿Importar archivo?',
        text: 'SÃ³lo aÃ±adirÃ¡ nuevos registros.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Importar'
    });

    if (!confirmation.isConfirmed) {
        event.target.value = '';
        return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    const prevText = event.target.nextElementSibling.innerHTML;
    event.target.nextElementSibling.innerHTML = "Subiendo y leyendo...";

    try {
        const res = await fetch('api/upload_users.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.status === 'success') {
            Swal.fire('Ã‰xito', data.message, 'success');
            loadUsers();
            loadDashboardResults();
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (e) {
        Swal.fire('Error', 'Error de conexiÃ³n al subir el archivo.', 'error');
    }

    event.target.value = '';
    event.target.nextElementSibling.innerHTML = prevText;
}

async function deleteVote(id_usuario) {
    const confirmation = await Swal.fire({
        title: 'Â¿Resetear todos los votos?',
        text: 'Se eliminarÃ¡n TODOS los votos de este estudiante (en todos los temas).',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Borrar todo'
    });
    if (!confirmation.isConfirmed) return;

    try {
        const res = await fetch('api/delete_vote.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_usuario })
        });
        const data = await res.json();

        if (data.status === 'success') {
            loadUsers();
            loadDashboardResults();
            Swal.fire('Borrados', 'Votos eliminados correctamente.', 'success');
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (e) {
        console.error("Error al borrar el voto", e);
    }
}



async function loadElections() {
    try {
        const res = await fetch('api/manage_elections.php?action=get&nocache=' + Date.now());
        const data = await res.json();
        const grid = document.getElementById('elections-grid');
        grid.innerHTML = '';

        if (data.status === 'success' && data.data.length > 0) {
            data.data.forEach(e => {
                const isActive = e.estado === 'activa';
                const statusColor = isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200';
                const mainBorder = isActive ? 'border-2 border-indigo-400 shadow-md' : 'border border-gray-200 shadow-sm';

                grid.innerHTML += `
                <div class="glass-panel p-5 rounded-2xl ${mainBorder} transition bg-white flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <span class="px-3 py-1 rounded-full text-xs font-bold border ${statusColor}">
                                ${isActive ? 'âœ… ACTIVO' : 'INACTIVO'}
                            </span>
                            <div class="flex gap-2">
                                <label class="relative inline-flex items-center cursor-pointer" title="Activar/Desactivar">
                                    <input type="checkbox" class="sr-only peer" ${isActive ? 'checked' : ''} onchange="toggleElection(${e.id}, this.checked)">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                                <button onclick="deleteElection(${e.id})" title="Eliminar Tema" class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
                                    ðŸ—‘ï¸
                                </button>
                            </div>
                        </div>
                        <h4 class="font-bold text-lg text-gray-900 mb-4 line-clamp-2">${e.titulo}</h4>
                    </div>
                    <button onclick="openElection(${e.id}, '${e.titulo.replace(/'/g, "\\'")}')" class="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl transition">
                        ðŸ‘¥ Administrar Candidatos â†’
                    </button>
                </div>`;
            });
        } else {
            grid.innerHTML = '<div class="col-span-1 sm:col-span-2 text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No hay temas de debate creados.</div>';
        }
    } catch (err) {
        console.error("Error cargando elecciones", err);
    }
}

async function addElection() {
    const titulo = document.getElementById('new-election-title').value.trim();
    if (!titulo) {
        Swal.fire('AtenciÃ³n', 'Escribe un tÃ­tulo para el tema.', 'warning');
        return;
    }

    try {
        const res = await fetch('api/manage_elections.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo })
        });
        const data = await res.json();
        if (data.status === 'success') {
            document.getElementById('new-election-title').value = '';
            loadElections();
            loadDashboardResults();
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (err) {
        Swal.fire('Error', 'No se pudo crear.', 'error');
    }
}

async function toggleElection(id, isChecked) {
    const estado = isChecked ? 'activa' : 'inactiva';
    try {
        await fetch('api/manage_elections.php?action=toggle', {
            method: 'POST',
            body: JSON.stringify({ id, estado })
        });
        loadElections();
        loadDashboardResults();
    } catch (err) {
        console.error(err);
    }
}

async function deleteElection(id) {
    const conf = await Swal.fire({
        title: 'Â¿Eliminar este tema?',
        text: 'Se eliminarÃ¡n sus candidatos y todos los votos asociados a este tema.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'SÃ­, eliminar'
    });
    if (!conf.isConfirmed) return;

    try {
        const res = await fetch('api/manage_elections.php?action=delete', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.status === 'success') {
            loadElections();
            loadDashboardResults();
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (err) {
        Swal.fire('Error', 'Error de red', 'error');
    }
}

function openElection(id, titulo) {
    current_election_id = id;
    document.getElementById('current-election-title').innerText = "Tema: " + titulo;
    document.getElementById('elections-view').classList.add('hidden');
    document.getElementById('candidates-view').classList.remove('hidden');
    loadCandidates();
}

function goBackToElections() {
    current_election_id = null;
    document.getElementById('candidates-view').classList.add('hidden');
    document.getElementById('elections-view').classList.remove('hidden');
    loadElections();
}

// ===============================
// CANDIDATOS
// ===============================
async function loadCandidates() {
    if (!current_election_id) return;
    try {
        const res = await fetch('api/manage_candidates.php?action=get&id_eleccion=' + current_election_id + '&nocache=' + Date.now());
        const data = await res.json();
        const grid = document.getElementById('candidates-grid');
        grid.innerHTML = '';

        if (data.status === 'success' && data.data.length > 0) {
            data.data.forEach(c => {
                grid.innerHTML += `
                <div class="glass-panel p-5 rounded-2xl border border-gray-200 text-center shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
                    <div>
                        <div class="relative inline-block">
                            <img src="${c.foto_url}" class="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md bg-gray-50 mb-3">
                            <div class="absolute bottom-2 right-0 w-6 h-6 bg-indigo-500 rounded-full border-2 border-white text-white flex items-center justify-center text-xs shadow-sm">ðŸ‘‘</div>
                        </div>
                        <h4 class="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 mb-2">${c.nombre}</h4>
                        <p class="text-xs text-gray-600 mt-2 h-14 overflow-y-auto text-left leading-relaxed px-1">${c.propuesta}</p>
                    </div>
                    <button onclick="deleteCandidate(${c.id})" class="mt-4 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-xl transition">Eliminar</button>
                </div>`;
            });
        } else {
            grid.innerHTML = '<div class="col-span-1 sm:col-span-2 text-center py-6 text-gray-400">No hay candidatos registrados.</div>';
        }
    } catch (e) {
        console.error("Error cargando candidatos", e);
    }
}

async function addCandidate() {
    const nombre = document.getElementById('cand-nombre').value.trim();
    const propuesta = document.getElementById('cand-propuesta').value.trim();
    const fileInput = document.getElementById('cand-foto');

    if (!nombre || !fileInput.files[0]) {
        Swal.fire('AtenciÃ³n', 'Completar campos obligatorios', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64 = e.target.result;
        const res = await fetch('api/manage_candidates.php?action=add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_eleccion: current_election_id, nombre, propuesta, foto: base64 })
        });
        const data = await res.json();
        if (data.status === 'success') {
            document.getElementById('cand-nombre').value = '';
            document.getElementById('cand-propuesta').value = '';
            fileInput.value = '';
            loadCandidates();
            loadDashboardResults();
            Swal.fire('Ã‰xito', 'Candidato aÃ±adido.', 'success');
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    };
    reader.readAsDataURL(fileInput.files[0]);
}

async function deleteCandidate(id) {
    const confirmation = await Swal.fire({
        title: 'Â¿Eliminar candidato?',
        text: 'TambiÃ©n se eliminarÃ¡n los votos que recibiÃ³ este candidato.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SÃ­, eliminar',
        confirmButtonColor: '#dc2626'
    });
    if (!confirmation.isConfirmed) return;

    const res = await fetch('api/manage_candidates.php?action=delete', {
        method: 'POST',
        body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.status === 'success') {
        loadCandidates();
        loadDashboardResults();
        Swal.fire('Eliminado', 'Candidato y sus votos eliminados.', 'success');
    } else {
        Swal.fire('Error', data.message, 'error');
    }
}

// ===============================
// ADMIN
// ===============================
async function createAdmin() {
    const user = document.getElementById('new-admin-user').value.trim();
    const pass = document.getElementById('new-admin-pass').value.trim();

    if (!user || !pass) {
        Swal.fire('Aviso', 'Completa usuario y contraseÃ±a.', 'warning');
        return;
    }

    const res = await fetch('api/admin_auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'create', usuario: user, contrasena: pass })
    });
    const data = await res.json();

    if (data.status === 'success') {
        Swal.fire('Ã‰xito', 'Administrador creado exitosamente.', 'success');
        document.getElementById('new-admin-user').value = '';
        document.getElementById('new-admin-pass').value = '';
    } else {
        Swal.fire('Error', data.message, 'error');
    }
}




// ===============================
// IMPRESIÃ“N DE RESULTADOS
// ===============================
function printResults() {
    const select = document.getElementById('dashboard-election-select');
    const electionId = select.value;
    const electionName = select.options[select.selectedIndex]?.text || 'Resultados';
    
    if (!electionId) {
        Swal.fire({
            title: 'Selecciona un tema',
            text: 'Por favor selecciona un tema de debate para imprimir sus resultados',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Preparar informaciÃ³n para la impresiÃ³n
    document.getElementById('print-date').innerText = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('election-print-name').innerHTML = `
        <strong>Tema:</strong> ${electionName}<br>
        <strong>Fecha de generaciÃ³n:</strong> ${new Date().toLocaleString('es-ES')}
    `;

    // Forzar renderizado de la grÃ¡fica antes de imprimir
    if (dashboardChart) {
        dashboardChart.resize();
    }

    // PequeÃ±a demora para asegurar que todo se renderice
    setTimeout(() => {
        window.print();
    }, 300);
}




// ===============================
// IMPRESIÃ“N DE TABLA DE VOTANTES
// ===============================
function printVotersTable() {
    const totalVoters = window.allUsers?.length || 0;
    const votedCount = (window.allUsers || []).filter(u => u.total_votos > 0).length;
    const pendingCount = totalVoters - votedCount;
    
    // Preparar metadatos del reporte
    const dateStr = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const votedPercent = totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0;

    document.getElementById('voters-print-meta').innerHTML = `
        <div style="font-size: 12pt; margin-bottom: 5px;">
            <strong>Total Registrados:</strong> ${totalVoters} &nbsp;|&nbsp; 
            <strong>Han Votado:</strong> ${votedCount} (${votedPercent}%) &nbsp;|&nbsp; 
            <strong>Pendientes:</strong> ${pendingCount}
        </div>
        <div style="font-size: 10pt; color: #666; margin-top: 8px;">
            <em>Fecha de generaciÃ³n: ${dateStr}</em>
        </div>
    `;

    // Verificar si hay datos
    if (totalVoters === 0) {
        Swal.fire({
            title: 'Sin datos',
            text: 'No hay votantes registrados para imprimir',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Si hay un filtro activo, advertir que se imprimirÃ¡ solo lo visible
    const searchValue = document.getElementById('search-voters')?.value.trim();
    if (searchValue) {
        Swal.fire({
            title: 'Filtro activo',
            text: 'Se imprimirÃ¡ solo la tabla filtrada actual. Â¿Deseas continuar?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'SÃ­, imprimir filtrado',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                executeVotersPrint();
            }
        });
    } else {
        executeVotersPrint();
    }
}

function executeVotersPrint() {
    // PequeÃ±a demora para asegurar que el DOM se actualice
    setTimeout(() => {
        window.print();
    }, 300);
}



// ===============================
// AGREGAR ALUMNO MANUALMENTE
// ===============================
async function addManualUser() {
    const { value: formValues } = await Swal.fire({
        title: 'Agregar Visitante / Evaluador',
        html:
            '<div style="text-align: left; margin-bottom: 10px;"><label style="font-size: 14px; color: #555;">Nombre completo</label><input id="swal-input-name" class="swal2-input" placeholder="Ej: Juan Pérez" style="margin-top: 5px;"></div>' +
            '<div style="text-align: left;"><label style="font-size: 14px; color: #555;">Correo Electrónico</label><input id="swal-input-email" type="email" class="swal2-input" placeholder="tu-correo@gmail.com" style="margin-top: 5px;"></div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = document.getElementById('swal-input-name').value.trim();
            const email = document.getElementById('swal-input-email').value.trim();
            if (!nombre || !email) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
            }
            return { nombre: nombre, correo: email }
        }
    });

    if (formValues) {
        try {
            const res = await fetch('api/add_user.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues)
            });
            const data = await res.json();
            
            if (data.status === 'success') {
                Swal.fire('Agregado', data.message, 'success');
                if (typeof loadUsers === 'function') loadUsers();
                if (typeof loadDashboardResults === 'function') loadDashboardResults();
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (e) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    }
}

// ===============================
// INIT
// ===============================
let adminAutoRefreshInterval = null;

async function adminAutoRefresh() {
    try {
        // Obtenemos quÃ© tab estÃ¡ activo
        const dashboard = document.getElementById('tab-dashboard');
        
        // SOLO actualizar el dashboard, y solo si estÃ¡ visible
        if (dashboard && !dashboard.classList.contains('hidden')) {
            await loadDashboardResults();
        }
    } catch(e) {
        // Silenciar errores
    }
}

window.onload = () => {
    switchTab('dashboard');
    // Auto-actualizaciÃ³n cada 10 segundos
    adminAutoRefreshInterval = setInterval(adminAutoRefresh, 10000);
};

window.addEventListener('beforeunload', () => {
    if (adminAutoRefreshInterval) clearInterval(adminAutoRefreshInterval);
});


async function editUser(id_usuario, nombre, correo) {
    const { value: formValues, isConfirmed } = await Swal.fire({
        title: "Editar a " + nombre,
        html: `<div style="text-align: left; margin-bottom: 10px;">
                <label style="font-size: 14px; color: #555;">Nombre completo</label>
                <input id="edit-name-input" type="text" class="swal2-input" value="" + nombre + "" style="margin-top: 5px;">
            </div>
            <div style="text-align: left;">
                <label style="font-size: 14px; color: #555;">Correo Electrónico</label>
                <input id="edit-email-input" type="email" class="swal2-input" value="" + correo + "" style="margin-top: 5px;">
            </div>`,
        confirmButtonText: 'Guardar Cambios',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const valName = document.getElementById('edit-name-input').value.trim();
            const valEmail = document.getElementById('edit-email-input').value.trim();
            if (!valName || !valEmail) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
            return { nombre: valName, correo: valEmail };
        }
    });

    if (!isConfirmed || !formValues) return;

    try {
        const res = await fetch('api/edit_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id_usuario, nombre: formValues.nombre, correo: formValues.correo })
        });
        const data = await res.json();
        
        if (data.status === 'success') {
            Swal.fire('Listo', data.message, 'success');
            loadUsers(); // Refrescar la tabla
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    } catch (e) {
        console.error("Error actualizando usuario", e);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
}




