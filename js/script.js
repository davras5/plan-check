// ========================================
// BBL Prüfplattform Flächenmanagement
// Main JavaScript
// ========================================

// === CONFIGURATION ===
const CONFIG = {
    SPECKLE_PROJECT_ID: 'fccae9bd00',
    SPECKLE_MODEL_ID: 'e65877a4ee',
    // Token should be loaded from environment/server in production
    SPECKLE_EMBED_TOKEN: 'cd8278c08caa75725d392d5b5ecb650b579db274a1',
    TOAST_DURATION_MS: 3000,
    STEP_COUNT: 4,
    BYTES_PER_KB: 1024
};

// === SECURITY UTILITIES ===

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

/**
 * Sanitizes a filename for display
 * @param {string} filename - The filename to sanitize
 * @returns {string} The sanitized filename
 */
function sanitizeFilename(filename) {
    if (!filename) return '';
    // Remove path traversal and dangerous characters
    return escapeHtml(filename.replace(/[<>:"/\\|?*]/g, '_'));
}

// === ERROR HANDLING UTILITIES ===

/**
 * Wraps a function with try-catch error handling
 * @param {Function} fn - The function to wrap
 * @param {string} context - Context for error logging
 * @returns {Function} The wrapped function
 */
function withErrorHandling(fn, context) {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(`[${context}] Error:`, error);
            showToast(`Ein Fehler ist aufgetreten: ${context}`, 'error');
        }
    };
}

/**
 * Safely queries a DOM element with error handling
 * @param {string} selector - The CSS selector
 * @param {Element} [parent=document] - Parent element to search within
 * @returns {Element|null} The found element or null
 */
function safeQuerySelector(selector, parent = document) {
    try {
        return parent.querySelector(selector);
    } catch (error) {
        console.error(`[DOM] Invalid selector: ${selector}`, error);
        return null;
    }
}

/**
 * Safely gets an element by ID with validation
 * @param {string} id - The element ID
 * @returns {Element|null} The found element or null
 */
function safeGetElementById(id) {
    if (!id || typeof id !== 'string') {
        console.warn('[DOM] Invalid element ID provided');
        return null;
    }
    return document.getElementById(id);
}

/**
 * Safely parses an integer with fallback
 * @param {string} value - The string to parse
 * @param {number} [fallback=0] - Fallback value if parsing fails
 * @returns {number} The parsed integer or fallback
 */
function safeParseInt(value, fallback = 0) {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
}

// === UI UTILITIES ===

/**
 * Renders a status icon pill based on status
 * @param {string} status - The status ('ok', 'warning', 'error')
 * @returns {string} HTML string for the status icon
 */
function renderStatusIcon(status) {
    const iconMap = {
        'ok': { class: 'success', icon: 'check' },
        'warning': { class: 'warning', icon: 'alert-triangle' },
        'error': { class: 'error', icon: 'x' }
    };
    const config = iconMap[status] || iconMap['error'];
    return `<span class="status-pill status-pill--${config.class}"><i data-lucide="${config.icon}" class="icon icon-sm" aria-hidden="true"></i></span>`;
}

/**
 * Sets up tab functionality for a tab group
 * @param {string} tabAttribute - The data attribute name for tabs (e.g., 'data-tab')
 * @param {string} paneIdPrefix - The prefix for pane IDs (e.g., 'tab-')
 * @param {string[]} [paneIds] - Optional specific pane IDs to target
 */
function setupTabGroup(tabAttribute, paneIdPrefix, paneIds = null) {
    document.querySelectorAll(`.tabs__tab[${tabAttribute}]`).forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.getAttribute(tabAttribute);

            // Update active tab within the same tab list
            const tabList = tab.closest('.tabs__list');
            const tabsContainer = tab.closest('.tabs');
            if (tabList) {
                tabList.querySelectorAll('.tabs__tab').forEach(t => {
                    t.classList.remove('tabs__tab--active');
                });
            }
            tab.classList.add('tabs__tab--active');

            // Update tab actions visibility
            if (tabsContainer) {
                tabsContainer.querySelectorAll('.tabs__actions').forEach(actions => {
                    actions.style.display = 'none';
                });
                const targetActions = tabsContainer.querySelector(`#tabs-actions-${tabName}`);
                if (targetActions) {
                    targetActions.style.display = 'flex';
                }
            }

            // Update active pane
            if (paneIds) {
                paneIds.forEach(id => {
                    const pane = safeGetElementById(id);
                    if (pane) pane.classList.remove('tab-pane--active');
                });
            } else {
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('tab-pane--active');
                });
            }

            const targetPane = safeGetElementById(`${paneIdPrefix}${tabName}`);
            if (targetPane) {
                targetPane.classList.add('tab-pane--active');
            }
        });
    });
}

// === MODAL UTILITIES ===

/**
 * Opens a modal by ID
 * @param {string} modalId - The modal element ID
 */
function openModal(modalId) {
    const modal = safeGetElementById(modalId);
    if (!modal) return;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Initialize Lucide icons in modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Focus first input or close button
    const firstInput = modal.querySelector('input, select, textarea');
    const closeBtn = modal.querySelector('[data-modal-close]');
    if (firstInput) {
        firstInput.focus();
    } else if (closeBtn) {
        closeBtn.focus();
    }

    // Trap focus within modal
    modal.addEventListener('keydown', trapFocus);
}

