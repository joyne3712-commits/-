import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

// Gemini client initialization
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
  });
});

// Helper for generating lesson with Gemini (RAG Unit Retrieval + AI Expansion + 120-min Plan)
app.post('/api/generate-lesson', async (req: Request, res: Response) => {
  const { 
    textbookName = 'Think B1', 
    unitNumber = 'Unit 6', 
    todayFocus = '工作和职场表达', 
    duration = 120, 
    student, 
    unitData 
  } = req.body;

  if (!ai) {
    return res.status(200).json({
      success: true,
      fallbackUsed: true,
      message: '本地智能教学引擎已就绪（当前未检测到 GEMINI_API_KEY）。',
      lesson: generateFallbackLesson(textbookName, unitNumber, todayFocus, duration, unitData),
    });
  }

  const prompt = `
你是一位专门为一对一成人英语教师服务的 AI 教学教研专家。
教师正在为一名 43 岁成年女性学员备课：
- 当前英语水平：B1（长远目标：C1）
- 学习目标：实用英语（外企职场沟通、国际会议与海外出行）
- 背景：有大学 CET-4/CET-6 基础，语法框架存在但词汇处于休眠状态，缺乏长期高频使用。
- 教学核心原则：
  1. 教材是起点与锚点（Anchor），但传统教材内容单薄，不足以支撑完整的 2 小时私教课。
  2. 绝不能只做教材内容摘要（Summary），必须完成深度智能扩展（Textbook Unit → Expanded Lesson）。
  3. 将教材词汇扩展为实用语言网络（Word Family 词族、Prefixes/Suffixes 前缀后缀、Collocations 地道固定搭配、Sentence Patterns 句型）。
  4. 严格区分【教材原始内容】与【AI扩展内容】，不把 AI 补充的内容伪称为教材原文。
  5. 分类为四类：教授 (Teach)、复习 (Review)、运用 (Use)、跳过 (Skip)。
  6. 教师界面提示与注释使用中文，面向学生的教学与练习英文保持地道英语。

本次选定教材与单元：
- 教材：${textbookName}
- 单元：${unitNumber}
- 今日重点：${todayFocus}
- 课程时长：${duration} 分钟
- 单元检索参考内容：
${JSON.stringify(unitData || {})}

请生成完整的 120 分钟实战教案，包含：
1. expansions: 数组，对本单元 2-3 个核心词展开词族 (wordFamily)、搭配 (collocations)、相关表达 (relatedVocabulary)、前缀后缀 (prefixesSuffixes)、例句和常见错误 (commonMistake)。
2. review (20 分钟): 复习旧知与现在完成时/短语，5 道快速问答，3 道填空，2 道口语提问。
3. warmup (10 分钟): 话题导入、激活背景讨论题与关键词。
4. newLesson (25 分钟): 2-3 个核心新表达教学，含英文解释、例句、语境、常见误区警示与检查问答。
5. practice (15 分钟): 10 道词汇语境选择/填空题，5 道语法单选题，5 道语法填空题。
6. speaking (20 分钟): 深度职场沟通场景、主问题、追问与目标词汇清单、中文教师提示。
7. writing (30 分钟): 120-150 词实战写作任务、5 步框架、目标表达、30 分钟计时。
8. homework: 10 道词汇练习、10 道语法单选、10 道语法填空、120-150 词写作任务、2 分钟口语录音。所有作业必须在全新的真实语境中复用今天的目标语言！
9. selectedContent: 教授 (teach)、复习 (review)、运用 (use)、跳过 (skip) 四个维度的明确清单与简要理由。

严格返回合法 JSON 格式。
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      fallbackUsed: false,
      lesson: {
        id: `lesson-${Date.now()}`,
        topic: todayFocus || `${textbookName} ${unitNumber}`,
        textbookName,
        unitNumber,
        unitTitle: unitData?.title || `${unitNumber} 实践主题`,
        date: new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }) + '日',
        duration,
        studentId: student?.id || 'student-1',
        todayFocus,
        status: 'ready',
        ...parsed,
      },
    });
  } catch (err: any) {
    console.error('Gemini generation error, falling back:', err);
    return res.json({
      success: true,
      fallbackUsed: true,
      errorNotice: err?.message,
      lesson: generateFallbackLesson(textbookName, unitNumber, todayFocus, duration, unitData),
    });
  }
});

// Endpoint for regenerating an individual section
app.post('/api/regenerate-section', async (req: Request, res: Response) => {
  const { sectionName, topic, currentLesson, guidance } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      fallbackUsed: true,
      sectionData: generateFallbackSection(sectionName, topic),
    });
  }

  const prompt = `
请为 120 分钟一对一成人英语课程重新生成【${sectionName}】单一部分的内容。
学员画像：43 岁职场女性，B1 水平（有 CET-4/6 基础，目标实用 C1）。
教材与单元主题：${topic}
${guidance ? `教师具体要求：${guidance}` : ''}

注意：教师指导说明使用中文，学生作答与英文内容保持纯正地道英语。
仅输出对应 ${sectionName} 结构的合法 JSON。
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const sectionData = JSON.parse(text);
    return res.json({ success: true, sectionData });
  } catch (err: any) {
    console.error('Section regeneration error:', err);
    return res.json({
      success: true,
      fallbackUsed: true,
      sectionData: generateFallbackSection(sectionName, topic),
    });
  }
});

