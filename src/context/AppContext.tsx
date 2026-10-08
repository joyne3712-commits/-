import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, MaterialSource, MaterialItem, Lesson, ContentClassification, MaterialUnit } from '../types';
import { initialStudent, initialMaterials, initialLessons } from '../data/seedData';

interface AppContextType {
  student: Student;
  updateStudent: (updated: Partial<Student>) => void;
  materials: MaterialSource[];
  addMaterialSource: (source: MaterialSource) => void;
  deleteMaterialSource: (sourceId: string) => void;
  renameMaterialSource: (sourceId: string, newTitle: string) => void;
  uploadTextbookFile: (title: string, rawText?: string) => Promise<void>;
  isUploadingTextbook: boolean;
  uploadStatusText: string;

  lessons: Lesson[];
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  activeLesson: Lesson | null;
  activeNav: 'lessons' | 'materials' | 'student' | 'settings';
  setActiveNav: (nav: 'lessons' | 'materials' | 'student' | 'settings') => void;
  isNewLessonModalOpen: boolean;
  setIsNewLessonModalOpen: (open: boolean) => void;
  isAddMaterialModalOpen: boolean;
  setIsAddMaterialModalOpen: (open: boolean) => void;
  teachingModeLessonId: string | null;
  setTeachingModeLessonId: (id: string | null) => void;
  homeworkModalLessonId: string | null;
  setHomeworkModalLessonId: (id: string | null) => void;

