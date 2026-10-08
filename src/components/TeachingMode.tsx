import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Lightbulb, 
  PanelRightClose, 
  PanelRightOpen, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const TeachingMode: React.FC = () => {
  const { 
    activeLesson, 
    teachingModeLessonId, 
    setTeachingModeLessonId, 
    endLessonAndGenerateHomework 
  } = useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTeacherPanelVisible, setIsTeacherPanelVisible] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Timer for writing activity or general pacing
  const [timerSeconds, setTimerSeconds] = useState(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!activeLesson || teachingModeLessonId !== activeLesson.id) {
    return null;
  }

  // Construct dynamic presentation slides
  const slides: Array<{
    type: 'welcome' | 'review' | 'warmup' | 'new_vocab' | 'practice_q' | 'speaking' | 'writing' | 'wrapup';
    sectionTitle: string;
    stage: string;
    title: string;
    content: any;
    teacherNotes: string;
    followUp: string;
    commonError: string;
    hintText?: string;
    answerText?: string;
  }> = [
    {
      type: 'welcome',
      sectionTitle: '课程导览 (Overview)',
      stage: '课堂开场 · 2 分钟',
      title: activeLesson.topic,
      content: {
        subtitle: `120-Minute Practical Session · ${activeLesson.textbookName} ${activeLesson.unitNumber}`,
        goals: [
          'Review: Present perfect (for/since) and troubleshooting collocations',
          'Learn: cope with, be responsible for, work under pressure',
          'Practice: Controlled context exercises',
          'Produce: Spoken crisis analysis & 120-150 word professional reflection'
        ]
      },
      teacherNotes: '热情欢迎 Elena。提醒她今天重点在于将职场抗压与个人职责的英语表达激活，鼓励多说多练。',
      followUp: 'How was your workweek overall? Did any unexpected demands come up?',
      commonError: '切忌一上来就灌输枯燥语法规则，先建立轻松的英语会话氛围。'
    },
    {
      type: 'review',
      sectionTitle: '复习板块 (Review · 20 min)',
      stage: '现在完成时与时间点/段',
      title: 'Review: Present Perfect with for & since',
      content: {
        prompt: 'How long have you worked at your current company?',
        sentenceOne: 'I have worked in my field _____ 2015.',
        sentenceTwo: 'She has been in her leadership role _____ seven years.'
      },
      hintText: '起始时间点用 since，总时间长度用 for。',
      answerText: '1. since 2015  |  2. for seven years',
      teacherNotes: '中式英语常有 "I work here since 5 years" 或 "I am working..." 的时态混淆，请及时温和纠偏。',
      followUp: '追问：And how long have you known your closest business partner?',
      commonError: '在持续状态中不可使用一般现在时替代现在完成时。'
    },
    {
      type: 'review',
      sectionTitle: '复习板块 (Review · 20 min)',
      stage: '高频动词短语激活',
      title: 'Review: deal with',
      content: {
        prompt: 'What unexpected problems do you usually have to deal with on a Monday morning?',
        pattern: 'deal with + client inquiries / delayed shipments / technical issues'
      },
      hintText: '牢记介词为 with，不可省略。',
      answerText: 'Example: "I usually have to deal with delayed shipments and urgent client emails."',
      teacherNotes: '引导 Elena 尽量给出结构完整的英文句子，避免单蹦词回答。',
      followUp: '追问：Who helps you deal with the most complicated vendor disputes?',
      commonError: '留意是否遗漏介词说成 *deal the problem*。'
    },
    {
      type: 'warmup',
      sectionTitle: '热身导入 (Warm-up · 10 min)',
      stage: '话题破冰与生活关联',
      title: activeLesson.warmup.topic,
      content: {
        leadIn: activeLesson.warmup.leadInPrompt,
        questions: activeLesson.warmup.discussionQuestions
      },
      teacherNotes: '鼓励学生分享真实经历。重点在于打开思路，不需要在热身阶段过度纠正轻微口误。',
      followUp: 'What usually causes the most pressure: tight deadlines or difficult colleagues?',
      commonError: '不要在此处打断学生的流利度表达。'
    },
    ...activeLesson.newLesson.items.map((item) => ({
      type: 'new_vocab' as const,
      sectionTitle: '核心内容教学 (Core · 25 min)',
      stage: item.origin === 'textbook' ? '📘 教材原词讲解' : '✨ AI 扩展重点搭配',
      title: item.item,
      content: {
        item: item.item,
        level: item.level,
        type: item.type,
        explanation: item.explanation,
        example: item.exampleSentence,
        context: item.naturalContext
      },
      hintText: item.commonMistake,
      answerText: item.quickCheck?.answer,
      teacherNotes: `示范 "${item.item}" 的纯正连读与重音，让学生重复朗读。`,
      followUp: item.quickCheck?.question || `How could you use "${item.item}" in an email tomorrow?`,
      commonError: item.commonMistake || '注意介词搭配。'
    })),
    ...activeLesson.practice.vocabularyQuestions.slice(0, 3).map((q, i) => ({
      type: 'practice_q' as const,
      sectionTitle: '控制性练习 (Practice · 15 min)',
      stage: `词汇练习第 ${i + 1} 题`,
      title: 'Complete the sentence in context',
      content: {
        question: q.question,
        options: q.options
      },
      hintText: `考查重点表达：${q.targetItem}`,
      answerText: `${q.answer} — ${q.explanation}`,
      teacherNotes: '给学生 15-20 秒默读思考，随后要求其大声朗读完整句子。',
      followUp: '询问：Why is this option much more natural in business English?',
      commonError: '观察学生是否对介词尾音产生犹豫。'
    })),
    {
      type: 'speaking',
      sectionTitle: '口语表达实操 (Speaking · 20 min)',
      stage: '实战交际产出',
      title: activeLesson.speaking.topic,
      content: {
        mainPrompt: activeLesson.speaking.mainQuestion,
        followUp: activeLesson.speaking.followUpQuestions,
        usefulLanguage: activeLesson.speaking.usefulLanguage
      },
      teacherNotes: '扮演真实的职场商务伙伴，运用追问推动学生进行多句展开，不要自问自答。',
      followUp: 'What would you do differently if that happened today?',
      commonError: '确保学生在表达中真实用到了 cope with 和 work under pressure 等目标词汇。'
    },
    {
      type: 'writing',
      sectionTitle: '实战写作训练 (Writing · 30 min)',
      stage: '独立书面产出',
      title: 'Writing Task: A Difficult Situation at Work',
      content: {
        task: activeLesson.writing.task,
        targetWordCount: activeLesson.writing.targetWordCount,
        structure: activeLesson.writing.suggestedStructure,
        usefulLanguage: activeLesson.writing.usefulLanguage
      },
      hintText: '按五步框架推进：引言 → 情境 → 核心挑战 → 解决措施 → 长远复盘。',
      answerText: '目标字数：120-150 词，融入目标固定搭配。',
      teacherNotes: '学生可直接在随堂草稿纸或本应用中打字，保持计时器可见。教师随时答疑拼写或搭配。',
      followUp: '提醒学生检查最后一段的复盘反思是否正确使用了现在完成时。',
      commonError: '引言部分不要写太长，保持在两句以内即可。'
    },
    {
      type: 'wrapup',
      sectionTitle: '课堂总结与结课',
      stage: '知识固化与作业生成',
      title: 'Lesson Complete! Excellent Work.',
      content: {
        recap: [
          'Target expressions mastered: cope with, be responsible for, work under pressure',
          'Grammar consolidated: Present perfect (for/since) in professional context',
          'Speaking task and writing task completed'
        ],
        nextStep: '点击下方“结束课程”，系统将自动为 Elena 生成针对今日内容的全新情境课后作业。'
      },
      teacherNotes: '高度赞扬 Elena 在整节课中的口语流利度与搭配准确度。',
      followUp: '询问学生：今天学到的哪个短语觉得对明天上班最实用？',
      commonError: '结课前记得在学员档案中随手记录本节课表现。'
    }
  ];

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(i => i + 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(i => i - 1);
      setShowAnswer(false);
      setShowHint(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <header className="h-14 px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            授课模式: {activeLesson.topic} ({activeLesson.textbookName} · {activeLesson.unitNumber})
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {currentSlideIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Center: Section Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
          <span className="font-semibold text-white">{currentSlide.sectionTitle}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{currentSlide.stage}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Writing Timer */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700 text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-bold text-white">{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-slate-300 hover:text-white p-0.5 ml-1 cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-slate-300" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(30 * 60);
              }}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title="重置计时"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setIsTeacherPanelVisible(!isTeacherPanelVisible)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition-colors"
          >
            {isTeacherPanelVisible ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isTeacherPanelVisible ? '隐藏教师面板' : '显示教师面板'}</span>
          </button>

          <button
            onClick={() => setTeachingModeLessonId(null)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            title="退出授课模式"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Classroom Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Student-Facing Area (Mainly English, large, clean) */}
        <main className="flex-1 bg-slate-950 flex flex-col justify-between p-8 sm:p-14 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full my-auto py-6 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2.5 py-1 rounded-md">
                {currentSlide.sectionTitle}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-4 leading-tight font-serif">
                {currentSlide.title}
              </h2>
            </div>

            {/* Slide Body */}
            {currentSlide.type === 'welcome' && (
              <div className="space-y-6 pt-4">
                <p className="text-xl text-slate-300">
                  {currentSlide.content.subtitle}
                </p>
                <div className="p-6 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Today's Objectives</h3>
                  <ul className="space-y-2.5 text-base sm:text-lg text-slate-200">
                    {currentSlide.content.goals.map((g: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentSlide.type === 'review' && (
              <div className="space-y-6 pt-2">
                <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                  <p className="text-2xl text-slate-100 font-medium leading-relaxed">
                    "{currentSlide.content.prompt}"
                  </p>
                  {currentSlide.content.sentenceOne && (
                    <div className="p-4 bg-slate-950 rounded-xl font-mono text-lg text-indigo-200 border border-slate-800 space-y-2">
                      <p>1. {currentSlide.content.sentenceOne}</p>
                      <p>2. {currentSlide.content.sentenceTwo}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentSlide.type === 'warmup' && (
              <div className="space-y-6 pt-2">
                <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
                  <p className="text-2xl sm:text-3xl text-slate-100 leading-snug font-medium">
                    "{currentSlide.content.leadIn}"
                  </p>
                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    {currentSlide.content.questions.map((q: string, idx: number) => (
                      <p key={idx} className="text-lg text-slate-300">
                        • {q}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentSlide.type === 'new_vocab' && (
              <div className="space-y-6 pt-2">
                <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-mono font-bold text-indigo-300">
                      {currentSlide.content.item}
                    </span>
                    <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded font-mono">
                      {currentSlide.content.level}
                    </span>
                  </div>

                  <p className="text-xl text-slate-200">
                    <strong className="text-white">Meaning: </strong>
                    {currentSlide.content.explanation}
                  </p>

                  <div className="p-5 bg-slate-950 rounded-xl border-l-4 border-indigo-500 text-lg sm:text-xl text-slate-100 italic">
                    "{currentSlide.content.example}"
                  </div>

                  <p className="text-sm text-slate-400">
                    <strong>Natural Context: </strong>
                    {currentSlide.content.context}
                  </p>
                </div>
              </div>
            )}

            {currentSlide.type === 'practice_q' && (
              <div className="space-y-6 pt-2">
                <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
                  <p className="text-2xl sm:text-3xl text-slate-100 leading-relaxed font-medium">
                    {currentSlide.content.question}
                  </p>

                  {currentSlide.content.options && (
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      {currentSlide.content.options.map((opt: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-lg font-mono text-slate-300"
                        >
                          <span className="text-slate-500 mr-3">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentSlide.type === 'speaking' && (
              <div className="space-y-6 pt-2">
                <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
                  <p className="text-2xl sm:text-3xl text-slate-100 leading-snug font-medium">
                    "{currentSlide.content.mainPrompt}"
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Follow-up questions
                    </span>
                    {currentSlide.content.followUp.map((fq: string, idx: number) => (
                      <p key={idx} className="text-base sm:text-lg text-slate-300">
                        • {fq}
                      </p>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Target Language Checklist
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentSlide.content.usefulLanguage.map((ul: string, idx: number) => (
                        <span key={idx} className="bg-indigo-900/70 border border-indigo-700 text-indigo-200 px-3 py-1 rounded-lg text-sm font-mono">
                          {ul}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide.type === 'writing' && (
              <div className="space-y-6 pt-2">
                <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6">
                  <div>
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                      30-Minute Writing Task
                    </span>
                    <p className="text-2xl text-slate-100 font-medium mt-2 leading-relaxed">
                      "{currentSlide.content.task}"
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                        5-Step Framework
                      </span>
                      {currentSlide.content.structure.map((st: any, idx: number) => (
                        <div key={idx} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                          <span className="font-semibold text-slate-400">{st.step}:</span>
                          <span>{st.description}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                        Target Collocations
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentSlide.content.usefulLanguage.map((ul: string, idx: number) => (
                          <span key={idx} className="bg-slate-900 text-slate-200 border border-slate-700 px-2.5 py-1 rounded text-xs font-mono">
                            {ul}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentSlide.type === 'wrapup' && (
              <div className="space-y-6 pt-2">
                <div className="p-8 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-6 text-center">
                  <div className="w-16 h-16 bg-emerald-950 border border-emerald-700 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">本节课程顺利完成</h3>
                  <p className="text-slate-300 max-w-lg mx-auto">
                    Elena 已完成 B1 基础唤醒、核心职场搭配输入以及独立口语与写作实操。
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => endLessonAndGenerateHomework(activeLesson.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base py-3 px-8 rounded-xl shadow-lg transition-all cursor-pointer active:scale-98"
                    >
                      结束课程并自动生成作业
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hint & Answer Accordion */}
            {(showHint || showAnswer) && (
              <div className="space-y-3 animate-fadeIn">
                {showHint && currentSlide.hintText && (
                  <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-xl text-amber-200 text-sm flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">课堂提示:</span>
                      {currentSlide.hintText}
                    </div>
                  </div>
                )}

                {showAnswer && currentSlide.answerText && (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-200 text-sm flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">参考答案 / 示范回答:</span>
                      {currentSlide.answerText}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Floating Bar */}
          <div className="h-16 flex items-center justify-between border-t border-slate-800 pt-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2">
              {currentSlide.hintText && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    showHint ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? '隐藏提示' : '提示'}</span>
                </button>
              )}

              {currentSlide.answerText && (
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    showAnswer ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showAnswer ? '隐藏答案' : '查看答案'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-sm text-white font-medium cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一题</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlideIndex === slides.length - 1}
                className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 rounded-xl text-sm text-white font-semibold cursor-pointer transition-colors"
              >
                <span>下一题</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Dedicated Teacher Panel in Chinese */}
        {isTeacherPanelVisible && (
          <aside className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  教师随堂提示面板
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">学生不可见</span>
              </div>

              {/* 教师提示 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                  教师提示 (Teacher Notes)
                </span>
                <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-200 leading-relaxed border border-slate-700/80">
                  {currentSlide.teacherNotes}
                </div>
              </div>

              {/* 追问 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                  进阶追问 (Follow-up)
                </span>
                <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-200 leading-relaxed border border-slate-700/80">
                  {currentSlide.followUp}
                </div>
              </div>

              {/* 常见错误警示 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">
                  常见错误警示 (Common Error)
                </span>
                <div className="p-3 bg-rose-950/40 rounded-xl text-xs text-rose-200 leading-relaxed border border-rose-800/60">
                  {currentSlide.commonError}
                </div>
              </div>
            </div>

            {/* End Lesson Button */}
            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => endLessonAndGenerateHomework(activeLesson.id)}
                className="w-full bg-slate-800 hover:bg-emerald-600 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>结束课程并生成作业</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