/**
 * Closes a modal by ID
 * @param {string} modalId - The modal element ID
 */
function closeModal(modalId) {
    const modal = safeGetElementById(modalId);
    if (!modal) return;

    modal.hidden = true;
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', trapFocus);
}

/**
 * Traps focus within a modal for accessibility
 * @param {KeyboardEvent} e - The keyboard event
 */
function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const modal = e.currentTarget;
    const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
    }
}

/**
 * Sets up modal event listeners
 */
function setupModals() {
    // New Project button opens modal
    const newProjectBtn = safeGetElementById('new-project-btn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
            openModal('new-project-modal');
        });
    }

    // Close modal on backdrop click or close button
    document.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:not([hidden])');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });

    // Setup New Project form
    setupNewProjectForm();
}

/**
 * Sets up the New Project form handling
 */
function setupNewProjectForm() {
    const form = safeGetElementById('new-project-form');
    const imageInput = safeGetElementById('project-image');
    const imagePreview = safeGetElementById('project-image-preview');
    const imagePreviewImg = safeGetElementById('project-image-preview-img');
    const imageRemoveBtn = safeGetElementById('project-image-remove');
    const imagePlaceholder = document.querySelector('.form__file-placeholder');
    const imageUpload = safeGetElementById('project-image-upload');

    // Store image data URL
    let selectedImageUrl = '';

    // Image preview on file select
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    selectedImageUrl = event.target.result;
                    if (imagePreviewImg) {
                        imagePreviewImg.src = selectedImageUrl;
                    }
                    if (imagePreview) {
                        imagePreview.hidden = false;
                    }
                    if (imagePlaceholder) {
                        imagePlaceholder.hidden = true;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove image
    if (imageRemoveBtn) {
        imageRemoveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectedImageUrl = '';
            if (imageInput) {
                imageInput.value = '';
            }
            if (imagePreview) {
                imagePreview.hidden = true;
            }
            if (imagePlaceholder) {
                imagePlaceholder.hidden = false;
            }
        });
    }

    // Drag and drop support
    if (imageUpload) {
        imageUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUpload.classList.add('is-dragover');
        });

        imageUpload.addEventListener('dragleave', () => {
            imageUpload.classList.remove('is-dragover');
        });

        imageUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUpload.classList.remove('is-dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                // Trigger the change event by setting files
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                if (imageInput) {
                    imageInput.files = dataTransfer.files;
                    imageInput.dispatchEvent(new Event('change'));
                }
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const projectNumber = formData.get('projectNumber');
            const name = formData.get('name');
            const siaPhase = formData.get('siaPhase');

            // Generate new project ID
            const newId = mockProjects.length > 0
                ? Math.max(...mockProjects.map(p => p.id)) + 1
                : 1;

            // Create new project object
            const newProject = {
                id: newId,
                name: escapeHtml(name),
                location: extractLocation(name),
                siaPhase: escapeHtml(siaPhase),
                createdDate: formatDate(new Date()),
                documentCount: 0,
                completionPercentage: 0,
                status: 'active',
                imageUrl: selectedImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
                projectNumber: escapeHtml(projectNumber)
            };

            // Add to mockProjects array
            mockProjects.unshift(newProject);

            // Close modal and reset form
            closeModal('new-project-modal');
            form.reset();
            selectedImageUrl = '';
            if (imagePreview) {
                imagePreview.hidden = true;
            }
            if (imagePlaceholder) {
                imagePlaceholder.hidden = false;
            }

            // Re-render projects and show success message
            renderProjects();
            showToast(`Projekt "${name}" wurde erstellt`, 'success');
        });
    }
}

/**
 * Extracts location from project name (assumes format "Location, Building Name")
 * @param {string} name - The project name
 * @returns {string} The extracted location or the full name
 */
function extractLocation(name) {
    if (!name) return '';
    const parts = name.split(',');
    return parts[0].trim();
}

/**
 * Formats a date to DD/MM/YYYY format
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Generates the Speckle viewer URL
 * @returns {string} The Speckle viewer URL
 */
function getSpeckleViewerUrl() {
    const baseUrl = `https://app.speckle.systems/projects/${CONFIG.SPECKLE_PROJECT_ID}/models/${CONFIG.SPECKLE_MODEL_ID}`;
    const embedOptions = encodeURIComponent(JSON.stringify({
        isEnabled: true,
        isTransparent: true,
        hideControls: true,
        hideSelectionInfo: true,
        disableModelLink: true
    }));
    const savedView = encodeURIComponent(JSON.stringify({ id: '0a421b6a94' }));

    let url = `${baseUrl}?embed=${embedOptions}&savedView=${savedView}`;
    if (CONFIG.SPECKLE_EMBED_TOKEN) {
        url = `${baseUrl}?embedToken=${CONFIG.SPECKLE_EMBED_TOKEN}#embed=${embedOptions}&savedView=${savedView}`;
    }
    return url;
}

