# plan-check Data Model

## Overview

This document defines the data model for the BBL Prüfplattform Flächenmanagement. The model is designed to support floor plan validation, room data extraction, SIA 416 area calculations, and validation reporting.

For the prototype/demo, data is stored as JSON files in the `data/` directory. In production, this would be backed by PostgreSQL + PostGIS.

---

## Entity Relationship Diagram

```
User
  ↓ (creates)
Project
  ↓ (contains)
Document
  ├─→ ValidationResult (many)
  ├─→ Room (many)
  └─→ AreaSummary (one)
```

---

## 1. User

Represents a platform user (BBL staff, external planner, admin).

### Schema

```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // Unique email address
  name: string;                  // Full name
  role: 'admin' | 'staff' | 'external';
  organization?: string;         // Company/department name
  createdAt: string;            // ISO 8601 datetime
  lastLoginAt?: string;         // ISO 8601 datetime
}
```

### Example JSON

```json
{
  "id": "usr_550e8400-e29b-41d4-a716-446655440000",
  "email": "max.muster@bbl.admin.ch",
  "name": "Max Muster",
  "role": "staff",
  "organization": "BBL Flächenmanagement",
  "createdAt": "2022-01-15T09:30:00Z",
  "lastLoginAt": "2025-01-07T14:22:00Z"
}
```

### Business Rules

- Email must be unique
- Role determines access permissions:
  - **admin**: Full access, user management
  - **staff**: BBL internal, can view all projects
  - **external**: Planners/architects, can only see own projects
- In production, integrate with Swiss eIAM for authentication

---

## 2. Project (Auftrag)

Represents a building project containing one or more floor plan documents.

### Schema

```typescript
interface Project {
  id: string;                    // UUID
  projectNumber: string;         // Unique project number (e.g., "1234/AA.001")
  name: string;                  // Project name
  location: string;              // City/location
  siaPhase: '51' | '52' | '53';  // SIA phase code
  status: 'active' | 'completed' | 'archived';
  createdAt: string;             // ISO 8601 datetime
  completedAt?: string;          // ISO 8601 datetime
  createdBy: string;             // User ID reference
  buildingImageUrl?: string;     // Optional building photo URL
  completionPercentage: number;  // 0-100, calculated from documents
  documentCount: number;         // Total documents in project
  metadata?: ProjectMetadata;    // Additional project data
}

interface ProjectMetadata {
  address?: string;
  buildingType?: string;         // e.g., "office", "residential"
  totalFloors?: number;
  constructionYear?: number;
  architectFirm?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
}
```

### Example JSON

```json
{
  "id": "prj_123e4567-e89b-12d3-a456-426614174000",
  "projectNumber": "1234/AA.001",
  "name": "Bern, Verwaltungsgebäude Liebefeld",
  "location": "Bern",
  "siaPhase": "53",
  "status": "active",
  "createdAt": "2022-04-14T08:00:00Z",
  "completedAt": null,
  "createdBy": "usr_550e8400-e29b-41d4-a716-446655440000",
  "buildingImageUrl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
  "completionPercentage": 95,
  "documentCount": 14,
  "metadata": {
    "address": "Ostermundigenstrasse 51, 3003 Bern",
    "buildingType": "office",
    "totalFloors": 6,
    "constructionYear": 2019,
    "architectFirm": "Beispiel Architekten AG",
    "contactEmail": "projekt@beispiel.ch",
    "contactPhone": "+41 31 123 45 67",
    "notes": "Phase 53 - Ausführungsprojekt"
  }
}
```

### Business Rules

- `projectNumber` must be unique
- `completionPercentage` is calculated as: `(sum of document validation scores) / (document count)`
- SIA Phase codes:
  - **51**: Vorprojekt (Preliminary Project)
  - **52**: Bauprojekt (Construction Project)
  - **53**: Ausführungsprojekt (Execution Project)
