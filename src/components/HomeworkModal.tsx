import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  RotateCw, 
  Check, 
  Copy, 
  FileText
} from 'lucide-react';

export const HomeworkModal: React.FC = () => {
  const { 
    activeLesson, 
    homeworkModalLessonId, 
    setHomeworkModalLessonId,
    generateHomeworkAction,
    isGenerating
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vocab' | 'grammarMCQ' | 'grammarFill' | 'writing' | 'speaking'>('vocab');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!activeLesson || homeworkModalLessonId !== activeLesson.id) {
    return null;
  }

  const homework = activeLesson.homework;

  const handleCopyAll = () => {
    if (!homework) return;
    const text = `
=== LESSON AI 课后作业: ${activeLesson.topic} (${activeLesson.textbookName} · ${activeLesson.unitNumber}) ===
学员: Elena Zhao
课时时长: 120 分钟实战课跟进

【第一部分：词汇迁移练习 (10 题)】
${homework.vocabulary.map((q, i) => `${i + 1}. ${q.question} (答案: ${q.answer})`).join('\n')}

【第二部分：语法单项选择 (10 题)】
${homework.grammarMCQ.map((q, i) => `${i + 1}. ${q.question}\n选项: ${(q.options || []).join(' / ')}\n答案: ${q.answer}`).join('\n\n')}

【第三部分：语法句子填空 (10 题)】
${homework.grammarFill.map((q, i) => `${i + 1}. ${q.question}\n答案: ${q.answer}`).join('\n')}

【第四部分：实战书面任务 (${homework.writing.wordCount})】
${homework.writing.prompt}
写作指引:
${homework.writing.guidelines.map(g => `- ${g}`).join('\n')}
必须使用的搭配: ${homework.writing.requiredExpressions.join(', ')}

【第五部分：口语语音打卡 (${homework.speaking.duration})】
${homework.speaking.prompt}
打卡要求: 请录制一段微信语音或备忘录音频，包含表达：${homework.speaking.requiredExpressions.join(', ')}
`;
    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                结课自动生成作业
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Elena Zhao · {activeLesson.textbookName}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              课后作业：{activeLesson.topic}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateHomeworkAction(activeLesson.id)}
              disabled={isGenerating}
              className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium py-1.5 px-3 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>全新语境中重新生成</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium py-1.5 px-3 rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制！' : '复制给学生'}</span>
            </button>

            <button
              onClick={() => setHomeworkModalLessonId(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vocab')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'vocab'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            词汇迁移 (10 题)
          </button>
          <button
            onClick={() => setActiveTab('grammarMCQ')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'grammarMCQ'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            语法选择 (10 题)
          </button>
          <button
            onClick={() => setActiveTab('grammarFill')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'grammarFill'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            语法填空 (10 题)
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'writing'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            实战写作 (120–150 词)
          </button>
          <button
            onClick={() => setActiveTab('speaking')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'speaking'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            口语打卡 (2 分钟语音)
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>智能作业设计原则：</strong> 所有题目均将课上核心词汇（如 <em>be responsible for</em>, <em>cope with</em>, <em>work under pressure</em>, <em>present perfect</em>）置入<strong>全新的真实跨国供应链、差旅与团队管理场景</strong>中，严禁机械重复课上原题。
          </p>

          {/* Tab 1: Vocabulary */}
          {activeTab === 'vocab' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">
                10 道词汇语境迁移选填题
              </h3>
              <div className="space-y-2">
                {homework?.vocabulary.map((q, idx) => (
                  <div key={q.id || idx} className="p-3 bg-white rounded-xl border border-slate-200 text-sm space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-slate-800">
                        <span className="text-slate-400 font-mono text-xs mr-2">{idx + 1}.</span>
                        {q.question}
                      </p>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 shrink-0">
                        {q.answer}
                      </span>
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-slate-500 pl-5">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Grammar MCQ */}
          {activeTab === 'grammarMCQ' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">
                10 道语法单项选择题
              </h3>
              <div className="space-y-2.5">
                {homework?.grammarMCQ.map((q, idx) => (
                  <div key={q.id || idx} className="p-3.5 bg-white rounded-xl border border-slate-200 text-sm space-y-2">
                    <p className="text-slate-800 font-medium">
                      <span className="text-slate-400 font-mono text-xs mr-2">{idx + 1}.</span>
                      {q.question}
                    </p>
                    {q.options && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-lg border ${
                              opt.toLowerCase() === q.answer.toLowerCase()
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="text-slate-400 mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-emerald-700">正确答案: {q.answer}</span>
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Grammar Fill-in */}
          {activeTab === 'grammarFill' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">
                10 道语法句子填空题
              </h3>
              <div className="space-y-2">
                {homework?.grammarFill.map((q, idx) => (
                  <div key={q.id || idx} className="p-3 bg-white rounded-xl border border-slate-200 text-sm flex items-center justify-between">
                    <p className="text-slate-800">
                      <span className="text-slate-400 font-mono text-xs mr-2">{idx + 1}.</span>
                      {q.question}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {q.hint && <span className="text-[11px] text-slate-400 font-mono">{q.hint}</span>}
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                        {q.answer}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Writing */}
          {activeTab === 'writing' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  目标要求：{homework?.writing.wordCount}
                </span>
                <p className="text-base font-semibold text-slate-900 leading-relaxed">
                  "{homework?.writing.prompt}"
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  学员写作指引
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {homework?.writing.guidelines.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  必须使用的目标搭配表达
                </span>
                <div className="flex flex-wrap gap-2">
                  {homework?.writing.requiredExpressions.map((expr, i) => (
                    <span key={i} className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-2.5 py-1 rounded-lg text-xs font-mono font-medium">
                      {expr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Speaking */}
          {activeTab === 'speaking' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  录音时长要求：{homework?.speaking.duration}
                </span>
                <p className="text-base font-semibold text-slate-900 leading-relaxed">
                  "{homework?.speaking.prompt}"
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  语音打卡要求
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  <li>直接对着微信语音或手机录音软件说，避免念预先写好的死记稿件。</li>
                  <li>语速适中，重在表达连贯与自然停顿。</li>
                  <li>必须自然融入至少 3 个目标职场搭配短语。</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  必用搭配
                </span>
                <div className="flex flex-wrap gap-2">
                  {homework?.speaking.requiredExpressions.map((expr, i) => (
                    <span key={i} className="bg-purple-50 border border-purple-200 text-purple-900 px-2.5 py-1 rounded-lg text-xs font-mono font-medium">
                      {expr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            作业已自动记录至 Elena 的课程记忆 (Lesson Memory) 中。
          </span>
          <button
            onClick={handleSave}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm py-2 px-4 rounded-xl transition-colors cursor-pointer"
          >
            {saved ? '已保存！' : '保存作业记录'}
          </button>
        </div>
      </div>
    </div>
  );
};
