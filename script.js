// ========================================
// BBL Prüfplattform Flächenmanagement
// Main JavaScript
// ========================================

// === MOCK DATA ===
const mockProjects = [
    {
        id: 1,
        name: 'Bern, Verwaltungsgebäude Liebefeld',
        location: 'Bern',
        siaPhase: '53',
        createdDate: '14/04/2022',
        documentCount: 14,
        completionPercentage: 95,
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Genf, Dienstleistungszentrum Montbrillant',
        location: 'Genf',
        siaPhase: '52',
        createdDate: '22/03/2022',
        documentCount: 8,
        completionPercentage: 75,
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Magglinen, BAZG, Hochschule Hauptgebäude',
        location: 'Magglinen',
        siaPhase: '51',
        createdDate: '10/02/2022',
        documentCount: 22,
        completionPercentage: 65,
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1502101872923-d48509bff386?w=800&auto=format&fit=crop'
    },
    {
        id: 4,
        name: 'Zollikofen, Forschung 3',
        location: 'Zollikofen',
        siaPhase: '53',
        createdDate: '18/01/2022',
        documentCount: 12,
        completionPercentage: 100,
        status: 'completed',
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'
    },
    {
        id: 5,
        name: 'Magglinen, BAZG, Hochschule Hauptgebäude',
        location: 'Magglinen',
        siaPhase: '52',
        createdDate: '05/12/2021',
        documentCount: 16,
        completionPercentage: 99,
        status: 'completed',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop'
    }
];

const mockDocuments = [
    {
        id: 1,
        name: 'Flächenplan zum validierten.dwg',
        creator: 'completed.admin on 17/06/2022 12:30',
        lastChange: 'completed.admin on 27/06/2022 10:45',
        status: 'validated',
        score: 95
    },
    {
        id: 2,
        name: 'Flächenplan zum validierten.dwg',
        creator: 'completed.admin on 17/06/2022 12:30',
        lastChange: 'completed.admin on 27/06/2022 10:45',
        status: 'validated',
        score: 95
    },
    {
        id: 3,
        name: 'Flächenplan zum validierten.dwg',
        creator: 'completed.admin on 17/06/2022 12:30',
        lastChange: 'completed.admin on 27/06/2022 10:45',
        status: 'validated',
        score: 95
    },
    {
        id: 4,
        name: 'Flächenplan zum validierten.dwg',
        creator: 'completed.admin on 17/06/2022 12:30',
        lastChange: 'completed.admin on 27/06/2022 10:45',
        status: 'validated',
        score: 95
    },
    {
        id: 5,
        name: 'Flächenplan zum validierten.dwg',
        creator: 'completed.admin on 17/06/2022 12:30',
        lastChange: 'completed.admin on 27/06/2022 10:45',
        status: 'validated',
        score: 95
    }
];

const mockRooms = [
    { xao: '1.01', area: 24.45, areaGro: 25.00, areaRed: 23.90, aofuncti: 'conference' },
    { xao: '1.02', area: 18.32, areaGro: 19.00, areaRed: 17.64, aofuncti: 'office' },
    { xao: '1.03', area: 22.10, areaGro: 23.00, areaRed: 21.20, aofuncti: 'office' },
    { xao: '1.04', area: 15.67, areaGro: 16.50, areaRed: 14.84, aofuncti: 'storage' },
    { xao: '1.05', area: 28.90, areaGro: 30.00, areaRed: 27.80, aofuncti: 'meeting' },
    { xao: '1.06', area: 12.45, areaGro: 13.00, areaRed: 11.90, aofuncti: 'WC' },
    { xao: '1.07', area: 45.22, areaGro: 47.00, areaRed: 43.44, aofuncti: 'hall' },
    { xao: '1.08', area: 19.78, areaGro: 21.00, areaRed: 18.56, aofuncti: 'office' },
    { xao: '1.09', area: 16.33, areaGro: 17.50, areaRed: 15.11, aofuncti: 'office' },
    { xao: '1.10', area: 21.55, areaGro: 23.00, areaRed: 20.33, aofuncti: 'office' },
    { xao: '2.01', area: 35.80, areaGro: 37.00, areaRed: 34.60, aofuncti: 'conference' },
    { xao: '2.02', area: 14.21, areaGro: 15.00, areaRed: 13.42, aofuncti: 'office' },
    { xao: '2.03', area: 18.95, areaGro: 20.00, areaRed: 17.73, aofuncti: 'office' },
    { xao: '2.04', area: 22.67, areaGro: 24.00, areaRed: 21.45, aofuncti: 'office' },
    { xao: '2.05', area: 11.30, areaGro: 12.50, areaRed: 10.08, aofuncti: 'WC' },
    { xao: '2.06', area: 27.45, areaGro: 29.00, areaRed: 26.23, aofuncti: 'meeting' },
    { xao: '2.07', area: 16.88, areaGro: 18.00, areaRed: 15.66, aofuncti: 'office' },
    { xao: '2.08', area: 19.12, areaGro: 20.50, areaRed: 17.90, aofuncti: 'office' },
    { xao: '2.09', area: 24.76, areaGro: 26.00, areaRed: 23.54, aofuncti: 'office' },
    { xao: '2.10', area: 13.45, areaGro: 14.50, areaRed: 12.23, aofuncti: 'storage' },
    { xao: '3.01', area: 42.30, areaGro: 44.00, areaRed: 41.08, aofuncti: 'hall' },
    { xao: '3.02', area: 20.55, areaGro: 22.00, areaRed: 19.33, aofuncti: 'office' }
];