// Endpoint for regenerating an individual question
app.post('/api/regenerate-question', async (req: Request, res: Response) => {
  const { category, type, topic, targetItem } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      question: {
        id: `pq-new-${Date.now()}`,
        type: type || 'vocab_context',
        category: category || 'vocabulary',
        origin: 'ai_expanded',
        question: `When negotiating high-stakes contracts in ${topic || 'work'}, executives must ${targetItem || 'cope with'} sudden changes with composure.`,
        options: [targetItem || 'cope with', 'give up', 'look into', 'run after'],
        answer: targetItem || 'cope with',
        explanation: `考察目标搭配 "${targetItem || 'cope with'}" 在真实商务场景中的自然运用。`,
        targetItem: targetItem || 'cope with',
      },
    });
  }

  const prompt = `
为成人 B1 英语学员生成 1 道针对目标语言的高质量练习题。
主题：${topic}
目标语言项目：${targetItem || 'target collocation'}
类别：${category} (vocabulary 或 grammar)
题型：${type} (vocab_choice, vocab_context, grammar_mcq, 或 grammar_fill)

输出合法 JSON：
{
  "id": "pq-${Date.now()}",
  "type": "${type || 'vocab_context'}",
  "category": "${category || 'vocabulary'}",
  "origin": "ai_expanded",
  "question": "包含 __________ 题干句子",
  "options": ["opt1", "opt2", "opt3", "opt4"],
  "answer": "正确答案",
  "explanation": "简明的中文解析",
  "targetItem": "${targetItem || ''}"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const question = JSON.parse(response.text || '{}');
    return res.json({ success: true, question });
  } catch (err: any) {
    return res.json({
      success: true,
      fallbackUsed: true,
      question: {
        id: `pq-new-${Date.now()}`,
        type: type || 'vocab_context',
        category: category || 'vocabulary',
        origin: 'ai_expanded',
        question: `In modern operations, the ability to __________ unexpected hurdles is vital.`,
        options: [targetItem || 'cope with', 'give up', 'turn down', 'stand by'],
        answer: targetItem || 'cope with',
        explanation: '考察职场高频固定搭配 cope with。',
        targetItem: targetItem || 'cope with',
      },
    });
  }
});

// Endpoint for generating homework
app.post('/api/generate-homework', async (req: Request, res: Response) => {
  const { topic, targetLanguage } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      homework: generateFallbackHomework(topic, targetLanguage),
    });
  }

  const prompt = `
为本次 120 分钟课程生成完整的课后作业体系：
主题：${topic}
今日教授与复习的目标语言：${JSON.stringify(targetLanguage || ['be responsible for', 'cope with', 'work under pressure', 'deal with', 'present perfect'])}

重要要求：
课后作业必须将上述目标语言放置于【全新的真实语境】中（例如外企项目管理、跨国差旅、商务谈判、日常生活），绝不能简单复制课堂原题！

包含 5 部分：
1. vocabulary: 10 道语境选词填空题（含解析）
2. grammarMCQ: 10 道语法单选题（4 个选项，含答案与中文解析）
3. grammarFill: 10 道语法填空题（含提示词与答案）
4. writing: 120-150 词实战写作任务（含写作指导与必用表达）
5. speaking: 2 分钟语音录音打卡任务（含指导与必用表达）

输出合法 JSON。
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const homework = JSON.parse(response.text || '{}');
    return res.json({ success: true, homework });
  } catch (err: any) {
    return res.json({
      success: true,
      fallbackUsed: true,
      homework: generateFallbackHomework(topic, targetLanguage),
    });
  }
});

