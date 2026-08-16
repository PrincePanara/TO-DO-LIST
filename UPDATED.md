# Project Updates

## Syllabus Import Section Temporarily Removed

**Date**: August 16, 2026

**Summary**: 
The "Import Your Syllabus" section has been temporarily commented out and removed from the active onboarding flow of the application. 

**Details**:
- In `src/pages/onboarding/AcademicSetup.tsx`, the routing now skips the `/import` page and navigates the user directly to `/app/dashboard` after the initial profile setup. The "Next up" info card regarding syllabus import was also hidden.
- In `src/App.tsx`, the routes pointing to `/import`, `/import/analyze`, and `/import/review` have been commented out to prevent direct navigation to those pages.

These changes were made as requested, keeping the component files intact but inaccessible for the time being.
