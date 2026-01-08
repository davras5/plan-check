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
        documentCount: 7,
        completionPercentage: 91,
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop'
    },
    {
        id: 2,
        name: 'Genf, Dienstleistungszentrum Montbrillant',
        location: 'Genf',
        siaPhase: '52',
        createdDate: '22/03/2022',
        documentCount: 9,
        completionPercentage: 75,
        status: 'active',
        imageUrl: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&auto=format&fit=crop'
    },
    {
        id: 3,
        name: 'Magglingen, BAZG, Hochschule Hauptgebäude',
        location: 'Magglingen',
        siaPhase: '51',
        createdDate: '10/02/2022',
        documentCount: 6,
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
        documentCount: 5,
        completionPercentage: 100,
        status: 'completed',
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'
    },
    {
        id: 5,
        name: 'Magglingen, BAZG, Hochschule Neubau',
        location: 'Magglingen',
        siaPhase: '52',
        createdDate: '05/12/2021',
        documentCount: 4,
        completionPercentage: 99,
        status: 'completed',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop'
    }
];

const mockDocuments = [
    {
        id: 1,
        name: 'Erdgeschoss (EG).dwg',
        creator: 'max.muster@bbl.admin.ch on 17/06/2022 12:30',
        lastChange: 'max.muster@bbl.admin.ch on 27/06/2022 10:45',
        status: 'validated',
        score: 95
    },
    {
        id: 2,
        name: '1. Obergeschoss (1.OG).dwg',
        creator: 'max.muster@bbl.admin.ch on 17/06/2022 14:15',
        lastChange: 'max.muster@bbl.admin.ch on 27/06/2022 11:00',
        status: 'validated',
        score: 92
    },
    {
        id: 3,
        name: '2. Obergeschoss (2.OG).dwg',
        creator: 'max.muster@bbl.admin.ch on 17/06/2022 15:30',
        lastChange: 'max.muster@bbl.admin.ch on 27/06/2022 11:20',
        status: 'validated',
        score: 88
    },
    {
        id: 4,
        name: '3. Obergeschoss (3.OG).dwg',
        creator: 'anna.mueller@bbl.admin.ch on 18/06/2022 09:00',
        lastChange: 'anna.mueller@bbl.admin.ch on 27/06/2022 14:30',
        status: 'validated',
        score: 90
    },
    {
        id: 5,
        name: 'Untergeschoss (UG).dwg',
        creator: 'max.muster@bbl.admin.ch on 16/06/2022 16:00',
        lastChange: 'max.muster@bbl.admin.ch on 26/06/2022 10:15',
        status: 'validated',
        score: 78
    },
    {
        id: 6,
        name: 'Dachgeschoss (DG).dwg',
        creator: 'lisa.weber@bbl.admin.ch on 19/06/2022 10:30',
        lastChange: 'lisa.weber@bbl.admin.ch on 28/06/2022 09:45',
        status: 'processing',
        score: 0
    },
    {
        id: 7,
        name: 'Raumliste_Verwaltungsgebaeude.xlsx',
        creator: 'max.muster@bbl.admin.ch on 17/06/2022 15:00',
        lastChange: 'max.muster@bbl.admin.ch on 17/06/2022 15:00',
        status: 'validated',
        score: 100
    }
];

