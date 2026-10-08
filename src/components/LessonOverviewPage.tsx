import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  RotateCw, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Clock, 
  BookOpen, 
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ContentClassification } from '../types';

export const LessonOverviewPage: React.FC = () => {
  const { 
    activeLesson, 
    setActiveLessonId, 
    setTeachingModeLessonId, 
    setHomeworkModalLessonId, 
    setIsAddMaterialModalOpen,
    removeSelectedContentItem,
    moveSelectedContentItem,
    regenerateSectionAction,
    regenerateQuestionAction,
    isGenerating,
    generationStep
  } = useApp();

  const [activeTab, setActiveTab] = useState<'plan' | 'expansion'>('plan');
  const [expandedSection, setExpandedSection] = useState<string | null>('newLesson');
  const [showSkipped, setShowSkipped] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [timerRunning, setTimerRunning] = useState(false);

  if (!activeLesson) {
    return (
      <div className="p-12 text-center text-slate-500">
        未选中任何课程。{' '}
        <button 
          onClick={() => setActiveLessonId('lesson-work-career')} 
          className="text-slate-900 underline font-medium cursor-pointer"
        >
          查看 Think B1 Unit 6 (Work & Career) 示范课
        </button>
      </div>
    );
  }

  const toggleAnswer = (qId: string) => {
    setRevealedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSection(prev => prev === sectionKey ? null : sectionKey);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-10 pb-28">
      {/* Back button & Breadcrumb */}
      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setActiveLessonId(null)}
          className="hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
        >
          ← 返回课程列表
        </button>
        <div className="flex items-center gap-2">
          <span>学生: <strong className="text-slate-700">Elena Zhao (B1)</strong></span>
          <span>·</span>
          <span>教材依托: <strong className="text-slate-700">{activeLesson.textbookName} · {activeLesson.unitNumber}</strong></span>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono">
              {activeLesson.textbookName} · {activeLesson.unitNumber}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">{activeLesson.unitTitle}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {activeLesson.topic}
          </h1>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              {activeLesson.duration} 分钟实战课
            </span>
            <span>·</span>
            <span>目标: 实用职场英语</span>
            <span>·</span>
            <span className="text-slate-400">{activeLesson.todayFocus}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setHomeworkModalLessonId(activeLesson.id)}
            className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium text-xs sm:text-sm py-2 px-3.5 rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>课后作业</span>
          </button>

          <button
            onClick={() => regenerateSectionAction(activeLesson.id, 'practice')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium text-xs sm:text-sm py-2 px-3.5 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="重新生成练习题"
          >
            <RotateCw className={`w-4 h-4 text-slate-500 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>重新生成</span>
          </button>

          <button
            onClick={() => setTeachingModeLessonId(activeLesson.id)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm py-2 px-4 rounded-xl shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>开始上课</span>
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="my-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 text-sm text-indigo-900 animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
          <span>{generationStep || 'AI 正在分析教材并智能扩展教学内容...'}</span>
        </div>
      )}

      {/* Mode Switcher: 课程安排 VS AI内容深度扩展 */}
      <div className="mt-8 flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-2 text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'plan'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>120分钟课程安排 (Lesson Plan)</span>
        </button>

        <button
          onClick={() => setActiveTab('expansion')}
          className={`flex items-center gap-2 text-sm font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'expansion'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:text-indigo-900 hover:bg-indigo-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI 深度内容扩展 (Expansion View)</span>
        </button>
      </div>

      {/* VIEW 1: EXPANSION VIEW */}
      {activeTab === 'expansion' && (
        <div className="mt-6 space-y-6 animate-fadeIn">
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs text-indigo-950 space-y-1">
            <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              教材起点 → AI 智能内容扩展架构
            </h3>
            <p className="leading-relaxed">
              针对教材单薄无法支撑 2 小时私教的问题，AI 以教材选定词为核心锚点，自动衍生出<strong>词族 (Word Family)</strong>、<strong>固定搭配 (Collocations)</strong>、<strong>词缀构词</strong>与<strong>实用句型网络</strong>，并清晰区分教材原词与 AI 扩展。
            </p>
          </div>

          <div className="space-y-4">
            {activeLesson.expansions.map((exp) => (
              <div key={exp.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                        {exp.coreWord}
                      </h4>
                      {exp.origin === 'textbook' ? (
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                          📘 教材原词
                        </span>
                      ) : (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono font-medium">
                          ✨ AI 智能扩展
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-mono">{exp.level}</span>
                    </div>
                    {exp.textbookContext && (
                      <p className="text-xs text-slate-500 mt-1">{exp.textbookContext}</p>
                    )}
                  </div>
                </div>

                {/* Word Family Grid */}
                {exp.wordFamily && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      1. 词族拓展 (Word Family)
                    </span>
                    <div className="grid sm:grid-cols-3 gap-2 text-xs">
                      {exp.wordFamily.noun && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <strong className="text-slate-500 block mb-0.5">名词 (Noun)</strong>
                          <span className="font-mono text-slate-900">{exp.wordFamily.noun.join(', ')}</span>
                        </div>
                      )}
                      {exp.wordFamily.adjective && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <strong className="text-slate-500 block mb-0.5">形容词 (Adj)</strong>
                          <span className="font-mono text-slate-900">{exp.wordFamily.adjective.join(', ')}</span>
                        </div>
                      )}
                      {exp.wordFamily.adverb && (
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <strong className="text-slate-500 block mb-0.5">副词 (Adv)</strong>
                          <span className="font-mono text-slate-900">{exp.wordFamily.adverb.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Collocations */}
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    2. 高频地道固定搭配 (Collocations)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {exp.collocations.map((col, cIdx) => (
                      <span key={cIdx} className="bg-indigo-50/70 border border-indigo-200/70 text-indigo-900 px-2.5 py-1 rounded-lg text-xs font-mono font-medium">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Useful Expressions */}
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    3. 职场实战运用句型 (Sentence Patterns)
                  </span>
                  <div className="space-y-1.5">
                    {exp.usefulExpressions.map((expr, eIdx) => (
                      <div key={eIdx} className="p-2 rounded-lg bg-slate-50 border-l-2 border-indigo-600 text-xs text-slate-800 italic">
                        "{expr}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistake Alert */}
                {exp.commonMistake && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                    <strong className="block mb-0.5 text-amber-900 font-semibold">常见错误提示 (Common Mistake)</strong>
                    {exp.commonMistake}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: 120-MIN LESSON PLAN */}
      {activeTab === 'plan' && (
        <div className="mt-6 space-y-3 animate-fadeIn">
          {/* 1. Review Section (20 min) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs">
            <div 
              onClick={() => toggleSection('review')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-200/60">
                  1
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">复习 (Review)</h3>
                    <span className="text-xs font-medium text-slate-400">· 20 分钟</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                    {activeLesson.review.targetVocabulary.map((v, i) => (
                      <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                        {v}
                      </span>
                    ))}
                    {activeLesson.review.targetGrammar.map((g, i) => (
                      <span key={i} className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-medium border border-amber-200/40">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {activeLesson.review.quickQuestions.length} 道问答 · {activeLesson.review.sentenceCompletions.length} 道填空 · {activeLesson.review.speakingQuestions.length} 道口语激活
                </span>
                {expandedSection === 'review' ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {expandedSection === 'review' && (
              <div className="p-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    休眠知识激活与纠偏练习
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      regenerateSectionAction(activeLesson.id, 'review');
                    }}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    重新生成本段
                  </button>
                </div>

                <div className="space-y-2">
                  {activeLesson.review.quickQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-white rounded-xl border border-slate-200 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-slate-800 font-medium leading-relaxed">
                          <span className="text-slate-400 font-mono text-xs mr-2">{idx + 1}.</span>
                          {q.prompt}
                        </p>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
                          {q.target}
                        </span>
                      </div>
                      {q.answer && (
                        <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                          <span>标准参考回答:</span>
                          <span className="text-slate-700">{q.answer}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Warm-up Section (10 min) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs">
            <div 
              onClick={() => toggleSection('warmup')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/60">
                  2
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">热身与导入 (Warm-up)</h3>
                    <span className="text-xs font-medium text-slate-400">· 10 分钟</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeLesson.warmup.topic}
                  </p>
                </div>
              </div>

              {expandedSection === 'warmup' ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {expandedSection === 'warmup' && (
              <div className="p-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-4">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    教师导入引导词 (Lead-in Prompt)
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    "{activeLesson.warmup.leadInPrompt}"
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    互动讨论问题
                  </span>
                  {activeLesson.warmup.discussionQuestions.map((dq, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-sm text-slate-800">
                      <span className="text-slate-400 font-mono text-xs mr-2">{idx + 1}.</span>
                      {dq}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. New Lesson Section (25 min) - CORE TEACHING */}
          <div className="bg-white border-2 border-slate-900/10 rounded-2xl overflow-hidden transition-all shadow-xs">
            <div 
              onClick={() => toggleSection('newLesson')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none bg-slate-50/20"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200/60">
                  3
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">核心内容教学 (Core Content)</h3>
                    <span className="text-xs font-medium text-slate-400">· 25 分钟</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                      深度精讲
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-700 font-medium">
                    {activeLesson.newLesson.items.map((item, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs font-mono">
                        {item.item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {expandedSection === 'newLesson' ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {expandedSection === 'newLesson' && (
              <div className="p-5 pt-3 border-t border-slate-200 bg-slate-50/50 space-y-4">
                <div className="grid gap-3.5">
                  {activeLesson.newLesson.items.map((nl) => (
                    <div key={nl.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-base font-bold text-slate-900 tracking-tight font-mono">
                            {nl.item}
                          </h4>
                          {nl.origin === 'textbook' ? (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                              📘 教材原词
                            </span>
                          ) : (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded font-mono font-semibold">
                              ✨ AI 扩展搭配
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 capitalize">{nl.type}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-700">
                        <strong className="text-slate-900">核心含义:</strong> {nl.explanation}
                      </p>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-sm text-slate-800 border-l-2 border-indigo-600">
                        <span className="text-xs text-slate-400 block mb-0.5">自然职场例句</span>
                        "{nl.exampleSentence}"
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/50 text-amber-900">
                          <span className="font-semibold block mb-0.5">常见误区提示</span>
                          {nl.commonMistake}
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-200/50 text-emerald-900">
                          <span className="font-semibold block mb-0.5">即时理解检测 (Quick Check)</span>
                          {nl.quickCheck?.question}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Practice Section (15 min) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs">
            <div 
              onClick={() => toggleSection('practice')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200/60">
                  4
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">控制性练习 (Controlled Practice)</h3>
                    <span className="text-xs font-medium text-slate-400">· 15 分钟</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    基于教材原词与 AI 扩展搭配的针对性题目
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {activeLesson.practice.vocabularyQuestions.length} 道词汇 · {activeLesson.practice.grammarQuestions.length} 道语法
                </span>
                {expandedSection === 'practice' ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {expandedSection === 'practice' && (
              <div className="p-5 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                    词汇语境练习 ({activeLesson.practice.vocabularyQuestions.length} 题)
                  </h4>
                  <div className="space-y-2.5">
                    {activeLesson.practice.vocabularyQuestions.map((q, idx) => {
                      const isRevealed = revealedAnswers[q.id];
                      return (
                        <div key={q.id} className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-slate-800 font-medium">
                              <span className="text-slate-400 font-mono text-xs mr-2">{idx + 1}.</span>
                              {q.question}
                            </p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => toggleAnswer(q.id)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title={isRevealed ? "隐藏答案" : "查看答案"}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => regenerateQuestionAction(activeLesson.id, q.id, 'vocabulary')}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="仅重新生成本题"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {q.options && (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {q.options.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className={`px-2 py-0.5 rounded border ${
                                    isRevealed && opt.toLowerCase() === q.answer.toLowerCase()
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                                      : 'bg-slate-50 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  {opt}
                                </span>
                              ))}
                            </div>
                          )}

                          {isRevealed && (
                            <div className="p-2 bg-emerald-50/70 border border-emerald-200/60 rounded text-xs text-emerald-900 space-y-0.5 animate-fadeIn">
                              <p className="font-semibold">正确答案: {q.answer}</p>
                              {q.explanation && <p className="text-emerald-800">{q.explanation}</p>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Speaking Section (20 min) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs">
            <div 
              onClick={() => toggleSection('speaking')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center border border-purple-200/60">
                  5
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">口语表达实操 (Speaking)</h3>
                    <span className="text-xs font-medium text-slate-400">· 20 分钟</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeLesson.speaking.topic}
                  </p>
                </div>
              </div>

              {expandedSection === 'speaking' ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {expandedSection === 'speaking' && (
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/40 space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    核心口语话题 (Main Prompt)
                  </span>
                  <p className="text-base font-semibold text-slate-900">
                    "{activeLesson.speaking.mainQuestion}"
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    深度追问列表 (Follow-up Questions)
                  </span>
                  <ul className="space-y-1.5 text-sm text-slate-700 list-disc list-inside">
                    {activeLesson.speaking.followUpQuestions.map((fq, idx) => (
                      <li key={idx} className="leading-relaxed">{fq}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    强制要求运用的目标词汇清单
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeLesson.speaking.usefulLanguage.map((term, idx) => (
                      <span key={idx} className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-2.5 py-1 rounded-lg text-xs font-medium font-mono">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Writing Section (30 min) */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-2xs">
            <div 
              onClick={() => toggleSection('writing')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 select-none"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center border border-rose-200/60">
                  6
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">实战写作训练 (Writing)</h3>
                    <span className="text-xs font-medium text-slate-400">· 30 分钟</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeLesson.writing.task}
                  </p>
                </div>
              </div>

              {expandedSection === 'writing' ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {expandedSection === 'writing' && (
              <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/40 space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      写作任务要求
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                      目标字数: {activeLesson.writing.targetWordCount}
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-900">
                    "{activeLesson.writing.task}"
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    推荐五步段落框架 (Suggested Structure)
                  </span>
                  <div className="grid gap-2">
                    {activeLesson.writing.suggestedStructure.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 bg-slate-50 rounded-xl">
                        <span className="font-semibold text-slate-900 whitespace-nowrap">{step.step}:</span>
                        <span>{step.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Content Section (Under Lesson Plan) */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">已选内容 (Selected Content)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              AI 基于学员水平对教材单元与扩展内容的四维分类。教师可随时移除或从教材库补充。
            </p>
          </div>
          <button
            onClick={() => setIsAddMaterialModalOpen(true)}
            className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-medium text-xs sm:text-sm py-2 px-3 rounded-xl shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-slate-600 stroke-[2.5]" />
            <span>+ 从教材库中添加</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Column 1: Core — 教授 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <h3 className="font-bold text-slate-900 text-sm">核心 — 教授 (Teach)</h3>
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">
                {activeLesson.selectedContent.teach.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              新颖且极高价值的内容；值得在课堂上深度示范与纠偏。
            </p>

            <div className="space-y-2 flex-1">
              {activeLesson.selectedContent.teach.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1 group">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-indigo-950 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />
                      {item.text}
                    </span>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveSelectedContentItem(activeLesson.id, item.id, 'teach', 'review')}
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                      >
                        →复习
                      </button>
                      <button
                        onClick={() => removeSelectedContentItem(activeLesson.id, 'teach', item.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {item.reason && (
                    <p className="text-[11px] text-slate-500 leading-tight">{item.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: 复习 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h3 className="font-bold text-slate-900 text-sm">重点 — 复习 (Review)</h3>
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">
                {activeLesson.selectedContent.review.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              之前学过但易遗忘；需要在对话与问答中激活。
            </p>

            <div className="space-y-2 flex-1">
              {activeLesson.selectedContent.review.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs space-y-1 group">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-amber-950 font-mono flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-amber-600" />
                      {item.text}
                    </span>
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveSelectedContentItem(activeLesson.id, item.id, 'review', 'teach')}
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                      >
                        →教授
                      </button>
                      <button
                        onClick={() => removeSelectedContentItem(activeLesson.id, 'review', item.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {item.reason && (
                    <p className="text-[11px] text-slate-500 leading-tight">{item.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: 运用 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h3 className="font-bold text-slate-900 text-sm">熟练 — 运用 (Use)</h3>
              </div>
              <span className="text-xs font-mono font-medium text-slate-400">
                {activeLesson.selectedContent.use.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              学员已熟练掌握；无需占用讲授课时，直接在口语写作中自然调用。
            </p>

            <div className="space-y-2 flex-1">
              {activeLesson.selectedContent.use.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs space-y-1 group">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-emerald-950 font-mono flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                      {item.text}
                    </span>
                    <button
                      onClick={() => removeSelectedContentItem(activeLesson.id, 'use', item.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 opacity-60 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {item.reason && (
                    <p className="text-[11px] text-slate-500 leading-tight">{item.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skipped Section Collapsible */}
        <div className="mt-5 pt-3">
          <button
            onClick={() => setShowSkipped(!showSkipped)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            {showSkipped ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>已跳过教材内容 ({activeLesson.selectedContent.skip.length} 项)</span>
          </button>

          {showSkipped && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <p className="text-xs text-slate-400">
                下列词汇来自教材该单元，但因过于生僻、偏向历史背景或与成人职场目标不符，已被 AI 自动过滤。
              </p>
              <div className="grid sm:grid-cols-3 gap-2 pt-1">
                {activeLesson.selectedContent.skip.map((item) => (
                  <div key={item.id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono text-slate-700 block font-semibold">{item.text}</span>
                      <span className="text-[10px] text-slate-400 block">{item.reason || '非成人实用核心'}</span>
                    </div>
                    <button
                      onClick={() => moveSelectedContentItem(activeLesson.id, item.id, 'skip', 'teach')}
                      className="text-[10px] text-indigo-600 hover:underline font-medium ml-2 shrink-0 cursor-pointer"
                    >
                      +移入教授
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
