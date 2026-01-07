# plan-check Requirements Specification

## Project Overview

**Project Name:** plan-check (BBL Prüfplattform Flächenmanagement Prototype)

**Purpose:** Replace/modernize the existing BBL floor plan validation platform with an open-source solution that validates DWG/DXF files against BBL CAD-Richtlinie standards before CAFM import.

**Target Users:**
- BBL internal staff (Flächenmanagement team)
- External planners/architects submitting floor plans
- Project managers reviewing submissions

---

## Functional Requirements

### FR-1: Authentication & Access Control

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1.1 | User login with username/email and password | Must | Swiss federal identity integration (eIAM) for production |
| FR-1.2 | Role-based access: Admin, BBL Staff, External Planner | Must | |
| FR-1.3 | "Zugang anfordern" (Request access) workflow | Should | Self-registration for external users |
| FR-1.4 | Password reset functionality | Must | |
| FR-1.5 | Session management with timeout | Must | Security requirement |

### FR-2: Project Management (Aufträge)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-2.1 | Create new project (Auftrag) with metadata | Must | Project ID, name, SIA phase, location |
| FR-2.2 | Project dashboard with card view | Must | Show building photo, completion %, document count |
| FR-2.3 | Project search by name, ID, Auftrag number | Must | |
| FR-2.4 | Filter projects by status (active, completed, archived) | Should | |
| FR-2.5 | Project completion percentage calculation | Must | Aggregate from document validation scores |
| FR-2.6 | Auto-archive completed projects after 30 days | Should | "Wird in 30 Tagen gelöscht" |
| FR-2.7 | Project metadata: SIA Phase (51, 52, 53), creation date | Must | |

### FR-3: Document Management

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-3.1 | Upload DWG files | Must | Primary use case |
| FR-3.2 | Upload DXF files | Should | Fallback format |
| FR-3.3 | Upload Excel room list (Raumliste) | Must | For AOID cross-validation |
| FR-3.4 | Document versioning | Should | Track changes over time |
| FR-3.5 | Document list view with status | Must | Name, creator, last change, validation % |
| FR-3.6 | Download original uploaded files | Must | |
| FR-3.7 | Batch upload multiple files | Should | |

### FR-4: Validation Workflow (4-Step Wizard)

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-4.1 | Step 1: DWG hochladen (Upload DWG) | Must | File upload with drag & drop |
| FR-4.2 | Step 2: Raumliste hochladen (Upload room list) | Must | Excel file upload |
| FR-4.3 | Step 3: Ergebnisse bestätigen (Confirm results) | Must | Review validation results |
| FR-4.4 | Step 4: Auftrag abschliessen (Complete order) | Must | Final submission |
| FR-4.5 | Progress indicator showing current step | Must | Visual stepper component |
| FR-4.6 | Navigation between steps (back/next) | Must | |
| FR-4.7 | Save progress and resume later | Should | |

### FR-5: DWG Validation Engine

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| **Layer Validation** ||||
| FR-5.1 | Validate presence of required BBL layers | Must | 14 layers per CAD-Richtlinie |
| FR-5.2 | Validate layer colors match specification | Must | RGB color index mapping |
| FR-5.3 | Warn on unexpected/extra layers | Should | |
| FR-5.4 | System layers allowed: "0", "Defpoints" | Must | |
| **Geometry Validation** ||||
| FR-5.5 | Validate polylines are closed | Must | Room polygons must be closed |
| FR-5.6 | Validate Z-coordinates = 0 | Must | 2D floor plans only |
| FR-5.7 | Validate polyline width = 0 | Should | |
| FR-5.8 | Validate minimum room area (0.25 m²) | Should | |
| FR-5.9 | Detect self-intersecting polygons | Should | |
| FR-5.10 | Detect overlapping room polygons | Should | |
| **Entity Validation** ||||
| FR-5.11 | Check for forbidden entities (SPLINE, ELLIPSE, OLE) | Must | |
| FR-5.12 | Validate entities on correct layers | Must | |
| **Text/Font Validation** ||||
| FR-5.13 | Validate font is Arial | Must | |
| FR-5.14 | Validate text on allowed layers only | Should | |
| FR-5.15 | Validate text color is BYLAYER | Should | |
| **AOID Validation** ||||
| FR-5.16 | Validate AOID format (regex) | Must | `^\d{4}\.[A-Z]{2}\.\d{2}\.\d{3}$` |
| FR-5.17 | Validate AOID uniqueness | Must | No duplicates |
| FR-5.18 | Validate AOID position inside room polygon | Should | |
| FR-5.19 | Cross-check AOID with Excel room list | Must | |
| **Structure Validation** ||||
| FR-5.20 | Validate drawing scale | Should | |
| FR-5.21 | Check for external references (XREFs) | Should | May need warning |
| FR-5.22 | Check for embedded images | Should | |

