# Multi-Step Wizard Infrastructure - File Structure

## Directory Tree

```
/frontend/src/components/patients/wizard/
│
├── Core Components
│   ├── FormContext.tsx              # State management (React Context)
│   ├── MultiStepWizard.tsx          # Main wizard container
│   ├── ProgressIndicator.tsx        # Visual progress tracking
│   └── SectionNavigator.tsx         # Sidebar navigation
│
├── Utilities
│   ├── ValidationUtils.ts           # Validation functions
│   └── index.ts                     # Public API exports
│
├── Section Components
│   └── sections/
│       └── Section10Review.tsx      # Review & submit section
│
├── Examples & Documentation
│   ├── ExampleWizardUsage.tsx       # Complete integration example
│   ├── README.md                    # Full documentation
│   ├── MIGRATION_GUIDE.md           # Migration from old form
│   └── STRUCTURE.md                 # This file
│
└── Existing Sections (in ../form/sections/)
    ├── Section1CenterType.tsx
    ├── Section2Identity.tsx
    ├── Section3ClinicalData.tsx
    ├── Section4Diagnostics.tsx
    ├── Section5Diagnosis.tsx
    ├── Section6Staging.tsx
    ├── Section7CPCConference.tsx
    ├── Section8Treatment.tsx
    └── Section9FollowUp.tsx
```

## Component Hierarchy

```
App
└── FormProvider                          [State Container]
    └── MultiStepWizard                   [Main Wizard]
        ├── Auto-save Indicator           [UI: Fixed position]
        ├── SectionNavigator              [UI: Sidebar]
        │   ├── Progress Summary
        │   ├── Section List
        │   │   ├── Section 1 ✓
        │   │   ├── Section 2 ✓
        │   │   ├── Section 3 → (current)
        │   │   └── ...
        │   └── Legend
        │
        └── Main Content Area
            ├── Section Header
            ├── Validation Errors (if any)
            ├── Current Section Component
            │   └── Section3ClinicalData   [Dynamic]
            │       ├── Form Fields
            │       └── Field-level Errors
            └── Navigation Buttons
                ├── Previous
                ├── Save Draft
                └── Next / Submit
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FormContext                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  State: { section1: {...}, section2: {...}, ... }    │  │
│  │  Methods: updateSection, updateField, saveDraft       │  │
│  │  Auto-save: localStorage + optional API               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ provides
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MultiStepWizard                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Controls:                                            │  │
│  │  - Current section index                              │  │
│  │  - Navigation (next/previous/jump)                    │  │
│  │  - Validation triggering                              │  │
│  │  - Section completion tracking                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
       │                    │                    │
       │ renders            │ renders            │ renders
       ▼                    ▼                    ▼
┌─────────────┐   ┌──────────────────┐   ┌────────────────┐
│  Navigator  │   │ Current Section  │   │  Navigation    │
│  Sidebar    │   │   Component      │   │   Buttons      │
└─────────────┘   └──────────────────┘   └────────────────┘
                           │
                           │ receives props
                           ▼
                  ┌──────────────────┐
                  │   SectionProps   │
                  │  - data          │
                  │  - updateField   │
                  │  - errors        │
                  │  - isActive      │
                  └──────────────────┘
```

## Validation Flow

```
User fills field
       │
       ▼
updateField() triggered
       │
       ▼
FormContext updates state
       │
       ▼
isDirty = true
       │
       ▼
Auto-save timer starts (2 min)
       │
       ▼
User clicks "Next"
       │
       ▼
validateCurrentSection() called
       │
       ├─── validates field-level
       │
       ├─── validates section-level
       │
       └─── validates cross-section
               │
               ├─── Valid?
               │      │
               │      ├─── Yes → Mark complete, go to next section
               │      │
               │      └─── No → Display errors, stay on current section
               │
               └─── Auto-save triggers (if 2 min elapsed)
```

## File Responsibilities

### FormContext.tsx (379 lines)
**Purpose**: Centralized state management for entire form

**Exports**:
- `FormProvider` - Context provider component
- `useFormContext()` - Hook to access form state
- `useSectionData(sectionId)` - Hook for section-scoped access

**Features**:
- Section-based data storage
- Auto-save to localStorage
- Optional API auto-save
- Change tracking (isDirty)
- Draft management (save/load/clear)
- Unsaved changes warning

---

### MultiStepWizard.tsx (457 lines)
**Purpose**: Main wizard container and orchestration

**Exports**:
- `MultiStepWizard` - Main component
- `Section` - Section configuration interface
- `SectionProps` - Section component props interface

**Features**:
- Section navigation
- Progress tracking
- Auto-save integration
- Validation triggering
- Conditional section rendering
- Loading states
- Sidebar integration
- Submit handling

---

### ValidationUtils.ts (580 lines)
**Purpose**: Comprehensive validation functions

**Exports**:
- Field validators: `validateEmail`, `validateNIK`, `validatePhoneNumber`, etc.
- Section validators: `validateSection1` through `validateSection9`
- Cross-section: `validateCrossSections`, `validateAllSections`

**Features**:
- Indonesian-specific validators (NIK, phone)
- Medical field validators (Karnofsky score)
- Date validation with range checking
- Number validation with bounds
- String length validation
- Conditional validation based on pathology type

---

### ProgressIndicator.tsx (296 lines)
**Purpose**: Visual progress tracking components

**Exports**:
- `ProgressIndicator` - Full-featured progress display
- `LinearProgress` - Simple linear bar
- `StepDots` - Minimalist dot indicators

