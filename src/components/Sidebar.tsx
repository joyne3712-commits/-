import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  FolderKanban, 
  User, 
  Settings, 
  Plus, 
  GraduationCap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeNav, 
    setActiveNav, 
    setIsNewLessonModalOpen, 
    student 
  } = useApp();

  const navItems = [
    { id: 'lessons' as const, label: '课程', icon: BookOpen },
    { id: 'materials' as const, label: '教材库', icon: FolderKanban },
    { id: 'student' as const, label: '学生', icon: User },
    { id: 'settings' as const, label: '设置', icon: Settings },
  ];

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-sm tracking-tight shadow-xs">
            LA
          </div>
          <div className="leading-tight">
            <span className="font-bold text-slate-900 text-base tracking-tight block">Lesson AI</span>
            <span className="text-[11px] text-slate-400 font-medium block">英语教师备课工作台</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button: + 新建课程 */}
      <div className="p-3.5 border-b border-slate-100">
        <button
          onClick={() => setIsNewLessonModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all duration-150 active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>新建课程</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Student Badge Footer */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
        <div 
          onClick={() => setActiveNav('student')} 
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-slate-900 truncate">{student.name}</p>
              <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-mono font-medium">
                {student.currentLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">目标: {student.targetLevel} · 实用英语</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