### FR-6: Room Data Extraction & Display

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-6.1 | Extract room count from DWG | Must | |
| FR-6.2 | Extract room polygons with areas | Must | Calculate from geometry |
| FR-6.3 | Display room table with columns | Must | XAO, AREA, AREA_GRO, AREA_RED, AOFUNCTI, AOUSCOM |
| FR-6.4 | Sort rooms by area (descending) | Should | |
| FR-6.5 | Link room table rows to floor plan viewer | Should | Click to highlight |
| FR-6.6 | Room type classification (office, WC, hall, etc.) | Should | From AOFUNCTI code |

### FR-7: Floor Plan Viewer

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-7.1 | Display uploaded DWG as interactive floor plan | Must | Core feature |
| FR-7.2 | Pan and zoom controls | Must | |
| FR-7.3 | Layer visibility toggle | Should | Show/hide individual layers |
| FR-7.4 | Highlight validation errors on plan | Must | Visual markers |
| FR-7.5 | Click on room to see details | Should | |
| FR-7.6 | Color-code rooms by validation status | Should | Green=OK, Yellow=Warning, Red=Error |
| FR-7.7 | "DWG Hochladen" button in viewer | Must | Quick re-upload |
| FR-7.8 | "Menu Bearbeiten" context menu | Should | Additional actions |

### FR-8: SIA 416 Area Calculations

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-8.1 | Calculate Geschossfläche (GF) | Must | Total floor area |
| FR-8.2 | Calculate Nettogeschossfläche (NGF) | Must | Net floor area |
| FR-8.3 | Calculate Hauptnutzfläche (HNF) | Must | Main usable area |
| FR-8.4 | Calculate Nebennutzfläche (NNF) | Should | Secondary usable area |
| FR-8.5 | Calculate Verkehrsfläche (VF) | Should | Circulation area |
| FR-8.6 | Calculate Funktionsfläche (FF) | Should | Functional area |
| FR-8.7 | Calculate Konstruktionsfläche (KF) | Should | Construction area |
| FR-8.8 | Display area breakdown by DIN 277 categories | Should | HNF 1-7, FF 8, VF 9, BUF 10 |
| FR-8.9 | Calculate efficiency ratios (HNF/GF, VMF/GF) | Should | Kennzahlen Wirtschaftlichkeit |
| FR-8.10 | Pie chart visualization of area distribution | Should | |

### FR-9: Validation Results & Reporting

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-9.1 | Display error count with severity | Must | Errors vs Warnings |
| FR-9.2 | List all validation errors with details | Must | Code, message, location |
| FR-9.3 | "Fehlermeldungen" tab in detail view | Must | |
| FR-9.4 | Link errors to floor plan location | Should | Click error → pan to location |
| FR-9.5 | Export validation report as PDF | Should | |
| FR-9.6 | Export validation report as JSON | Should | For API consumers |
| FR-9.7 | "Zusammenfassung Ergebnis" summary page | Must | Final results overview |

### FR-10: Downloads & Documentation

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-10.1 | Provide BBL CAD Weisung.pdf download | Must | |
| FR-10.2 | Provide BBL CAD Prüfungskatalog.pdf download | Must | |
| FR-10.3 | Provide BBL CAD BPMN Prozess.pdf download | Should | |
| FR-10.4 | Provide BBL CAD Vorlage Raumliste.xlsx template | Must | |
| FR-10.5 | Provide BBL CAD Beispiel Dateien.zip samples | Should | |
| FR-10.6 | Embed explainer video (Erklärvideo) | Should | |

---

## Non-Functional Requirements

### NFR-1: Performance

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-1.1 | DWG upload response time | < 5 seconds | For files up to 50 MB |
| NFR-1.2 | Validation processing time | < 30 seconds | Per floor plan |
| NFR-1.3 | Floor plan viewer load time | < 3 seconds | After processing |
| NFR-1.4 | Dashboard load time | < 2 seconds | |
| NFR-1.5 | Support concurrent users | 50+ | |

### NFR-2: Security

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-2.1 | HTTPS/TLS encryption | All traffic |
| NFR-2.2 | Authentication required for all operations | Except public docs |
| NFR-2.3 | Input validation and sanitization | Prevent injection |
| NFR-2.4 | File type validation | Only allow DWG, DXF, XLSX |
| NFR-2.5 | Rate limiting on uploads | Prevent abuse |
| NFR-2.6 | Audit logging | All user actions |
| NFR-2.7 | ISG-compliant data handling | For production |

