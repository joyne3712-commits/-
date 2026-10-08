import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, BookOpen, Layers } from 'lucide-react';

export const NewLessonModal: React.FC = () => {
  const { 
    isNewLessonModalOpen, 
    setIsNewLessonModalOpen, 
    createLesson, 
    materials, 
    student,
    isGenerating,
    generationStep 
  } = useApp();

  const [selectedTextbook, setSelectedTextbook] = useState(materials[0]?.title || 'Think B1');
  const [selectedUnit, setSelectedUnit] = useState('Unit 6');
  const [todayFocus, setTodayFocus] = useState('工作和职场表达（抗压与职责分工）');
  const [duration, setDuration] = useState(120);

  if (!isNewLessonModalOpen) return null;

  const currentBook = materials.find(m => m.title === selectedTextbook) || materials[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTextbook || !selectedUnit) return;

    try {
      await createLesson({
        textbookName: selectedTextbook,
        unitNumber: selectedUnit,
        todayFocus: todayFocus.trim(),
        duration,
      });
      setIsNewLessonModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
              3分钟极速备课工作流
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              新建课程 (New Lesson)
            </h2>
          </div>
          <button
            onClick={() => setIsNewLessonModalOpen(false)}
            disabled={isGenerating}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Context Card */}
        <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{student.name}</span>
            <span>·</span>
            <span>当前水平: <strong className="font-mono text-slate-800">{student.currentLevel}</strong></span>
            <span>→</span>
            <span>目标: <strong className="font-mono text-indigo-700">{student.targetLevel}</strong></span>
          </div>
          <span className="text-slate-400 text-[11px]">长远目标驱动</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 教材选择 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. 选择教材 (Textbook) *
            </label>
            <select
              value={selectedTextbook}
              onChange={(e) => {
                setSelectedTextbook(e.target.value);
                const book = materials.find(m => m.title === e.target.value);
                if (book && book.units.length > 0) {
                  setSelectedUnit(book.units[0].unitNumber);
                }
              }}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-slate-900 shadow-2xs"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.title}>
                  {m.title} ({m.level} · {m.units.length} 个单元)
                </option>
              ))}
            </select>
          </div>

          {/* Unit 选择 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. 选择单元 (Unit) *
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-slate-900 shadow-2xs font-mono"
            >
              {currentBook?.units.map((u) => (
                <option key={u.id} value={u.unitNumber}>
                  {u.unitNumber} — {u.title} ({u.topic})
                </option>
              ))}
            </select>
          </div>

          {/* 今日重点 (可选) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              3. 今日教学重点 (可选 / 自定义)
            </label>
            <input
              type="text"
              placeholder="例如：工作和职场表达、商务谈判冲突解决、海外差旅突发应对"
              value={todayFocus}
              onChange={(e) => setTodayFocus(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-slate-900 shadow-2xs"
            />
          </div>

          {/* 课程时长 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              4. 课程时长
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[60, 90, 120].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-2 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                    duration === d
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {d} 分钟 {d === 120 ? '(标准)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Generating Status */}
          {isGenerating && (
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>{generationStep || '正在检索 Unit 并智能扩展...'}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? '正在研读教材并扩展生成...' : '生成课程'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