const mockErrors = [
    {
        code: 'LAYER_001',
        severity: 'error',
        message: 'Required layer "Architecture_Wände" is missing',
        location: null
    },
    {
        code: 'POLY_003',
        severity: 'error',
        message: 'Room polygon is not closed in room 1.04',
        location: { x: 125, y: 340 }
    },
    {
        code: 'AOID_002',
        severity: 'warning',
        message: 'AOID format invalid: "2011DM04045" (missing dots)',
        location: { x: 280, y: 190 }
    },
    {
        code: 'TEXT_001',
        severity: 'error',
        message: 'Text font is not Arial in 3 locations',
        location: null
    },
    {
        code: 'GEOM_005',
        severity: 'warning',
        message: 'Polyline has non-zero width (should be 0)',
        location: { x: 450, y: 120 }
    },
    {
        code: 'LAYER_002',
        severity: 'warning',
        message: 'Layer color mismatch: "Möblierung" should be RGB(128,128,128)',
        location: null
    },
    {
        code: 'ENTITY_001',
        severity: 'error',
        message: 'Forbidden entity type SPLINE found on layer "Architecture"',
        location: { x: 320, y: 410 }
    },
    {
        code: 'AOID_005',
        severity: 'warning',
        message: 'AOID "2011.DM.04.023" not found in Excel room list',
        location: { x: 195, y: 275 }
    },
    {
        code: 'GEOM_002',
        severity: 'error',
        message: 'Self-intersecting polygon detected in room 2.07',
        location: { x: 380, y: 220 }
    },
    {
        code: 'POLY_001',
        severity: 'warning',
        message: 'Room area below minimum threshold (0.18 m²)',
        location: { x: 510, y: 305 }
    },
    {
        code: 'LAYER_003',
        severity: 'warning',
        message: 'Unexpected layer "Temp_Construction" found',
        location: null
    },
    {
        code: 'GEOM_007',
        severity: 'error',
        message: 'Z-coordinate is not 0 in 12 entities',
        location: null
    },
    {
        code: 'AOID_001',
        severity: 'error',
        message: 'Duplicate AOID found: "2011.DM.04.015"',
        location: { x: 240, y: 385 }
    }
];

// === STATE MANAGEMENT ===
let currentView = 'login';
let currentProject = null;
let currentDocument = null;

// === VIEW SWITCHING ===
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('view--active');
    });

    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('view--active');
        currentView = viewName;
    }
}

// === PROJECT RENDERING ===
function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    grid.innerHTML = mockProjects.map(project => {
        const scoreClass = project.completionPercentage >= 90 ? 'success' :
                          project.completionPercentage >= 60 ? 'warning' : 'error';

        const overlayHtml = project.status === 'completed'
            ? '<div class="card__overlay">Auftrag Abgeschlossen<br>(Wird in 30 Tagen gelöscht)</div>'
            : '';

        return `
            <article class="card" data-project-id="${project.id}">
                <div class="card__image">
                    <img src="${project.imageUrl}" alt="${project.name}">
                    ${overlayHtml}
                </div>
                <div class="card__content">
                    <h3 class="card__title">${project.name}</h3>
                    <dl class="card__meta">
                        <dd>SIA Phase: ${project.siaPhase}</dd>
                        <dd>Auftrag erstellt: ${project.createdDate}</dd>
                        <dd>Anzahl Dokumente: ${project.documentCount}</dd>
                    </dl>
                </div>
                <div class="card__score">
                    <span class="card__percentage card__percentage--${scoreClass}">${project.completionPercentage}%</span>
                </div>
            </article>
        `;
    }).join('');

    // Add click handlers
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.dataset.projectId);
            openProjectDetail(projectId);
        });
    });
}

