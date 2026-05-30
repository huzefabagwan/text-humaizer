'use client';

import React from 'react';
import { 
  Database, 
  CreditCard, 
  History, 
  FileDown, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Search,
  FileText
} from 'lucide-react';
import { DocBlock } from '../utils/documentProcessor';

export interface HistoryRecord {
  id: string;
  filename: string;
  timestamp: string;
  tone: string;
  originalAiScore: number;
  humanizedHumanScore: number;
  blocks: DocBlock[];
}

interface DashboardProps {
  user: { email: string; credits: number } | null;
  history: HistoryRecord[];
  onLoadRecord: (record: HistoryRecord) => void;
  onDownloadRecord: (record: HistoryRecord) => void;
  onNavigateToWorkspace: () => void;
}

export default function Dashboard({
  user,
  history,
  onLoadRecord,
  onDownloadRecord,
  onNavigateToWorkspace,
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredHistory = history.filter(record => 
    record.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProcessed = history.length;
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SaaS Dashboard</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your subscriptions, track credits, and view past documents.</p>
          </div>
          <button
            onClick={onNavigateToWorkspace}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-blue rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:opacity-90 transition-all cursor-pointer"
          >
            <span>Open Humanizer Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Credits */}
          <div className="relative p-6 rounded-2xl glass-panel bg-white/2 overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-bl-full group-hover:bg-brand-purple/10 transition-colors pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Credits Remaining</span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{user?.credits} <span className="text-xs font-normal text-gray-400">words</span></h3>
              </div>
            </div>
            
            {/* Credit progress meter */}
            <div className="mt-4">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue rounded-full" 
                  style={{ width: `${Math.min(100, ((user?.credits || 0) / 1000) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                <span>0</span>
                <span>1,000 Word Cap (Monthly)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Subscription Plan */}
          <div className="relative p-6 rounded-2xl glass-panel bg-white/2 overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-bl-full group-hover:bg-brand-blue/10 transition-colors pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Account Subscription</span>
                <h3 className="text-lg font-bold text-white mt-1">Pro SaaS Plan</h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              Renews automatically on June 26, 2026
            </p>
          </div>

          {/* Card 3: Files Processed */}
          <div className="relative p-6 rounded-2xl glass-panel bg-white/2 overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-pink/5 rounded-bl-full group-hover:bg-brand-pink/10 transition-colors pointer-events-none" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-pink/10 border border-brand-pink/20 flex items-center justify-center">
                <History className="w-5 h-5 text-brand-pink" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Files Processed</span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5">{totalProcessed} <span className="text-xs font-normal text-gray-400">uploads</span></h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-pink" />
              Last parsed document: {history[0]?.filename || 'None'}
            </p>
          </div>

        </div>

        {/* History Table Panel */}
        <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/60 backdrop-blur-2xl overflow-hidden shadow-xl">
          
          {/* Table Header Controls */}
          <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-purple" />
              <h2 className="text-sm font-semibold text-white">Document Processing History</h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search history files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs glass-input text-white"
              />
            </div>
          </div>

          {/* Table Content */}
          {filteredHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2 text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="px-6 py-3.5">Document Name</th>
                    <th className="px-6 py-3.5">Date Rewritten</th>
                    <th className="px-6 py-3.5 text-center">Original AI</th>
                    <th className="px-6 py-3.5 text-center">Humanized</th>
                    <th className="px-6 py-3.5 text-center">Tone</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-purple shrink-0" />
                        <span className="truncate max-w-[200px]">{record.filename}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{record.timestamp}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded font-semibold bg-red-500/10 text-red-400">
                          {record.originalAiScore}% AI
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded font-semibold bg-green-500/10 text-green-400">
                          {record.humanizedHumanScore}% Human
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs capitalize text-gray-400">{record.tone}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onLoadRecord(record)}
                            className="px-2.5 py-1.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20 text-[10px] font-semibold transition-all cursor-pointer"
                          >
                            Open Compare
                          </button>
                          <button
                            onClick={() => onDownloadRecord(record)}
                            className="p-1.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                            title="Download DOCX"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-4 text-gray-500 flex flex-col items-center">
              <FileText className="w-8 h-8 opacity-25 mb-4 text-brand-purple animate-pulse" />
              <p className="text-xs">No files matched your criteria or history is empty.</p>
              <button
                onClick={onNavigateToWorkspace}
                className="mt-4 text-xs font-semibold text-brand-purple hover:underline cursor-pointer"
              >
                Upload your first file
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
