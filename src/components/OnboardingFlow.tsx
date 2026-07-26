import React, { useState } from 'react';
import { UserProfile, SubjectSelection, EducationLevel } from '../types';
import {
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Building2,
  BookOpen,
  Briefcase
} from 'lucide-react';

interface OnboardingFlowProps {
  initialProfile?: UserProfile | null;
  onCompleteProfile: (profile: UserProfile, selection: SubjectSelection) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ initialProfile, onCompleteProfile }) => {
  // Profile Fields
  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [college, setCollege] = useState(initialProfile?.college || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(initialProfile?.educationLevel || 'Undergraduate');
  const [degreeBranch, setDegreeBranch] = useState(initialProfile?.degreeBranch || '');
  const [yearOfStudy, setYearOfStudy] = useState(initialProfile?.yearOfStudy || '3rd Year');
  const [skillsKnownInput, setSkillsKnownInput] = useState('');
  const [skillsKnown, setSkillsKnown] = useState<string[]>(initialProfile?.skillsKnown || []);
  const [preferredLanguage, setPreferredLanguage] = useState(initialProfile?.preferredLanguage || 'English');
  const [targetCompany, setTargetCompany] = useState(initialProfile?.targetCompany || '');

  const addSkill = () => {
    if (skillsKnownInput.trim() && !skillsKnown.includes(skillsKnownInput.trim())) {
      setSkillsKnown([...skillsKnown, skillsKnownInput.trim()]);
      setSkillsKnownInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkillsKnown(skillsKnown.filter((s) => s !== skill));
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      alert('Please fill in your Full Name and Email Address.');
      return;
    }

    const profile: UserProfile = {
      fullName: fullName.trim(),
      email: email.trim(),
      college: college.trim() || 'University / Institute',
      educationLevel,
      degreeBranch: degreeBranch.trim() || 'Computer Science',
      yearOfStudy,
      skillsKnown,
      preferredLanguage,
      targetCompany: targetCompany.trim() || 'Tech Industry',
      goal: 'Placement Interviews',
      xpPoints: 100,
      dailyStreak: 1,
      totalSessionsCompleted: 0,
      overallAccuracy: 0,
      estimatedReadiness: 30,
      createdAt: new Date().toISOString(),
    };

    const defaultSelection: SubjectSelection = {
      goal: 'Placement Interviews',
      subject: 'Data Structures & Algorithms',
      difficulty: 'Medium',
    };

    onCompleteProfile(profile, defaultSelection);
  };

  return (
    <div className="min-h-screen pt-12 pb-16 px-4 max-w-3xl mx-auto space-y-6 flex flex-col justify-center font-sans">
      {/* Header Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>PrepPilot AI • Profile Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Create Your Student Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Enter your profile details to set up your personal learning portal and access your dashboard.
        </p>
      </div>

      {/* Profile Form Card */}
      <form onSubmit={handleSubmitProfile} className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#11162A] to-[#0D111D] border border-indigo-500/20 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Student Details</h2>
              <p className="text-[11px] text-slate-400">Your profile information for personalized tracking</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            Profile Setup
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Adithya Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. adithya@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* College */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">College / University</label>
            <input
              type="text"
              placeholder="e.g. IIT / NIT / BITS / Anna University"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Education Level */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Education Level *</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="School">School (Higher Secondary)</option>
              <option value="Diploma">Polytechnic Diploma</option>
              <option value="Undergraduate">Undergraduate (B.Tech / B.E / B.Sc / BCA)</option>
              <option value="Postgraduate">Postgraduate (M.Tech / M.Sc / MCA)</option>
            </select>
          </div>

          {/* Degree/Branch */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Degree / Branch *</label>
            <input
              type="text"
              placeholder="e.g. Computer Science Engineering / IT / ECE"
              value={degreeBranch}
              onChange={(e) => setDegreeBranch(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Year of Study */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Year of Study *</label>
            <select
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="Final Year">Final Year</option>
              <option value="Graduated">Graduated / Working Professional</option>
            </select>
          </div>

          {/* Preferred Language */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Preferred Language</label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi / Hinglish</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>

          {/* Target Company */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Target Company / Career Path</label>
            <input
              type="text"
              placeholder="e.g. Google, Amazon, Microsoft, TCS, GATE 2026"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Skills Known */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-slate-300">Known Programming & Technical Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. C++, Java, SQL, React) & press Add"
              value={skillsKnownInput}
              onChange={(e) => setSkillsKnownInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="flex-1 bg-[#070A12] border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {skillsKnown.map((sk) => (
              <span
                key={sk}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold"
              >
                {sk}
                <button
                  type="button"
                  onClick={() => removeSkill(sk)}
                  className="hover:text-rose-400 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit & Enter Dashboard */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Complete Profile & Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