- Auto-archive after 30 days when `status = 'completed'`

---

## 3. Document

Represents an uploaded DWG/DXF floor plan or Excel room list.

### Schema

```typescript
interface Document {
  id: string;                    // UUID
  projectId: string;             // Foreign key to Project
  filename: string;              // Original filename
  fileType: 'DWG' | 'DXF' | 'XLSX';
  fileSize: number;              // Bytes
  filePath: string;              // Storage path or URL
  uploadedAt: string;            // ISO 8601 datetime
  uploadedBy: string;            // User ID reference
  lastModifiedAt: string;        // ISO 8601 datetime
  lastModifiedBy: string;        // User ID reference
  validationStatus: 'pending' | 'processing' | 'completed' | 'failed';
  validationScore: number;       // 0-100, percentage of passing rules
  validationCompletedAt?: string; // ISO 8601 datetime
  metadata?: DocumentMetadata;
}

interface DocumentMetadata {
  originalFilename?: string;
  mimeType?: string;
  version?: number;              // Document version number
  floor?: string;                // Floor level (e.g., "EG", "1.OG")
  scale?: string;                // Drawing scale (e.g., "1:100")
  drawingDate?: string;          // Date on original drawing
  revisionNumber?: string;       // Revision code
  checksum?: string;             // File hash for integrity
}
```

### Example JSON

```json
{
  "id": "doc_789e4567-e89b-12d3-a456-426614174111",
  "projectId": "prj_123e4567-e89b-12d3-a456-426614174000",
  "filename": "Flächenplan_EG_validated.dwg",
  "fileType": "DWG",
  "fileSize": 2847392,
  "filePath": "/uploads/2022/06/doc_789e4567.dwg",
  "uploadedAt": "2022-06-17T12:30:00Z",
  "uploadedBy": "usr_550e8400-e29b-41d4-a716-446655440000",
  "lastModifiedAt": "2022-06-27T10:45:00Z",
  "lastModifiedBy": "usr_550e8400-e29b-41d4-a716-446655440000",
  "validationStatus": "completed",
  "validationScore": 95,
  "validationCompletedAt": "2022-06-17T12:35:00Z",
  "metadata": {
    "originalFilename": "Verwaltungsgebäude_EG_Rev03.dwg",
    "mimeType": "application/acad",
    "version": 3,
    "floor": "EG",
    "scale": "1:100",
    "drawingDate": "2022-06-15",
    "revisionNumber": "Rev03",
    "checksum": "sha256:a3b2c1d4..."
  }
}
```

### Business Rules

- `validationScore` is calculated as: `(passing rules) / (total rules) * 100`
- Status transitions:
  - `pending` → `processing` → `completed` | `failed`
- Only DWG/DXF files are validated (XLSX room lists are for cross-reference)
- File size limit: 50 MB (configurable)

---

## 4. ValidationResult

Represents a single validation rule result (error, warning, or info).

### Schema

```typescript
interface ValidationResult {
  id: string;                    // UUID
  documentId: string;            // Foreign key to Document
  ruleCode: string;              // Rule identifier (e.g., "LAYER_001")
  ruleName: string;              // Human-readable rule name
  severity: 'error' | 'warning' | 'info';
  message: string;               // Detailed error message
  category: ValidationCategory;  // Rule category
  location?: ValidationLocation; // Spatial location if applicable
  entityHandle?: string;         // DWG entity handle
  layerName?: string;            // Layer where error occurred
  createdAt: string;             // ISO 8601 datetime
  metadata?: ValidationMetadata;
}

type ValidationCategory =
  | 'layer'          // Layer validation
  | 'geometry'       // Geometry/polyline validation
  | 'entity'         // Entity type validation
  | 'text'           // Text/font validation
  | 'aoid'           // AOID validation
  | 'structure'      // Drawing structure
  | 'area';          // Area calculation

interface ValidationLocation {
  x: number;                     // X coordinate in drawing units
  y: number;                     // Y coordinate in drawing units
  z?: number;                    // Z coordinate (should be 0)
}

interface ValidationMetadata {
  expectedValue?: string | number;
  actualValue?: string | number;
  affectedCount?: number;        // Number of affected entities
  autoFixable?: boolean;         // Can be auto-corrected?
  documentationUrl?: string;     // Link to BBL CAD guideline
}
```