// === STATE MANAGEMENT ===
const AppState = {
    currentView: 'login',
    currentProject: null,
    currentDocument: null,
    currentStep: 1,
    isNavigatingFromHash: false,

    /**
     * Updates the current view
     * @param {string} view - The new view name
     */
    setView(view) {
        this.currentView = view;
    },

    /**
     * Updates the current project
     * @param {Object|null} project - The project object or null
     */
    setProject(project) {
        this.currentProject = project;
    },

    /**
     * Updates the current document
     * @param {Object|null} doc - The document object or null
     */
    setDocument(doc) {
        this.currentDocument = doc;
    },

    /**
     * Updates the current step
     * @param {number} step - The step number (1-4)
     */
    setStep(step) {
        if (step >= 1 && step <= CONFIG.STEP_COUNT) {
            this.currentStep = step;
        }
    },

    /**
     * Resets the state
     */
    reset() {
        this.currentView = 'login';
        this.currentProject = null;
        this.currentDocument = null;
        this.currentStep = 1;
    }
};

// Legacy compatibility - use getters/setters to sync with AppState
let _navigationTimeoutId = null; // Track pending navigation timeout

// Define getters/setters for legacy global compatibility
Object.defineProperty(window, 'currentView', {
    get: () => AppState.currentView,
    set: (v) => { AppState.currentView = v; }
});
Object.defineProperty(window, 'currentProject', {
    get: () => AppState.currentProject,
    set: (v) => { AppState.currentProject = v; }
});
Object.defineProperty(window, 'currentDocument', {
    get: () => AppState.currentDocument,
    set: (v) => { AppState.currentDocument = v; }
});
Object.defineProperty(window, 'currentStep', {
    get: () => AppState.currentStep,
    set: (v) => { AppState.currentStep = v; }
});
Object.defineProperty(window, 'isNavigatingFromHash', {
    get: () => AppState.isNavigatingFromHash,
    set: (v) => { AppState.isNavigatingFromHash = v; }
});

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

