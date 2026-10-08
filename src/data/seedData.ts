import { Student, MaterialSource, Lesson, VocabularyExpansion } from '../types';

export const initialStudent: Student = {
  id: 'student-1',
  name: 'Elena Zhao',
  age: 43,
  gender: '女',
  currentLevel: 'B1',
  targetLevel: 'C1',
  goal: '实用英语（外企职场沟通、涉外商务会议与个人海外出行）',
  textbook: 'Think B1',
  background: '大学期间通过 CET-4 和 CET-6，但工作十余年间缺乏高频英语实践。基础语法框架完整，但词汇处于“休眠”状态，口语表达时有中文直译习惯。',
  learningCharacteristics: '不需要从零填鸭初级语法，重点在于被动词汇激活、自然地道固定搭配（Collocations）输入，以及实战口语和书面场景的高频运用。',
  previousLearning: [
    'deal with (固定搭配)',
    '职场面试核心动词与表达',
    '一般过去时与过去进行时区分',
    '商务邮件中的礼貌请求句式',
    '机场值机与出行常见词汇'
  ],
  needsReview: [
    '现在完成时 (Present Perfect with for / since) 与一般过去时区分',
    '职场常用介词搭配 (responsible for vs in charge of)',
    '自然口语连接词 (however, nevertheless, actually)'
  ],
  recentLessonIds: ['lesson-work-career', 'lesson-travel', 'lesson-daily-comm']
};

export const sampleExpansions: VocabularyExpansion[] = [
  {
    id: 'exp-responsible',
    coreWord: 'responsible',
    origin: 'textbook',
    textbookContext: 'Think B1 Unit 6 原始核心词汇',
    level: 'B1',
    wordFamily: {
      noun: ['responsibility (责任/职责)'],
      adjective: ['responsible (负责的)', 'irresponsible (不负责任的)'],
      adverb: ['responsibly (负责任地)']
    },
    prefixesSuffixes: [
      { affix: '-ible', meaning: '能…的 / 具有…性质的', example: 'responsible, flexible' },
      { affix: 'ir-', meaning: '否定前缀（接在 r 开头单词前）', example: 'irresponsible, irregular' }
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
      "It is our team's responsibility to ensure...",
      "Who takes responsibility when plans change?"
    ],
    relatedVocabulary: ['accountable', 'in charge of', 'supervise', 'oversee'],
    exampleSentence: 'In my current position, I am responsible for managing key client accounts.',
    commonMistake: '不要接不定式 *responsible to do*；务必使用 responsible for + V-ing 或名词。',
    spokenAlternatives: ['I handle...', 'I take care of...'],
    writingAlternatives: ['Hold primary accountability for...', 'Oversee the execution of...']
  },
  {
    id: 'exp-cope',
    coreWord: 'cope with',
    origin: 'ai_expanded',
    textbookContext: 'AI 围绕职场压力与责任主题智能扩展的 B1+ 核心搭配',
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
    commonMistake: '切勿说 *cope up with*（中式/印式英语常见多余加 up 错误），标准英语为单一介词 cope with。'
  },
  {
    id: 'exp-pressure',
    coreWord: 'work under pressure',
    origin: 'ai_expanded',
    textbookContext: 'AI 根据成人职场简历与工作沟通需求扩展的高频地道短语',
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
    commonMistake: '在表示心理/工作压力时 pressure 是不可数名词，不要说 *work under pressures*。'
  }
];

