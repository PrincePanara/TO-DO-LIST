# Project Analysis: Qubeso To Do List (StudyForge)

## Project Overview
This project is a React-based Single Page Application (SPA) designed as an academic planner and management tool for students (branded as "StudyForge" internally, though recent changes refer to "Qubeso To Do List"). It allows students to manage subjects, tasks, assignments, lab work, projects, notes, and timetables. It functions primarily as a highly interactive frontend prototype or localized app utilizing React Context for state management and seeded mock data.

## Complete Folder Structure
```text
/Users/princepanara/To Do List
├── .eslintrc.cjs
├── .gitignore
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    ├── index.tsx
    ├── components/
    │   ├── classwork/
    │   ├── dashboard/
    │   ├── forms/
    │   ├── labs/
    │   ├── layout/
    │   ├── notes/
    │   ├── projects/
    │   ├── search/
    │   ├── subjects/
    │   ├── tasks/
    │   ├── timetable/
    │   └── ui/
    ├── contexts/
    │   ├── QuickAdd.tsx
    │   └── StudyForgeContext.tsx
    ├── data/
    │   └── seed.ts
    ├── pages/
    │   ├── onboarding/
    │   │   ├── Welcome.tsx
    │   │   ├── AcademicSetup.tsx
    │   │   ├── ImportSyllabus.tsx
    │   │   ├── PdfAnalysis.tsx
    │   │   └── DetectedSubjects.tsx
    │   ├── AssignmentDetail.tsx
    │   ├── Calendar.tsx
    │   ├── ClassWork.tsx
    │   ├── Dashboard.tsx
    │   ├── LabDetail.tsx
    │   ├── LabWork.tsx
    │   ├── NoteEditor.tsx
    │   ├── Notes.tsx
    │   ├── Notifications.tsx
    │   ├── Profile.tsx
    │   ├── Progress.tsx
    │   ├── ProjectDetail.tsx
    │   ├── Projects.tsx
    │   ├── Settings.tsx
    │   ├── Splash.tsx
    │   ├── SubjectWorkspace.tsx
    │   ├── Subjects.tsx
    │   ├── Tasks.tsx
    │   └── Timetable.tsx
    ├── types/
    │   └── index.ts
    └── utils/
        ├── date.ts
        ├── events.ts
        └── progress.ts
```

## Folder-by-Folder Analysis
- **`src/`**: The main source directory for the React application.
- **`src/components/`**: Modular, reusable React components divided by domain (tasks, subjects, dashboard) and generic UI elements (buttons, cards, modals).
- **`src/contexts/`**: Contains React Context providers for global state management (`StudyForgeContext` for main domain state, `QuickAdd` for a global quick-add modal).
- **`src/data/`**: Contains `seed.ts`, which holds the mock data used to initialize the application state.
- **`src/pages/`**: Contains the route-level components (screens) of the application, including a nested `onboarding` directory for the initial setup flow.
- **`src/types/`**: Contains TypeScript interface and type definitions (e.g., `Task`, `Subject`, `Project`) ensuring type safety across the app.
- **`src/utils/`**: Helper functions and shared logic (date formatting, progress calculation, event handling).

## File-by-File Analysis (Key Files)
- **`src/App.tsx`**: The root component that sets up React Router and wraps the application in the necessary Context Providers (`StudyForgeProvider`, `QuickAddProvider`).
- **`src/contexts/StudyForgeContext.tsx`**: The core state management hub. It maintains state for subjects, tasks, assignments, labs, projects, notes, and timetable. It exposes actions to mutate this state (e.g., `upsertTask`, `removeSubject`).
- **`src/types/index.ts`**: The central data dictionary defining all entities used in the app, such as `StudentProfile`, `ClassSlot`, `LabWork`, and their associated statuses/priorities.
- **`src/data/seed.ts`**: Provides initial dummy data for the context to render a fully populated application on startup.
- **`package.json`**: Defines dependencies (React, Framer Motion, Tailwind) and scripts (`dev`, `build`, `lint`).
- **`vite.config.ts`**: Configuration for the Vite bundler, utilizing the React plugin.

## Pages & Screens
The application has a comprehensive set of routes:
- **Onboarding Flow**: Splash → Welcome → Setup → Import → Analysis → Review. This simulates setting up the user's academic profile and parsing a syllabus PDF.
- **Main App Shell**: 
  - **Dashboard**: Overview of today's schedule, pending tasks, and recent activity.
  - **Tasks, Subjects, Notes, Projects, Labs**: Dedicated CRUD and list views for each entity type.
  - **Timetable & Calendar**: Visual representations of the student's schedule.
  - **Profile, Progress, Notifications, Settings**: User and app management pages.

## Components
Components are highly modularized:
- **`ui/`**: Low-level generic components (Buttons, Cards, Inputs, Skeletons).
- **`layout/`**: Structural components like `AppShell` (sidebar, header) and `OnboardingShell`.
- **Domain Components**: Specific feature blocks like a project status card, a note editor toolbar, or a timetable grid cell.

