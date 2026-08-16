import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StudyForgeProvider } from './contexts/StudyForgeContext';
import { QuickAddProvider } from './contexts/QuickAdd';
import { AppShell } from './components/layout/AppShell';
import { Splash } from './pages/Splash';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Welcome } from './pages/onboarding/Welcome';
import { AcademicSetup } from './pages/onboarding/AcademicSetup';
import { ImportSyllabus } from './pages/onboarding/ImportSyllabus';
import { PdfAnalysis } from './pages/onboarding/PdfAnalysis';
import { DetectedSubjects } from './pages/onboarding/DetectedSubjects';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Subjects } from './pages/Subjects';
import { SubjectWorkspace } from './pages/SubjectWorkspace';
import { ClassWork } from './pages/ClassWork';
import { AssignmentDetail } from './pages/AssignmentDetail';
import { LabWorkPage } from './pages/LabWork';
import { LabDetail } from './pages/LabDetail';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Notes } from './pages/Notes';
import { NoteEditor } from './pages/NoteEditor';
import { Timetable } from './pages/Timetable';
import { CalendarPage } from './pages/Calendar';
import { ProgressPage } from './pages/Progress';
import { NotificationsPage } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { ImportTimetable } from './pages/timetable/ImportTimetable';
import { AnalyzeTimetable } from './pages/timetable/AnalyzeTimetable';
import { ReviewTimetable } from './pages/timetable/ReviewTimetable';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudyForgeProvider>
          <QuickAddProvider>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
              <Route path="/setup" element={<ProtectedRoute><AcademicSetup /></ProtectedRoute>} />
              {/* TEMPORARILY COMMENTED OUT
              <Route path="/import" element={<ProtectedRoute><ImportSyllabus /></ProtectedRoute>} />
              <Route path="/import/analyze" element={<ProtectedRoute><PdfAnalysis /></ProtectedRoute>} />
              <Route path="/import/review" element={<ProtectedRoute><DetectedSubjects /></ProtectedRoute>} />
              */}
              
              <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="subjects" element={<Subjects />} />
                <Route path="subjects/:subjectId" element={<SubjectWorkspace />} />
                <Route path="class-work" element={<ClassWork />} />
                <Route path="assignments/:assignmentId" element={<AssignmentDetail />} />
                <Route path="lab-work" element={<LabWorkPage />} />
                <Route path="labs/:labId" element={<LabDetail />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:projectId" element={<ProjectDetail />} />
                <Route path="notes" element={<Notes />} />
                <Route path="notes/:noteId" element={<NoteEditor />} />
                <Route path="timetable" element={<Timetable />} />
                <Route path="timetable/import" element={<ImportTimetable />} />
                <Route path="timetable/analyze" element={<AnalyzeTimetable />} />
                <Route path="timetable/review" element={<ReviewTimetable />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </QuickAddProvider>
        </StudyForgeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}