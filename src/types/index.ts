export type ContentClassification = 'teach' | 'review' | 'use' | 'skip';

export interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  currentLevel: string; // 'B1'
  targetLevel: string;  // 'C1'
  goal: string;         // '实用英语'
  textbook: string;     // 'Think B1'
  background: string;
  learningCharacteristics: string;
  previousLearning: string[];
  needsReview: string[];
  recentLessonIds: string[];
}

export interface VocabularyExpansion {
  id: string;
  coreWord: string;
  origin: 'textbook' | 'ai_expanded';
  textbookContext?: string;
  level: string;
  wordFamily?: {
    noun?: string[];
    verb?: string[];
    adjective?: string[];
    adverb?: string[];
  };
  prefixesSuffixes?: {
    affix: string;
    meaning: string;
    example: string;
  }[];
  relatedForms?: string[]; // e.g. be responsible for, take responsibility for
  collocations: string[];  // e.g. be responsible for a project, work under pressure
  usefulExpressions: string[]; // e.g. It's my responsibility to...
  relatedVocabulary: string[]; // e.g. accountable, manage, supervise
  exampleSentence: string;
  commonMistake?: string;
  spokenAlternatives?: string[];
  writingAlternatives?: string[];
}

export interface MaterialItem {
  id: string;
  source: string; // e.g. "Think B1", "Think B2"
  unit: string;   // e.g. "Unit 6"
  topic: string;  // e.g. "Work & Career"
  text: string;   // phrase/collocation/grammar
  level: string;  // "B1", "B2", "C1"
  type: 'vocabulary' | 'collocation' | 'phrase' | 'grammar' | 'expression';
  origin: 'textbook' | 'ai_expanded';
  use: ('speaking' | 'writing')[];
  priority: 'high' | 'medium' | 'low';
  practicalUsefulness: string;
  explanation: string;
  exampleSentence: string;
  naturalContext: string;
  commonMistake?: string;
  quickCheckQuestion?: string;
  quickCheckAnswer?: string;
  reason?: string;
  expansionData?: VocabularyExpansion;
}

export interface MaterialUnit {
  id: string;
  unitNumber: string; // e.g. "Unit 6"
  title: string;      // e.g. "Work & Ambition"
  topic: string;      // e.g. "Work & Career"
  grammarPoint: string;
  readingTopic: string;
  speakingTopic: string;
  writingTopic: string;
  rawTextbookItems: MaterialItem[];
  items: MaterialItem[];
}

export interface MaterialSource {
  id: string;
  title: string;       // e.g. "Think B1"
  level: string;       // "B1"
  category: string;    // "经典综合教材"
  description: string;
  totalUnits: number;
  status: 'ready' | 'parsing';
  parsedDate?: string;
  units: MaterialUnit[];
}

export interface ReviewQuickQuestion {
  id: string;
  prompt: string;
  answer: string;
  target: string;
}

export interface ReviewSentenceCompletion {
  id: string;
  prompt: string;
  target: string;
  answer: string;
}

export interface ReviewSpeakingQuestion {
  id: string;
  prompt: string;
  targetLanguage: string[];
}

export interface ReviewSection {
  duration: number; // 20 min
  targetVocabulary: string[];
  targetGrammar: string[];
  quickQuestions: ReviewQuickQuestion[];
  sentenceCompletions: ReviewSentenceCompletion[];
  speakingQuestions: ReviewSpeakingQuestion[];
}

export interface WarmupSection {
  duration: number; // 10 min
  topic: string;
  leadInPrompt: string;
  discussionQuestions: string[];
  activationKeywords: string[];
}

export interface NewLessonItem {
  id: string;
  item: string;
  level: string;
  type: string;
  origin: 'textbook' | 'ai_expanded';
  explanation: string;
  exampleSentence: string;
  naturalContext: string;
  commonMistake: string;
  quickCheck: {
    question: string;
    answer: string;
  };
  expansion?: VocabularyExpansion;
}

export interface NewLessonSection {
  duration: number; // 25 min
  items: NewLessonItem[];
}

export interface PracticeQuestion {
  id: string;
  type: 'vocab_choice' | 'vocab_context' | 'grammar_mcq' | 'grammar_fill';
  category: 'vocabulary' | 'grammar';
  origin: 'textbook' | 'ai_expanded';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  targetItem: string;
}

export interface PracticeSection {
  duration: number; // 15 min
  vocabularyQuestions: PracticeQuestion[];
  grammarQuestions: PracticeQuestion[];
}

export interface SpeakingSection {
  duration: number; // 20 min
  topic: string;
  mainQuestion: string;
  followUpQuestions: string[];
  usefulLanguage: string[];
  teacherPrompts: string[];
  sampleStudentScenario: string;
}

export interface WritingSection {
  duration: number; // 30 min
  task: string;
  targetWordCount: string;
  usefulLanguage: string[];
  suggestedStructure: { step: string; description: string }[];
  timedMinutes: number;
}

export interface SelectedContentClassification {
  teach: MaterialItem[];
  review: MaterialItem[];
  use: MaterialItem[];
  skip: MaterialItem[];
}

export interface HomeworkQuestion {
  id: string;
  question: string;
  answer: string;
  options?: string[];
  hint?: string;
  explanation?: string;
}

export interface HomeworkTask {
  vocabulary: HomeworkQuestion[];
  grammarMCQ: HomeworkQuestion[];
  grammarFill: HomeworkQuestion[];
  writing: {
    prompt: string;
    wordCount: string;
    guidelines: string[];
    requiredExpressions: string[];
  };
  speaking: {
    prompt: string;
    duration: string;
    guidelines: string[];
    requiredExpressions: string[];
  };
}

export interface Lesson {
  id: string;
  topic: string;
  textbookName: string; // e.g. "Think B1"
  unitNumber: string;   // e.g. "Unit 6"
  unitTitle: string;    // e.g. "Work & Ambition"
  date: string;
  duration: number;     // 120
  studentId: string;
  todayFocus: string;
  status: 'draft' | 'ready' | 'completed';

  // AI expansions breakdown
  expansions: VocabularyExpansion[];

  // 6 Structured sections
  review: ReviewSection;
  warmup: WarmupSection;
  newLesson: NewLessonSection;
  practice: PracticeSection;
  speaking: SpeakingSection;
  writing: WritingSection;

  // Categorized content
  selectedContent: SelectedContentClassification;

  // Homework
  homework: HomeworkTask;

  // Lesson Memory
  teacherNotes: string[];
  futureReviewNeeds: string[];
}