### Example JSON

```json
{
  "id": "val_987e4567-e89b-12d3-a456-426614174222",
  "documentId": "doc_789e4567-e89b-12d3-a456-426614174111",
  "ruleCode": "POLY_003",
  "ruleName": "Polyline Closure Check",
  "severity": "error",
  "message": "Room polygon is not closed in room 1.04",
  "category": "geometry",
  "location": {
    "x": 125.5,
    "y": 340.2,
    "z": 0
  },
  "entityHandle": "1A3F",
  "layerName": "Raum_Nutzfläche",
  "createdAt": "2022-06-17T12:35:12Z",
  "metadata": {
    "expectedValue": "closed",
    "actualValue": "open (gap: 0.15m)",
    "affectedCount": 1,
    "autoFixable": true,
    "documentationUrl": "https://bbl.admin.ch/cad-richtlinie#polylines"
  }
}
```

### Business Rules

- **Severity Levels:**
  - `error`: Must be fixed, prevents CAFM import
  - `warning`: Should be reviewed, may cause issues
  - `info`: Informational, no action required
- Validation rules are defined in `validation-rules.json` (see below)
- Rule codes follow pattern: `{CATEGORY}_{NUMBER}` (e.g., `LAYER_001`, `AOID_003`)

### Validation Rule Catalog

Common validation rules (see `requirements.md` FR-5 for complete list):

| Code | Category | Description | Severity |
|------|----------|-------------|----------|
| `LAYER_001` | layer | Required layer missing | error |
| `LAYER_002` | layer | Layer color mismatch | warning |
| `LAYER_003` | layer | Unexpected layer found | warning |
| `POLY_001` | geometry | Room area below minimum (0.25 m²) | warning |
| `POLY_002` | geometry | Self-intersecting polygon | error |
| `POLY_003` | geometry | Polyline not closed | error |
| `GEOM_001` | geometry | Z-coordinate not zero | error |
| `GEOM_002` | geometry | Polyline width not zero | warning |
| `ENTITY_001` | entity | Forbidden entity type (SPLINE, ELLIPSE) | error |
| `TEXT_001` | text | Font is not Arial | error |
| `TEXT_002` | text | Text color not BYLAYER | warning |
| `AOID_001` | aoid | AOID format invalid | error |
| `AOID_002` | aoid | Duplicate AOID | error |
| `AOID_003` | aoid | AOID not in room polygon | warning |
| `AOID_004` | aoid | AOID not in Excel room list | warning |
| `STRUCT_001` | structure | External reference (XREF) found | warning |
| `AREA_001` | area | Area calculation mismatch | warning |

---

## 5. Room

Represents an extracted room from a floor plan.

### Schema

```typescript
interface Room {
  id: string;                    // UUID
  documentId: string;            // Foreign key to Document
  aoid: string;                  // AOID code (e.g., "2011.DM.04.045")
  xao?: string;                  // Room type code (e.g., "1.01")
  area: number;                  // Calculated area in m²
  areaGross?: number;            // Gross area (AREA_GRO) in m²
  areaReduced?: number;          // Reduced area (AREA_RED) in m²
  functionCode?: string;         // AOFUNCTI code
  functionName?: string;         // Human-readable function
  comment?: string;              // AOUSCOM comment
  polygon: GeoJSONPolygon;       // Room geometry
  validationStatus: 'valid' | 'warning' | 'error';
  metadata?: RoomMetadata;
}

interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];     // GeoJSON format: [[[x,y], [x,y], ...]]
}

interface RoomMetadata {
  layerName?: string;
  boundingBox?: BoundingBox;
  centroid?: { x: number; y: number };
  perimeter?: number;            // In meters
  height?: number;               // Room height in meters
  volume?: number;               // Calculated volume in m³
  occupancy?: number;            // Expected occupancy count
  equipment?: string[];          // List of equipment/furniture
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
```

