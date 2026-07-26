import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Database,
  Layers,
  Network,
  Terminal,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Brain,
  Calculator
} from 'lucide-react';

export interface PracticeTopic {
  id: string;
  name: string;
  iconName: string;
  description: string;
  units: string[];
  gradient: string;
}

export const PRACTICE_TOPICS: PracticeTopic[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    iconName: 'Code2',
    description: 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming & Sorting',
    units: ['Arrays & Strings', 'Trees & Binary Search', 'Dynamic Programming', 'Graph Algorithms'],
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'logical-reasoning',
    name: 'Logical Reasoning',
    iconName: 'Brain',
    description: 'Sequences, Syllogisms, Blood Relations, Coding-Decoding, Seating Arrangement & Puzzles',
    units: ['Number Sequences', 'Syllogisms & Deductions', 'Blood Relations', 'Seating Arrangements'],
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'aptitude',
    name: 'Quantitative Aptitude',
    iconName: 'Calculator',
    description: 'Percentages, Speed & Distance, Profit & Loss, Probability, Permutations & Combinations',
    units: ['Percentages & Ratios', 'Time & Work', 'Speed, Distance & Time', 'Probability & Combinations'],
    gradient: 'from-amber-600 to-yellow-600',
  },
  {
    id: 'verbal',
    name: 'Verbal Ability & English',
    iconName: 'BookOpen',
    description: 'Reading Comprehension, Synonyms & Antonyms, Sentence Correction, Paragraph Summary',
    units: ['Vocabulary & Analogies', 'Reading Comprehension', 'Sentence Correction', 'Grammar Rules'],
    gradient: 'from-pink-600 to-rose-600',
  },
  {
    id: 'system-design',
    name: 'System Design & Architecture',
    iconName: 'Layers',
    description: 'Scalability, Microservices, Caching, Load Balancing, Message Queues',
    units: ['Rate Limiters & Caching', 'Database Sharding', 'Message Queues', 'API Gateway Design'],
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    iconName: 'Database',
    description: 'SQL Queries, Indexing, Transactions, ACID Properties, Normalization',
    units: ['SQL & Joins', 'B-Tree Indexing', 'ACID Transactions', 'NoSQL vs Relational'],
    gradient: 'from-cyan-600 to-emerald-600',
  },
  {
    id: 'os',
    name: 'Operating Systems',
    iconName: 'Cpu',
    description: 'Processes, Threads, Virtual Memory, Deadlocks, Page Replacement',
    units: ['Process Scheduling', 'Virtual Memory & Paging', 'Synchronization & Locks', 'System Calls'],
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'oops',
    name: 'Object-Oriented Programming',
    iconName: 'Terminal',
    description: 'Encapsulation, Inheritance, Polymorphism, Abstraction & Design Patterns',
    units: ['SOLID Principles', 'Design Patterns', 'Memory Management', 'Class Modeling'],
    gradient: 'from-amber-600 to-orange-600',
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    iconName: 'Network',
    description: 'TCP/IP Stack, HTTP/HTTPS protocols, DNS, Routing Algorithms',
    units: ['OSI & TCP/IP Model', 'HTTP/S & WebSockets', 'DNS & Routing', 'Socket Programming'],
    gradient: 'from-rose-600 to-red-600',
  },
];