export const initialMaterials: MaterialSource[] = [
  {
    id: 'source-think-b1',
    title: 'Think B1',
    level: 'B1',
    category: '剑桥综合核心教材',
    description: '剑桥青少年与成人实用英语教材，注重逻辑批判思考与日常实用表达。',
    totalUnits: 12,
    status: 'ready',
    parsedDate: '2026-10-07',
    units: [
      {
        id: 'unit-b1-6',
        unitNumber: 'Unit 6',
        title: 'Work & Ambition',
        topic: 'Work & Career',
        grammarPoint: 'Present Perfect (for / since) & Past Simple contrast',
        readingTopic: 'Modern Career Paths and Workplace Resilience',
        speakingTopic: 'Workplace problems, career history and pressure management',
        writingTopic: 'Professional reflection on a challenging work situation (120-150 words)',
        rawTextbookItems: [
          {
            id: 'raw-1',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'responsible',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'high',
            practicalUsefulness: '教材核心词汇，描述个人职责与分工。',
            explanation: 'Having an obligation to do something, or having control over or care for someone.',
            exampleSentence: 'She is a responsible manager.',
            naturalContext: 'Job descriptions and roles.',
            reason: '教材原始词汇 — AI将对其进行词族与固定搭配深度扩展。'
          },
          {
            id: 'raw-2',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'deal with',
            level: 'B1',
            type: 'collocation',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'high',
            practicalUsefulness: '日常职场解决问题最高频词组之一。',
            explanation: 'To take action in order to solve a problem or handle a situation.',
            exampleSentence: 'We deal with customer feedback daily.',
            naturalContext: 'Problem solving and troubleshooting.',
            reason: '教材原始词汇 — 属于之前学过的内容，列入复习与激活。'
          },
          {
            id: 'raw-3',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'colleague',
            level: 'A2',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'low',
            practicalUsefulness: '同事通称。',
            explanation: 'A person that you work with in a profession or business.',
            exampleSentence: 'My colleagues supported the plan.',
            naturalContext: 'Office dialogue.',
            reason: '已熟练掌握 — 在课堂对话中自然运用，不浪费时间单讲。'
          },
          {
            id: 'raw-4',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'promotion',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'low',
            practicalUsefulness: '职场晋升。',
            explanation: 'The action of raising someone to a higher position.',
            exampleSentence: 'She received a well-deserved promotion.',
            naturalContext: 'Career trajectory.',
            reason: '已熟练掌握 — 结合在写作和口语中自然运用。'
          },
          {
            id: 'raw-5',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'salary',
            level: 'A2',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'low',
            practicalUsefulness: '薪资报酬。',
            explanation: 'A fixed regular payment made by an employer.',
            exampleSentence: 'Competitive salary packages.',
            naturalContext: 'HR conversation.',
            reason: '已掌握概念 — 无需花时间讲解。'
          },
          {
            id: 'raw-6',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'blacksmith',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking'],
            priority: 'low',
            practicalUsefulness: '铁匠（历史工艺背景词汇）。',
            explanation: 'A person who makes and repairs iron things.',
            exampleSentence: 'The village blacksmith.',
            naturalContext: 'Historical stories.',
            reason: '跳过：历史背景词汇，对成人职场学员无实际交流价值。'
          },
          {
            id: 'raw-7',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'mill owner',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking'],
            priority: 'low',
            practicalUsefulness: '磨坊主/工厂主（工业革命背景词）。',
            explanation: 'An owner of an industrial mill.',
            exampleSentence: 'The mill owner hired workers.',
            naturalContext: 'Historical fiction.',
            reason: '跳过：教材阅读附带生词，与学员目标不匹配。'
          },
          {
            id: 'raw-8',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'apprentice',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking'],
            priority: 'low',
            practicalUsefulness: '学徒工。',
            explanation: 'A person learning a trade from a skilled employer.',
            exampleSentence: 'He worked as an apprentice.',
            naturalContext: 'Craftsmanship.',
            reason: '跳过：低频手工职业词，暂不需要占用课时。'
          }
        ],
        items: [
          {
            id: 'm-1',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'be responsible for',
            level: 'B1',
            type: 'phrase',
            origin: 'ai_expanded',
            use: ['speaking', 'writing'],
            priority: 'high',
            practicalUsefulness: '【AI扩展】基于教材 responsible 扩展为高频地道职场短语。',
            explanation: 'Having the official duty to look after something or someone and make decisions.',
            exampleSentence: 'In my current role, I am responsible for managing key client accounts.',
            naturalContext: 'Job descriptions, self-introductions, performance reviews.',
            commonMistake: '务必后接 for + V-ing/名词，不要写成 *responsible to organize*。',
            quickCheckQuestion: '填空：She is responsible for __________ (coordinate) the weekly schedule.',
            quickCheckAnswer: 'coordinating',
            reason: '【AI扩展】基于教材 responsible 拓展而成，职场自述核心句式。'
          },
          {
            id: 'm-2',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'cope with',
            level: 'B1',
            type: 'collocation',
            origin: 'ai_expanded',
            use: ['speaking', 'writing'],
            priority: 'high',
            practicalUsefulness: '【AI扩展】针对压力应对场景补充的高频实用表达。',
            explanation: 'To deal successfully with a difficult situation or heavy demands.',
            exampleSentence: 'She learned how to cope with heavy workloads without burning out.',
            naturalContext: 'Discussing stressful quarters, reorganization, and tight deadlines.',
            commonMistake: '不要说 *cope up with*（避免错误加 up），直接使用 cope with。',
            quickCheckQuestion: 'Which is correct: "cope with pressure" or "cope up with pressure"?',
            quickCheckAnswer: '"cope with pressure"',
            reason: '【AI扩展】补充高频抗压短语，提升口语与写作丰富度。'
          },
          {
            id: 'm-3',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'work under pressure',
            level: 'B1',
            type: 'phrase',
            origin: 'ai_expanded',
            use: ['speaking', 'writing'],
            priority: 'high',
            practicalUsefulness: '【AI扩展】标准职场抗压与面试核心搭配。',
            explanation: 'Performing job duties effectively during tight deadlines or emergencies.',
            exampleSentence: 'Our project team demonstrated we could work under pressure to deliver on time.',
            naturalContext: 'Performance reviews, deadline sprints, crisis management.',
            commonMistake: '注意 pressure 在此语境不可数，切勿说 *work under pressures*。',
            quickCheckQuestion: 'Is "pressure" countable in "work under pressure"?',
            quickCheckAnswer: 'No, it is uncountable.',
            reason: '【AI扩展】紧扣工作场景，极为贴近 Elena 的外企工作实际。'
          },
          {
            id: 'm-4',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'deal with',
            level: 'B1',
            type: 'collocation',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'medium',
            practicalUsefulness: '【教材原词】解决日常问题、接待客户必备搭配。',
            explanation: 'To take action in order to solve a problem or handle a situation.',
            exampleSentence: 'We need to deal with customer inquiries promptly.',
            naturalContext: 'Daily troubleshooting with colleagues or clients.',
            reason: '【教材原词】之前学过 — 列入复习与激活。'
          },
          {
            id: 'm-5',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'colleague',
            level: 'A2',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'low',
            practicalUsefulness: '【教材原词】日常同事通称。',
            explanation: 'A person who works with you.',
            exampleSentence: 'I discussed the proposal with my colleagues yesterday.',
            naturalContext: 'Everyday workplace dialogue.',
            reason: '【教材原词】已掌握 — 课堂口语自然运用。'
          },
          {
            id: 'm-6',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'promotion',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'low',
            practicalUsefulness: '【教材原词】升职晋级。',
            explanation: 'Moving to a higher job level with more responsibility.',
            exampleSentence: 'She received a well-deserved promotion last spring.',
            naturalContext: 'Career trajectory reflections.',
            reason: '【教材原词】已掌握 — 写入写作任务。'
          },
          {
            id: 'm-7',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'salary',
            level: 'A2',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking', 'writing'],
            priority: 'low',
            practicalUsefulness: '【教材原词】薪酬待遇。',
            explanation: 'A fixed regular payment made by an employer.',
            exampleSentence: 'Competitive salary packages attract skilled talent.',
            naturalContext: 'HR and recruitment conversations.',
            reason: '【教材原词】已掌握 — 课堂中直接运用。'
          },
          {
            id: 'm-8',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'blacksmith',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking'],
            priority: 'low',
            practicalUsefulness: '【教材原词】铁匠。',
            explanation: 'A person who makes and repairs iron items.',
            exampleSentence: 'The village blacksmith.',
            naturalContext: 'Historical stories.',
            reason: '【教材原词】跳过：历史背景词，实用价值极低。'
          },
          {
            id: 'm-9',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'mill owner',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking'],
            priority: 'low',
            practicalUsefulness: '【教材原词】磨坊主。',
            explanation: 'An owner of an industrial mill.',
            exampleSentence: 'The mill owner hired many factory workers.',
            naturalContext: 'Historical readings.',
            reason: '【教材原词】跳过：无成人职场价值。'
          },
          {
            id: 'm-10',
            source: 'Think B1',
            unit: 'Unit 6',
            topic: 'Work & Career',
            text: 'apprentice',
            level: 'B1',
            type: 'vocabulary',
            origin: 'textbook',
            use: ['speaking'],
            priority: 'low',
            practicalUsefulness: '【教材原词】学徒。',
            explanation: 'A person learning a trade from an employer.',
            exampleSentence: 'He worked as an apprentice for three years.',
            naturalContext: 'Crafts and vocational trades.',
            reason: '【教材原词】跳过：不符合当前学员的学习目标。'
          }
        ]
      },
      {
        id: 'unit-b1-1',
        unitNumber: 'Unit 1',
        title: 'Life & Routine',
        topic: 'Daily Communication',
        grammarPoint: 'Present Simple vs Present Continuous',
        readingTopic: 'Modern Daily Habits and Time Tracking',
        speakingTopic: 'Work-life balance and morning routines',
        writingTopic: 'Productivity rules memo (100-120 words)',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-2',
        unitNumber: 'Unit 2',
        title: 'Going Places',
        topic: 'Travel',
        grammarPoint: 'Past Continuous & Past Simple with when/while',
        readingTopic: 'Memorable Journeys off the Beaten Track',
        speakingTopic: 'Travel delays and memorable experiences',
        writingTopic: 'Travel recommendation email (120-150 words)',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-3',
        unitNumber: 'Unit 3',
        title: 'The Future is Now',
        topic: 'Technology & Work',
        grammarPoint: 'Will, be going to, present continuous for future',
        readingTopic: 'AI and the Future of Workplace Roles',
        speakingTopic: 'Predicting technological impacts on your industry',
        writingTopic: 'Opinion essay on workplace automation',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-4',
        unitNumber: 'Unit 4',
        title: 'Science & Discovery',
        topic: 'General English',
        grammarPoint: 'Comparative and superlative forms with adverbs',
        readingTopic: 'Everyday Scientific Innovations',
        speakingTopic: 'Explaining a complex process simply',
        writingTopic: 'Summary report',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-5',
        unitNumber: 'Unit 5',
        title: 'Entertainment & Media',
        topic: 'Daily Communication',
        grammarPoint: 'Modal verbs of obligation and permission',
        readingTopic: 'Streaming Culture and Digital Well-being',
        speakingTopic: 'Recommending films, books, and podcasts',
        writingTopic: 'Review of a professional book or documentary',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-7',
        unitNumber: 'Unit 7',
        title: 'Healthy Body, Healthy Mind',
        topic: 'Health & Lifestyle',
        grammarPoint: 'First Conditional with if / unless',
        readingTopic: 'Stress Management and Modern Wellness',
        speakingTopic: 'Healthy habits for busy professionals',
        writingTopic: 'Action plan for stress relief',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-8',
        unitNumber: 'Unit 8',
        title: 'Creative Minds',
        topic: 'Innovation',
        grammarPoint: 'Second Conditional for hypothetical scenarios',
        readingTopic: 'Design Thinking in Business Solutions',
        speakingTopic: 'If you were CEO of your company...',
        writingTopic: 'Proposal for workplace improvement',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-9',
        unitNumber: 'Unit 9',
        title: 'Money Matters',
        topic: 'Finance & Negotiation',
        grammarPoint: 'Passive Voice (Present & Past)',
        readingTopic: 'Smart Budgeting and Financial Literacy',
        speakingTopic: 'Discussing budgets, proposals, and pricing',
        writingTopic: 'Formal quotation and pricing cover letter',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-10',
        unitNumber: 'Unit 10',
        title: 'Global Community',
        topic: 'Cross-Cultural Communication',
        grammarPoint: 'Reported Speech (statements and questions)',
        readingTopic: 'Navigating Cross-Cultural Business Etiquette',
        speakingTopic: 'Handling cross-cultural misunderstandings',
        writingTopic: 'Summary email of a multilateral meeting',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-11',
        unitNumber: 'Unit 11',
        title: 'Environmental Horizons',
        topic: 'Sustainability',
        grammarPoint: 'Relative Clauses (defining and non-defining)',
        readingTopic: 'ESG Practices in International Corporations',
        speakingTopic: 'Sustainability initiatives in modern offices',
        writingTopic: 'Sustainability pledge report',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b1-12',
        unitNumber: 'Unit 12',
        title: 'Looking Back, Moving Forward',
        topic: 'Milestones & Achievements',
        grammarPoint: 'Third Conditional & Wish structures',
        readingTopic: 'Career Transitions and Lifelong Learning',
        speakingTopic: 'Reflecting on past career milestones',
        writingTopic: 'Five-year personal development plan',
        rawTextbookItems: [],
        items: []
      }
    ]
  },
  {
    id: 'source-think-b2',
    title: 'Think B2',
    level: 'B2',
    category: '剑桥进阶核心教材',
    description: '进阶中高级综合教材，聚焦更细腻的观点论证与更复杂的职场情境。',
    totalUnits: 12,
    status: 'ready',
    parsedDate: '2026-10-06',
    units: [
      {
        id: 'unit-b2-1',
        unitNumber: 'Unit 1',
        title: 'Professional Growth',
        topic: 'Work & Career',
        grammarPoint: 'Advanced Conditionals & Inversion',
        readingTopic: 'Proactive Leadership in Fast-Paced Startups',
        speakingTopic: 'Taking initiative vs waiting for instructions',
        writingTopic: 'Executive summary report',
        rawTextbookItems: [],
        items: []
      },
      {
        id: 'unit-b2-2',
        unitNumber: 'Unit 2',
        title: 'Conflict Resolution',
        topic: 'Work & Career',
        grammarPoint: 'Modals of deduction in the past (must have / could have)',
        readingTopic: 'De-escalating High-Stakes Workplace Disputes',
        speakingTopic: 'Reaching a consensus during team friction',
        writingTopic: 'Dispute resolution memo',
        rawTextbookItems: [],
        items: []
      }
    ]
  },
  {
    id: 'source-grammar-in-use',
    title: 'English Grammar in Use',
    level: 'B1-B2',
    category: '语法专项精讲',
    description: 'Raymond Murphy 编写的全球权威中级英语语法参考书与实战题库。',
    totalUnits: 12,
    status: 'ready',
    parsedDate: '2026-10-05',
    units: [
      {
        id: 'unit-giu-7',
        unitNumber: 'Unit 7',
        title: 'Present Perfect (for / since)',
        topic: 'Work & Career',
        grammarPoint: 'Present Perfect with for and since for ongoing states',
        readingTopic: 'Distinguishing past duration from completed timestamps',
        speakingTopic: 'Explaining your company tenure and career duration',
        writingTopic: 'Professional career history profile',
        rawTextbookItems: [],
        items: []
      }
    ]
  }
];