### Example JSON

```json
{
  "id": "room_456e4567-e89b-12d3-a456-426614174333",
  "documentId": "doc_789e4567-e89b-12d3-a456-426614174111",
  "aoid": "2011.DM.04.045",
  "xao": "1.01",
  "area": 24.45,
  "areaGross": 25.00,
  "areaReduced": 23.90,
  "functionCode": "1.2",
  "functionName": "Büroraum",
  "comment": "Einzelbüro mit Fenster",
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [50.0, 50.0],
        [75.0, 50.0],
        [75.0, 60.0],
        [50.0, 60.0],
        [50.0, 50.0]
      ]
    ]
  },
  "validationStatus": "valid",
  "metadata": {
    "layerName": "Raum_Nutzfläche",
    "boundingBox": {
      "minX": 50.0,
      "minY": 50.0,
      "maxX": 75.0,
      "maxY": 60.0
    },
    "centroid": {
      "x": 62.5,
      "y": 55.0
    },
    "perimeter": 50.0,
    "height": 2.8,
    "volume": 68.46,
    "occupancy": 1,
    "equipment": ["desk", "chair", "cabinet"]
  }
}
```

### Business Rules

- `aoid` must match regex: `^\d{4}\.[A-Z]{2}\.\d{2}\.\d{3}$`
- `area` is calculated from polygon geometry using Shapely
- Function codes follow DIN 277 / SIA 416 classification
- Polygon must be:
  - Closed (first point = last point)
  - Non-self-intersecting
  - Counter-clockwise winding order

---

## 6. AreaSummary

Represents aggregated SIA 416 area calculations for a document.

### Schema

```typescript
interface AreaSummary {
  id: string;                    // UUID
  documentId: string;            // Foreign key to Document
  gf: number;                    // Geschossfläche (total floor area)
  ngf: number;                   // Nettogeschossfläche (net floor area)
  hnf: number;                   // Hauptnutzfläche (main usable area)
  nnf: number;                   // Nebennutzfläche (secondary area)
  vf: number;                    // Verkehrsfläche (circulation area)
  ff: number;                    // Funktionsfläche (functional area)
  kf: number;                    // Konstruktionsfläche (construction area)
  gv?: number;                   // Gebäudevolumen (building volume)
  gvOg?: number;                 // Volume above ground
  gvUg?: number;                 // Volume below ground
  roomCount: number;             // Total rooms
  calculatedAt: string;          // ISO 8601 datetime
  breakdown: AreaBreakdown;      // Detailed breakdown
  ratios: AreaRatios;            // Efficiency ratios
}

interface AreaBreakdown {
  din277: DIN277Breakdown;       // DIN 277 classification
  sia416: SIA416Breakdown;       // SIA 416 classification
}

interface DIN277Breakdown {
  hnf1: number;                  // Wohnen und Aufenthalt
  hnf2: number;                  // Büroarbeit
  hnf3: number;                  // Produktion, Hand- und Maschinenarbeit
  hnf4: number;                  // Lagern, Verteilen und Verkaufen
  hnf5: number;                  // Bildung, Unterricht und Kultur
  hnf6: number;                  // Heilen und Pflegen
  hnf7: number;                  // Sonstige Nutzflächen
  ff8: number;                   // Technische Anlagen
  vf9: number;                   // Verkehrserschließung und -sicherung
}

interface SIA416Breakdown {
  nf: number;                    // Nutzfläche (HNF + NNF)
  vmf: number;                   // Verkehrs- und Montagefläche (VF + NNF)
}

interface AreaRatios {
  hnfGfRatio: number;            // HNF/GF (efficiency)
  nnfGfRatio: number;            // NNF/GF
  vfGfRatio: number;             // VF/GF
  vmfGfRatio: number;            // VMF/GF (VF+NNF)
  kfGfRatio: number;             // KF/GF
}
```

