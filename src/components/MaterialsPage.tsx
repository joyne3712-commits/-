import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderKanban, 
  Search, 
  Upload, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Trash2,
  Edit2,
  Check,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MaterialSource, MaterialItem } from '../types';

export const MaterialsPage: React.FC = () => {
  const { 
    materials, 
    deleteMaterialSource, 
    renameMaterialSource, 
    uploadTextbookFile, 
    isUploadingTextbook, 
    uploadStatusText 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState<string>(materials[0]?.id || 'source-think-b1');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const selectedSource = materials.find((s) => s.id === selectedSourceId) || materials[0];
  const currentUnit = selectedSource?.units.find((u) => u.id === selectedUnitId) || selectedSource?.units[0];

  // Flat list of all items across all sources for global search
  const allItems: MaterialItem[] = materials.flatMap(s => s.units.flatMap(u => u.items));
  
  const displayedItems = searchQuery.trim()
    ? allItems.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentUnit?.items || [];

  const handleStartRename = (src: MaterialSource) => {
    setEditingSourceId(src.id);
    setEditTitleInput(src.title);
  };

  const handleSaveRename = (srcId: string) => {
    if (editTitleInput.trim()) {
      renameMaterialSource(srcId, editTitleInput.trim());
    }
    setEditingSourceId(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    await uploadTextbookFile(uploadFileName.trim());
    setShowUploadModal(false);
    setUploadFileName('');
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">教材库</h1>
          <p className="text-sm text-slate-500 mt-1">
            教师个人专属英文知识库 · 上传一次，永久支持 RAG 语义检索与智能课件生成
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>+ 上传教材 (PDF)</span>
        </button>
      </div>

      {/* Upload Progress Banner */}
      {isUploadingTextbook && (
        <div className="my-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 text-sm text-indigo-900 animate-pulse">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" />
          <div>
            <strong className="block text-indigo-950">PDF 文本抽取与语义切块进行中</strong>
            <span className="text-xs text-indigo-700">{uploadStatusText}</span>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl animate-scaleIn">
            <h2 className="text-lg font-bold text-slate-900">上传新教材 (PDF)</h2>
            <p className="text-xs text-slate-500 mt-1">
              系统将自动提取文本、识别 1-12 单元结构、提炼生词句型并建立向量检索索引。
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  教材名称 / 文件名
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：Think B1, Market Leader Intermediate"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:outline-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 block">点击或拖拽 PDF 文件至此处</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">支持剑桥、牛津、朗文等主流原版教材</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 py-2 px-3 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!uploadFileName.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  开始解析并存入教材库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Search */}
      <div className="mt-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="在已上传的全部教材与单元中跨书检索（例如：'responsible', 'cope with', 'present perfect'）..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-slate-400 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              清空
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="mt-8 grid md:grid-cols-4 gap-8">
        {/* Left Column: Textbook list */}
        <div className="md:col-span-1 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              我的教材 ({materials.length})
            </h3>
            <div className="space-y-2">
              {materials.map((src) => {
                const isSelected = src.id === selectedSourceId && !searchQuery;
                const isEditing = editingSourceId === src.id;

                return (
                  <div
                    key={src.id}
                    onClick={() => {
                      if (!isEditing) {
                        setSelectedSourceId(src.id);
                        setSelectedUnitId(null);
                        setSearchQuery('');
                      }
                    }}
                    className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {isEditing ? (
                        <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitleInput}
                            onChange={(e) => setEditTitleInput(e.target.value)}
                            className="text-xs p-1 bg-white text-slate-900 border rounded w-full"
                          />
                          <button onClick={() => handleSaveRename(src.id)} className="p-1 hover:text-emerald-500">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingSourceId(null)} className="p-1 hover:text-rose-500">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-bold text-sm tracking-tight">{src.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {src.level}
                          </span>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/20 text-xs">
                        <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                          {src.units.length} 个单元 · {src.category}
                        </span>
                        <div className="flex items-center gap-1 opacity-70 hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleStartRename(src)}
                            className="p-1 hover:text-indigo-400"
                            title="重命名教材"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          {materials.length > 1 && (
                            <button
                              onClick={() => deleteMaterialSource(src.id)}
                              className="p-1 hover:text-rose-400"
                              title="删除教材"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Browser for selected textbook */}
          {!searchQuery && selectedSource && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                {selectedSource.title} 单元目录 ({selectedSource.units.length})
              </h3>
              <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
                {selectedSource.units.map((u) => {
                  const isUnitSelected = (selectedUnitId === u.id) || (!selectedUnitId && u === selectedSource.units[0]);
                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUnitId(u.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                        isUnitSelected
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-mono text-slate-400 mr-1.5">{u.unitNumber}</span>
                        <span>{u.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {u.items.length || u.rawTextbookItems?.length || 0} 项
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Area: Items in selected unit or search results */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {searchQuery ? `跨教材检索结果："${searchQuery}"` : `${selectedSource?.title} — ${currentUnit?.unitNumber}: ${currentUnit?.title}`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {displayedItems.length} 个结构化语言点（含教材原词与 AI 关联拓展）
              </p>
            </div>
            {currentUnit?.topic && (
              <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                主题: {currentUnit.topic}
              </span>
            )}
          </div>

          {displayedItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
              该单元暂无独立语言项，生成教案时 AI 将全自动依据单元标题进行 RAG 扩充。
            </div>
          ) : (
            <div className="space-y-3">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 transition-all shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-bold text-slate-900 font-mono tracking-tight">
                        {item.text}
                      </h4>
                      {item.origin === 'textbook' ? (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                          📘 教材原词
                        </span>
                      ) : (
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded font-mono font-medium">
                          ✨ AI扩展
                        </span>
                      )}
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                        {item.level}
                      </span>
                      <span className="text-[11px] text-slate-500 capitalize bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded">
                        {item.type}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.source} · {item.unit}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <strong>核心释义:</strong> {item.explanation}
                  </p>

                  {item.exampleSentence && (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 border-l-2 border-slate-400 italic">
                      "{item.exampleSentence}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                    <span>
                      <strong>教学价值: </strong>
                      {item.practicalUsefulness}
                    </span>
                    {item.priority && (
                      <span className={`px-2 py-0.2 rounded font-mono capitalize ${
                        item.priority === 'high' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.priority} 优先级
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
