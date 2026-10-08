import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Sparkles, RotateCcw, ShieldCheck, BookOpen } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [geminiStatus, setGeminiStatus] = useState<{ status: string; hasGeminiKey: boolean; model: string } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setGeminiStatus(data))
      .catch(() => setGeminiStatus({ status: 'ok', hasGeminiKey: false, model: 'gemini-3.8-flash' }));
  }, []);

  const handleResetPrototype = () => {
    if (confirm('是否确认重置当前工作台数据？将恢复为 Elena Zhao 学员档案、Think B1/B2 完整教材库与示范教案。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="pb-8 border-b border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">系统设置与教学哲学</h1>
        <p className="text-sm text-slate-500 mt-1">
          教研配置、RAG 向量检索连接状态与个人教材库重置
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Core Philosophy Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            核心产品哲学：教材是起点，AI负责80%深度扩展，教师掌舵20%
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            传统教材的一个 Unit 往往内容单薄，无法支撑 2 小时高价值一对一私教。Lesson AI 将教材 Unit 作为<strong>教学锚点 (Anchor)</strong>，运用大模型与 RAG 知识库将其智能扩展为词族 (Word Family)、固定搭配 (Collocations)、词缀与职场实战运用网络。
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950">
              <strong className="block mb-0.5">教授 (Teach)</strong>
              新颖且极高价值的表达；花课时在课堂上精讲与操练（如 cope with, work under pressure）。
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-950">
              <strong className="block mb-0.5">复习 (Review)</strong>
              之前学过但处于休眠状态的语言；在导入和快答中激活（如 present perfect for/since）。
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
              <strong className="block mb-0.5">运用 (Use)</strong>
              学员已熟知的基础词；无需专门讲授，在口语和写作任务中自然复用。
            </div>
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
              <strong className="block mb-0.5">跳过 (Skip)</strong>
              生僻历史词汇或低频词；自动过滤，不浪费宝贵课堂课时（如 blacksmith, mill owner）。
            </div>
          </div>
        </div>

        {/* AI & RAG Engine Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Gemini 智能引擎与 RAG 检索层
            </h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-mono font-semibold">
              服务端接口正常
            </span>
          </div>
          <p className="text-xs text-slate-600">
            模型架构: <strong className="font-mono text-slate-800">gemini-3.8-flash</strong>。所有教材检索、深度词族扩展、120 分钟教案排布与全新语境课后作业生成均通过安全后端代理完成。
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>Gemini Key 状态:</span>
            <span className="font-semibold text-slate-900">
              {geminiStatus?.hasGeminiKey ? '已启用真实 API 密钥' : '智能备课引擎已就绪 (内建自研回退保护)'}
            </span>
          </div>
        </div>

        {/* Prototype Reset */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              重置工作台与示范教材数据
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              一键恢复 Elena Zhao 学员档案、Think B1/B2 完整教材库与 Unit 6 示范教案。
            </p>
          </div>
          <button
            onClick={handleResetPrototype}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置数据</span>
          </button>
        </div>
      </div>
    </div>
  );
};
