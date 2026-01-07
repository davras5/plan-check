# plan-check

**BBL Prüfplattform Flächenmanagement** - A validation tool for floor plan drawings following Swiss Federal BBL CAD standards.

## Live Demo

Visit the interactive prototype: **[https://davidrasner.github.io/plan-check/](https://davidrasner.github.io/plan-check/)**

> The demo is a static HTML/CSS/JavaScript prototype showcasing the user interface and workflow. Upload, check, and ensure data quality for DWG/DXF floor plans.

<p align="center">
  <img src="assets/Preview1.jpg" width="45%" style="vertical-align: top;"/>
  <img src="assets/Preview3.jpg" width="45%" style="vertical-align: top;"/>
</p>



## Project Overview

This project aims to replace/modernize the existing BBL floor plan validation platform with an open-source solution that validates DWG/DXF files against BBL CAD-Richtlinie standards before CAFM import.

**Target Users:**
- BBL internal staff (Flächenmanagement team)
- External planners/architects submitting floor plans
- Project managers reviewing submissions

## Features

### Frontend Prototype (Live Demo)
- **Swiss Federal Design System** - Official colors, typography, and layouts
- **Project Dashboard** - Grid view with filterable project cards
- **Document Management** - Upload and track DWG/DXF/XLSX files
- **4-Step Validation Workflow** - Upload → Room List → Review → Submit
- **Interactive Floor Plan Viewer** - Visual error markers on plans
- **SIA 416 Area Calculations** - Complete area breakdowns and ratios
- **Validation Results** - Detailed error/warning list with severity levels

### Planned Backend Features
- DWG/DXF file processing (Speckle or LibreDWG)
- 25+ validation rules from BBL CAD-Richtlinie
- Excel room list cross-validation
- Real-time validation progress
- PDF report generation
- Swiss eIAM authentication

## Repository Structure

```
plan-check/
├── index.html              # Main demo page (GitHub Pages)
├── styles.css              # Swiss Federal Design System styles
├── script.js               # Interactive functionality with mock data
├── README_PROTOTYPE.md     # Detailed prototype documentation
├── documentation/
│   ├── requirements.md     # Functional requirements
│   ├── styleguide.md       # Swiss Federal Design System guide
│   ├── data-model.md       # Complete data model specification
│   └── wireframes_05-2025/ # Design wireframes
└── data/                   # Sample JSON data for demo
    ├── users.json
    ├── projects.json
    ├── documents.json
    ├── validation-results.json
    ├── rooms.json
    ├── area-summaries.json
    ├── validation-rules.json
    └── bbl-layers.json
```

## Design System

The prototype follows the **Swiss Federal Corporate Design** guidelines:
- **Colors:** Venetian Red (#DC0018), Cerulean Blue (#006699)
- **Typography:** Frutiger font family (with system fallbacks)
- **Layout:** Grid-based with 8px spacing system
- **Accessibility:** WCAG 2.1 AA compliant

See [documentation/styleguide.md](documentation/styleguide.md) for complete design specifications.

## Data Model

The application uses a normalized data structure:
- **User** → **Project** → **Document** → **ValidationResult**, **Room**, **AreaSummary**

Sample data is provided in JSON format in the `data/` directory. See [documentation/data-model.md](documentation/data-model.md) for complete schema definitions.

## Technology Stack

### Frontend (Current)
- HTML5, CSS3, Vanilla JavaScript
- Swiss Federal Design System
- No build tools required

### Backend (Planned)
- **Runtime:** Python 3.12+
- **Framework:** FastAPI
- **DWG Processing:** Speckle (cloud) or LibreDWG (self-hosted)
- **DXF Fallback:** ezdxf
- **Geometry:** Shapely
- **Database:** PostgreSQL + PostGIS
- **Authentication:** Swiss eIAM integration

## Getting Started

### View the Demo
Simply visit: **[https://davidrasner.github.io/plan-check/](https://davidrasner.github.io/plan-check/)**

### Run Locally
```bash
# Clone the repository
git clone https://github.com/davidrasner/plan-check.git
cd plan-check

# Open in browser
open index.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000
```

### Explore the Data Model
```bash
# View sample data
cat data/projects.json
cat data/validation-results.json

# Read documentation
cat documentation/data-model.md
```

## Documentation

- **[requirements.md](documentation/requirements.md)** - Complete functional requirements (FR-1 to FR-10)
- **[styleguide.md](documentation/styleguide.md)** - Swiss Federal Design System guide
- **[data-model.md](documentation/data-model.md)** - Database schema and API contracts
- **[README_PROTOTYPE.md](README_PROTOTYPE.md)** - Detailed prototype documentation

## Demo Workflow

The live demo demonstrates the complete validation workflow:

1. **Login** - Enter credentials (demo only, no real authentication)
2. **Project Dashboard** - Browse projects with completion percentages
3. **Project Detail** - View documents and their validation scores
4. **Validation Workflow** - Step through the 4-stage process:
   - Upload DWG file
   - Upload Excel room list
   - Review validation results and floor plan
   - View SIA 416 area summary
5. **Results** - See detailed error reports with spatial markers

## Next Steps

### Phase 1: Backend MVP
- [ ] Set up FastAPI backend
- [ ] Implement DWG file upload and storage
- [ ] Build validation engine (5 core rules)
- [ ] Create REST API endpoints
- [ ] Connect frontend to backend

### Phase 2: Full Validation
- [ ] Implement all 25+ validation rules
- [ ] Excel room list cross-validation
- [ ] AOID format and uniqueness checks
- [ ] Room extraction and area calculations
- [ ] PDF report generation

### Phase 3: Production Ready
- [ ] Swiss eIAM authentication
- [ ] Multi-language support (DE, FR, IT)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment to Swiss federal infrastructure

## References

- [Swiss Federal Design System](https://github.com/swiss/designsystem)
- [SIA 416 - Areas and Volumes of Buildings](https://www.sia.ch/de/dienstleistungen/sia-norm/sia-416/)
- [DIN 277 - Floor Areas and Volumes](https://www.din.de/)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/TR/WCAG21/)

## License

This project is a prototype for the BBL Prüfplattform Flächenmanagement.

---

**Built with:** HTML5, CSS3, Vanilla JavaScript
**Design System:** Swiss Federal Corporate Design
**Last Updated:** January 2025