// === PROJECT DETAIL ===
function openProjectDetail(projectId) {
    currentProject = mockProjects.find(p => p.id === projectId);
    if (!currentProject) return;

    // Update header
    document.getElementById('project-detail-name').textContent = currentProject.name;
    document.getElementById('breadcrumb-project-name').textContent = currentProject.name;
    document.getElementById('project-completion').textContent = `${currentProject.completionPercentage}%`;

    // Update image
    const imageElement = document.getElementById('project-detail-image');
    imageElement.style.backgroundImage = `url(${currentProject.imageUrl})`;

    // Update donut chart
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (currentProject.completionPercentage / 100) * circumference;
    document.getElementById('project-donut-progress').setAttribute('stroke-dashoffset', offset);

    const scoreClass = currentProject.completionPercentage >= 90 ? 'success' :
                      currentProject.completionPercentage >= 60 ? 'warning' : 'error';
    document.getElementById('project-donut-progress').className = `donut-chart__progress donut-chart__progress--${scoreClass}`;

    // Render documents
    renderDocuments();

    switchView('project-detail');
}

// === DOCUMENT RENDERING ===
function renderDocuments() {
    const tbody = document.getElementById('document-table-body');
    if (!tbody) return;

    tbody.innerHTML = mockDocuments.map(doc => {
        const scoreClass = doc.score >= 90 ? 'success' :
                          doc.score >= 60 ? 'warning' : 'error';

        const statusIcon = doc.status === 'validated'
            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';

        return `
            <tr data-document-id="${doc.id}">
                <td>${doc.name}</td>
                <td>${doc.creator}</td>
                <td>${doc.lastChange}</td>
                <td>${statusIcon} ${doc.status}</td>
                <td class="text-right"><span class="card__percentage card__percentage--${scoreClass}">${doc.score}%</span></td>
            </tr>
        `;
    }).join('');

    // Add click handlers
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
            const docId = parseInt(row.dataset.documentId);
            openValidationView(docId);
        });
    });
}

// === VALIDATION VIEW ===
function openValidationView(documentId) {
    currentDocument = mockDocuments.find(d => d.id === documentId);
    if (!currentDocument) return;

    // Update breadcrumbs
    document.getElementById('breadcrumb-val-project').textContent = currentProject.name;
    document.getElementById('breadcrumb-val-document').textContent = currentDocument.name;

    // Render rooms
    renderRooms();

    // Render errors
    renderErrors();

    // Render floor plan
    renderFloorPlan();

    switchView('validation');
}

// === ROOM RENDERING ===
function renderRooms() {
    const tbody = document.getElementById('room-table-body');
    if (!tbody) return;

    tbody.innerHTML = mockRooms.map(room => `
        <tr>
            <td>${room.xao}</td>
            <td class="text-right">${room.area.toFixed(2)}</td>
            <td class="text-right">${room.areaGro.toFixed(2)}</td>
            <td class="text-right">${room.areaRed.toFixed(2)}</td>
            <td>${room.aofuncti}</td>
        </tr>
    `).join('');
}

// === ERROR RENDERING ===
function renderErrors() {
    const errorList = document.getElementById('error-list');
    if (!errorList) return;

    errorList.innerHTML = mockErrors.map(error => `
        <div class="error-item error-item--${error.severity}">
            <div class="error-item__header">
                <span class="error-item__code">${error.code}</span>
                <span class="error-item__severity error-item__severity--${error.severity}">${error.severity}</span>
            </div>
            <div class="error-item__message">${error.message}</div>
        </div>
    `).join('');
}