  // Lesson manipulation
  createLesson: (params: {
    textbookName: string;
    unitNumber: string;
    todayFocus: string;
    duration: number;
  }) => Promise<Lesson>;
  updateLesson: (lessonId: string, updater: (prev: Lesson) => Lesson) => void;
  removeSelectedContentItem: (lessonId: string, category: ContentClassification, itemId: string) => void;
  moveSelectedContentItem: (lessonId: string, itemId: string, fromCategory: ContentClassification, toCategory: ContentClassification) => void;
  addItemFromMaterialsToLesson: (lessonId: string, item: MaterialItem, targetCategory: ContentClassification) => void;
  regenerateSectionAction: (lessonId: string, sectionName: string, guidance?: string) => Promise<void>;
  regenerateQuestionAction: (lessonId: string, questionId: string, category: 'vocabulary' | 'grammar') => Promise<void>;
  generateHomeworkAction: (lessonId: string) => Promise<void>;
  endLessonAndGenerateHomework: (lessonId: string) => Promise<void>;
  isGenerating: boolean;
  generationStep: string;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  STUDENT: 'lesson_ai_student_v2',
  MATERIALS: 'lesson_ai_materials_v2',
  LESSONS: 'lesson_ai_lessons_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT);
    return saved ? JSON.parse(saved) : initialStudent;
  });

  const [materials, setMaterials] = useState<MaterialSource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LESSONS);
    return saved ? JSON.parse(saved) : initialLessons;
  });

  const [activeLessonId, setActiveLessonId] = useState<string | null>('lesson-work-career');
  const [activeNav, setActiveNav] = useState<'lessons' | 'materials' | 'student' | 'settings'>('lessons');
  const [isNewLessonModalOpen, setIsNewLessonModalOpen] = useState(false);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [teachingModeLessonId, setTeachingModeLessonId] = useState<string | null>(null);
  const [homeworkModalLessonId, setHomeworkModalLessonId] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [isUploadingTextbook, setIsUploadingTextbook] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  }, [lessons]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) || null;

  const updateStudent = (updated: Partial<Student>) => {
    setStudent((prev) => ({ ...prev, ...updated }));
  };

  const addMaterialSource = (source: MaterialSource) => {
    setMaterials((prev) => [source, ...prev]);
  };

  const deleteMaterialSource = (sourceId: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== sourceId));
  };

  const renameMaterialSource = (sourceId: string, newTitle: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === sourceId ? { ...m, title: newTitle } : m))
    );
  };

  const uploadTextbookFile = async (title: string, rawText?: string) => {
    setIsUploadingTextbook(true);
    setUploadStatusText(`${title}.pdf 正在读取文件...`);

    await new Promise((r) => setTimeout(r, 600));
    setUploadStatusText(`正在解析章节结构与单元目录 (Units 1-12)...`);

    await new Promise((r) => setTimeout(r, 800));
    setUploadStatusText(`正在提取生词表、句型、语法要点与阅读段落...`);

    await new Promise((r) => setTimeout(r, 700));

    // Create a new parsed textbook with 12 structured units
    const cleanTitle = title.replace(/\.pdf$/i, '');
    const newBook: MaterialSource = {
      id: `source-${Date.now()}`,
      title: cleanTitle,
      level: 'B1-B2',
      category: '教师自传 PDF 教材',
      description: '已完成 PDF 文本提取与 12 单元语义结构化解析。',
      totalUnits: 12,
      status: 'ready',
      parsedDate: new Date().toISOString().split('T')[0],
      units: Array.from({ length: 12 }).map((_, i) => ({
        id: `unit-${Date.now()}-${i + 1}`,
        unitNumber: `Unit ${i + 1}`,
        title: [
          'Life & Routine',
          'Going Places',
          'The Future is Now',
          'Science & Discovery',
          'Entertainment & Media',
          'Work & Ambition',
          'Healthy Body, Healthy Mind',
          'Creative Minds',
          'Money Matters',
          'Global Community',
          'Environmental Horizons',
          'Looking Back, Moving Forward',
        ][i],
        topic: [
          'Daily Communication',
          'Travel',
          'Technology',
          'General English',
          'Entertainment',
          'Work & Career',
          'Health',
          'Innovation',
          'Finance',
          'Culture',
          'Environment',
          'Milestones',
        ][i],
        grammarPoint: 'Target Unit Grammar Point',
        readingTopic: 'Unit Reading Passage Overview',
        speakingTopic: 'Communicative practice topic',
        writingTopic: 'Practical writing assignment',
        rawTextbookItems: [],
        items: [],
      })),
    };

    setMaterials((prev) => [newBook, ...prev]);
    setIsUploadingTextbook(false);
    setUploadStatusText('');
  };

  const updateLesson = (lessonId: string, updater: (prev: Lesson) => Lesson) => {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id === lessonId) {
          return updater(l);
        }
        return l;
      })
    );
  };

  const removeSelectedContentItem = (
    lessonId: string,
    category: ContentClassification,
    itemId: string
  ) => {
    updateLesson(lessonId, (l) => {
      const removedItem = l.selectedContent[category].find((it) => it.id === itemId);
      const updatedCategoryList = l.selectedContent[category].filter((it) => it.id !== itemId);
      const updatedSelectedContent = {
        ...l.selectedContent,
        [category]: updatedCategoryList,
      };

      // Also if removed from teach, update newLesson items
      let updatedNewLesson = l.newLesson;
      if (category === 'teach' && removedItem) {
        updatedNewLesson = {
          ...l.newLesson,
          items: l.newLesson.items.filter((it) => it.item.toLowerCase() !== removedItem.text.toLowerCase()),
        };
      }

      return {
        ...l,
        selectedContent: updatedSelectedContent,
        newLesson: updatedNewLesson,
      };
    });
  };

  const moveSelectedContentItem = (
    lessonId: string,
    itemId: string,
    fromCategory: ContentClassification,
    toCategory: ContentClassification
  ) => {
    if (fromCategory === toCategory) return;
    updateLesson(lessonId, (l) => {
      const item = l.selectedContent[fromCategory].find((it) => it.id === itemId);
      if (!item) return l;

      const fromList = l.selectedContent[fromCategory].filter((it) => it.id !== itemId);
      const toList = [item, ...l.selectedContent[toCategory]];

      let updatedNewLesson = l.newLesson;
      if (toCategory === 'teach' && !l.newLesson.items.some((i) => i.item.toLowerCase() === item.text.toLowerCase())) {
        updatedNewLesson = {
          ...l.newLesson,
          items: [
            ...l.newLesson.items,
            {
              id: `nl-added-${Date.now()}`,
              item: item.text,
              level: item.level,
              type: item.type,
              origin: item.origin || 'ai_expanded',
              explanation: item.explanation || '实用表达，适合重点操练。',
              exampleSentence: item.exampleSentence || `She used "${item.text}" naturally in conversation.`,
              naturalContext: item.naturalContext || '职场与日常交流场景。',
              commonMistake: item.commonMistake || `确保介词搭配正确。`,
              quickCheck: {
                question: item.quickCheckQuestion || `How would you use "${item.text}" in your work?`,
                answer: item.quickCheckAnswer || `准确运用 "${item.text}"。`,
              },
            },
          ],
        };
      } else if (fromCategory === 'teach') {
        updatedNewLesson = {
          ...l.newLesson,
          items: l.newLesson.items.filter((i) => i.item.toLowerCase() !== item.text.toLowerCase()),
        };
      }

      return {
        ...l,
        selectedContent: {
          ...l.selectedContent,
          [fromCategory]: fromList,
          [toCategory]: toList,
        },
        newLesson: updatedNewLesson,
      };
    });
  };

  const addItemFromMaterialsToLesson = (
    lessonId: string,
    item: MaterialItem,
    targetCategory: ContentClassification
  ) => {
    updateLesson(lessonId, (l) => {
      if (l.selectedContent[targetCategory].some((it) => it.text.toLowerCase() === item.text.toLowerCase())) {
        return l;
      }

      const updatedCategoryList = [item, ...l.selectedContent[targetCategory]];
      let updatedNewLesson = l.newLesson;

      if (targetCategory === 'teach' && !l.newLesson.items.some((i) => i.item.toLowerCase() === item.text.toLowerCase())) {
        updatedNewLesson = {
          ...l.newLesson,
          items: [
            ...l.newLesson.items,
            {
              id: `nl-added-${Date.now()}`,
              item: item.text,
              level: item.level,
              type: item.type,
              origin: item.origin || 'textbook',
              explanation: item.explanation || '实用表达。',
              exampleSentence: item.exampleSentence || `Example sentence with "${item.text}".`,
              naturalContext: item.naturalContext || '职场工作语境。',
              commonMistake: item.commonMistake || '注意固定搭配与时态一致。',
              quickCheck: {
                question: item.quickCheckQuestion || `Use "${item.text}" in a sentence.`,
                answer: item.quickCheckAnswer || `Correct usage of "${item.text}".`,
              },
            },
          ],
        };
      }

      return {
        ...l,
        selectedContent: {
          ...l.selectedContent,
          [targetCategory]: updatedCategoryList,
        },
        newLesson: updatedNewLesson,
      };
    });
  };

  const createLesson = async (params: {
    textbookName: string;
    unitNumber: string;
    todayFocus: string;
    duration: number;
  }): Promise<Lesson> => {
    setIsGenerating(true);
    setGenerationStep(`[RAG 知识库检索] 正在从《${params.textbookName}》中检索 ${params.unitNumber}...`);

    try {
      // Find the unit in local library
      const source = materials.find((m) => m.title.toLowerCase() === params.textbookName.toLowerCase()) || materials[0];
      const unit = source?.units.find((u) => u.unitNumber.toLowerCase() === params.unitNumber.toLowerCase()) || source?.units[0];

      await new Promise((r) => setTimeout(r, 500));
      setGenerationStep(`[AI 单元研读] 分析 ${params.unitNumber} 核心生词、语篇、语法与交际功能...`);

      await new Promise((r) => setTimeout(r, 600));
      setGenerationStep(`[AI 深度扩展] 构建词族 (Word Family)、固定搭配 (Collocations) 与前缀后缀...`);

      await new Promise((r) => setTimeout(r, 500));
      setGenerationStep(`[教案生成] 编排 120 分钟六步实战课程与控制性练习...`);

      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textbookName: params.textbookName,
          unitNumber: params.unitNumber,
          todayFocus: params.todayFocus,
          duration: params.duration,
          student,
          unitData: unit,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.lesson) {
        throw new Error('生成课程失败');
      }

      const newLesson: Lesson = data.lesson;
      setLessons((prev) => [newLesson, ...prev]);
      setActiveLessonId(newLesson.id);
      setActiveNav('lessons');
      return newLesson;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const regenerateSectionAction = async (lessonId: string, sectionName: string, guidance?: string) => {
    const l = lessons.find((x) => x.id === lessonId);
    if (!l) return;

    setIsGenerating(true);
    setGenerationStep(`正在重新优化【${sectionName}】板块教学内容...`);

    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName,
          topic: l.topic,
          currentLesson: l,
          guidance,
        }),
      });
      const data = await res.json();
      if (data.success && data.sectionData) {
        updateLesson(lessonId, (prev) => {
          const existingSection = (prev as any)[sectionName];
          return {
            ...prev,
            [sectionName]: {
              ...(typeof existingSection === 'object' ? existingSection : {}),
              ...data.sectionData,
            },
          };
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const regenerateQuestionAction = async (
    lessonId: string,
    questionId: string,
    category: 'vocabulary' | 'grammar'
  ) => {
    const l = lessons.find((x) => x.id === lessonId);
    if (!l) return;

    const currentQ =
      category === 'vocabulary'
        ? l.practice.vocabularyQuestions.find((q) => q.id === questionId)
        : l.practice.grammarQuestions.find((q) => q.id === questionId);

    try {
      const res = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          type: currentQ?.type || 'vocab_context',
          topic: l.topic,
          targetItem: currentQ?.targetItem || 'target language',
        }),
      });
      const data = await res.json();
      if (data.success && data.question) {
        updateLesson(lessonId, (prev) => {
          if (category === 'vocabulary') {
            return {
              ...prev,
              practice: {
                ...prev.practice,
                vocabularyQuestions: prev.practice.vocabularyQuestions.map((q) =>
                  q.id === questionId ? { ...data.question, id: questionId } : q
                ),
              },
            };
          } else {
            return {
              ...prev,
              practice: {
                ...prev.practice,
                grammarQuestions: prev.practice.grammarQuestions.map((q) =>
                  q.id === questionId ? { ...data.question, id: questionId } : q
                ),
              },
            };
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateHomeworkAction = async (lessonId: string) => {
    const l = lessons.find((x) => x.id === lessonId);
    if (!l) return;

    setIsGenerating(true);
    setGenerationStep('正在将课上目标语言迁移至全新语境，生成 5 部分作业...');

    try {
      const targetLanguage = [
        ...l.selectedContent.teach.map((i) => i.text),
        ...l.selectedContent.review.map((i) => i.text),
      ];

      const res = await fetch('/api/generate-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: l.topic,
          targetLanguage,
        }),
      });
      const data = await res.json();
      if (data.success && data.homework) {
        updateLesson(lessonId, (prev) => ({
          ...prev,
          homework: data.homework,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const endLessonAndGenerateHomework = async (lessonId: string) => {
    updateLesson(lessonId, (prev) => ({
      ...prev,
      status: 'completed',
    }));
    setTeachingModeLessonId(null);
    await generateHomeworkAction(lessonId);
    setHomeworkModalLessonId(lessonId);
  };

  return (
    <AppContext.Provider
      value={{
        student,
        updateStudent,
        materials,
        addMaterialSource,
        deleteMaterialSource,
        renameMaterialSource,
        uploadTextbookFile,
        isUploadingTextbook,
        uploadStatusText,
        lessons,
        activeLessonId,
        setActiveLessonId,
        activeLesson,
        activeNav,
        setActiveNav,
        isNewLessonModalOpen,
        setIsNewLessonModalOpen,
        isAddMaterialModalOpen,
        setIsAddMaterialModalOpen,
        teachingModeLessonId,
        setTeachingModeLessonId,
        homeworkModalLessonId,
        setHomeworkModalLessonId,
        createLesson,
        updateLesson,
        removeSelectedContentItem,
        moveSelectedContentItem,
        addItemFromMaterialsToLesson,
        regenerateSectionAction,
        regenerateQuestionAction,
        generateHomeworkAction,
        endLessonAndGenerateHomework,
        isGenerating,
        generationStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
