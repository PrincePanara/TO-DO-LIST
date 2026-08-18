# Repository Details: Qubeso To Do List (StudyForge)

**Repository Link:** [https://github.com/PrincePanara/TO-DO-LIST](https://github.com/PrincePanara/TO-DO-LIST)

## Overview
This repository contains a React-based Single Page Application (SPA) designed as an academic planner and management tool for students.

## Architecture & Tech Stack
- **Framework**: React 18, React Router v6
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## State Management
- **React Context API**: The app uses a global `StudyForgeContext` to manage the state for subjects, tasks, assignments, labs, projects, notes, and the timetable.
- **Data Persistence**: Currently, there is no backend or local storage implemented. The app state is volatile and initializes from mock data located in `src/data/seed.ts` on every reload.

## Core Features
1. **Dashboard**: Daily overview and activity tracking.
2. **Task & Subject Management**: Track coursework, priorities, and credits.
3. **Labs & Projects**: Multi-stage project and lab work tracking.
4. **Timetable**: Daily and weekly schedule views.
5. **Notes**: Integrated academic note-taking editor.
6. **Onboarding**: A mock setup flow (with the "Import Syllabus" section temporarily removed).

## Recent Changes
- Added Table injection and Symbols toolbar to Note Editor.
- Added Note collaboration via UID invites.
- Added PDF export feature using `html2pdf.js`.
- The "Import Your Syllabus" flow was temporarily removed from the active onboarding process (August 16, 2026). Users are now routed directly from profile setup to the dashboard.
