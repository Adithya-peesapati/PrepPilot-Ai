import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Circle, Calendar, Sparkles, ArrowRight, Clock } from 'lucide-react';

export const StudyPlanView: React.FC = () => {
  const [completedItems, setCompletedItems] = useState<string[]>(['m1_1', 'm1_2']);

  const toggleCheck = (id: string) => {
    setCompletedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const modules = [
    {
      week: "Week 1",
      title: "Core System Design & High Availability",
      items: [
        { id: 'm1_1', name: "URL Shortener Base62 Strategy", duration: "45 mins" },
        { id: 'm1_2', name: "Distributed Rate Limiting Algorithms", duration: "60 mins" },
        { id: 'm1_3', name: "Cache Invalidation & CDN Edge Purges", duration: "50 mins" },
      ],
    },
    {
      week: "Week 2",
      title: "Data Structures & High-Performance Caching",
      items: [
        { id: 'm2_1', name: "LRU Cache O(1) Get/Put Implementation", duration: "40 mins" },
        { id: 'm2_2', name: "Trie (Prefix Trees) for Auto-Complete", duration: "55 mins" },
        { id: 'm2_3', name: "B-Tree vs B+ Tree Indexing in PostgreSQL", duration: "60 mins" },
      ],
    },
    {
      week: "Week 3",
      title: "Algorithms & Advanced Dynamic Programming",
      items: [
        { id: 'm3_1', name: "Longest Increasing Subsequence O(N log N)", duration: "60 mins" },
        { id: 'm3_2', name: "Patience Sorting & Binary Search Optimization", duration: "45 mins" },
        { id: 'm3_3', name: "Object-Oriented Design: Parking Lot", duration: "50 mins" },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-16 px-4 md:px-8 max-w-[1200px] mx-auto space-y-8">
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#050816]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Adaptive Curriculum</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Personalized Study Plan</h1>
          <p className="text-xs text-slate-300">Custom tailored roadmap focusing on your weakest engineering concepts.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0">
          <div className="text-xs text-slate-400">Curriculum Completion</div>
          <div className="text-2xl font-black text-emerald-400">
            {Math.round((completedItems.length / 9) * 100)}%
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {modules.map((mod, idx) => (
          <div key={idx} className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold">
                  {mod.week}
                </span>
                <h3 className="font-bold text-white text-base">{mod.title}</h3>
              </div>
            </div>

            <div className="space-y-2">
              {mod.items.map((item) => {
                const isDone = completedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-slate-300'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                      )}
                      <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
