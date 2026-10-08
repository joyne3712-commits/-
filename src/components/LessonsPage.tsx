import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Clock, Calendar, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

export const LessonsPage: React.FC = () => {
  const { lessons, setActiveLessonId, setIsNewLessonModalOpen } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">课程管理</h1>
          <p className="text-sm text-slate-500 mt-1">
            学生 Elena Zhao 的历次 120 分钟教案记录
          </p>
        </div>
        <button
          onClick={() => setIsNewLessonModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ 新建课程</span>
        </button>
      </div>

      {/* Lesson List */}
      <div className="mt-8 space-y-3">
        {lessons.map((lesson) => {
          const isTaught = lesson.status === 'completed';
          return (
            <div
              key={lesson.id}
              onClick={() => setActiveLessonId(lesson.id)}
              className="group bg-white border border-slate-200 hover:border-slate-400/80 rounded-2xl p-5 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                    {lesson.topic}
                  </h2>
                  <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md font-mono">
                    {lesson.textbookName} · {lesson.unitNumber}
                  </span>
                  {isTaught ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      已结课
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      备课就绪
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {lesson.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {lesson.duration} 分钟
                  </span>
                  <span>·</span>
                  <span>重点: {lesson.todayFocus || '实用职场'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <span className="text-xs text-slate-400 block font-mono">
                    {lesson.selectedContent.teach.length} 核心教授 · {lesson.selectedContent.review.length} 重点复习
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