### NFR-3: Usability

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-3.1 | Responsive design (desktop, tablet) | Mobile optional |
| NFR-3.2 | German language UI | Primary language |
| NFR-3.3 | French language UI | Secondary (for production) |
| NFR-3.4 | Italian language UI | Tertiary (for production) |
| NFR-3.5 | Accessible (WCAG 2.1 AA) | Federal requirement |
| NFR-3.6 | Swiss Federal CI/CD compliance | Design system |

### NFR-4: Reliability & Availability

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-4.1 | Uptime | 99.5% | During business hours |
| NFR-4.2 | Data backup frequency | Daily | |
| NFR-4.3 | Recovery time objective (RTO) | < 4 hours | |
| NFR-4.4 | Recovery point objective (RPO) | < 24 hours | |

### NFR-5: Scalability & Maintainability

| ID | Requirement | Notes |
|----|-------------|-------|
| NFR-5.1 | Containerized deployment (Docker) | Easy scaling |
| NFR-5.2 | Configuration-driven validation rules | YAML/JSON config |
| NFR-5.3 | API-first architecture | Enable integrations |
| NFR-5.4 | Comprehensive logging | Debugging & monitoring |
| NFR-5.5 | Automated testing (unit, integration) | CI/CD pipeline |

---

## Data Model

### Entities

```
Project (Auftrag)
├── id: UUID
├── project_number: String (e.g., "1234/AA.001")
├── name: String
├── location: String
├── sia_phase: Enum (51, 52, 53)
├── status: Enum (active, completed, archived)
├── created_at: DateTime
├── completed_at: DateTime?
├── created_by: User
├── building_image_url: String?
├── completion_percentage: Float (calculated)
└── documents: Document[]

Document
├── id: UUID
├── project_id: FK → Project
├── filename: String
├── file_type: Enum (DWG, DXF, XLSX)
├── file_size: Integer
├── file_path: String
├── uploaded_at: DateTime
├── uploaded_by: User
├── last_modified_at: DateTime
├── last_modified_by: User
├── validation_status: Enum (pending, processing, completed, failed)
├── validation_score: Float (0-100)
└── validation_results: ValidationResult[]

ValidationResult
├── id: UUID
├── document_id: FK → Document
├── rule_code: String (e.g., "LAYER_001")
├── severity: Enum (error, warning, info)
├── message: String
├── location: JSON? (x, y coordinates)
├── entity_handle: String?
├── layer_name: String?
└── created_at: DateTime

Room
├── id: UUID
├── document_id: FK → Document
├── aoid: String (e.g., "2011.DM.04.045")
├── xao: String (room type code)
├── area: Float (m²)
├── area_gross: Float?
├── area_reduced: Float?
├── function_code: String (AOFUNCTI)
├── comment: String?
├── polygon_wkt: String (WKT geometry)
└── validation_status: Enum

AreaSummary
├── id: UUID
├── document_id: FK → Document
├── gf: Float (Geschossfläche)
├── ngf: Float (Nettogeschossfläche)
├── hnf: Float (Hauptnutzfläche)
├── nnf: Float (Nebennutzfläche)
├── vf: Float (Verkehrsfläche)
├── ff: Float (Funktionsfläche)
├── kf: Float (Konstruktionsfläche)
├── room_count: Integer
└── calculated_at: DateTime

User
├── id: UUID
├── email: String
├── name: String
├── role: Enum (admin, staff, external)
├── organization: String?
├── created_at: DateTime
└── last_login_at: DateTime?
```

---