// Local pedagogical fallback generators
function generateFallbackLesson(
  textbookName: string, 
  unitNumber: string, 
  todayFocus: string, 
  duration: number,
  unitData?: any
) {
  const title = unitData?.title || 'Work & Ambition';
  const topic = todayFocus || 'Work & Career';

  return {
    topic,
    textbookName,
    unitNumber,
    unitTitle: title,
    todayFocus,
    expansions: [
      {
        id: `exp-${Date.now()}-1`,
        coreWord: 'responsible',
        origin: 'textbook',
        textbookContext: `${textbookName} ${unitNumber} 核心重点词`,
        level: 'B1',
        wordFamily: {
          noun: ['responsibility (责任/职责)'],
          adjective: ['responsible (负责的)', 'irresponsible (不负责任的)'],
          adverb: ['responsibly (负责任地)']
        },
        prefixesSuffixes: [
          { affix: '-ible', meaning: '能够…的 / 具有…属性的', example: 'responsible, flexible' },
          { affix: 'ir-', meaning: '否定前缀（用于 r 开头单词）', example: 'irresponsible, irregular' }
        ],
        relatedForms: [
          'be responsible for (+ V-ing / n.)',
          'take responsibility for',
          'have responsibility for'
        ],
        collocations: [
          'be responsible for managing a team',
          'be responsible for project delivery',
          'take responsibility for an unexpected mistake'
        ],
        usefulExpressions: [
          "In my current role, I'm directly responsible for...",
          "It is our department's responsibility to ensure...",
          "Who takes responsibility when deadlines slip?"
        ],
        relatedVocabulary: ['accountable', 'in charge of', 'supervise', 'oversee'],
        exampleSentence: 'In my current position, I am responsible for managing key client accounts.',
        commonMistake: '切勿接不定式 *responsible to do*；务必使用 responsible for + V-ing 或名词。',
        spokenAlternatives: ['I take care of...', 'I handle...'],
        writingAlternatives: ['Hold direct accountability for...', 'Oversee the execution of...']
      },
      {
        id: `exp-${Date.now()}-2`,
        coreWord: 'cope with',
        origin: 'ai_expanded',
        textbookContext: 'AI 围绕抗压与职场应急主题智能补充的高频搭配',
        level: 'B1',
        wordFamily: {
          verb: ['cope (应付/处理)']
        },
        relatedForms: ['cope with pressure', 'cope with heavy workload'],
        collocations: [
          'cope with stress',
          'cope with tight deadlines',
          'cope with unexpected challenges'
        ],
        usefulExpressions: [
          'She learned how to cope with heavy workloads without burning out.',
          'How do you cope with tight timelines when resources are limited?'
        ],
        relatedVocabulary: ['manage', 'handle', 'deal with', 'withstand'],
        exampleSentence: 'Our project team learned how to cope with demanding deadlines by prioritizing tasks.',
        commonMistake: '切勿说 *cope up with*，标准英语中搭配为单一介词 cope with。'
      },
      {
        id: `exp-${Date.now()}-3`,
        coreWord: 'work under pressure',
        origin: 'ai_expanded',
        textbookContext: 'AI 根据成人外企面试与述职需求扩展的高频地道短语',
        level: 'B1',
        relatedForms: ['under intense pressure', 'feel under pressure', 'put pressure on'],
        collocations: [
          'work under pressure',
          'perform well under pressure',
          'handle pressure calmly'
        ],
        usefulExpressions: [
          'In high-stakes projects, the ability to work under pressure is essential.',
          'Our division demonstrated that we can work under pressure to deliver on time.'
        ],
        relatedVocabulary: ['stressful', 'demanding', 'high-stakes', 'crunch time'],
        exampleSentence: 'The operations division demonstrated they could work under pressure during the quarterly audit.',
        commonMistake: '表示精神/工作压力时 pressure 不可数，切勿说 *work under pressures*。'
      }
    ],
    review: {
      duration: 20,
      targetVocabulary: ['deal with', 'be responsible for'],
      targetGrammar: ['present perfect', 'for / since'],
      quickQuestions: [
        {
          id: 'rq-1',
          prompt: 'How long have you worked at your current company? (Use "for" or "since")',
          target: 'present perfect + for/since',
          answer: 'I have worked here for [X] years / since [year].'
        },
        {
          id: 'rq-2',
          prompt: 'In your daily work, what kinds of client requests do you usually have to deal with?',
          target: 'deal with',
          answer: 'I usually deal with urgent shipment adjustments and contract revisions.'
        },
        {
          id: 'rq-3',
          prompt: 'Fill in: "She has been in her current role _____ last October."',
          target: 'since',
          answer: 'since'
        },
        {
          id: 'rq-4',
          prompt: 'Fill in: "Our team has collaborated on this initiative _____ six months."',
          target: 'for',
          answer: 'for'
        },
        {
          id: 'rq-5',
          prompt: 'Correct this sentence: "I work in human resources since 2019."',
          target: 'present perfect correction',
          answer: 'I have worked in human resources since 2019.'
        }
      ],
      sentenceCompletions: [
        {
          id: 'rc-1',
          prompt: 'Whenever unexpected technical glitches happen, our department is expected to __________ them within two hours.',
          target: 'deal with',
          answer: 'deal with'
        },
        {
          id: 'rc-2',
          prompt: 'She __________ (hold) the position of department head for more than seven years.',
          target: 'has held',
          answer: 'has held'
        },
        {
          id: 'rc-3',
          prompt: 'Our company has partnered with European suppliers __________ early 2021.',
          target: 'since',
          answer: 'since'
        }
      ],
      speakingQuestions: [
        {
          id: 'rs-1',
          prompt: 'Tell me about the biggest professional challenge you have dealt with this year.',
          targetLanguage: ['dealt with', 'have experienced', 'for / since']
        },
        {
          id: 'rs-2',
          prompt: 'Reflect on a skill you have developed since you joined your current industry.',
          targetLanguage: ['have improved', 'since', 'responsible for']
        }
      ]
    },
    warmup: {
      duration: 10,
      topic: '谈论职场工作经历与高压挑战 (Workplace pressures & experience)',
      leadInPrompt: 'Think about a typical busy Monday at your office. What creates the most pressure: tight deadlines, difficult clients, or unexpected changes?',
      discussionQuestions: [
        'What usually causes the most pressure in your typical workweek?',
        'How has the way people handle workplace stress changed over the past five years in your field?'
      ],
      activationKeywords: ['deadlines', 'priorities', 'workload', 'communication', 'stress']
    },
    newLesson: {
      duration: 25,
      items: [
        {
          id: 'nl-1',
          item: 'be responsible for',
          level: 'B1',
          type: 'phrase',
          origin: 'ai_expanded',
          explanation: 'Having the official duty to look after something or someone and make decisions.',
          exampleSentence: 'As a project lead, I am directly responsible for ensuring project milestones are met.',
          naturalContext: 'Job descriptions, self-introductions, performance assessments, meeting handoffs.',
          commonMistake: '不要接不定式 *responsible to do*；务必使用 responsible for + V-ing/名词。',
          quickCheck: {
            question: 'Complete: "In our department, Mark is responsible for __________ (coordinate) vendor contracts."',
            answer: 'coordinating'
          }
        },
        {
          id: 'nl-2',
          item: 'cope with',
          level: 'B1',
          type: 'collocation',
          origin: 'ai_expanded',
          explanation: 'To deal successfully with a difficult situation or heavy emotional/physical demand.',
          exampleSentence: 'She learned how to cope with heavy workloads by delegating administrative tasks.',
          naturalContext: 'Discussing quarterly sprints, reorganization, or sudden increases in responsibilities.',
          commonMistake: '不要说 *cope up with*。英语中固定介词为 cope with。',
          quickCheck: {
            question: 'Choose the correct phrasing: "How do you (cope with / cope up with) tight timelines?"',
            answer: '"cope with"'
          }
        },
        {
          id: 'nl-3',
          item: 'work under pressure',
          level: 'B1',
          type: 'phrase',
          origin: 'ai_expanded',
          explanation: 'Performing professional tasks effectively even when conditions are demanding or stressful.',
          exampleSentence: 'In international logistics, the ability to work under pressure is an indispensable asset.',
          naturalContext: 'Job interviews, high-stakes negotiations, operational incidents.',
          commonMistake: '注意在此搭配中 pressure 不可数，严禁说成 *work under pressures*。',
          quickCheck: {
            question: 'Is "under severe pressure" or "under severe pressures" natural in business English?',
            answer: '"under severe pressure" (uncountable)'
          }
        }
      ]
    },
    practice: {
      duration: 15,
      vocabularyQuestions: [
        {
          id: 'pq-1',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'When multiple shipment delays occurred simultaneously, the logistics manager had to __________ the crisis calmly.',
          options: ['cope with', 'look forward to', 'run out of', 'give up on'],
          answer: 'cope with',
          explanation: '"Cope with" 表示成功沉着应对棘手难题。',
          targetItem: 'cope with'
        },
        {
          id: 'pq-2',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'In her new role as compliance manager, Linda is directly __________ auditing financial reports.',
          options: ['responsible for', 'responsible to', 'coped with', 'deal about'],
          answer: 'responsible for',
          explanation: '"responsible for" 必须后接动名词 (-ing) 或名词。',
          targetItem: 'be responsible for'
        },
        {
          id: 'pq-3',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'During the quarterly audit, the entire accounting division demonstrated they could __________ without making mistakes.',
          options: ['work under pressure', 'work over pressure', 'cope up pressure', 'handle with pressure'],
          answer: 'work under pressure',
          explanation: 'work under pressure 为职场固定高频抗压搭配。',
          targetItem: 'work under pressure'
        },
        {
          id: 'pq-4',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'Many working parents find it challenging to __________ high-demanding careers and household responsibilities.',
          options: ['cope with', 'deal of', 'responsible to', 'work over'],
          answer: 'cope with',
          explanation: 'cope with heavy demands (应付高负荷工作)。',
          targetItem: 'cope with'
        },
        {
          id: 'pq-5',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'Who will be __________ leading the kickoff presentation while our director is overseas?',
          options: ['responsible for', 'responsible on', 'in deal with', 'pressure for'],
          answer: 'responsible for',
          explanation: 'be responsible for leading 负责主导。',
          targetItem: 'be responsible for'
        },
        {
          id: 'pq-6',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'If you want to advance to senior management, learning to __________ tight deadlines is crucial.',
          options: ['work under pressure with', 'work under pressure', 'work beneath pressure', 'deal into pressure'],
          answer: 'work under pressure',
          explanation: '在时间紧迫下沉着工作。',
          targetItem: 'work under pressure'
        },
        {
          id: 'pq-7',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'textbook',
          question: 'Our customer support representatives must __________ dozens of urgent inquiries each morning.',
          options: ['deal with', 'deal to', 'cope at', 'responsible with'],
          answer: 'deal with',
          explanation: 'deal with 处理事务与客户需求。',
          targetItem: 'deal with'
        },
        {
          id: 'pq-8',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'Senior executives are held __________ the strategic growth of the organization.',
          options: ['responsible for', 'responsible by', 'in coping with', 'dealing about'],
          answer: 'responsible for',
          explanation: 'be held responsible for 对某事被问责/负全责。',
          targetItem: 'be responsible for'
        },
        {
          id: 'pq-9',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'The medical team proved they could __________ extreme fatigue during the crisis.',
          options: ['cope with', 'cope up with', 'deal into', 'responsible for'],
          answer: 'cope with',
          explanation: '牢记单一介词搭配 cope with，避免 cope up with 语病。',
          targetItem: 'cope with'
        },
        {
          id: 'pq-10',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: 'Interviewers often ask candidates to demonstrate past instances where they had to __________.',
          options: ['work under pressure', 'work over pressure', 'cope to pressures', 'be responsible to'],
          answer: 'work under pressure',
          explanation: '行为面试中的标准抗压表达。',
          targetItem: 'work under pressure'
        }
      ],
      grammarQuestions: [
        {
          id: 'pq-g1',
          type: 'grammar_mcq',
          category: 'grammar',
          origin: 'textbook',
          question: 'David __________ at the consulting agency for six years, and he still enjoys the dynamic pace.',
          options: ['has worked', 'worked', 'works', 'is working'],
          answer: 'has worked',
          explanation: '从过去持续至今的任职状态，配合 for six years 必须用现在完成时。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g2',
          type: 'grammar_mcq',
          category: 'grammar',
          origin: 'textbook',
          question: 'Our engineering department has adopted this agile workflow __________ January 2023.',
          options: ['since', 'for', 'during', 'from'],
          answer: 'since',
          explanation: '明确的过去起始时间点（January 2023）用 since 连接。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g3',
          type: 'grammar_mcq',
          category: 'grammar',
          origin: 'ai_expanded',
          question: 'How long __________ responsible for regional vendor negotiations?',
          options: ['have you been', 'are you', 'were you being', 'did you be'],
          answer: 'have you been',
          explanation: '询问至今为止的职责持续时间，用 How long have you been responsible for。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g4',
          type: 'grammar_mcq',
          category: 'grammar',
          origin: 'textbook',
          question: 'She __________ a significant promotion last November after completing the merger.',
          options: ['received', 'has received', 'receives', 'was receiving'],
          answer: 'received',
          explanation: '明确的过去完成时间状语 last November 必须使用一般过去时。',
          targetItem: 'present perfect vs past simple'
        },
        {
          id: 'pq-g5',
          type: 'grammar_mcq',
          category: 'grammar',
          origin: 'textbook',
          question: 'They have collaborated with our procurement branch __________ over a decade.',
          options: ['for', 'since', 'in', 'ago'],
          answer: 'for',
          explanation: '一段时间跨度（over a decade）用 for。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g6',
          type: 'grammar_fill',
          category: 'grammar',
          origin: 'textbook',
          question: 'Mr. Vance has supervised global accounts __________ (since / for) he relocated to the headquarters.',
          options: ['since', 'for'],
          answer: 'since',
          explanation: '从过去某一从句发生时至今用 since。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g7',
          type: 'grammar_fill',
          category: 'grammar',
          origin: 'textbook',
          question: 'Our technical director __________ (lead) the transformation team since its inception.',
          options: ['has led'],
          answer: 'has led',
          explanation: '第三人称单数配合 since：has led。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g8',
          type: 'grammar_fill',
          category: 'grammar',
          origin: 'textbook',
          question: 'We have maintained an open-door policy __________ (for / since) three consecutive quarters.',
          options: ['for', 'since'],
          answer: 'for',
          explanation: '时长用 for。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g9',
          type: 'grammar_fill',
          category: 'grammar',
          origin: 'textbook',
          question: 'Since entering the European market, sales revenues __________ (increase) by nearly forty percent.',
          options: ['have increased'],
          answer: 'have increased',
          explanation: '主语复数 revenues 配合 since：have increased。',
          targetItem: 'present perfect (for / since)'
        },
        {
          id: 'pq-g10',
          type: 'grammar_fill',
          category: 'grammar',
          origin: 'textbook',
          question: 'I __________ (not have) any serious disagreements with our regional partners for quite some time.',
          options: ['have not had', "haven't had"],
          answer: 'have not had',
          explanation: '完成时否定形式：have not had。',
          targetItem: 'present perfect (for / since)'
        }
      ]
    },
    speaking: {
      duration: 20,
      topic: '职场危机处理与应对压力 (Workplace Problems & Crisis Management)',
      mainQuestion: 'Tell me about a difficult situation you have experienced at work.',
      followUpQuestions: [
        'What exactly happened, and why was the timeline so demanding?',
        'How did you deal with the conflicting priorities or anxious team members?',
        'Looking back, what would you do differently to cope with similar stress in the future?'
      ],
      usefulLanguage: ['deal with', 'cope with', 'be responsible for', 'work under pressure'],
      teacherPrompts: [
        '引导 Elena 结合她在外企供应链/项目审计的真实过往经历回答，避免机械读教材。',
        '仔细关注她是否正确使用 "cope with"（避免口误添加 up）。',
        '提醒她在阐述个人职责时自然运用现在完成时。'
      ],
      sampleStudentScenario: 'A sudden system malfunction right before a critical client shipment deadline.'
    },
    writing: {
      duration: 30,
      task: 'Describe a difficult situation at work and explain how you dealt with it.',
      targetWordCount: '120–150 words',
      usefulLanguage: ['deal with', 'cope with', 'be responsible for', 'work under pressure'],
      suggestedStructure: [
        { step: '1. Introduction (引言)', description: '介绍你当时的职位角色，以及你负责的具体业务 (what you were responsible for)。' },
        { step: '2. Situation (情境)', description: '描述突发出现的危机事件或紧急截止日期。' },
        { step: '3. Problem (核心挑战)', description: '阐述为什么团队必须在高压状态下协同工作 (work under pressure)。' },
        { step: '4. Solution (解决措施)', description: '详细写出你如何调整心态、应对压力并有效化解难题 (cope with / deal with)。' },
        { step: '5. Reflection (长远复盘)', description: '用现在完成时总结自从那次危机之后，你所收获的宝贵专业经验 (Since then, I have learned...)。' }
      ],
      timedMinutes: 30
    },
    selectedContent: {
      teach: [
        {
          id: 'fb-t1',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'be responsible for',
          level: 'B1',
          type: 'phrase',
          origin: 'ai_expanded',
          use: ['speaking', 'writing'],
          priority: 'high',
          practicalUsefulness: '【AI扩展】基于教材 responsible 拓展而成，职场自述核心句式。',
          explanation: 'Having the official duty to manage something.',
          exampleSentence: 'I am responsible for managing key client accounts.',
          naturalContext: 'Job descriptions and meetings.',
          reason: '【AI扩展】基于教材 responsible 拓展而成，职场自述核心句式。'
        },
        {
          id: 'fb-t2',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'cope with',
          level: 'B1',
          type: 'collocation',
          origin: 'ai_expanded',
          use: ['speaking', 'writing'],
          priority: 'high',
          practicalUsefulness: '【AI扩展】补充高频抗压短语，提升口语与写作丰富度。',
          explanation: 'To deal successfully with a difficult situation.',
          exampleSentence: 'She learned how to cope with heavy workloads.',
          naturalContext: 'Workplace stress and deadlines.',
          reason: '【AI扩展】补充高频抗压短语，提升口语与写作丰富度。'
        },
        {
          id: 'fb-t3',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'work under pressure',
          level: 'B1',
          type: 'phrase',
          origin: 'ai_expanded',
          use: ['speaking', 'writing'],
          priority: 'high',
          practicalUsefulness: '【AI扩展】紧扣工作场景，极为贴近学员的外企工作实际。',
          explanation: 'Performing job duties effectively during tight deadlines.',
          exampleSentence: 'Our team showed they could work under pressure.',
          naturalContext: 'Performance reviews and sprint deadlines.',
          reason: '【AI扩展】紧扣工作场景，极为贴近学员的外企工作实际。'
        }
      ],
      review: [
        {
          id: 'fb-r1',
          source: 'Think B1 & Grammar in Use',
          unit: unitNumber,
          topic,
          text: 'deal with',
          level: 'B1',
          type: 'collocation',
          origin: 'textbook',
          use: ['speaking', 'writing'],
          priority: 'medium',
          practicalUsefulness: '日常职场解决问题最高频词组之一。',
          explanation: 'To take action in order to solve a problem.',
          exampleSentence: 'We dealt with client inquiries smoothly.',
          naturalContext: 'Troubleshooting.',
          reason: '【教材原词】之前学过 — 列入复习与激活。'
        },
        {
          id: 'fb-r2',
          source: 'English Grammar in Use',
          unit: 'Unit 7',
          topic,
          text: 'present perfect (for / since)',
          level: 'B1',
          type: 'grammar',
          origin: 'textbook',
          use: ['speaking', 'writing'],
          priority: 'high',
          practicalUsefulness: '职场履历自述与工作持续时长必用语法。',
          explanation: '表示从过去某一时刻开始持续至今的动作或状态。',
          exampleSentence: 'I have worked here for five years / since 2019.',
          naturalContext: 'Career history and timelines.',
          reason: '【教材原词】之前学过（CET-4/6旧知识）— 列入复习与激活。'
        }
      ],
      use: [
        {
          id: 'fb-u1',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'colleague',
          level: 'A2',
          type: 'vocabulary',
          origin: 'textbook',
          use: ['speaking', 'writing'],
          priority: 'low',
          practicalUsefulness: '同事通称。',
          explanation: 'A person who works with you.',
          exampleSentence: 'I discussed this with my colleagues.',
          naturalContext: 'Office dialogue.',
          reason: '【教材原词】已熟练掌握 — 课堂口语自然运用。'
        },
        {
          id: 'fb-u2',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'promotion',
          level: 'B1',
          type: 'vocabulary',
          origin: 'textbook',
          use: ['speaking', 'writing'],
          priority: 'low',
          practicalUsefulness: '职场晋升。',
          explanation: 'Moving to a higher job level.',
          exampleSentence: 'She received a promotion.',
          naturalContext: 'Career growth.',
          reason: '【教材原词】已熟练掌握 — 结合在写作和口语中自然运用。'
        },
        {
          id: 'fb-u3',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'salary',
          level: 'A2',
          type: 'vocabulary',
          origin: 'textbook',
          use: ['speaking', 'writing'],
          priority: 'low',
          practicalUsefulness: '薪酬待遇。',
          explanation: 'Fixed regular payment.',
          exampleSentence: 'Competitive salary packages.',
          naturalContext: 'HR discussions.',
          reason: '【教材原词】已掌握概念 — 无需花时间讲解。'
        }
      ],
      skip: [
        {
          id: 'fb-s1',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'blacksmith',
          level: 'B1',
          type: 'vocabulary',
          origin: 'textbook',
          use: ['speaking'],
          priority: 'low',
          practicalUsefulness: '铁匠。',
          explanation: 'A person making iron objects.',
          exampleSentence: 'The village blacksmith.',
          naturalContext: 'Historical fiction.',
          reason: '【教材原词】跳过：历史背景词汇，对成人职场学员无实际交流价值。'
        },
        {
          id: 'fb-s2',
          source: textbookName,
          unit: unitNumber,
          topic,
          text: 'mill owner',
          level: 'B1',
          type: 'vocabulary',
          origin: 'textbook',
          use: ['speaking'],
          priority: 'low',
          practicalUsefulness: '磨坊主。',
          explanation: 'Owner of a mill.',
          exampleSentence: 'The mill owner hired workers.',
          naturalContext: 'Historical reading.',
          reason: '【教材原词】跳过：教材阅读附带生词，与学员目标不匹配。'
        }
      ]
    },
    homework: generateFallbackHomework(topic, ['be responsible for', 'cope with', 'work under pressure', 'deal with', 'present perfect']),
    teacherNotes: [
      'Elena 对 "work under pressure" 结合其供应链突发查验经验的反应极好，口语展开顺畅。',
      '下节课需跟进："cope with" 偶有加 "up" 的中文习惯，需在下节课热身中再次强化固定介词。',
      '现在完成时对于 "since 2018" 理解准确，但快速连读时需提醒不要吞掉 auxiliary "have"。'
    ],
    futureReviewNeeds: [
      '下节课热身中快速盲测 cope with 的介词搭配。',
      '适度引入 B2 级表达（如 take the initiative）逐步拔高职场成熟度。',
      '巩固现在完成进行时 (have been doing) 与现在完成时简单的微差。'
    ]
  };
}