interface PracticeTopicSelectionProps {
  onStartTest: (subject: string, difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  currentSubject?: string;
  currentDifficulty?: string;
}

export function PracticeTopicSelection({
  onStartTest,
  currentSubject = 'Data Structures & Algorithms',
  currentDifficulty = 'Easy',
}: PracticeTopicSelectionProps) {
  const [selectedTopic, setSelectedTopic] = useState<PracticeTopic>(() => {
    return (
      PRACTICE_TOPICS.find((t) => t.name.toLowerCase() === currentSubject.toLowerCase()) ||
      PRACTICE_TOPICS[0]
    );
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(
    (currentDifficulty as any) || 'Easy'
  );

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Code2':
        return <Code2 className="w-6 h-6 text-indigo-400" />;
      case 'Brain':
        return <Brain className="w-6 h-6 text-emerald-400" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-amber-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-blue-400" />;
      case 'Database':
        return <Database className="w-6 h-6 text-cyan-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-amber-400" />;
      case 'Network':
        return <Network className="w-6 h-6 text-rose-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-100 font-sans">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Practice Hub</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Select a Topic & Difficulty Tier
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Choose one subject topic to practice. Practice tests are structured into <strong>Easy (20 Questions)</strong>, <strong>Medium (15 Questions)</strong>, and <strong>Hard (10 Questions)</strong> tests.
        </p>
      </div>

      {/* Step 1: Topic Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
            <span>Select Practice Topic</span>
          </h2>
          <span className="text-xs text-slate-400">Selected: <strong className="text-indigo-400">{selectedTopic.name}</strong></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRACTICE_TOPICS.map((topic) => {
            const isSelected = selectedTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden border ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#13182A] to-[#0D111D] border-indigo-500 shadow-xl shadow-indigo-950/50 ring-2 ring-indigo-500/40'
                    : 'bg-[#0D111D] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-indigo-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {renderIcon(topic.iconName)}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm">{topic.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{topic.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {topic.units.slice(0, 3).map((u, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Difficulty Tier Cards */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">2</span>
            <span>Choose Difficulty Tier for {selectedTopic.name}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Easy Tier: 20 Questions */}
          <div
            onClick={() => setSelectedDifficulty('Easy')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-4 relative ${
              selectedDifficulty === 'Easy'
                ? 'bg-emerald-950/20 border-emerald-500 shadow-xl shadow-emerald-950/30 ring-2 ring-emerald-500/40'
                : 'bg-[#0D111D] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                🟢 Easy Test
              </span>
              <span className="text-xl font-black text-emerald-400">20 Qs</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Easy Practice Test</h3>
              <p className="text-xs text-slate-400 mt-1">
                Foundational concepts, code tracing, basic syntax definitions, and quick problem drills.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span><strong>20 Questions</strong> in total</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ideal for beginners & warmups</span>
              </div>
            </div>
          </div>

          {/* Medium Tier: 15 Questions */}
          <div
            onClick={() => setSelectedDifficulty('Medium')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-4 relative ${
              selectedDifficulty === 'Medium'
                ? 'bg-amber-950/20 border-amber-500 shadow-xl shadow-amber-950/30 ring-2 ring-amber-500/40'
                : 'bg-[#0D111D] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                🟡 Medium Test
              </span>
              <span className="text-xl font-black text-amber-400">15 Qs</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Medium Practice Test</h3>
              <p className="text-xs text-slate-400 mt-1">
                Algorithmic trade-offs, multi-step code execution, optimization, and real placement questions.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span><strong>15 Questions</strong> in total</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Placement level challenge</span>
              </div>
            </div>
          </div>

          {/* Hard Tier: 10 Questions */}
          <div
            onClick={() => setSelectedDifficulty('Hard')}
            className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-4 relative ${
              selectedDifficulty === 'Hard'
                ? 'bg-rose-950/20 border-rose-500 shadow-xl shadow-rose-950/30 ring-2 ring-rose-500/40'
                : 'bg-[#0D111D] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
                🔴 Hard Test
              </span>
              <span className="text-xl font-black text-rose-400">10 Qs</span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Hard Practice Test</h3>
              <p className="text-xs text-slate-400 mt-1">
                Deep architectural edge cases, asymptotic space/time proofs, and top-tier product company drills.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span><strong>10 Questions</strong> in total</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                <span>Advanced product interview prep</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Action Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-[#0D111D] border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-white text-base">
            Ready to launch practice test?
          </h4>
          <p className="text-xs text-indigo-200">
            Subject: <strong>{selectedTopic.name}</strong> • Level: <strong>{selectedDifficulty}</strong> ({selectedDifficulty === 'Easy' ? '20 Questions' : selectedDifficulty === 'Medium' ? '15 Questions' : '10 Questions'})
          </p>
        </div>

        <button
          onClick={() => onStartTest(selectedTopic.name, selectedDifficulty)}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
        >
          <span>Start {selectedDifficulty} Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