**Variants**:
- `default` - Full featured with step cards
- `compact` - Horizontal step pills
- `minimal` - Just bar and percentage

**Features**:
- Visual progress bar
- Section completion status
- Error indicators
- Current section highlight
- Percentage display
- Responsive design

---

### SectionNavigator.tsx (219 lines)
**Purpose**: Sidebar navigation for sections

**Exports**:
- `SectionNavigator` - Full sidebar
- `CompactSectionNavigator` - Mobile-friendly compact version

**Features**:
- Clickable section list
- Visual status indicators (✓ completed, → current, ⚠️ error)
- Progress summary
- Optional sections marked
- Error count display
- Status legend
- Accessible navigation

---

### Section10Review.tsx (335 lines)
**Purpose**: Final review section before submission

**Features**:
- Expandable/collapsible sections
- Data completeness indicators
- Field-by-field review
- Visual organization by section
- Empty state handling
- Warning messages
- Data quality scoring

---

### ExampleWizardUsage.tsx (244 lines)
**Purpose**: Complete integration example

**Includes**:
- Section definitions
- Validation integration
- Form submission handling
- Draft saving
- Data transformation
- Error handling
- Complete working example

---

### index.ts (62 lines)
**Purpose**: Public API exports

**Exports**: All public interfaces, components, hooks, and utilities

---

### README.md (630 lines)
**Purpose**: Complete documentation

**Sections**:
- Quick start guide
- Component usage
- Validation system
- State management
- Auto-save configuration
- Progress tracking
- Navigation
- Styling
- Accessibility
- TypeScript types
- Best practices
- Troubleshooting

---

### MIGRATION_GUIDE.md (440 lines)
**Purpose**: Guide for migrating from old form

**Sections**:
- Benefits of migration
- Step-by-step migration
- Data structure comparison
- Common issues and solutions
- Gradual migration strategy
- Testing checklist
- Rollback plan

---

## Integration Points

### With Existing Form Sections
The wizard can use existing section components from `../form/sections/`:
- Section1CenterType.tsx
- Section2Identity.tsx
- Section3ClinicalData.tsx
- Section4Diagnostics.tsx
- Section5Diagnosis.tsx
- Section6Staging.tsx
- Section7CPCConference.tsx
- Section8Treatment.tsx
- Section9FollowUp.tsx

**Note**: These may need props adaptation (see MIGRATION_GUIDE.md)

### With Backend API
Integration points:
1. `onComplete` - Final submission to patient API
2. `onAutoSave` - Optional API auto-save
3. Draft loading on mount

### With Routing
After submission, can redirect to:
- Patient detail page: `/patients/{id}`
- Patient list: `/patients`
- Follow-up entry: `/patients/{id}/follow-up`

## State Persistence

### LocalStorage
**Key**: `tumor-registry-patient-form` (configurable)

**Stored Data**:
```json
{
  "data": {
    "section1": { "centerId": "...", "pathologyType": "..." },
    "section2": { "name": "...", "nik": "..." },
    ...
  },
  "timestamp": "2025-12-12T10:30:00.000Z",
  "validation": {
    "section1": { "isValid": true, "errors": [] },
    ...
  }
}
```

### Optional API Persistence
Can implement backend draft saving via `onAutoSave` prop.

## Styling System

### Tailwind Classes Used
- **Colors**: `blue-*` (primary), `green-*` (success), `red-*` (error), `gray-*` (neutral)
- **Spacing**: 4px grid system (`space-4`, `p-6`, `mb-8`)
- **Typography**: `text-sm`, `text-lg`, `font-medium`, `font-bold`
- **Layout**: `flex`, `grid`, `space-x-*`, `gap-*`
- **Responsive**: `sm:`, `md:`, `lg:` breakpoints

### Customization Points
- Component `className` props
- Tailwind config extension
- CSS custom properties
- Theme provider (if using one)

## Performance Considerations

### Auto-Save Optimization
- Default 2-minute interval prevents API flooding
- Only saves when `isDirty` flag is true
- Debounced to prevent rapid successive saves

### Render Optimization
- Section components only render when active
- React Context prevents unnecessary re-renders
- Validation runs only on navigation

### Bundle Size
Total estimated size: ~15KB gzipped
- FormContext: ~3KB
- MultiStepWizard: ~4KB
- ValidationUtils: ~5KB
- Other components: ~3KB

## Accessibility Features

### ARIA Labels
- `aria-current="step"` on current section
- `aria-label` on navigation buttons
- `role="navigation"` on sidebar

### Keyboard Navigation
- Tab through form fields
- Enter to submit
- Arrow keys in sidebar (future enhancement)

### Screen Readers
- Section status announcements
- Error message associations
- Progress updates

## Future Enhancements Roadmap

### Phase 2
- [ ] Field-level auto-save (immediate)
- [ ] Offline mode with sync queue
- [ ] Multi-language support (i18n)
- [ ] Enhanced analytics integration

### Phase 3
- [ ] Collaborative editing
- [ ] PDF export of review
- [ ] Email draft link
- [ ] Mobile app integration

### Phase 4
- [ ] AI-assisted form completion
- [ ] Voice input support
- [ ] Advanced accessibility features
- [ ] Custom theme support

---

**Structure Version**: 1.0
**Last Updated**: December 2025
**Total Files**: 10 (4 components, 1 utility, 1 section, 1 example, 3 docs)