### Example JSON

```json
{
  "id": "area_111e4567-e89b-12d3-a456-426614174444",
  "documentId": "doc_789e4567-e89b-12d3-a456-426614174111",
  "gf": 4500.0,
  "ngf": 4000.0,
  "hnf": 3200.0,
  "nnf": 400.0,
  "vf": 300.0,
  "ff": 100.0,
  "kf": 500.0,
  "gv": 16848.0,
  "gvOg": 14500.0,
  "gvUg": 2348.0,
  "roomCount": 22,
  "calculatedAt": "2022-06-17T12:35:15Z",
  "breakdown": {
    "din277": {
      "hnf1": 850.0,
      "hnf2": 1200.0,
      "hnf3": 0.0,
      "hnf4": 150.0,
      "hnf5": 500.0,
      "hnf6": 300.0,
      "hnf7": 200.0,
      "ff8": 100.0,
      "vf9": 300.0
    },
    "sia416": {
      "nf": 3600.0,
      "vmf": 700.0
    }
  },
  "ratios": {
    "hnfGfRatio": 0.71,
    "nnfGfRatio": 0.09,
    "vfGfRatio": 0.07,
    "vmfGfRatio": 0.16,
    "kfGfRatio": 0.11
  }
}
```

### Business Rules

- **SIA 416 Relationships:**
  - `GF = NGF + KF`
  - `NGF = NF + VF + FF`
  - `NF = HNF + NNF`
  - `VMF = VF + NNF` (Verkehrs- und Montagefläche)
- **DIN 277 Relationships:**
  - `HNF = HNF1 + HNF2 + HNF3 + HNF4 + HNF5 + HNF6 + HNF7`
- Area calculations must match room polygon sums
- Ratios are expressed as decimals (0-1), multiply by 100 for percentage

---

## Additional Data Structures

### 7. ValidationRuleCatalog

Configuration file defining all validation rules.

```typescript
interface ValidationRuleCatalog {
  version: string;               // Catalog version
  lastUpdated: string;           // ISO 8601 datetime
  rules: ValidationRule[];
}

interface ValidationRule {
  code: string;                  // Rule code (e.g., "LAYER_001")
  name: string;                  // Rule name
  category: ValidationCategory;
  severity: 'error' | 'warning' | 'info';
  description: string;           // Detailed description
  requirement: string;           // BBL CAD guideline requirement
  autoFixable: boolean;
  documentationUrl?: string;
  parameters?: Record<string, any>; // Rule-specific parameters
}
```

### 8. BBL Layer Definition

Configuration for required BBL CAD layers.

```typescript
interface BBLLayerCatalog {
  version: string;
  layers: BBLLayer[];
}

interface BBLLayer {
  name: string;                  // Layer name
  colorIndex: number;            // AutoCAD color index
  rgb: string;                   // RGB hex code
  lineWeight: number;            // Line weight
  lineType: string;              // Line type (CONTINUOUS, DASHED, etc.)
  purpose: string;               // Layer purpose description
  required: boolean;             // Is layer mandatory?
  entities?: string[];           // Allowed entity types
}
```

Example:
```json
{
  "version": "2.1",
  "layers": [
    {
      "name": "Architecture_Wände",
      "colorIndex": 7,
      "rgb": "#FFFFFF",
      "lineWeight": 0.5,
      "lineType": "CONTINUOUS",
      "purpose": "Exterior and interior walls",
      "required": true,
      "entities": ["LINE", "POLYLINE", "LWPOLYLINE"]
    }
  ]
}
```

---