## API Specification (Draft)

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/request-access
POST /api/auth/reset-password
```

### Projects
```
GET    /api/projects                    # List projects
POST   /api/projects                    # Create project
GET    /api/projects/{id}               # Get project details
PUT    /api/projects/{id}               # Update project
DELETE /api/projects/{id}               # Archive project
GET    /api/projects/{id}/documents     # List project documents
```

### Documents
```
POST   /api/documents/upload            # Upload file
GET    /api/documents/{id}              # Get document details
GET    /api/documents/{id}/download     # Download original file
DELETE /api/documents/{id}              # Delete document
POST   /api/documents/{id}/validate     # Trigger validation
GET    /api/documents/{id}/results      # Get validation results
GET    /api/documents/{id}/rooms        # Get extracted rooms
GET    /api/documents/{id}/areas        # Get area summary
GET    /api/documents/{id}/viewer       # Get viewer data (SVG/JSON)
```

### Reports
```
GET    /api/documents/{id}/report/json  # JSON validation report
GET    /api/documents/{id}/report/pdf   # PDF validation report
```

---

## Technology Stack (Prototype)

### Backend
- **Runtime:** Python 3.12+
- **Framework:** FastAPI
- **DWG Processing:** Speckle (cloud) or LibreDWG (self-hosted)
- **DXF Fallback:** ezdxf
- **Geometry:** Shapely
- **Excel Parsing:** openpyxl
- **Database:** PostgreSQL + PostGIS (production) / SQLite (prototype)
- **File Storage:** Local (prototype) / S3-compatible (production)

### Frontend
- **Framework:** React 18+ or plain HTML/JS (prototype)
- **Styling:** Tailwind CSS + Swiss Federal Design System
- **Floor Plan Viewer:** Speckle Viewer or Mapbox GL JS / SVG
- **Charts:** Chart.js or Recharts
- **State Management:** React Query / Zustand

### Infrastructure
- **Containerization:** Docker
- **Hosting (Demo):** GitHub Pages (frontend) + Google Cloud Run (API)
- **Hosting (Production):** Swiss federal infrastructure / Bundescloud
- **CI/CD:** GitHub Actions

---

## Prototype Scope (MVP)

### Phase 1: Core Validation (4 weeks)

**In Scope:**
- [ ] Simple login (username/password, no eIAM)
- [ ] Single project view (no project management)
- [ ] DWG upload via Speckle
- [ ] Basic validation: 5 core rules (layer names, layer colors, closed polylines, Z=0, forbidden entities)
- [ ] Validation results display (error list)
- [ ] Basic floor plan viewer (via Speckle embed)

**Out of Scope:**
- Multi-project management
- Excel room list upload
- AOID validation
- SIA 416 calculations
- PDF reports
- Multi-language

### Phase 2: Extended Features (4 weeks)

**In Scope:**
- [ ] Excel room list upload & cross-validation
- [ ] AOID validation (format, uniqueness)
- [ ] Room table extraction and display
- [ ] Error highlighting on floor plan
- [ ] Project list view
- [ ] Basic SIA 416 area summary

### Phase 3: Production Ready (4 weeks)

**In Scope:**
- [ ] Full project management (CRUD)
- [ ] 4-step wizard workflow
- [ ] Complete SIA 416 calculations
- [ ] PDF report generation
- [ ] German + French UI
- [ ] Swiss Federal CI/CD styling
- [ ] Performance optimization
- [ ] Security hardening

---

## Wireframe Analysis (from uploaded images)

### Screen 1 & 2: Login Page
- Swiss federal header with BBL branding
- Login form (email/password)
- "Zugang anfordern" / "Password vergessen" links
- Explainer video embed
- Downloads section with 5 documents

### Screen 3: Project Dashboard
- Search bar (Projektname, ID, Auftrag)
- Grid/list toggle
- Project cards showing:
  - Building thumbnail
  - Project name & location
  - SIA Phase
  - Creation date
  - Document count
  - Completion % (color-coded: green >90%, yellow 60-90%, red <60%)
- Completed projects marked with overlay

### Screen 4: Project Detail (Document List)
- Breadcrumb navigation
- Building image + completion donut chart
- Tabs: Stammdaten, Abgabe Dokumente, Flächenkennzahlen
- Document table: Name, Creator, Last Change, Status, Score

### Screen 5: Validation Detail
- 4-step progress indicator
- Key metrics cards: Räume, GF, NGF, Fehlermeldungen
- Tabs: Flächen, Räume, Fehlermeldungen
- Split view: Room table (left) + Floor plan viewer (right)
- Floor plan with interactive layers and "DWG Hochladen" button

### Screen 6: Results Summary
- "Zusammenfassung Ergebnis" header
- SIA 416 area breakdown tables:
  - Gebäudevolumen (GV, GV OG, GV UG)
  - Gebäudeflächen (GF, KF, NGF, NF, HNF, NNF, VF, FF)
  - Flächen DIN 277 (HNF 1-7, FF 8, VF 9, BUF 10)
- Kennzahlen Wirtschaftlichkeit ratios
- Pie chart visualization
- Navigation: Vorheriger Schritt / Nächster Schritt

---

## Open Questions

1. **Authentication:** Will prototype use simple auth or mock eIAM integration?
2. **DWG Processing:** Speckle cloud or self-hosted LibreDWG?
3. **Data Persistence:** How long to retain uploaded files and results?
4. **Integration:** Any existing systems to integrate with (SAP RE-FX, SUPERB)?
5. **Validation Rules:** Are the 14 layers in CAD-Richtlinie complete, or are there additional rules?
6. **SIA 416 Logic:** How are area types (HNF, NNF, VF, FF) determined from room codes?
7. **Multi-tenancy:** Should external planners see only their own projects?

---

## References

- BBL CAD-Richtlinie (CAD-Richtlinie_BBL-DE.docx)
- BBL CAD Prüfungskatalog
- SIA 416 - Flächen und Volumen von Gebäuden
- DIN 277 - Grundflächen und Rauminhalte
- Swiss Federal Design System: https://design.admin.ch/
- Speckle Documentation: https://docs.speckle.systems/