## Features & Functionality
- **Academic Setup & Syllabus Parsing**: Simulates importing a PDF and extracting subjects.
- **Task Management**: Create, edit, toggle, and filter tasks with priorities and categories.
- **Subject Management**: Track credits, teachers, and related coursework.
- **Lab & Project Tracking**: Manage multi-stage projects (Idea → Testing → Completed) and laboratory records.
- **Timetable**: View daily and weekly class schedules.
- **Notes**: A dedicated editor for taking academic notes.

## Data Flow
User interactions occur in the **Pages/Components**, which dispatch actions provided by the `useStudyForge()` custom hook. The `StudyForgeProvider` updates its internal `useState` hooks, triggering a re-render of the relevant components with the new data.

## Authentication
Currently, there is **no authentication system** implemented. The user is assumed to be authenticated, and state is initialized directly from seed data.

## API/Backend Integration
There is **no active backend integration**. All data operations (CRUD) are performed in-memory via React state in `StudyForgeContext`. 

## State Management
State is entirely managed by **React Context API** (`StudyForgeContext`). It uses multiple `useState` hooks to manage different slices of data (tasks, subjects, profile) and provides a combined `value` object containing both state and mutator functions.

## UI/UX Structure
- **Framework**: Tailwind CSS is used for utility-first styling.
- **Animations**: `framer-motion` is used extensively for page transitions and micro-interactions (e.g., list item reveal animations in `Welcome.tsx`).
- **Icons**: `lucide-react` provides consistent, scalable iconography.
- **Design Language**: Features a modern, slightly brutalist or high-contrast aesthetic with custom fonts (referenced via Tailwind classes like `font-display`, `bg-brand`, `border-ink`).

## Assets
- The project relies on SVG icons from `lucide-react` rather than static image files.
- Custom fonts or external assets are likely linked in `index.html` or `index.css`.

## Configuration Files
- **`tailwind.config.js`**: Customizes the Tailwind theme (colors, fonts, extensions).
- **`vite.config.ts`**: Standard Vite React setup.
- **`tsconfig.json` & `tsconfig.node.json`**: TypeScript compiler configurations for the browser and Node environments, respectively.
- **`.eslintrc.cjs`**: Linting rules to enforce code quality.

## Dependencies
- **Core**: React 18, React Router v6.
- **Styling**: Tailwind CSS, Tailwind Merge.
- **Animation**: Framer Motion.
- **Utilities**: Date-fns (date manipulation).
- **Icons**: Lucide React.

## Routing
Routing is handled by `react-router-dom` in `App.tsx`:
- Unauthenticated/Onboarding routes (`/`, `/welcome`, `/setup`, etc.)
- Authenticated app routes nested under `/app` using `<AppShell />` as a layout wrapper (e.g., `/app/dashboard`).

## Existing Architecture
The architecture is a standard **Frontend-only React SPA**. It follows a standard component-based structure, separating global state (contexts), static data (data), page wrappers (pages), and reusable pieces (components).

## Important Implementation Details
- **Idempotent Updates**: State updates use a custom `replaceOrAppend` utility to handle upserts elegantly based on object IDs.
- **Fake Loading States**: The onboarding flow (like `PdfAnalysis.tsx`) uses `setInterval` to simulate processing time before routing the user to the next step.

## Current Project Behavior
When the development server runs, the user is presented with the Splash/Welcome screens. They can navigate through the onboarding flow and enter the main application, which is pre-populated with mock data. They can interact with the app fully, but changes will be lost upon a hard page reload since there is no persistent storage.

## Dependencies Between Files
- **Pages** depend heavily on `src/components/*` and `src/contexts/StudyForgeContext`.
- **Context** depends on `src/types/index` and `src/data/seed`.
- **Components** depend on `src/types/index` and `lucide-react`.

## Potential Issues / Observations
1. **Volatile State**: Because state is kept only in React state variables inside the Context Provider, any page refresh will reset the app back to the initial `seed.ts` data. Implementing `localStorage` or a backend is required for persistence.
2. **Context Performance**: `StudyForgeContext` holds a large amount of data (subjects, tasks, labs, etc.). Frequent updates to one slice of state (e.g., toggling a task) will cause a re-render of all components consuming `useStudyForge()`, which could lead to performance bottlenecks if the app grows. Splitting contexts by domain might be necessary in the future.
3. **Mocked Features**: Features like PDF Syllabus analysis are entirely mocked on the frontend.

## Overall Project Understanding
The project is a beautifully designed, functional prototype of a student productivity application. It effectively demonstrates the UI/UX and core features (task tracking, timetable, subjects) using local state and seed data. It is well-structured and uses modern React patterns (Context, Hooks, React Router 6), making it ready to be integrated with a real backend or local persistent storage.