function generateFallbackSection(sectionName: string, topic: string) {
  if (sectionName === 'practice') {
    return {
      duration: 15,
      vocabularyQuestions: [
        {
          id: 'pq-new-1',
          type: 'vocab_context',
          category: 'vocabulary',
          origin: 'ai_expanded',
          question: `How do professionals in ${topic} learn to __________ high volumes of complex information?`,
          options: ['cope with', 'give away', 'run over', 'call in'],
          answer: 'cope with',
          explanation: 'cope with 表示成功消化处理大量繁重信息。',
          targetItem: 'cope with'
        }
      ],
      grammarQuestions: []
    };
  }
  return {};
}

function generateFallbackHomework(topic: string, targetLanguage: string[] = []) {
  return {
    vocabulary: Array.from({ length: 10 }).map((_, i) => ({
      id: `hw-v-${i + 1}`,
      question: `Question ${i + 1}: In cross-border ${topic.toLowerCase()} operations, how do senior managers __________ (cope with / deal with) unexpected supplier setbacks?`,
      answer: 'cope with',
      explanation: '考察职场高频应对搭配 cope with。'
    })),
    grammarMCQ: Array.from({ length: 10 }).map((_, i) => ({
      id: `hw-g-${i + 1}`,
      question: `Question ${i + 1}: Our management team __________ closely together since the strategic restructuring took place.`,
      options: ['has worked', 'worked', 'works', 'was working'],
      answer: 'has worked',
      explanation: '配合 since 从句表达从过去持续至今的状态，选用现在完成时。'
    })),
    grammarFill: Array.from({ length: 10 }).map((_, i) => ({
      id: `hw-gf-${i + 1}`,
      question: `Question ${i + 1}: She has supervised the procurement pipeline __________ (for / since) three consecutive quarters.`,
      answer: 'for',
      hint: '在 for 与 since 中二选一'
    })),
    writing: {
      prompt: `Write a 120–150 word professional reflection detailing an important challenge in ${topic} and how your team handled it.`,
      wordCount: '120–150 词',
      guidelines: [
        '明确写出你当时负责的具体业务 (responsible for)。',
        '使用 "cope with" 与 "work under pressure"。',
        '包含至少一句使用现在完成时 (for / since) 的复盘反思。'
      ],
      requiredExpressions: ['cope with', 'be responsible for', 'work under pressure', 'deal with']
    },
    speaking: {
      prompt: `Record a 2-minute spoken reflection describing your approach to managing stress and responsibility in ${topic}.`,
      duration: '2 分钟语音打卡',
      guidelines: [
        '使用自然得体的语速完整表达，不要照念讲稿。',
        '准确融入目标搭配。'
      ],
      requiredExpressions: ['cope with', 'be responsible for', 'work under pressure', 'deal with']
    }
  };
}

// Start server & attach Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Lesson AI server running on port ${PORT}`);
  });
}

startServer();
