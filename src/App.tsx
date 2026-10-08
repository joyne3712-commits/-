import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { LessonsPage } from './components/LessonsPage';
import { LessonOverviewPage } from './components/LessonOverviewPage';
import { MaterialsPage } from './components/MaterialsPage';
import { StudentPage } from './components/StudentPage';
import { SettingsPage } from './components/SettingsPage';
import { NewLessonModal } from './components/NewLessonModal';
import { AddMaterialModal } from './components/AddMaterialModal';
import { HomeworkModal } from './components/HomeworkModal';
import { TeachingMode } from './components/TeachingMode';

const MainLayout: React.FC = () => {
  const { activeNav, activeLessonId } = useApp();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">
      {/* Narrow Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeNav === 'lessons' && (
          activeLessonId ? <LessonOverviewPage /> : <LessonsPage />
        )}
        {activeNav === 'materials' && <MaterialsPage />}
        {activeNav === 'student' && <StudentPage />}
        {activeNav === 'settings' && <SettingsPage />}
      </main>

      {/* Global Interactive Views & Modals */}
      <NewLessonModal />
      <AddMaterialModal />
      <HomeworkModal />
      <TeachingMode />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