// === FLOOR PLAN RENDERING ===
function renderFloorPlan() {
    const svg = document.getElementById('floorplan-svg');
    if (!svg) return;

    // Simple floor plan visualization
    const rooms = [
        { x: 50, y: 50, width: 150, height: 100, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 220, y: 50, width: 120, height: 100, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 360, y: 50, width: 180, height: 100, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 50, y: 170, width: 100, height: 150, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 170, y: 170, width: 170, height: 150, fill: 'rgba(220, 53, 69, 0.3)', stroke: 'var(--color-error-marker)' }, // Error room
        { x: 360, y: 170, width: 180, height: 150, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 50, y: 340, width: 150, height: 120, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 220, y: 340, width: 120, height: 120, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 360, y: 340, width: 180, height: 120, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' }
    ];

    svg.innerHTML = rooms.map((room, i) => `
        <rect x="${room.x}" y="${room.y}" width="${room.width}" height="${room.height}"
              fill="${room.fill}" stroke="${room.stroke}" stroke-width="2" class="floorplan-room"/>
        <text x="${room.x + room.width/2}" y="${room.y + room.height/2}"
              text-anchor="middle" font-size="14" fill="#333">${mockRooms[i]?.xao || ''}</text>
    `).join('') +
    // Add error markers
    mockErrors.filter(e => e.location).map(error => `
        <circle cx="${error.location.x}" cy="${error.location.y}" r="8"
                class="floorplan-marker floorplan-marker--${error.severity}"
                title="${error.message}"/>
        <text x="${error.location.x}" y="${error.location.y + 4}"
              text-anchor="middle" font-size="12" fill="white" font-weight="bold">!</text>
    `).join('');
}

// === PIE CHART RENDERING ===
function renderPieChart() {
    const slicesGroup = document.getElementById('pie-chart-slices');
    const legend = document.getElementById('pie-legend');

    if (!slicesGroup || !legend) return;

    const data = [
        { label: 'HNF (Hauptnutzfläche)', value: 3200, color: '#2E7D32' },
        { label: 'NNF (Nebennutzfläche)', value: 400, color: '#558B2F' },
        { label: 'VF (Verkehrsfläche)', value: 300, color: '#7CB342' },
        { label: 'FF (Funktionsfläche)', value: 100, color: '#AED581' },
        { label: 'KF (Konstruktionsfläche)', value: 500, color: '#C5E1A5' }
    ];

    const total = data.reduce((sum, d) => sum + d.value, 0);
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    let currentAngle = -90; // Start at top

    slicesGroup.innerHTML = data.map(item => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = currentAngle + angle;

        const startRad = (currentAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;

        const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        currentAngle = endAngle;

        return `<path d="${path}" fill="${item.color}" stroke="white" stroke-width="2"/>`;
    }).join('');

    legend.innerHTML = data.map(item => {
        const percentage = ((item.value / total) * 100).toFixed(1);
        return `
            <div class="pie-legend-item">
                <div class="pie-legend-color" style="background: ${item.color}"></div>
                <span>${item.label}: ${percentage}%</span>
            </div>
        `;
    }).join('');
}

// === TAB SWITCHING ===
function setupTabs() {
    // Project detail tabs
    document.querySelectorAll('.tabs__tab[data-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.dataset.tab;

            // Update active tab
            tab.parentElement.parentElement.querySelectorAll('.tabs__tab').forEach(t => {
                t.classList.remove('tabs__tab--active');
            });
            tab.classList.add('tabs__tab--active');

            // Update active pane (simplified for prototype)
            console.log(`Switched to tab: ${tabName}`);
        });
    });

    // Validation view tabs
    document.querySelectorAll('.tabs__tab[data-val-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.dataset.valTab;

            // Update active tab
            tab.parentElement.parentElement.querySelectorAll('.tabs__tab').forEach(t => {
                t.classList.remove('tabs__tab--active');
            });
            tab.classList.add('tabs__tab--active');

            // Update active pane
            document.querySelectorAll('.val-tab-pane').forEach(pane => {
                pane.classList.remove('val-tab-pane--active');
            });
            document.getElementById(`val-tab-${tabName}`).classList.add('val-tab-pane--active');
        });
    });
}

// === PROJECT SEARCH ===
function setupSearch() {
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.card').forEach(card => {
                const title = card.querySelector('.card__title').textContent.toLowerCase();
                const meta = card.querySelector('.card__meta').textContent.toLowerCase();
                if (title.includes(query) || meta.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// === EVENT LISTENERS ===
function setupEventListeners() {
    // Login form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            switchView('projects');
            renderProjects();
        });
    }

    // Back to projects
    const backBtn = document.getElementById('back-to-overview');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchView('projects');
        });
    }

    // Breadcrumb navigation
    document.querySelectorAll('#breadcrumb-projects, #breadcrumb-val-projects').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('projects');
        });
    });

    document.getElementById('breadcrumb-val-project')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('project-detail');
    });

    // Workflow navigation
    document.getElementById('prev-step-btn')?.addEventListener('click', () => {
        alert('Navigating to previous step (not implemented in prototype)');
    });

    document.getElementById('next-step-btn')?.addEventListener('click', () => {
        switchView('results');
        renderPieChart();
    });

    // View toggle
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-toggle-btn').forEach(b => {
                b.classList.remove('view-toggle-btn--active');
            });
            btn.classList.add('view-toggle-btn--active');

            const viewType = btn.dataset.view;
            console.log(`View type switched to: ${viewType}`);
        });
    });
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupTabs();
    setupSearch();

    // Start at login view
    switchView('login');
});