const mockRooms = [
    { aoid: '1.01', area: 24.45, aofunction: 'conference', status: 'ok' },
    { aoid: '1.02', area: 18.32, aofunction: 'office', status: 'ok' },
    { aoid: '1.03', area: 22.10, aofunction: 'office', status: 'error' },
    { aoid: '1.04', area: 15.67, aofunction: 'storage', status: 'ok' },
    { aoid: '1.05', area: 28.90, aofunction: 'meeting', status: 'ok' },
    { aoid: '1.06', area: 12.45, aofunction: 'WC', status: 'warning' },
    { aoid: '1.07', area: 45.22, aofunction: 'hall', status: 'ok' },
    { aoid: '1.08', area: 19.78, aofunction: 'office', status: 'ok' },
    { aoid: '1.09', area: 16.33, aofunction: 'office', status: 'ok' },
    { aoid: '1.10', area: 21.55, aofunction: 'office', status: 'error' },
    { aoid: '2.01', area: 35.80, aofunction: 'conference', status: 'ok' },
    { aoid: '2.02', area: 14.21, aofunction: 'office', status: 'ok' },
    { aoid: '2.03', area: 18.95, aofunction: 'office', status: 'ok' },
    { aoid: '2.04', area: 22.67, aofunction: 'office', status: 'warning' },
    { aoid: '2.05', area: 11.30, aofunction: 'WC', status: 'ok' },
    { aoid: '2.06', area: 27.45, aofunction: 'meeting', status: 'ok' },
    { aoid: '2.07', area: 16.88, aofunction: 'office', status: 'ok' },
    { aoid: '2.08', area: 19.12, aofunction: 'office', status: 'ok' },
    { aoid: '2.09', area: 24.76, aofunction: 'office', status: 'ok' },
    { aoid: '2.10', area: 13.45, aofunction: 'storage', status: 'ok' },
    { aoid: '3.01', area: 42.30, aofunction: 'hall', status: 'ok' },
    { aoid: '3.02', area: 20.55, aofunction: 'office', status: 'error' }
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
let currentStep = 1; // Current step in validation workflow (1-4)
let isNavigatingFromHash = false; // Prevent hash update during popstate handling

// === URL ROUTING ===
function updateUrlHash() {
    if (isNavigatingFromHash) return;

    let hash = '';

    if (currentView === 'projects') {
        hash = '#/projects';
    } else if (currentView === 'project-detail' && currentProject) {
        hash = `#/project/${currentProject.id}`;
    } else if (currentView === 'validation' && currentProject && currentDocument) {
        hash = `#/project/${currentProject.id}/document/${currentDocument.id}`;
    } else if (currentView === 'results' && currentProject && currentDocument) {
        hash = `#/project/${currentProject.id}/document/${currentDocument.id}/results`;
    } else if (currentView === 'login') {
        hash = '#/login';
    }

    if (hash && window.location.hash !== hash) {
        history.pushState(null, '', hash);
    }
}

function parseUrlHash() {
    const hash = window.location.hash || '#/login';
    const parts = hash.replace('#/', '').split('/');

    return {
        view: parts[0] || 'login',
        projectId: parts[1] === 'project' ? null : (parts[0] === 'project' ? parseInt(parts[1]) : null),
        documentId: parts.includes('document') ? parseInt(parts[parts.indexOf('document') + 1]) : null,
        isResults: parts.includes('results')
    };
}

function navigateFromHash() {
    isNavigatingFromHash = true;
    const route = parseUrlHash();
    const hash = window.location.hash || '';

    // Parse the hash more directly
    const projectMatch = hash.match(/#\/project\/(\d+)/);
    const documentMatch = hash.match(/\/document\/(\d+)/);
    const isResults = hash.includes('/results');

    if (hash === '#/projects' || hash === '') {
        switchView('projects');
        renderProjects();
    } else if (hash === '#/login') {
        switchView('login');
    } else if (projectMatch) {
        const projectId = parseInt(projectMatch[1]);

        if (documentMatch) {
            const documentId = parseInt(documentMatch[1]);
            // First open project, then document
            openProjectDetail(projectId, true); // true = skip hash update

            setTimeout(() => {
                openValidationView(documentId, true);
                if (isResults) {
                    switchView('results');
                    renderPieChart();
                }
                isNavigatingFromHash = false;
            }, 50);
            return;
        } else {
            openProjectDetail(projectId, true);
        }
    }

    isNavigatingFromHash = false;
}

function setupRouting() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        navigateFromHash();
    });

    // Handle initial URL on page load
    const hash = window.location.hash;
    if (hash && hash !== '#/login') {
        navigateFromHash();
    }
}

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

    // Update URL hash
    updateUrlHash();
}

