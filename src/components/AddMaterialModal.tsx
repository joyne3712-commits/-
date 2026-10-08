import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Search, Plus, Check } from 'lucide-react';
import { ContentClassification, MaterialItem } from '../types';

export const AddMaterialModal: React.FC = () => {
  const { 
    isAddMaterialModalOpen, 
    setIsAddMaterialModalOpen, 
    materials, 
    activeLesson, 
    addItemFromMaterialsToLesson 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ContentClassification>('teach');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isAddMaterialModalOpen || !activeLesson) return null;

  const allItems: MaterialItem[] = materials.flatMap(s => s.units.flatMap(u => u.items));
  
  const filtered = allItems.filter(it => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      it.text.toLowerCase().includes(q) ||
      it.explanation.toLowerCase().includes(q) ||
      it.topic.toLowerCase().includes(q)
    );
  });

  const handleAdd = (item: MaterialItem) => {
    addItemFromMaterialsToLesson(activeLesson.id, item, selectedCategory);
    setAddedItemIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 animate-scaleIn flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              从教材库添加内容 (Add from Textbook Library)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              可随时从 Think B1、Think B2 或语法库中检索词汇，快速插入到《{activeLesson.topic}》教案中
            </p>
          </div>
          <button
            onClick={() => setIsAddMaterialModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category selector & search */}
        <div className="py-4 space-y-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              目标分类归宿：
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('teach')}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                  selectedCategory === 'teach'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                核心 — 教授 (Teach)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('review')}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                  selectedCategory === 'review'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                重点 — 复习 (Review)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('use')}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                  selectedCategory === 'use'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                熟练 — 运用 (Use)
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="跨书检索关键词（例如：'deal with', 'initiative', 'meeting'）..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="overflow-y-auto flex-1 py-3 space-y-2">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-8">
              未找到符合条件的词条。
            </p>
          ) : (
            filtered.map((item) => {
              const isAdded = addedItemIds[item.id];
              return (
                <div
                  key={item.id}
                  className="p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between text-xs transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {item.text}
                      </span>
                      {item.origin === 'textbook' ? (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          📘 教材
                        </span>
                      ) : (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded font-mono">
                          ✨ 扩展
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.source} · {item.unit}
                      </span>
                    </div>
                    <p className="text-slate-600">{item.explanation}</p>
                  </div>

                  <button
                    onClick={() => handleAdd(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已加入</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>加入</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsAddMaterialModalOpen(false)}
            className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl cursor-pointer"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