export const sampleWorkCareerLesson: Lesson = {
  id: 'lesson-work-career',
  topic: 'Work & Career',
  textbookName: 'Think B1',
  unitNumber: 'Unit 6',
  unitTitle: 'Work & Ambition',
  date: '10月8日',
  duration: 120,
  studentId: 'student-1',
  todayFocus: '工作和职场表达（抗压、职责与现在完成时）',
  status: 'ready',

  expansions: sampleExpansions,

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
        },
        expansion: sampleExpansions[0]
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
        },
        expansion: sampleExpansions[1]
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
        },
        expansion: sampleExpansions[2]
      }
    ]
  },

  practice: {
    duration: 15,
    vocabularyQuestions: [
      {
        id: 'pq-v1',
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
        id: 'pq-v2',
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
        id: 'pq-v3',
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
        id: 'pq-v4',
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
        id: 'pq-v5',
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
        id: 'pq-v6',
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
        id: 'pq-v7',
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
        id: 'pq-v8',
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
        id: 'pq-v9',
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
        id: 'pq-v10',
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
      '提醒她在阐述个人职责时自然运用现在完成时（例如："Since that incident, I have been more cautious about..."）。'
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
      initialMaterials[0].units[0].items[0], // be responsible for (AI扩展)
      initialMaterials[0].units[0].items[1], // cope with (AI扩展)
      initialMaterials[0].units[0].items[2]  // work under pressure (AI扩展)
    ],
    review: [
      initialMaterials[0].units[0].items[3], // deal with (教材原词)
      {
        id: 'rev-gram-1',
        source: 'Think B1 & Grammar in Use',
        unit: 'Unit 6',
        topic: 'Work & Career',
        text: 'present perfect (for / since)',
        level: 'B1',
        type: 'grammar',
        origin: 'textbook',
        use: ['speaking', 'writing'],
        priority: 'high',
        practicalUsefulness: '职场履历自述与工作持续时长必用语法。',
        explanation: '表示从过去某一时刻开始持续至今的动作或状态。',
        exampleSentence: 'I have worked here for eight years / since 2018.',
        naturalContext: 'Career timeline.',
        reason: '之前学过（CET-4/6旧知识）— 列入复习与激活。'
      }
    ],
    use: [
      initialMaterials[0].units[0].items[4], // colleague (教材原词)
      initialMaterials[0].units[0].items[5], // promotion (教材原词)
      initialMaterials[0].units[0].items[6]  // salary (教材原词)
    ],
    skip: [
      initialMaterials[0].units[0].items[7], // blacksmith (教材原词)
      initialMaterials[0].units[0].items[8], // mill owner (教材原词)
      initialMaterials[0].units[0].items[9]  // apprentice (教材原词)
    ]
  },

  homework: {
    vocabulary: [
      {
        id: 'hw-v1',
        question: 'When the overseas server shut down unexpectedly, the operations director had to __________ the crisis calmly.',
        answer: 'cope with',
        explanation: 'cope with 处理突发复杂局面。'
      },
      {
        id: 'hw-v2',
        question: 'Who will be __________ submitting the quarterly ESG compliance report to the board?',
        answer: 'responsible for',
        explanation: 'responsible for 后接动名词。'
      },
      {
        id: 'hw-v3',
        question: 'Emergency response leaders are professionally trained to __________ without succumbing to panic.',
        answer: 'work under pressure',
        explanation: '职场固定抗压搭配。'
      },
      {
        id: 'hw-v4',
        question: 'Our customer support department is trained to __________ demanding client complaints with patience.',
        answer: 'deal with',
        explanation: 'deal with 处理/解决。'
      },
      {
        id: 'hw-v5',
        question: 'It took several months for the newly promoted director to __________ the rapid expansion of the regional office.',
        answer: 'cope with',
        explanation: '应对高负荷扩张。'
      },
      {
        id: 'hw-v6',
        question: 'Each regional division head is held personally __________ the accuracy of their financial projections.',
        answer: 'responsible for',
        explanation: 'be held responsible for 对某事被问责。'
      },
      {
        id: 'hw-v7',
        question: 'Can you describe an instance when you had to __________ to deliver an executive pitch on time?',
        answer: 'work under pressure',
        explanation: '在高压下产出成果。'
      },
      {
        id: 'hw-v8',
        question: 'The management steering committee meets tomorrow morning to __________ supplier contract disputes.',
        answer: 'deal with',
        explanation: '解决合约纠纷。'
      },
      {
        id: 'hw-v9',
        question: 'Practicing regular time-boxing techniques can help managers __________ chronic workplace fatigue.',
        answer: 'cope with',
        explanation: '有效排解工作倦怠。'
      },
      {
        id: 'hw-v10',
        question: 'Senior executives must be adept at both strategic delegation and __________ corporate reputation.',
        answer: 'being responsible for',
        explanation: '动名词平行结构：delegation and being responsible for。'
      }
    ],
    grammarMCQ: [
      {
        id: 'hw-g1',
        question: 'She __________ as a business strategist for six years before joining our company in 2022.',
        options: ['worked', 'has worked', 'is working', 'has been working since'],
        answer: 'worked',
        explanation: '过去某一时间段已彻底结束的历史履历用一般过去时。'
      },
      {
        id: 'hw-g2',
        question: 'Our logistics firm __________ eco-friendly packing containers since October 2021.',
        options: ['has utilized', 'utilized', 'utilizes', 'is utilizing'],
        answer: 'has utilized',
        explanation: '从过去某点持续至今的商业举措用现在完成时。'
      },
      {
        id: 'hw-g3',
        question: 'How long __________ your current overseas distributor?',
        options: ['have you known', 'did you know', 'do you know', 'are you knowing'],
        answer: 'have you known',
        explanation: '状态动词 know 询问时长用现在完成时。'
      },
      {
        id: 'hw-g4',
        question: 'They have been renegotiating the regional vendor agreement __________ three whole weeks.',
        options: ['for', 'since', 'during', 'over than'],
        answer: 'for',
        explanation: '三周时间跨度用 for。'
      },
      {
        id: 'hw-g5',
        question: 'Julian has directed the international compliance team __________ he stepped down from the executive board.',
        options: ['since', 'for', 'from', 'when'],
        answer: 'since',
        explanation: '时间起始从句用 since。'
      },
      {
        id: 'hw-g6',
        question: 'We __________ three major supply chain bottlenecks so far this quarter.',
        options: ['have solved', 'solved', 'solve', 'are solving'],
        answer: 'have solved',
        explanation: 'so far this quarter 提示包含现在的时间段。'
      },
      {
        id: 'hw-g7',
        question: 'I __________ any severe server downtime since our team upgraded the cloud infrastructure.',
        options: ['have not encountered', 'did not encounter', 'do not encounter', 'am not encountering'],
        answer: 'have not encountered',
        explanation: '配合 since 从句的完成时否定。'
      },
      {
        id: 'hw-g8',
        question: 'The multinational brand has expanded across Southeast Asia __________ nearly a decade.',
        options: ['for', 'since', 'in', 'ago'],
        answer: 'for',
        explanation: '时间跨度用 for。'
      },
      {
        id: 'hw-g9',
        question: 'When __________ the new enterprise software officially launched?',
        options: ['was', 'has been', 'is', 'did'],
        answer: 'was',
        explanation: 'when 针对过去具体时间点提问用一般过去时。'
      },
      {
        id: 'hw-g10',
        question: 'She has been responsible for key Asian accounts __________ the previous director retired.',
        options: ['since', 'for', 'when', 'from'],
        answer: 'since',
        explanation: '起始点标记词 since。'
      }
    ],
    grammarFill: [
      {
        id: 'hw-gf1',
        question: 'I __________ (live) in this metropolitan district for over fifteen years.',
        answer: 'have lived',
        hint: '使用现在完成时'
      },
      {
        id: 'hw-gf2',
        question: 'Our engineering lead has directed this pipeline __________ (for / since) March.',
        answer: 'since',
        hint: '在 for 与 since 中二选一'
      },
      {
        id: 'hw-gf3',
        question: 'The finance division __________ (not finalize) the Q4 audit report yet.',
        answer: 'has not finalized',
        hint: '现在完成时否定形式'
      },
      {
        id: 'hw-gf4',
        question: 'We have maintained healthy operating margins __________ (for / since) five quarters.',
        answer: 'for',
        hint: '连续五个季度的时长'
      },
      {
        id: 'hw-gf5',
        question: 'Since she completed her MBA, she __________ (lead) several turnaround projects.',
        answer: 'has led',
        hint: 'lead 的现在完成时'
      },
      {
        id: 'hw-gf6',
        question: 'How long __________ (you / be) responsible for client onboarding deliverables?',
        answer: 'have you been',
        hint: '现在完成时疑问句'
      },
      {
        id: 'hw-gf7',
        question: 'They __________ (work) under intense pressure since the regulatory audit started.',
        answer: 'have worked',
        hint: '从过去审计开始至今'
      },
      {
        id: 'hw-gf8',
        question: 'Our senior supply chain planner has dealt with international tariffs __________ (for / since) twenty years.',
        answer: 'for',
        hint: '时长介词'
      },
      {
        id: 'hw-gf9',
        question: 'Ever since we introduced weekly synchronization, misalignment __________ (drop) dramatically.',
        answer: 'has dropped',
        hint: 'drop 的完成时'
      },
      {
        id: 'hw-gf10',
        question: 'He __________ (hold) this executive director position since 2018.',
        answer: 'has held',
        hint: 'hold 的完成时'
      }
    ],
    writing: {
      prompt: 'Write a professional reflection (120–150 words) about an unexpected workplace crisis or stressful period you navigated in your professional career.',
      wordCount: '120–150 词',
      guidelines: [
        '明确写出你当时负责的具体业务 (responsible for)。',
        '包含至少两句话展现团队当时如何在压力下协同 (work under pressure)。',
        '写明你如何沉着应对并化解了主要危机 (cope with / deal with)。',
        '包含至少一句使用现在完成时 (for / since) 的长远经验复盘。'
      ],
      requiredExpressions: ['cope with', 'be responsible for', 'work under pressure', 'deal with']
    },
    speaking: {
      prompt: 'Record a 2-minute spoken voice response describing how your ability to cope with workplace stress has evolved throughout your career.',
      duration: '2 分钟语音录音',
      guidelines: [
        '不要照本宣科念讲稿，以自然得体的语速分享自身真实心路历程。',
        '对比你职业生涯初期与当下的职责与抗压心态。',
        '自然使用目标搭配：cope with, be responsible for, work under pressure, deal with。'
      ],
      requiredExpressions: ['cope with', 'be responsible for', 'work under pressure', 'deal with']
    }
  },

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

export const sampleTravelLesson: Lesson = {
  id: 'lesson-travel',
  topic: 'Travel & Horizons',
  textbookName: 'Think B1',
  unitNumber: 'Unit 2',
  unitTitle: 'Going Places',
  date: '10月5日',
  duration: 120,
  studentId: 'student-1',
  todayFocus: '海外出行、突发延误沟通与过去进行时',
  status: 'completed',
  expansions: [],
  review: {
    duration: 20,
    targetVocabulary: ['look forward to', 'airport terms'],
    targetGrammar: ['past continuous vs past simple'],
    quickQuestions: [
      { id: 't-rq-1', prompt: 'What travel destination are you looking forward to visiting next year?', target: 'look forward to + V-ing', answer: 'I look forward to visiting...' }
    ],
    sentenceCompletions: [
      { id: 't-rc-1', prompt: 'I look forward to __________ (hear) your flight details.', target: 'hearing', answer: 'hearing' }
    ],
    speakingQuestions: [
      { id: 't-rs-1', prompt: 'Tell me about an unexpected delay you experienced while traveling.', targetLanguage: ['while I was waiting', 'suddenly happened'] }
    ]
  },
  warmup: {
    duration: 10,
    topic: '个人旅行偏好与行程制定 (Travel preferences)',
    leadInPrompt: 'Do you prefer guided cultural tours or discovering hidden spots on your own?',
    discussionQuestions: ['How do you usually plan your personal holidays?'],
    activationKeywords: ['destination', 'itinerary', 'culture', 'scenery']
  },
  newLesson: {
    duration: 25,
    items: [
      {
        id: 't-nl-1',
        item: 'off the beaten track',
        level: 'B2',
        type: 'collocation',
        origin: 'ai_expanded',
        explanation: 'Far away from places frequented by standard tourists.',
        exampleSentence: 'We rented a small stone cottage off the beaten track in Tuscany.',
        naturalContext: 'Travel preferences and authentic cultural immersion.',
        commonMistake: 'Do not omit "track".',
        quickCheck: { question: 'Complete: "places off the beaten __________"', answer: 'track' }
      }
    ]
  },
  practice: { duration: 15, vocabularyQuestions: [], grammarQuestions: [] },
  speaking: {
    duration: 20,
    topic: '难忘的旅行波折 (Memorable Journeys)',
    mainQuestion: 'Describe a trip that did not go according to plan.',
    followUpQuestions: ['How did you adapt?'],
    usefulLanguage: ['off the beaten track', 'look forward to'],
    teacherPrompts: ['引导口语流畅度。'],
    sampleStudentScenario: 'Lost luggage in Frankfurt.'
  },
  writing: {
    duration: 30,
    task: 'Write a travel recommendation for an overseas colleague visiting your home region.',
    targetWordCount: '120-150 words',
    usefulLanguage: ['off the beaten track', 'look forward to'],
    suggestedStructure: [{ step: '1. Introduction', description: 'Welcome and destination overview.' }],
    timedMinutes: 30
  },
  selectedContent: {
    teach: [],
    review: [],
    use: [],
    skip: []
  },
  homework: {
    vocabulary: [],
    grammarMCQ: [],
    grammarFill: [],
    writing: {
      prompt: 'Write an email recommending a quiet holiday destination.',
      wordCount: '120-150 words',
      guidelines: ['Use "off the beaten track"'],
      requiredExpressions: ['off the beaten track']
    },
    speaking: {
      prompt: 'Share a 2-minute memory of your favorite travel experience.',
      duration: '2 minutes',
      guidelines: ['Use natural tone'],
      requiredExpressions: ['look forward to']
    }
  },
  teacherNotes: ['Elena 讲述托斯卡纳行程时口语积极，介词运用明显比上周自然。'],
  futureReviewNeeds: ['进一步巩固 look forward to 后接动名词用法。']
};

export const sampleDailyCommLesson: Lesson = {
  id: 'lesson-daily-comm',
  topic: 'Daily Communication',
  textbookName: 'Think B1',
  unitNumber: 'Unit 1',
  unitTitle: 'Life & Routine',
  date: '10月1日',
  duration: 120,
  studentId: 'student-1',
  todayFocus: '日常习惯养成、时间管理与进行时对比',
  status: 'completed',
  expansions: [],
  review: {
    duration: 20,
    targetVocabulary: ['get into the habit of'],
    targetGrammar: ['habitual present vs continuous'],
    quickQuestions: [],
    sentenceCompletions: [],
    speakingQuestions: []
  },
  warmup: {
    duration: 10,
    topic: '工作日常时间管理 (Time Management)',
    leadInPrompt: 'How do you structure your workday mornings?',
    discussionQuestions: ['What habit has made you the most productive?'],
    activationKeywords: ['routine', 'schedule', 'focus']
  },
  newLesson: {
    duration: 25,
    items: [
      {
        id: 'dc-nl-1',
        item: 'keep track of',
        level: 'B1',
        type: 'collocation',
        origin: 'ai_expanded',
        explanation: 'To maintain continuous awareness or records of progress/finances.',
        exampleSentence: 'I use a simple spreadsheet to keep track of quarterly deliverables.',
        naturalContext: 'Task tracking and accountability.',
        commonMistake: 'Do not confuse with "keep on track".',
        quickCheck: { question: 'Complete: "keep track __________ spending"', answer: 'of' }
      }
    ]
  },
  practice: { duration: 15, vocabularyQuestions: [], grammarQuestions: [] },
  speaking: {
    duration: 20,
    topic: '个人效率工具 (Personal Efficiency)',
    mainQuestion: 'What daily systems help you manage a demanding schedule?',
    followUpQuestions: ['What happens when plans change?'],
    usefulLanguage: ['keep track of', 'get into the habit of'],
    teacherPrompts: ['引导日常表达。'],
    sampleStudentScenario: 'Balancing work with conference calls.'
  },
  writing: {
    duration: 30,
    task: 'Write a memo suggesting how to improve team meeting efficiency.',
    targetWordCount: '120-150 words',
    usefulLanguage: ['keep track of'],
    suggestedStructure: [{ step: '1. Current challenges', description: 'Why meetings run over time.' }],
    timedMinutes: 30
  },
  selectedContent: {
    teach: [],
    review: [],
    use: [],
    skip: []
  },
  homework: {
    vocabulary: [],
    grammarMCQ: [],
    grammarFill: [],
    writing: {
      prompt: 'Write three rules for effective personal time management.',
      wordCount: '100-120 words',
      guidelines: ['Use "keep track of"'],
      requiredExpressions: ['keep track of']
    },
    speaking: {
      prompt: 'Describe your ideal Sunday routine in 2 minutes.',
      duration: '2 minutes',
      guidelines: [],
      requiredExpressions: []
    }
  },
  teacherNotes: ['Elena 掌握了常见时间搭配。'],
  futureReviewNeeds: ['继续关注 keep track of 的自然输出。']
};

export const initialLessons: Lesson[] = [
  sampleWorkCareerLesson,
  sampleTravelLesson,
  sampleDailyCommLesson
];