// === PROJECT RENDERING ===
function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    // Show empty state if no projects
    if (!mockProjects || mockProjects.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i data-lucide="folder-open" class="empty-state__icon"></i>
                <h3 class="empty-state__title">Keine Projekte gefunden</h3>
                <p class="empty-state__message">Es sind noch keine Projekte vorhanden. Erstellen Sie ein neues Projekt, um zu beginnen.</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ nodes: grid.querySelectorAll('[data-lucide]') });
        }
        return;
    }

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
                        <div class="card__meta-left">
                            <dd>SIA Phase: ${project.siaPhase}</dd>
                            <dd>${project.createdDate}</dd>
                            <dd>${project.documentCount} Dokumente</dd>
                        </div>
                        <div class="card__meta-right">
                            <span class="card__percentage card__percentage--${scoreClass}">${project.completionPercentage}%</span>
                        </div>
                    </dl>
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
function openProjectDetail(projectId, skipHashUpdate = false) {
    currentProject = mockProjects.find(p => p.id === projectId);
    if (!currentProject) return;

    // Update breadcrumb with project name
    document.getElementById('breadcrumb-project-name').textContent = currentProject.name;
    document.getElementById('project-completion').textContent = `${currentProject.completionPercentage}%`;

    // Update image
    const imageElement = document.getElementById('project-detail-image');
    imageElement.style.backgroundImage = `url(${currentProject.imageUrl})`;

    // Update donut chart (r=40, circumference = 2 * π * 40 ≈ 251)
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (currentProject.completionPercentage / 100) * circumference;
    const donutProgress = document.getElementById('project-donut-progress');
    donutProgress.setAttribute('stroke-dasharray', circumference);
    donutProgress.setAttribute('stroke-dashoffset', offset);

    const scoreClass = currentProject.completionPercentage >= 90 ? 'success' :
                      currentProject.completionPercentage >= 60 ? 'warning' : 'error';
    donutProgress.className = `donut-chart__progress donut-chart__progress--${scoreClass}`;

    // Update KPIs
    document.getElementById('project-sia-phase').textContent = currentProject.siaPhase;
    document.getElementById('project-document-count').textContent = currentProject.documentCount;

    // Calculate room count from mockRooms (in real app would come from project data)
    document.getElementById('project-room-count').textContent = mockRooms.length;

    // Mock area values (in real app would come from project data)
    document.getElementById('project-gf').textContent = "4'500 m²";

    // Render documents
    renderDocuments();

    if (skipHashUpdate) {
        // Directly switch view without updating hash
        document.querySelectorAll('.view').forEach(view => view.classList.remove('view--active'));
        document.getElementById('view-project-detail')?.classList.add('view--active');
        currentView = 'project-detail';
    } else {
        switchView('project-detail');
    }
}