## JSON File Structure for Demo

The demo will use the following JSON files in the `data/` directory:

```
data/
├── users.json                 # Array of User objects
├── projects.json              # Array of Project objects
├── documents.json             # Array of Document objects
├── validation-results.json    # Array of ValidationResult objects
├── rooms.json                 # Array of Room objects
├── area-summaries.json        # Array of AreaSummary objects
├── validation-rules.json      # ValidationRuleCatalog
└── bbl-layers.json            # BBLLayerCatalog
```

### Root-level Collections

Each JSON file contains an array of objects:

```json
{
  "version": "1.0",
  "lastUpdated": "2025-01-07T15:00:00Z",
  "data": [
    { /* object 1 */ },
    { /* object 2 */ },
    { /* object 3 */ }
  ]
}
```

---

## Data Relationships

### Foreign Key References

All relationships use UUID strings:

- `Project.createdBy` → `User.id`
- `Document.projectId` → `Project.id`
- `Document.uploadedBy` → `User.id`
- `ValidationResult.documentId` → `Document.id`
- `Room.documentId` → `Document.id`
- `AreaSummary.documentId` → `Document.id`

### Indexing Strategy (for Production DB)

Recommended indexes:
- `users(email)` - unique
- `projects(projectNumber)` - unique
- `projects(status)` - for filtering
- `documents(projectId)` - foreign key
- `documents(validationStatus)` - for filtering
- `validation_results(documentId, severity)` - composite
- `rooms(documentId)` - foreign key
- `rooms(aoid)` - for AOID lookups
- `area_summaries(documentId)` - foreign key, unique

---

## Data Validation Rules

### Required Fields

All entities must have:
- `id` (UUID)
- Timestamps (`createdAt`, `uploadedAt`, etc.)

### Data Types

- **UUIDs**: Use UUID v4 format
- **Dates**: ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- **Numbers**: All area/volume values in metric units (m², m³)
- **Coordinates**: Drawing units (typically meters)
- **Percentages**: Stored as decimals (0-1), not integers (0-100)

### Constraints

- `validationScore`: 0-100
- `completionPercentage`: 0-100
- `siaPhase`: Only "51", "52", "53"
- `role`: Only "admin", "staff", "external"
- `fileType`: Only "DWG", "DXF", "XLSX"
- `validationStatus`: Only "pending", "processing", "completed", "failed"
- `severity`: Only "error", "warning", "info"

---

## API Data Transfer

### REST Endpoints

Data is exchanged via JSON in REST API calls:

```http
GET /api/projects
→ Returns: Project[]

GET /api/projects/{id}
→ Returns: Project & { documents: Document[] }

POST /api/documents/upload
→ Request: multipart/form-data (file + metadata)
→ Returns: Document

GET /api/documents/{id}/validation-results
→ Returns: ValidationResult[]

GET /api/documents/{id}/rooms
→ Returns: Room[]

GET /api/documents/{id}/area-summary
→ Returns: AreaSummary
```

### Response Envelope

All API responses follow this structure:

```json
{
  "success": true,
  "data": { /* actual data */ },
  "meta": {
    "timestamp": "2025-01-07T15:30:00Z",
    "version": "1.0"
  },
  "error": null
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "meta": {
    "timestamp": "2025-01-07T15:30:00Z",
    "version": "1.0"
  },
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Document validation failed with 13 errors",
    "details": { /* error specifics */ }
  }
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-07 | Initial data model specification |

---

## References

- [requirements.md](requirements.md) - Functional requirements
- [SIA 416 Standard](https://www.sia.ch/de/dienstleistungen/sia-norm/sia-416/) - Area calculation methodology
- [DIN 277](https://www.din.de/de/mitwirken/normenausschuesse/nabau/veroeffentlichungen/wdc-beuth:din21:148242787) - Area and volume classifications
- [GeoJSON Specification](https://geojson.org/) - Polygon geometry format
