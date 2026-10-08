import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Plus, 
  Trash2, 
  Edit3, 
  Save,
  ArrowRight
} from 'lucide-react';

export const StudentPage: React.FC = () => {
  const { student, updateStudent, lessons, setActiveLessonId } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [goal, setGoal] = useState(student.goal);
  const [background, setBackground] = useState(student.background);
  const [characteristics, setCharacteristics] = useState(student.learningCharacteristics);
  const [newPrevLearning, setNewPrevLearning] = useState('');
  const [newNeedsReview, setNewNeedsReview] = useState('');

  const handleSave = () => {
    updateStudent({
      name,
      goal,
      background,
      learningCharacteristics: characteristics,
    });
    setIsEditing(false);
  };

  const handleAddPrevLearning = () => {
    if (!newPrevLearning.trim()) return;
    updateStudent({
      previousLearning: [...student.previousLearning, newPrevLearning.trim()],
    });
    setNewPrevLearning('');
  };

  const handleRemovePrevLearning = (index: number) => {
    updateStudent({
      previousLearning: student.previousLearning.filter((_, i) => i !== index),
    });
  };

  const handleAddNeedsReview = () => {
    if (!newNeedsReview.trim()) return;
    updateStudent({
      needsReview: [...student.needsReview, newNeedsReview.trim()],
    });
    setNewNeedsReview('');
  };

  const handleRemoveNeedsReview = (index: number) => {
    updateStudent({
      needsReview: student.needsReview.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-8 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            {student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {student.name}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                {student.age}岁 · {student.gender}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              主修教材: <strong className="text-slate-700">{student.textbook}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? '保存学员档案' : '编辑档案'}</span>
        </button>
      </div>

      {/* Level & Goal Cards */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            当前水平 (Current Level)
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {student.currentLevel}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            中级水平 · 被动认知待激活
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            长远目标 (Target Level)
          </span>
          <p className="text-2xl font-bold text-indigo-600 mt-1 font-mono">
            {student.targetLevel}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            高级流利度（逐步渐进，不盲目拔高）
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            核心学习目标
          </span>
          <p className="text-base font-semibold text-slate-900 mt-1">
            {isEditing ? (
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-1 border border-slate-300 rounded text-sm font-normal"
              />
            ) : (
              student.goal
            )}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            实用英语 / 外企职场实战
          </span>
        </div>
      </div>

      {/* Student Context & Background */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            学员英语学习背景 (CET-4/6 & 职场沉淀)
          </h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full p-2.5 text-xs text-slate-800 border border-slate-300 rounded-xl focus:outline-slate-900"
            />
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed">
              {student.background}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            核心学习特质（AI 智能调优依据）
          </h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={characteristics}
              onChange={(e) => setCharacteristics(e.target.value)}
              className="w-full p-2.5 text-xs text-slate-800 border border-slate-300 rounded-xl focus:outline-slate-900"
            />
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {student.learningCharacteristics}
            </p>
          )}
        </div>
      </div>

      {/* Previous Learning & Needs Review Lists */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Column 1: 之前学过 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-semibold text-sm text-slate-900">
              之前学过 (已学语言记录)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {student.previousLearning.length} 项
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            教师手动记录已教过的词组与句式。
          </p>

          <div className="space-y-1.5 flex-1 mb-4">
            {student.previousLearning.map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50 text-xs text-slate-800 flex items-center justify-between group">
                <span>{item}</span>
                <button
                  onClick={() => handleRemovePrevLearning(idx)}
                  className="text-slate-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="添加已学表达..."
              value={newPrevLearning}
              onChange={(e) => setNewPrevLearning(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPrevLearning()}
              className="flex-1 p-2 text-xs border border-slate-200 rounded-xl focus:outline-slate-900"
            />
            <button
              onClick={handleAddPrevLearning}
              className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Column 2: 需要复习 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <h3 className="font-semibold text-sm text-slate-900">
              需要复习 (Needs Review 标记)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {student.needsReview.length} 项
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            标记待巩固的痛点，下次备课时 AI 将自动编入复习板块。
          </p>

          <div className="space-y-1.5 flex-1 mb-4">
            {student.needsReview.map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950 flex items-center justify-between group">
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveNeedsReview(idx)}
                  className="text-slate-400 hover:text-rose-600 opacity-60 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="标记需复习的知识点..."
              value={newNeedsReview}
              onChange={(e) => setNewNeedsReview(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNeedsReview()}
              className="flex-1 p-2 text-xs border border-slate-200 rounded-xl focus:outline-slate-900"
            />
            <button
              onClick={handleAddNeedsReview}
              className="bg-amber-600 text-white p-2 rounded-xl hover:bg-amber-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Elena 最近上的课程
        </h3>
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveLessonId(lesson.id)}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900">{lesson.topic}</h4>
                <span className="text-xs text-slate-400">{lesson.date} · {lesson.duration} 分钟 · {lesson.textbookName}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