// === DOCUMENT RENDERING ===
function renderDocuments() {
    const tbody = document.getElementById('document-table-body');
    if (!tbody) return;

    tbody.innerHTML = mockDocuments.map(doc => {
        const scoreClass = doc.score >= 90 ? 'success' :
                          doc.score >= 60 ? 'warning' : 'error';

        return `
            <tr data-document-id="${doc.id}">
                <td>${doc.name}</td>
                <td>${doc.creator}</td>
                <td>${doc.lastChange}</td>
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
function openValidationView(documentId, skipHashUpdate = false) {
    currentDocument = mockDocuments.find(d => d.id === documentId);
    if (!currentDocument) return;

    // Update breadcrumbs
    document.getElementById('breadcrumb-val-project').textContent = currentProject.name;
    document.getElementById('breadcrumb-val-document').textContent = currentDocument.name;

    // Reset to step 1 (DWG hochladen)
    currentStep = 1;
    updateStepper();

    // Render rooms
    renderRooms();

    // Render area polygons
    renderAreaPolygons();

    // Render errors
    renderErrors();

    // Render floor plan
    renderFloorPlan();

    if (skipHashUpdate) {
        // Directly switch view without updating hash
        document.querySelectorAll('.view').forEach(view => view.classList.remove('view--active'));
        document.getElementById('view-validation')?.classList.add('view--active');
        currentView = 'validation';
    } else {
        switchView('validation');
    }
}

// === STEPPER NAVIGATION ===
function updateStepper() {
    const stepItems = document.querySelectorAll('.stepper__item');
    const stepper = document.querySelector('.stepper');

    stepItems.forEach((item, index) => {
        const stepNumber = index + 1;

        // Remove all state classes
        item.classList.remove('stepper__item--complete', 'stepper__item--current', 'stepper__item--disabled');

        // Add appropriate class based on current step
        if (stepNumber < currentStep) {
            item.classList.add('stepper__item--complete');
        } else if (stepNumber === currentStep) {
            item.classList.add('stepper__item--current');
        }
        // All steps are clickable
        item.style.cursor = 'pointer';
    });

    // Re-initialize Lucide icons only within the stepper for performance
    if (typeof lucide !== 'undefined' && stepper) {
        lucide.createIcons({ nodes: stepper.querySelectorAll('[data-lucide]') });
    }

    // Update button states
    updateStepButtons();

    // Update step content visibility
    updateStepContent();
}

function updateStepContent() {
    // Hide all step content containers
    for (let i = 1; i <= 4; i++) {
        const stepContent = document.getElementById(`step-content-${i}`);
        if (stepContent) {
            stepContent.style.display = 'none';
        }
    }

    // Hide step detail content (metrics + tabs + split view)
    const step1DetailContent = document.getElementById('step-1-content');
    const step2DetailContent = document.getElementById('step-2-content');
    if (step1DetailContent) step1DetailContent.style.display = 'none';
    if (step2DetailContent) step2DetailContent.style.display = 'none';

    // Show current step content
    const currentStepContent = document.getElementById(`step-content-${currentStep}`);
    if (currentStepContent) {
        currentStepContent.style.display = 'block';
    }

    // Step 1 shows the detailed floor plan viewer
    if (currentStep === 1) {
        if (step1DetailContent) {
            step1DetailContent.style.display = 'block';
        }
    }

    // Step 2 shows the room matching validation
    if (currentStep === 2) {
        if (step2DetailContent) {
            step2DetailContent.style.display = 'block';
        }
        renderStep2Rooms();
        renderStep2Errors();
        renderStep2FloorPlan();
    }
}

function updateStepButtons() {
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');

    if (prevBtn) {
        prevBtn.disabled = currentStep === 1;
        prevBtn.style.opacity = currentStep === 1 ? '0.5' : '1';
        prevBtn.style.cursor = currentStep === 1 ? 'not-allowed' : 'pointer';
    }

    if (nextBtn) {
        // Update button text based on current step
        if (currentStep === 4) {
            nextBtn.textContent = 'Auftrag abschliessen';
        } else {
            nextBtn.textContent = 'Nächster Schritt';
        }
    }
}

function navigateToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 4) return;

    currentStep = stepNumber;
    updateStepper();

    // Show toast notification
    const stepNames = [
        'DWG hochladen',
        'Raumliste hochladen',
        'Ergebnisse bestätigen',
        'Auftrag abschliessen'
    ];

    showToast(`Schritt ${stepNumber}: ${stepNames[stepNumber - 1]}`, 'info');
}

function previousStep() {
    if (currentStep > 1) {
        navigateToStep(currentStep - 1);
    }
}

function nextStep() {
    if (currentStep < 4) {
        navigateToStep(currentStep + 1);
    } else if (currentStep === 4) {
        // On final step, go to results view
        switchView('results');
        renderPieChart();
        showToast('Validierung abgeschlossen!', 'success');
    }
}

// === ROOM RENDERING ===
function renderRooms() {
    const tbody = document.getElementById('room-table-body');
    if (!tbody) return;

    tbody.innerHTML = mockRooms.map(room => {
        const statusIcon = room.status === 'ok'
            ? '<span class="status-pill status-pill--success"><i data-lucide="check" class="icon icon-sm"></i></span>'
            : room.status === 'warning'
            ? '<span class="status-pill status-pill--warning"><i data-lucide="alert-triangle" class="icon icon-sm"></i></span>'
            : '<span class="status-pill status-pill--error"><i data-lucide="x" class="icon icon-sm"></i></span>';

        return `
            <tr>
                <td>${room.aoid}</td>
                <td class="text-right">${Math.round(room.area)}</td>
                <td>${room.aofunction}</td>
                <td class="text-center">${statusIcon}</td>
            </tr>
        `;
    }).join('');

    // Re-initialize Lucide icons only within the table for performance
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: tbody.querySelectorAll('[data-lucide]') });
    }
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

// === AREA POLYGONS RENDERING ===
function renderAreaPolygons() {
    const tbody = document.getElementById('area-polygons-table-body');
    if (!tbody) return;

    // Mock data for area polygons (same structure as rooms: AOID, AREA, AOFUNCTI, STATUS)
    const areaPolygons = [
        { aoid: 'BGF-01', area: 4500.00, aofunction: 'Brutto Geschossfläche', status: 'ok' },
        { aoid: 'NGF-01', area: 4000.00, aofunction: 'Netto Geschossfläche', status: 'warning' },
        { aoid: 'EBF-01', area: 4200.00, aofunction: 'Energiebezugsfläche', status: 'ok' },
        { aoid: 'VF-01', area: 320.50, aofunction: 'Verkehrsfläche', status: 'ok' },
        { aoid: 'NNF-01', area: 180.00, aofunction: 'Nebennutzfläche', status: 'error' }
    ];

    tbody.innerHTML = areaPolygons.map(polygon => {
        const statusIcon = polygon.status === 'ok'
            ? '<span class="status-pill status-pill--success"><i data-lucide="check" class="icon icon-sm"></i></span>'
            : polygon.status === 'warning'
            ? '<span class="status-pill status-pill--warning"><i data-lucide="alert-triangle" class="icon icon-sm"></i></span>'
            : '<span class="status-pill status-pill--error"><i data-lucide="x" class="icon icon-sm"></i></span>';

        return `
            <tr>
                <td>${polygon.aoid}</td>
                <td class="text-right">${Math.round(polygon.area).toLocaleString('de-CH')}</td>
                <td>${polygon.aofunction}</td>
                <td class="text-center">${statusIcon}</td>
            </tr>
        `;
    }).join('');

    // Re-initialize Lucide icons only within the table for performance
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: tbody.querySelectorAll('[data-lucide]') });
    }
}

// === STEP 2 RENDERING ===
function renderStep2Rooms() {
    const tbody = document.getElementById('step2-room-table-body');
    if (!tbody) return;

    tbody.innerHTML = mockRooms.map((room, index) => {
        // Simulate Excel matching - 3 rooms don't match
        const hasExcelMatch = index < 19; // First 19 match, last 3 don't
        const statusIcon = hasExcelMatch
            ? '<span class="status-pill status-pill--success"><i data-lucide="check" class="icon icon-sm"></i></span>'
            : '<span class="status-pill status-pill--error"><i data-lucide="x" class="icon icon-sm"></i></span>';

        return `
            <tr>
                <td>${room.aoid}</td>
                <td>Raum ${room.aoid}</td>
                <td class="text-right">${Math.round(room.area)}</td>
                <td>${room.aofunction}</td>
                <td class="text-center">${statusIcon}</td>
            </tr>
        `;
    }).join('');

    // Re-initialize Lucide icons only within the table for performance
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: tbody.querySelectorAll('[data-lucide]') });
    }
}

function renderStep2Errors() {
    const errorList = document.getElementById('step2-error-list');
    if (!errorList) return;

    // Excel matching errors
    const excelErrors = [
        {
            code: 'EXCEL-001',
            severity: 'error',
            message: 'Raum "EG-022" aus DWG nicht in Excel-Raumliste gefunden. Bitte Raumliste ergänzen.'
        },
        {
            code: 'EXCEL-002',
            severity: 'error',
            message: 'Raum "EG-021" aus DWG nicht in Excel-Raumliste gefunden. Bitte Raumliste ergänzen.'
        },
        {
            code: 'EXCEL-003',
            severity: 'error',
            message: 'Raum "EG-020" aus DWG nicht in Excel-Raumliste gefunden. Bitte Raumliste ergänzen.'
        }
    ];

    errorList.innerHTML = excelErrors.map(error => `
        <div class="error-item error-item--${error.severity}">
            <div class="error-item__header">
                <span class="error-item__code">${error.code}</span>
                <span class="error-item__severity error-item__severity--${error.severity}">${error.severity}</span>
            </div>
            <div class="error-item__message">${error.message}</div>
        </div>
    `).join('');
}

function renderStep2FloorPlan() {
    const svg = document.getElementById('step2-floorplan-svg');
    if (!svg) return;

    // Reuse same floor plan structure as Step 1
    const rooms = [
        { x: 50, y: 50, width: 150, height: 100, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 220, y: 50, width: 120, height: 100, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 360, y: 50, width: 180, height: 100, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 50, y: 170, width: 100, height: 150, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' },
        { x: 170, y: 170, width: 170, height: 150, fill: 'rgba(220, 53, 69, 0.3)', stroke: 'var(--color-error-marker)' }, // Non-matching room
        { x: 360, y: 170, width: 180, height: 150, fill: 'var(--color-room-fill)', stroke: 'var(--color-room-stroke)' }
    ];

    svg.innerHTML = rooms.map((room, i) => `
        <rect x="${room.x}" y="${room.y}" width="${room.width}" height="${room.height}"
              fill="${room.fill}" stroke="${room.stroke}" stroke-width="2" class="floorplan__room"/>
        <text x="${room.x + room.width/2}" y="${room.y + room.height/2}"
              text-anchor="middle" font-size="14" fill="#333">EG-${String(i + 1).padStart(3, '0')}</text>
    `).join('');
}

// === SPECKLE VIEWER ===
function initSpeckleViewer() {
    const iframe = document.getElementById('speckle-viewer');
    const loading = document.getElementById('speckle-loading');

    if (!iframe || !loading) return;

    // Hide loading indicator when iframe loads
    iframe.addEventListener('load', () => {
        loading.classList.add('is-hidden');
    });

    // Handle iframe load errors
    iframe.addEventListener('error', () => {
        loading.innerHTML = '<span>Fehler beim Laden des 3D-Grundrisses</span>';
    });
}

// Legacy function kept for compatibility - now handled by Speckle iframe
function renderFloorPlan() {
    // Speckle viewer is now used instead of SVG rendering
    // Use requestAnimationFrame to avoid blocking table rendering
    requestAnimationFrame(() => {
        initSpeckleViewer();
    });
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
            <div class="pie-chart__legend-item">
                <div class="pie-chart__legend-color" style="background: ${item.color}"></div>
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

            // Update active pane
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('tab-pane--active');
            });
            const targetPane = document.getElementById(`tab-${tabName}`);
            if (targetPane) {
                targetPane.classList.add('tab-pane--active');
            }
        });
    });

    // Validation view tabs (Step 1)
    document.querySelectorAll('.tabs__tab[data-val-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.dataset.valTab;

            // Update active tab
            tab.parentElement.parentElement.querySelectorAll('.tabs__tab').forEach(t => {
                t.classList.remove('tabs__tab--active');
            });
            tab.classList.add('tabs__tab--active');

            // Update active pane (val-tab-* panes are now unified to .tab-pane)
            document.querySelectorAll('#val-tab-rooms, #val-tab-areas, #val-tab-errors').forEach(pane => {
                pane.classList.remove('tab-pane--active');
            });
            document.getElementById(`val-tab-${tabName}`).classList.add('tab-pane--active');
        });
    });

    // Step 2 tabs
    document.querySelectorAll('.tabs__tab[data-step2-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.dataset.step2Tab;

            // Update active tab
            tab.parentElement.parentElement.querySelectorAll('.tabs__tab').forEach(t => {
                t.classList.remove('tabs__tab--active');
            });
            tab.classList.add('tabs__tab--active');

            // Update active pane (step2-tab-* panes are now unified to .tab-pane)
            document.querySelectorAll('#step2-tab-rooms, #step2-tab-errors').forEach(pane => {
                pane.classList.remove('tab-pane--active');
            });
            document.getElementById(`step2-tab-${tabName}`).classList.add('tab-pane--active');
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
    // Header brand navigation to dashboard
    const headerBrand = document.getElementById('header-brand-link');
    if (headerBrand) {
        headerBrand.addEventListener('click', (e) => {
            e.preventDefault();
            const currentView = document.querySelector('.view--active').id;
            if (currentView !== 'view-login') {
                switchView('projects');
                renderProjects();
            }
        });
    }

    // Login form
    const loginForm = document.querySelector('.login__form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            switchView('projects');
            renderProjects();
        });
    }

    // Demo button in header
    const demoBtn = document.getElementById('demo-btn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            switchView('projects');
            renderProjects();
        });
    }

    // Back to projects from project detail
    const backBtn = document.getElementById('back-to-overview');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchView('projects');
            renderProjects();
        });
    }

    // Back to project detail from validation view
    const backToProjectBtn = document.getElementById('back-to-project');
    if (backToProjectBtn) {
        backToProjectBtn.addEventListener('click', () => {
            switchView('project-detail');
        });
    }

    // Back to project detail from results view
    const backToProjectResultsBtn = document.getElementById('back-to-project-results');
    if (backToProjectResultsBtn) {
        backToProjectResultsBtn.addEventListener('click', () => {
            switchView('project-detail');
        });
    }

    // Breadcrumb navigation
    document.querySelectorAll('#breadcrumb-projects, #breadcrumb-val-projects, #breadcrumb-results-projects').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('projects');
            renderProjects();
        });
    });

    document.querySelectorAll('#breadcrumb-val-project, #breadcrumb-results-project').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('project-detail');
        });
    });

    // Workflow navigation buttons
    document.getElementById('prev-step-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        previousStep();
    });

    document.getElementById('next-step-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        nextStep();
    });

    // Stepper item click navigation
    document.querySelectorAll('.stepper__item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const stepNumber = index + 1;
            navigateToStep(stepNumber);
        });
    });

    // View toggle
    document.querySelectorAll('.view-toggle__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-toggle__btn').forEach(b => {
                b.classList.remove('view-toggle__btn--active');
            });
            btn.classList.add('view-toggle__btn--active');

            const viewType = btn.dataset.view;
            const cardGrid = document.getElementById('project-grid');

            if (viewType === 'list') {
                cardGrid.classList.add('card-grid--list');
                showToast('Listenansicht aktiviert', 'info');
            } else {
                cardGrid.classList.remove('card-grid--list');
                showToast('Kachelansicht aktiviert', 'info');
            }
        });
    });

    // File upload handlers
    setupFileUploads();
}

// === FILE UPLOAD ===
function setupFileUploads() {
    // DWG file upload
    const dwgInput = document.getElementById('dwg-file-input');
    const dwgBtn = document.getElementById('dwg-select-btn');
    const dwgZone = document.getElementById('dwg-upload-zone');

    if (dwgBtn && dwgInput) {
        dwgBtn.addEventListener('click', () => dwgInput.click());
        dwgZone.addEventListener('click', (e) => {
            if (e.target !== dwgBtn) dwgInput.click();
        });
        dwgInput.addEventListener('change', (e) => handleFileSelect(e, 'dwg'));
    }

    // Excel file upload
    const excelInput = document.getElementById('excel-file-input');
    const excelBtn = document.getElementById('excel-select-btn');
    const excelZone = document.getElementById('excel-upload-zone');

    if (excelBtn && excelInput) {
        excelBtn.addEventListener('click', () => excelInput.click());
        excelZone.addEventListener('click', (e) => {
            if (e.target !== excelBtn) excelInput.click();
        });
        excelInput.addEventListener('change', (e) => handleFileSelect(e, 'excel'));
    }
}

function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (!file) return;

    const fileSize = formatFileSize(file.size);

    if (type === 'dwg') {
        document.getElementById('dwg-file-name').textContent = file.name;
        document.getElementById('dwg-file-size').textContent = fileSize;
        document.getElementById('dwg-uploaded-file').style.display = 'block';
        showToast(`DWG-Datei "${file.name}" ausgewählt`, 'success');
    } else if (type === 'excel') {
        document.getElementById('excel-file-name').textContent = file.name;
        document.getElementById('excel-file-size').textContent = fileSize;
        document.getElementById('excel-uploaded-file').style.display = 'block';
        showToast(`Excel-Datei "${file.name}" ausgewählt`, 'success');
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === ENHANCED INTERACTIONS ===
function enhanceInteractions() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Enhanced room table hover
    document.querySelectorAll('#room-table-body tr').forEach((row, index) => {
        row.addEventListener('mouseenter', () => {
            // Highlight corresponding room on floor plan
            const rooms = document.querySelectorAll('.floorplan__room');
            if (rooms[index]) {
                rooms[index].classList.add('floorplan__room--selected');
            }
        });

        row.addEventListener('mouseleave', () => {
            document.querySelectorAll('.floorplan__room').forEach(r => {
                r.classList.remove('floorplan__room--selected');
            });
        });
    });

    // Add smooth scroll to error locations
    document.querySelectorAll('.error-item').forEach(error => {
        error.style.cursor = 'pointer';
        error.addEventListener('click', () => {
            showToast('Error location highlighted on floor plan', 'info');
        });
    });
}

// === KEYBOARD SHORTCUTS ===
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('project-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Escape to close/go back
        if (e.key === 'Escape') {
            if (currentView !== 'login' && currentView !== 'projects') {
                switchView('projects');
            }
        }
    });
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupTabs();
    setupSearch();
    setupKeyboardShortcuts();
    setupRouting();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Check if there's a URL hash to navigate to, otherwise start at login
    const hash = window.location.hash;
    if (hash && hash !== '#/login' && hash !== '#/' && hash !== '#') {
        // URL routing will handle navigation
        navigateFromHash();
    } else {
        // Default to login view
        switchView('login');
    }

    // Add welcome message after brief delay
    setTimeout(() => {
        console.log('%c BBL Prüfplattform Flächenmanagement ', 'background: #DC0018; color: white; font-size: 14px; padding: 4px 8px;');
        console.log('%c Prototype v1.0 - Swiss Federal Design System ', 'background: #006699; color: white; font-size: 12px; padding: 4px 8px;');
    }, 100);

    // Enhance interactions after DOM is ready
    setTimeout(enhanceInteractions, 500);
});
