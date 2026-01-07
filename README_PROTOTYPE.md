# BBL Prüfplattform Flächenmanagement - Frontend Prototype

A single-page HTML/vanilla JavaScript prototype for the BBL floor plan validation platform.

## 🎨 Design System

This prototype follows the **Swiss Federal Design System** guidelines:
- Official color palette (Venetian Red #DC0018, Cerulean Blue #006699)
- Frutiger font family (with system font fallbacks)
- Grid-based layouts with 8px spacing system
- No border-radius (per Swiss Federal CD guidelines)
- WCAG 2.1 AA accessibility compliance

## 📁 Files

```
prototype/
├── index.html      # Single-page application with all views
├── styles.css      # Complete stylesheet following Swiss Federal Design System
├── script.js       # Interactive JavaScript with mock data
└── README.md       # This file
```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local Server
For better development experience with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then navigate to `http://localhost:8000`

## 🖼️ Views Implemented

### 1. Login Page
- **Route:** Default view on load
- **Features:**
  - Username/password input fields with icons
  - "Zugang anfordern" and "Passwort vergessen?" links
  - Explainer video placeholder
  - Downloads section with 5 BBL CAD documents

### 2. Project Overview (Dashboard)
- **Route:** After login
- **Features:**
  - Search bar for filtering projects by name, ID, or order number
  - Grid/List view toggle
  - Project cards with:
    - Building thumbnail images
    - Project metadata (SIA Phase, creation date, document count)
    - Completion percentage with color coding (green ≥90%, yellow 60-89%, red <60%)
    - Completed project overlay ("Wird in 30 Tagen gelöscht")

### 3. Project Detail (Document List)
- **Route:** Click any project card
- **Features:**
  - Breadcrumb navigation
  - Building image and donut chart showing completion percentage
  - Tabs: "Abgabe Dokumente", "Stammdaten", "Flächenkennzahlen"
  - Document table with validation scores
  - "Zurück Übersicht" button

### 4. Validation Workflow
- **Route:** Click any document in project detail
- **Features:**
  - 4-step progress stepper (DWG hochladen → Raumliste → Ergebnisse → Abschliessen)
  - Key metrics cards (Räume, GF, NGF, Fehlermeldungen)
  - Tabs: Räume (22), Flächen, Fehlermeldungen (13)
  - Split view:
    - **Left:** Room table / Area summary / Error list
    - **Right:** Interactive floor plan viewer with error markers
  - Workflow navigation buttons (Vorheriger Schritt / Nächster Schritt)

### 5. Results Summary
- **Route:** "Nächster Schritt" from validation view
- **Features:**
  - Comprehensive SIA 416 area breakdown tables:
    - Gebäudevolumen (GV, GV OG, GV UG)
    - Gebäudeflächen (GF, KF, NGF, NF, HNF, NNF, VF, FF)
    - Flächen DIN 277 (HNF 1-7, FF 8, VF 9)
  - Kennzahlen Wirtschaftlichkeit ratios
  - Pie chart visualization of area distribution
  - "Auftrag abschliessen" button

## 🧪 Mock Data

The prototype includes realistic mock data:

- **5 Projects** with varying completion percentages and statuses
- **5 Documents** per project with validation scores
- **22 Rooms** with XAO codes, areas, and function types
- **13 Validation Errors** with severity levels (error/warning) and locations

## ✨ Interactive Features

### Navigation
- ✅ Login → Project Overview
- ✅ Project Card → Project Detail
- ✅ Document Row → Validation Workflow
- ✅ Next Step → Results Summary
- ✅ Breadcrumb navigation back to previous views
- ✅ "Zurück Übersicht" button

### UI Interactions
- ✅ Project search/filter
- ✅ Grid/List view toggle
- ✅ Tab switching (Project Detail and Validation Workflow)
- ✅ Interactive donut chart (calculates based on completion %)
- ✅ Floor plan viewer with error markers
- ✅ Color-coded validation scores and error rooms

### Visual Feedback
- ✅ Hover states on cards, buttons, links
- ✅ Focus states for keyboard navigation
- ✅ Active tab highlighting
- ✅ Error severity color coding

## 🎯 Design Highlights

### Swiss Federal Design
- **Red header bar** (6px, #DC0018) - mandatory CD element
- **Swiss coat of arms** (simplified SVG logo)
- **Clean typography** with Frutiger font family
- **No rounded corners** - sharp, professional aesthetics
- **Generous whitespace** - content breathes

### Color Coding
- **Success (≥90%):** Green (#3C763D)
- **Warning (60-89%):** Brown/Gold (#8A6D3B)
- **Error (<60%):** Dark Red (#A94442)

### Accessibility
- Semantic HTML structure
- ARIA labels for icon-only buttons
- High contrast text (WCAG AA compliant)
- Focus indicators for keyboard navigation
- `prefers-reduced-motion` support

## 📐 Responsive Behavior

The prototype is responsive with breakpoints at:
- **Desktop (≥992px):** Full layout with side-by-side views
- **Tablet (576-991px):** 2-column grids, stacked sections
- **Mobile (<576px):** Single column, vertical stepper

## 🔧 Customization

### Changing Mock Data
Edit `script.js` and modify:
- `mockProjects` - project list data
- `mockDocuments` - document validation data
- `mockRooms` - room extraction data
- `mockErrors` - validation error list

### Updating Colors
All colors are defined as CSS variables in `styles.css`:
```css
:root {
  --color-primary: #006699;
  --color-success: #3C763D;
  /* ... etc */
}
```

### Adding New Views
1. Add a new `<section id="view-your-name" class="view">` in `index.html`
2. Call `switchView('your-name')` to navigate
3. Style with existing CSS classes or add new ones

## 🚧 Limitations (Prototype Scope)

This is a **static prototype** with the following limitations:

❌ No backend API integration
❌ No actual DWG file processing
❌ No user authentication (login is simulated)
❌ No file upload functionality
❌ No data persistence (refreshing resets state)
❌ No multi-language support (German only)
❌ No PDF report generation
❌ Floor plan viewer is simplified (not a full CAD viewer)

## 🔮 Next Steps for Production

To turn this prototype into a production application:

1. **Backend Integration**
   - Connect to FastAPI backend (see `/backend` directory)
   - Implement actual file upload with multipart/form-data
   - Replace mock data with API calls

2. **DWG Processing**
   - Integrate Speckle Viewer or LibreDWG
   - Implement actual validation engine
   - Parse DWG layers, entities, and geometry

3. **Authentication**
   - Implement real login with JWT tokens
   - Integrate eIAM for Swiss federal identity
   - Add role-based access control (Admin, Staff, External)

4. **Enhanced Features**
   - Excel room list upload and cross-validation
   - PDF report generation
   - Multi-language support (DE, FR, IT)
   - Advanced floor plan viewer with pan/zoom
   - Real-time validation progress

5. **Production Deployment**
   - Containerize with Docker
   - Deploy to Swiss federal infrastructure
   - Set up CI/CD pipeline
   - Add monitoring and logging

## 📚 References

- [Swiss Federal Design System](https://github.com/swiss/designsystem)
- [Swiss Federal Styleguide (Legacy)](https://github.com/swiss/styleguide)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [SIA 416 Standard](https://www.sia.ch/de/dienstleistungen/sia-norm/sia-416/)

## 📄 License

This is a prototype for the BBL Prüfplattform Flächenmanagement project.

---

**Built with:** HTML5, CSS3, Vanilla JavaScript
**Design System:** Swiss Federal Corporate Design
**Last Updated:** January 2025