const mockUsers = [
    {
        id: 1,
        name: 'Max Muster',
        email: 'max.muster@bbl.admin.ch',
        role: 'Admin',
        roleClass: 'info',
        lastActivity: '27/06/2022 12:30'
    },
    {
        id: 2,
        name: 'Anna Beispiel',
        email: 'anna.beispiel@bbl.admin.ch',
        role: 'Editor',
        roleClass: 'secondary',
        lastActivity: '27/06/2022 10:45'
    },
    {
        id: 3,
        name: 'John Doe',
        email: 'john.doe@bbl.admin.ch',
        role: 'Viewer',
        roleClass: 'muted',
        lastActivity: '26/06/2022 09:15'
    },
    {
        id: 4,
        name: 'Lisa Weber',
        email: 'lisa.weber@bbl.admin.ch',
        role: 'Editor',
        roleClass: 'secondary',
        lastActivity: '27/06/2022 12:30'
    },
    {
        id: 5,
        name: 'Peter Schmidt',
        email: 'peter.schmidt@bbl.admin.ch',
        role: 'Viewer',
        roleClass: 'muted',
        lastActivity: '26/06/2022 09:15'
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

const mockValidationRules = [
    {
        code: 'LAYER_001',
        name: 'Pflichtlayer vorhanden',
        category: 'Layer',
        description: 'Prüft, ob alle 14 vorgeschriebenen Layer gemäss BBL CAD-Richtlinie vorhanden sind'
    },
    {
        code: 'LAYER_002',
        name: 'Layer-Farben korrekt',
        category: 'Layer',
        description: 'Prüft, ob die Layer-Farben den Vorgaben entsprechen (z.B. Layer 7 = weiss)'
    },
    {
        code: 'LAYER_003',
        name: 'Keine fremden Layer',
        category: 'Layer',
        description: 'Prüft, ob keine nicht definierten Layer in der Zeichnung vorhanden sind'
    },
    {
        code: 'GEOM_001',
        name: 'Polylinien geschlossen',
        category: 'Geometrie',
        description: 'Prüft, ob alle Raumpolygone geschlossen sind (Start- und Endpunkt identisch)'
    },
    {
        code: 'GEOM_002',
        name: 'Polylinien planar',
        category: 'Geometrie',
        description: 'Prüft, ob alle Polylinien auf Z=0 liegen (2D-Konformität)'
    },
    {
        code: 'GEOM_003',
        name: 'Keine Selbstüberschneidungen',
        category: 'Geometrie',
        description: 'Prüft, ob Raumpolygone sich nicht selbst überschneiden'
    },
    {
        code: 'GEOM_004',
        name: 'Minimale Raumgrösse',
        category: 'Geometrie',
        description: 'Prüft, ob alle Räume eine Mindestfläche von 1 m² haben'
    },
    {
        code: 'ENTITY_001',
        name: 'Erlaubte Entitätstypen',
        category: 'Entität',
        description: 'Prüft, ob nur erlaubte Entitätstypen verwendet werden (LINE, POLYLINE, TEXT, etc.)'
    },
    {
        code: 'ENTITY_002',
        name: 'Keine OLE-Objekte',
        category: 'Entität',
        description: 'Prüft, ob keine eingebetteten OLE-Objekte vorhanden sind'
    },
    {
        code: 'TEXT_001',
        name: 'Schriftart korrekt',
        category: 'Text',
        description: 'Prüft, ob nur die vorgeschriebene Schriftart "Arial" verwendet wird'
    },
    {
        code: 'TEXT_002',
        name: 'Textgrösse korrekt',
        category: 'Text',
        description: 'Prüft, ob die Texthöhe den Vorgaben entspricht (min. 2.5mm)'
    },
    {
        code: 'AOID_001',
        name: 'AOID-Format gültig',
        category: 'AOID',
        description: 'Prüft, ob alle AOIDs dem BBL-Format entsprechen (z.B. "2011.DM.04.015")'
    },
    {
        code: 'AOID_002',
        name: 'AOID eindeutig',
        category: 'AOID',
        description: 'Prüft, ob jede AOID nur einmal in der Zeichnung vorkommt'
    },
    {
        code: 'AOID_003',
        name: 'AOID in Raumliste',
        category: 'AOID',
        description: 'Prüft, ob alle AOIDs in der hochgeladenen Excel-Raumliste vorhanden sind'
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

/**
 * Parses the URL hash into route components
 * @returns {{view: string, projectId: number|null, documentId: number|null, isResults: boolean}}
 * @description Utility function for URL routing. Can be used for deep linking.
 */
function parseUrlHash() {
    const hash = window.location.hash || '#/login';
    const parts = hash.replace('#/', '').split('/');

    return {
        view: parts[0] || 'login',
        projectId: parts[1] === 'project' ? null : (parts[0] === 'project' ? safeParseInt(parts[1]) : null),
        documentId: parts.includes('document') ? safeParseInt(parts[parts.indexOf('document') + 1]) : null,
        isResults: parts.includes('results')
    };
}

function navigateFromHash() {
    // Cancel any pending navigation timeout to prevent race conditions
    if (_navigationTimeoutId) {
        clearTimeout(_navigationTimeoutId);
        _navigationTimeoutId = null;
    }

    isNavigatingFromHash = true;
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
        const projectId = safeParseInt(projectMatch[1]);

        if (documentMatch) {
            const documentId = safeParseInt(documentMatch[1]);
            // First open project, then document
            openProjectDetail(projectId, true); // true = skip hash update

            // Use tracked timeout to allow cancellation on rapid navigation
            _navigationTimeoutId = setTimeout(() => {
                _navigationTimeoutId = null;
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

    // Re-initialize Lucide icons in the visible view
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
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
            <article class="card" data-project-id="${safeParseInt(project.id)}">
                <div class="card__image">
                    <img src="${escapeHtml(project.imageUrl)}" alt="${escapeHtml(project.name)}">
                    ${overlayHtml}
                </div>
                <div class="card__content">
                    <h3 class="card__title">${escapeHtml(project.name)}</h3>
                    <dl class="card__meta">
                        <div class="card__meta-left">
                            <dd>SIA Phase: ${escapeHtml(project.siaPhase)}</dd>
                            <dd>${escapeHtml(project.createdDate)}</dd>
                            <dd>${safeParseInt(project.documentCount)} Dokumente</dd>
                        </div>
                        <div class="card__meta-right">
                            <span class="card__percentage card__percentage--${scoreClass}">${safeParseInt(project.completionPercentage)}%</span>
                        </div>
                    </dl>
                </div>
            </article>
        `;
    }).join('');

    // Add click handlers using event delegation would be better, but maintaining compatibility
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = safeParseInt(card.dataset.projectId);
            if (projectId > 0) {
                openProjectDetail(projectId);
            }
        });
    });
}

// === PROJECT DETAIL ===
function openProjectDetail(projectId, skipHashUpdate = false) {
    currentProject = mockProjects.find(p => p.id === projectId);
    if (!currentProject) return;

    // Update breadcrumb with project name
    document.getElementById('breadcrumb-project-name').textContent = currentProject.name;

    // Calculate average score from all validated floor plans (.dwg files)
    const validatedFloorPlans = mockDocuments.filter(doc =>
        doc.name.endsWith('.dwg') && doc.status !== 'processing'
    );
    const averageScore = validatedFloorPlans.length > 0
        ? Math.round(validatedFloorPlans.reduce((sum, doc) => sum + doc.score, 0) / validatedFloorPlans.length)
        : 0;

    document.getElementById('project-completion').textContent = `${averageScore}%`;

    // Update image
    const imageElement = document.getElementById('project-detail-image');
    imageElement.style.backgroundImage = `url(${currentProject.imageUrl})`;

    // Update donut chart (r=40, circumference = 2 * π * 40 ≈ 251)
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (averageScore / 100) * circumference;
    const donutProgress = document.getElementById('project-donut-progress');
    donutProgress.setAttribute('stroke-dasharray', circumference);
    donutProgress.setAttribute('stroke-dashoffset', offset);

    const scoreClass = averageScore >= 90 ? 'success' :
                      averageScore >= 60 ? 'warning' : 'error';
    donutProgress.className = `donut-chart__progress donut-chart__progress--${scoreClass}`;

    // Update KPIs
    document.getElementById('project-sia-phase').textContent = currentProject.siaPhase;
    document.getElementById('project-document-count').textContent = mockDocuments.length;

    // Calculate room count from mockRooms (in real app would come from project data)
    document.getElementById('project-room-count').textContent = mockRooms.length;

    // Mock area values (in real app would come from project data)
    document.getElementById('project-gf').textContent = "4'500 m²";

    // Render documents, users, and rules
    renderDocuments();
    renderUsers();
    renderRules();

    // Update tab counts
    document.getElementById('tab-documents-count').textContent = mockDocuments.length;
    document.getElementById('tab-users-count').textContent = mockUsers.length;
    document.getElementById('tab-rules-count').textContent = mockValidationRules.length;

    if (skipHashUpdate) {
        // Directly switch view without updating hash
        document.querySelectorAll('.view').forEach(view => view.classList.remove('view--active'));
        document.getElementById('view-project-detail')?.classList.add('view--active');
        currentView = 'project-detail';
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } else {
        switchView('project-detail');
    }
}

// === DOCUMENT SELECTION STATE ===
const DocumentSelection = {
    selectedIds: new Set(),

    toggle(id) {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
        this.updateUI();
    },

    selectAll() {
        mockDocuments.forEach(doc => this.selectedIds.add(doc.id));
        this.updateUI();
    },

    deselectAll() {
        this.selectedIds.clear();
        this.updateUI();
    },

    isSelected(id) {
        return this.selectedIds.has(id);
    },

    getSelectedCount() {
        return this.selectedIds.size;
    },

    updateUI() {
        const count = this.getSelectedCount();
        const total = mockDocuments.length;

        // Update selected count text
        const countEl = safeGetElementById('documents-selected-count');
        if (countEl) {
            countEl.textContent = `${count} ausgewählt`;
        }

        // Update select all checkbox state
        const selectAllCheckbox = safeGetElementById('select-all-documents');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = count === total && total > 0;
            selectAllCheckbox.indeterminate = count > 0 && count < total;
        }

        // Update row checkboxes and styles
        const tbody = safeGetElementById('document-table-body');
        if (tbody) {
            tbody.querySelectorAll('tr').forEach(row => {
                const docId = safeParseInt(row.dataset.documentId);
                const checkbox = row.querySelector('.document-checkbox');
                const isSelected = this.isSelected(docId);

                if (checkbox) {
                    checkbox.checked = isSelected;
                }
                row.classList.toggle('is-selected', isSelected);
            });
        }

        // Update action buttons
        const editBtn = safeGetElementById('edit-document-btn');
        const deleteBtn = safeGetElementById('delete-documents-btn');

        if (editBtn) {
            editBtn.disabled = count !== 1;
        }
        if (deleteBtn) {
            deleteBtn.disabled = count === 0;
        }
    }
};

// === DOCUMENT RENDERING ===
function renderDocuments() {
    const tbody = document.getElementById('document-table-body');
    if (!tbody) return;

    // Reset selection when re-rendering
    DocumentSelection.deselectAll();

    tbody.innerHTML = mockDocuments.map(doc => {
        const scoreStatus = doc.score >= 90 ? 'ok' :
                           doc.score >= 60 ? 'warning' : 'error';

        return `
            <tr data-document-id="${safeParseInt(doc.id)}">
                <td class="table__checkbox-col">
                    <label class="checkbox" onclick="event.stopPropagation()">
                        <input type="checkbox" class="document-checkbox" data-doc-id="${safeParseInt(doc.id)}" aria-label="Dokument ${escapeHtml(doc.name)} auswählen">
                        <span class="checkbox__mark"></span>
                    </label>
                </td>
                <td>${escapeHtml(doc.name)}</td>
                <td>${escapeHtml(doc.creator)}</td>
                <td>${escapeHtml(doc.lastChange)}</td>
                <td class="text-right">${safeParseInt(doc.score)}%</td>
                <td class="table__status-col">${renderStatusIcon(scoreStatus)}</td>
            </tr>
        `;
    }).join('');

    // Re-initialize Lucide icons for status icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: tbody.querySelectorAll('[data-lucide]') });
    }

    // Add click handlers for row selection (not on checkbox)
    tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', (e) => {
            // If clicking on checkbox label/input, don't open document
            if (e.target.closest('.checkbox')) {
                return;
            }
            const docId = safeParseInt(row.dataset.documentId);
            if (docId > 0) {
                openValidationView(docId);
            }
        });
    });

    // Add checkbox change handlers
    tbody.querySelectorAll('.document-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const docId = safeParseInt(e.target.dataset.docId);
            DocumentSelection.toggle(docId);
        });
    });

    // Setup select all checkbox
    setupSelectAllDocuments();
}

/**
 * Sets up the select all checkbox functionality
 */
function setupSelectAllDocuments() {
    const selectAllCheckbox = safeGetElementById('select-all-documents');
    if (!selectAllCheckbox) return;

    // Remove existing listener to prevent duplicates
    selectAllCheckbox.replaceWith(selectAllCheckbox.cloneNode(true));
    const newCheckbox = safeGetElementById('select-all-documents');

    if (newCheckbox) {
        newCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                DocumentSelection.selectAll();
            } else {
                DocumentSelection.deselectAll();
            }
        });
    }
}

/**
 * Sets up document action buttons
 */
function setupDocumentActions() {
    const newBtn = safeGetElementById('new-document-btn');
    const editBtn = safeGetElementById('edit-document-btn');
    const deleteBtn = safeGetElementById('delete-documents-btn');

    if (newBtn) {
        newBtn.addEventListener('click', () => {
            showToast('Neues Dokument erstellen - Funktion kommt bald', 'info');
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const selectedIds = Array.from(DocumentSelection.selectedIds);
            if (selectedIds.length === 1) {
                const doc = mockDocuments.find(d => d.id === selectedIds[0]);
                if (doc) {
                    showToast(`Dokument "${doc.name}" bearbeiten - Funktion kommt bald`, 'info');
                }
            }
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const count = DocumentSelection.getSelectedCount();
            if (count > 0) {
                const confirmed = confirm(`Möchten Sie ${count} Dokument(e) wirklich löschen?`);
                if (confirmed) {
                    // Remove selected documents from mockDocuments
                    const selectedIds = Array.from(DocumentSelection.selectedIds);
                    selectedIds.forEach(id => {
                        const index = mockDocuments.findIndex(d => d.id === id);
                        if (index !== -1) {
                            mockDocuments.splice(index, 1);
                        }
                    });

                    // Update document count in tab
                    const countEl = safeGetElementById('tab-documents-count');
                    if (countEl) {
                        countEl.textContent = mockDocuments.length;
                    }

                    // Re-render and show toast
                    renderDocuments();
                    showToast(`${count} Dokument(e) gelöscht`, 'success');
                }
            }
        });
    }
}

// === USER SELECTION STATE ===
const UserSelection = {
    selectedIds: new Set(),

    toggle(id) {
        if (this.selectedIds.has(id)) {
            this.selectedIds.delete(id);
        } else {
            this.selectedIds.add(id);
        }
        this.updateUI();
    },

    selectAll() {
        mockUsers.forEach(user => this.selectedIds.add(user.id));
        this.updateUI();
    },

    deselectAll() {
        this.selectedIds.clear();
        this.updateUI();
    },

    isSelected(id) {
        return this.selectedIds.has(id);
    },

    getSelectedCount() {
        return this.selectedIds.size;
    },

    updateUI() {
        const count = this.getSelectedCount();
        const total = mockUsers.length;

        // Update selected count text
        const countEl = safeGetElementById('users-selected-count');
        if (countEl) {
            countEl.textContent = `${count} ausgewählt`;
        }

        // Update select all checkbox state
        const selectAllCheckbox = safeGetElementById('select-all-users');
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = count === total && total > 0;
            selectAllCheckbox.indeterminate = count > 0 && count < total;
        }

        // Update row checkboxes and styles
        const tbody = safeGetElementById('user-table-body');
        if (tbody) {
            tbody.querySelectorAll('tr').forEach(row => {
                const userId = safeParseInt(row.dataset.userId);
                const checkbox = row.querySelector('.user-checkbox');
                const isSelected = this.isSelected(userId);

                if (checkbox) {
                    checkbox.checked = isSelected;
                }
                row.classList.toggle('is-selected', isSelected);
            });
        }

        // Update action buttons
        const editBtn = safeGetElementById('edit-user-btn');
        const deleteBtn = safeGetElementById('delete-users-btn');

        if (editBtn) {
            editBtn.disabled = count !== 1;
        }
        if (deleteBtn) {
            deleteBtn.disabled = count === 0;
        }
    }
};

// === USER RENDERING ===
function renderUsers() {
    const tbody = safeGetElementById('user-table-body');
    if (!tbody) return;

    // Reset selection when re-rendering
    UserSelection.deselectAll();

    tbody.innerHTML = mockUsers.map(user => {
        return `
            <tr data-user-id="${safeParseInt(user.id)}">
                <td class="table__checkbox-col">
                    <label class="checkbox" onclick="event.stopPropagation()">
                        <input type="checkbox" class="user-checkbox" data-user-id="${safeParseInt(user.id)}" aria-label="Benutzer ${escapeHtml(user.name)} auswählen">
                        <span class="checkbox__mark"></span>
                    </label>
                </td>
                <td>${escapeHtml(user.name)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td><span class="badge badge--${escapeHtml(user.roleClass)}">${escapeHtml(user.role)}</span></td>
                <td>${escapeHtml(user.lastActivity)}</td>
            </tr>
        `;
    }).join('');

    // Add checkbox change handlers
    tbody.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const userId = safeParseInt(e.target.dataset.userId);
            UserSelection.toggle(userId);
        });
    });

    // Setup select all checkbox
    setupSelectAllUsers();

    // Update tab count
    const tabCountEl = safeGetElementById('tab-users-count');
    if (tabCountEl) {
        tabCountEl.textContent = mockUsers.length;
    }
}

/**
 * Sets up the select all checkbox functionality for users
 */
function setupSelectAllUsers() {
    const selectAllCheckbox = safeGetElementById('select-all-users');
    if (!selectAllCheckbox) return;

    // Remove existing listener to prevent duplicates
    selectAllCheckbox.replaceWith(selectAllCheckbox.cloneNode(true));
    const newCheckbox = safeGetElementById('select-all-users');

    if (newCheckbox) {
        newCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                UserSelection.selectAll();
            } else {
                UserSelection.deselectAll();
            }
        });
    }
}

/**
 * Sets up user action buttons
 */
function setupUserActions() {
    const inviteBtn = safeGetElementById('invite-user-btn');
    const editBtn = safeGetElementById('edit-user-btn');
    const deleteBtn = safeGetElementById('delete-users-btn');

    if (inviteBtn) {
        inviteBtn.addEventListener('click', () => {
            showToast('Benutzer einladen - Funktion kommt bald', 'info');
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const selectedIds = Array.from(UserSelection.selectedIds);
            if (selectedIds.length === 1) {
                const user = mockUsers.find(u => u.id === selectedIds[0]);
                if (user) {
                    showToast(`Benutzer "${user.name}" bearbeiten - Funktion kommt bald`, 'info');
                }
            }
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const count = UserSelection.getSelectedCount();
            if (count > 0) {
                const confirmed = confirm(`Möchten Sie ${count} Benutzer wirklich entfernen?`);
                if (confirmed) {
                    // Remove selected users from mockUsers
                    const selectedIds = Array.from(UserSelection.selectedIds);
                    selectedIds.forEach(id => {
                        const index = mockUsers.findIndex(u => u.id === id);
                        if (index !== -1) {
                            mockUsers.splice(index, 1);
                        }
                    });

                    // Re-render and show toast
                    renderUsers();
                    showToast(`${count} Benutzer entfernt`, 'success');
                }
            }
        });
    }
}

// === RULES RENDERING ===
function renderRules() {
    const tbody = document.getElementById('rules-table-body');
    if (!tbody) return;

    tbody.innerHTML = mockValidationRules.map(rule => {
        return `
            <tr>
                <td><code>${escapeHtml(rule.code)}</code></td>
                <td>${escapeHtml(rule.name)}</td>
                <td><span class="badge badge--secondary">${escapeHtml(rule.category)}</span></td>
                <td>${escapeHtml(rule.description)}</td>
            </tr>
        `;
    }).join('');
}

// === VALIDATION VIEW ===
function openValidationView(documentId, skipHashUpdate = false) {
    currentDocument = mockDocuments.find(d => d.id === documentId);
    if (!currentDocument) return;

    // Update breadcrumbs
    document.getElementById('breadcrumb-val-project').textContent = currentProject.name;
    document.getElementById('breadcrumb-val-document').textContent = currentDocument.name;

    // Update step 1 score KPI with current document's score
    const scoreValue = currentDocument.score;
    document.getElementById('step1-score-value').textContent = `${scoreValue}%`;
    const scoreCard = document.getElementById('step1-score-card');
    const scoreClass = scoreValue >= 90 ? 'success' : scoreValue >= 60 ? 'warning' : 'error';
    scoreCard.className = `metric-card metric-card--${scoreClass}`;

    // Reset to step 1 (DWG hochladen)
    currentStep = 1;
    updateStepper();

    // Switch view FIRST to make container visible
    if (skipHashUpdate) {
        // Directly switch view without updating hash
        document.querySelectorAll('.view').forEach(view => view.classList.remove('view--active'));
        document.getElementById('view-validation')?.classList.add('view--active');
        currentView = 'validation';
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } else {
        switchView('validation');
    }

    // Render content AFTER view is visible
    renderRooms();
    renderAreaPolygons();
    renderErrors();
    renderFloorPlan();
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
        return `
            <tr>
                <td>${escapeHtml(room.aoid)}</td>
                <td class="text-right">${Math.round(room.area || 0)}</td>
                <td>${escapeHtml(room.aofunction)}</td>
                <td class="text-center">${renderStatusIcon(room.status)}</td>
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

    const validSeverities = ['error', 'warning', 'info'];
    errorList.innerHTML = mockErrors.map(error => {
        const severity = validSeverities.includes(error.severity) ? error.severity : 'error';
        return `
            <div class="error-item error-item--${severity}">
                <div class="error-item__header">
                    <span class="error-item__code">${escapeHtml(error.code)}</span>
                    <span class="error-item__severity error-item__severity--${severity}">${escapeHtml(error.severity)}</span>
                </div>
                <div class="error-item__message">${escapeHtml(error.message)}</div>
            </div>
        `;
    }).join('');
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
        return `
            <tr>
                <td>${escapeHtml(polygon.aoid)}</td>
                <td class="text-right">${Math.round(polygon.area || 0).toLocaleString('de-CH')}</td>
                <td>${escapeHtml(polygon.aofunction)}</td>
                <td class="text-center">${renderStatusIcon(polygon.status)}</td>
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
        const matchStatus = hasExcelMatch ? 'ok' : 'error';

        return `
            <tr>
                <td>${escapeHtml(room.aoid)}</td>
                <td>Raum ${escapeHtml(room.aoid)}</td>
                <td class="text-right">${Math.round(room.area || 0)}</td>
                <td>${escapeHtml(room.aofunction)}</td>
                <td class="text-center">${renderStatusIcon(matchStatus)}</td>
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

    const validSeverities = ['error', 'warning', 'info'];
    errorList.innerHTML = excelErrors.map(error => {
        const severity = validSeverities.includes(error.severity) ? error.severity : 'error';
        return `
            <div class="error-item error-item--${severity}">
                <div class="error-item__header">
                    <span class="error-item__code">${escapeHtml(error.code)}</span>
                    <span class="error-item__severity error-item__severity--${severity}">${escapeHtml(error.severity)}</span>
                </div>
                <div class="error-item__message">${escapeHtml(error.message)}</div>
            </div>
        `;
    }).join('');
}

// === SPECKLE VIEWER ===
let _speckleViewerInitialized = false; // Prevent duplicate event listener attachment

function initSpeckleViewer() {
    const iframe = document.getElementById('speckle-viewer');
    const loading = document.getElementById('speckle-loading');

    if (!iframe || !loading) return;

    // Set the Speckle viewer URL dynamically (only once)
    const viewerUrl = getSpeckleViewerUrl();
    if (viewerUrl && !iframe.src) {
        iframe.src = viewerUrl;
    }

    // Only attach event listeners once to prevent duplicates
    if (!_speckleViewerInitialized) {
        _speckleViewerInitialized = true;

        // Hide loading indicator when iframe loads
        iframe.addEventListener('load', () => {
            loading.classList.add('is-hidden');
        });

        // Handle iframe load errors
        iframe.addEventListener('error', () => {
            loading.innerHTML = '<span>Fehler beim Laden des 3D-Grundrisses</span>';
        });
    }
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
    // Project detail tabs (documents, users, rules)
    setupTabGroup('data-tab', 'tab-', ['tab-documents', 'tab-users', 'tab-rules']);

    // Validation view tabs - Step 1 (rooms, areas, errors)
    setupTabGroup('data-val-tab', 'val-tab-', ['val-tab-rooms', 'val-tab-areas', 'val-tab-errors']);

    // Step 2 tabs (rooms, errors)
    setupTabGroup('data-step2-tab', 'step2-tab-', ['step2-tab-rooms', 'step2-tab-errors']);
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

    // View toggle with accessibility support
    document.querySelectorAll('.view-toggle__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-toggle__btn').forEach(b => {
                b.classList.remove('view-toggle__btn--active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('view-toggle__btn--active');
            btn.setAttribute('aria-pressed', 'true');

            const viewType = btn.dataset.view;
            const cardGrid = document.getElementById('project-grid');

            if (cardGrid) {
                if (viewType === 'list') {
                    cardGrid.classList.add('card-grid--list');
                    showToast('Listenansicht aktiviert', 'info');
                } else {
                    cardGrid.classList.remove('card-grid--list');
                    showToast('Kachelansicht aktiviert', 'info');
                }
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
    const sanitizedName = sanitizeFilename(file.name);

    if (type === 'dwg') {
        const nameEl = document.getElementById('dwg-file-name');
        const sizeEl = document.getElementById('dwg-file-size');
        const uploadedEl = document.getElementById('dwg-uploaded-file');
        if (nameEl) nameEl.textContent = sanitizedName;
        if (sizeEl) sizeEl.textContent = fileSize;
        if (uploadedEl) uploadedEl.style.display = 'block';
        showToast(`DWG-Datei "${sanitizedName}" ausgewählt`, 'success');
    } else if (type === 'excel') {
        const nameEl = document.getElementById('excel-file-name');
        const sizeEl = document.getElementById('excel-file-size');
        const uploadedEl = document.getElementById('excel-uploaded-file');
        if (nameEl) nameEl.textContent = sanitizedName;
        if (sizeEl) sizeEl.textContent = fileSize;
        if (uploadedEl) uploadedEl.style.display = 'block';
        showToast(`Excel-Datei "${sanitizedName}" ausgewählt`, 'success');
    }
}

function formatFileSize(bytes) {
    if (!bytes || bytes <= 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(CONFIG.BYTES_PER_KB));
    if (i >= sizes.length) return 'File too large';
    return parseFloat((bytes / Math.pow(CONFIG.BYTES_PER_KB, i)).toFixed(2)) + ' ' + sizes[i];
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'info') {
    const validTypes = ['info', 'success', 'warning', 'error'];
    const toastType = validTypes.includes(type) ? type : 'info';

    const toast = document.createElement('div');
    toast.className = `toast toast--${toastType}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message; // textContent is safe from XSS
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, CONFIG.TOAST_DURATION_MS);
}

// === ENHANCED INTERACTIONS ===
let _interactionsInitialized = false;

function enhanceInteractions() {
    // Only initialize once - use event delegation for dynamic content
    if (_interactionsInitialized) return;
    _interactionsInitialized = true;

    // Add ripple effect to buttons using event delegation
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
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

        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    // Room table hover using event delegation (works with dynamically rendered rows)
    const roomTableBody = document.getElementById('room-table-body');
    if (roomTableBody) {
        roomTableBody.addEventListener('mouseenter', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            const index = Array.from(roomTableBody.children).indexOf(row);
            const rooms = document.querySelectorAll('.floorplan__room');
            if (rooms[index]) {
                rooms[index].classList.add('floorplan__room--selected');
            }
        }, true); // Use capture phase for delegation

        roomTableBody.addEventListener('mouseleave', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            document.querySelectorAll('.floorplan__room').forEach(r => {
                r.classList.remove('floorplan__room--selected');
            });
        }, true);
    }

    // Error item clicks using event delegation
    document.addEventListener('click', (e) => {
        const errorItem = e.target.closest('.error-item');
        if (errorItem) {
            showToast('Error location highlighted on floor plan', 'info');
        }
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
    setupModals();
    setupDocumentActions();
    setupUserActions();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Default to login view if no valid hash
    // Note: setupRouting() already handles hash-based navigation on page load,
    // so we only need to set the default view when there's no hash
    const hash = window.location.hash;
    if (!hash || hash === '#/login' || hash === '#/' || hash === '#') {
        switchView('login');
    }
    // Navigation for other hashes is handled by setupRouting() to avoid race conditions

    // Add welcome message
    console.log('%c BBL Prüfplattform Flächenmanagement ', 'background: #DC0018; color: white; font-size: 14px; padding: 4px 8px;');
    console.log('%c Prototype v1.0 - Swiss Federal Design System ', 'background: #006699; color: white; font-size: 12px; padding: 4px 8px;');

    // Enhance interactions - now uses event delegation so no delay needed
    enhanceInteractions();
});
