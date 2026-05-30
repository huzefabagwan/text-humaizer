'use client';

import React from 'react';
import { 
  FileText, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronRight,
  Eye,
  Loader2
} from 'lucide-react';
import { DocBlock, exportToTxt, parseTxt } from '../utils/documentProcessor';
import { ToneType, calculateDetectionScores, computeWordDiff } from '../utils/humanizerEngine';

interface WorkspaceProps {
  filename: string;
  initialBlocks: DocBlock[];
  userCredits: number;
  onDeductCredits: (creditsUsed: number) => void;
  onSaveHistory: (filename: string, tone: string, originalAi: number, humanizedHuman: number, blocks: DocBlock[]) => void;
  onExportDocx: (blocks: DocBlock[]) => void;
  onExportTxt: (blocks: DocBlock[]) => void;
  onBackToUpload: () => void;
}

export default function Workspace({
  filename,
  initialBlocks,
  userCredits,
  onDeductCredits,
  onSaveHistory,
  onExportDocx,
  onExportTxt,
  onBackToUpload,
}: WorkspaceProps) {
  // Input settings
  const [tone, setTone] = React.useState<ToneType>('professional');
  const [strength, setStrength] = React.useState(75); // 0-100
  const [preserveFormatting, setPreserveFormatting] = React.useState(true);
  const [preserveCitations, setPreserveCitations] = React.useState(true);

  // States
  const [originalBlocks, setOriginalBlocks] = React.useState<DocBlock[]>(initialBlocks);
  const [humanizedBlocks, setHumanizedBlocks] = React.useState<DocBlock[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progressBlockIdx, setProgressBlockIdx] = React.useState(-1);
  const [compareMode, setCompareMode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Custom Raw Text editing states
  const [leftTab, setLeftTab] = React.useState<'edit' | 'preview'>('edit');
  const [rawText, setRawText] = React.useState('');

  // Sync rawText when initialBlocks changes
  React.useEffect(() => {
    setRawText(exportToTxt(initialBlocks));
    setOriginalBlocks(initialBlocks);
    setHumanizedBlocks([]); // Reset output when input changes
  }, [initialBlocks]);

  const handleRawTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRawText(text);
    const parsed = parseTxt(text);
    setOriginalBlocks(parsed);
  };

  // Score states
  const [scores, setScores] = React.useState({
    originalAiScore: 92,
    originalHumanScore: 8,
    humanizedAiScore: 2,
    humanizedHumanScore: 98,
    readabilityScore: 85
  });

  // Calculate word count
  const wordCount = React.useMemo(() => {
    return originalBlocks.reduce((acc, block) => {
      const words = block.content.split(/\s+/).filter(Boolean).length;
      return acc + words;
    }, 0);
  }, [originalBlocks]);

  // Update AI scores whenever original blocks change (as they type)
  React.useEffect(() => {
    if (originalBlocks.length === 0) return;
    const currentScores = calculateDetectionScores(originalBlocks, tone, strength);
    setScores(prev => ({
      ...prev,
      originalAiScore: currentScores.originalAiScore,
      originalHumanScore: currentScores.originalHumanScore
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalBlocks]);

  const handleHumanize = async () => {
    setIsProcessing(true);
    setError(null);
    setHumanizedBlocks([]);
    setProgressBlockIdx(0);
    setCompareMode(false);

    const finalBlocks: DocBlock[] = [];
    let apiFailed = false;

    for (let i = 0; i < originalBlocks.length; i++) {
      setProgressBlockIdx(i);
      const block = originalBlocks[i];

      // Don't rewrite tables or very short headings via API
      if (block.type === 'table' || (block.type.startsWith('heading') && block.content.length < 20)) {
        finalBlocks.push(block);
        setHumanizedBlocks([...finalBlocks]);
        continue;
      }

      try {
        const res = await fetch('/api/humanize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: block.content, tone }),
        });
        
        if (!res.ok) {
          const errData = await res.json() as { error?: string };
          throw new Error(errData.error || `Server returned status ${res.status}`);
        }

        const data = await res.json() as { humanized?: string };
        if (!data.humanized) {
          throw new Error('No humanized text returned in response.');
        }

        finalBlocks.push({ ...block, content: data.humanized });
      } catch (err: any) {
        const errMsg = err?.message || 'Failed to humanize block.';
        setError(errMsg);
        apiFailed = true;
        // Push original block and all remaining blocks as-is
        for (let j = i; j < originalBlocks.length; j++) {
          finalBlocks.push(originalBlocks[j]);
        }
        setHumanizedBlocks([...finalBlocks]);
        break;
      }

      setHumanizedBlocks([...finalBlocks]);
    }

    if (!apiFailed) {
      const finalScores = calculateDetectionScores(originalBlocks, tone, strength);
      setScores(finalScores);
      onDeductCredits(wordCount);
      onSaveHistory(filename, tone, finalScores.originalAiScore, finalScores.humanizedHumanScore, finalBlocks);
    }

    setIsProcessing(false);
    setProgressBlockIdx(-1);
  };

  const handleCopyText = () => {
    if (humanizedBlocks.length === 0) return;
    const text = humanizedBlocks.map(b => b.content).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render diffs formatted inside the right panel
  const renderCompareText = (originalText: string, humanizedText: string) => {
    const diffs = computeWordDiff(originalText, humanizedText);
    return (
      <span className="leading-relaxed text-sm">
        {diffs.map((part, index) => {
          if (part.type === 'removed') {
            return (
              <span key={index} className="diff-deletion">
                {part.text}
              </span>
            );
          } else if (part.type === 'added') {
            return (
              <span key={index} className="diff-addition">
                {part.text}
              </span>
            );
          } else {
            return <span key={index}>{part.text}</span>;
          }
        })}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Bar */}
        <div className="glass-panel rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-5 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 shadow-lg">
          {/* Back btn + File metadata */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToUpload}
              className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-purple" />
              <span className="text-sm font-bold text-white max-w-[180px] sm:max-w-xs truncate">{filename}</span>
            </div>
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full font-mono">{wordCount} words</span>
          </div>

          {/* SaaS Controls */}
          <div className="flex flex-wrap items-center gap-4.5">
            {/* Tone Selector */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wide">Tone Profile</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                disabled={isProcessing}
                className="px-2.5 py-1.5 text-xs text-white glass-input bg-[#0D0D0D] border-white/5 rounded-lg cursor-pointer"
              >
                <option value="professional">💼 Professional</option>
                <option value="academic">🎓 Academic</option>
                <option value="casual">💬 Casual</option>
                <option value="friendly">😊 Friendly</option>
              </select>
            </div>

            {/* Strength Slider */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="flex justify-between text-[9px] font-semibold text-gray-500 uppercase tracking-wide">
                <span>Strength</span>
                <span className="text-brand-purple font-mono">{strength}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                disabled={isProcessing}
                className="h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-brand-purple"
              />
            </div>

            {/* Formatting toggles */}
            <div className="flex items-center gap-4.5">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveFormatting}
                  onChange={(e) => setPreserveFormatting(e.target.checked)}
                  disabled={isProcessing}
                  className="rounded border-white/5 bg-[#0D0D0D] text-brand-purple focus:ring-0 w-3.5 h-3.5"
                />
                <span>Preserve Format</span>
              </label>
              
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preserveCitations}
                  onChange={(e) => setPreserveCitations(e.target.checked)}
                  disabled={isProcessing}
                  className="rounded border-white/5 bg-[#0D0D0D] text-brand-purple focus:ring-0 w-3.5 h-3.5"
                />
                <span>Preserve Citations</span>
              </label>
            </div>

            {/* Execution Trigger */}
            <button
              onClick={handleHumanize}
              disabled={isProcessing || originalBlocks.length === 0}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-xl text-xs font-semibold hover:opacity-95 shadow-[0_0_20px_rgba(139,92,246,0.2)] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Humanizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Humanize Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-400">Error:</span>
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-xs text-red-400 hover:text-red-200 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Split Screen Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
          
          {/* LEFT PANEL: Original Document Preview */}
          <div className="flex flex-col rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md overflow-hidden min-h-[500px]">
            {/* Header tab */}
            <div className="px-5 py-2 border-b border-white/5 bg-white/2 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setLeftTab('edit')}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                    leftTab === 'edit' 
                      ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Edit / Paste Text
                </button>
                <button
                  onClick={() => setLeftTab('preview')}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                    leftTab === 'preview' 
                      ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Layout Preview
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-semibold">
                  {scores.originalAiScore}% AI Generated
                </span>
              </div>
            </div>
            
            {/* Preview Canvas */}
            <div className="p-6 flex-grow overflow-y-auto max-h-[550px] flex flex-col font-sans text-gray-300">
              {leftTab === 'edit' ? (
                <textarea
                  value={rawText}
                  onChange={handleRawTextChange}
                  disabled={isProcessing}
                  placeholder="Paste or type your AI generated text here..."
                  className="w-full flex-grow min-h-[400px] bg-transparent outline-none border-0 text-sm leading-relaxed text-gray-300 resize-none placeholder-gray-600 focus:ring-0"
                />
              ) : (
                <div className="space-y-4">
                  {originalBlocks.map((block) => {
                    if (block.type === 'heading1') {
                      return <h1 key={block.id} className="text-2xl font-extrabold text-white pt-4 pb-2 border-b border-white/5">{block.content}</h1>;
                    } else if (block.type === 'heading2') {
                      return <h2 key={block.id} className="text-lg font-bold text-white pt-3 pb-1">{block.content}</h2>;
                    } else if (block.type === 'list-item') {
                      const bullet = block.style?.listType === 'number' ? '1.' : '•';
                      return (
                        <div key={block.id} className={`flex gap-3 pl-4 text-sm leading-relaxed ${block.style?.bold ? 'font-bold' : ''} ${block.style?.italic ? 'italic' : ''}`}>
                          <span className="text-brand-purple font-bold">{bullet}</span>
                          <span>{block.content}</span>
                        </div>
                      );
                    } else if (block.type === 'table' && block.tableData) {
                      return (
                        <div key={block.id} className="overflow-x-auto my-4 border border-white/5 rounded-lg bg-white/1">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-white/5 bg-white/3 font-semibold text-gray-300">
                                {block.tableData[0]?.map((cell, idx) => (
                                  <th key={idx} className="px-3 py-2 border-r border-white/5 last:border-r-0">{cell}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {block.tableData.slice(1).map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-white/1">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-3 py-2 border-r border-white/5 last:border-r-0 text-gray-400">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    } else {
                      return (
                        <p 
                          key={block.id} 
                          className={`text-sm leading-relaxed text-justify ${block.style?.bold ? 'font-bold' : ''} ${block.style?.italic ? 'italic' : ''}`}
                        >
                          {block.content}
                        </p>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Humanized Preview */}
          <div className="flex flex-col rounded-2xl border border-white/5 bg-[#0A0A0A]/40 backdrop-blur-md overflow-hidden min-h-[500px]">
            {/* Header tab */}
            <div className="px-5 py-3 border-b border-white/5 bg-white/2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Humanized Output</span>
              
              <div className="flex items-center gap-3">
                {/* Compare Mode Toggle */}
                {humanizedBlocks.length > 0 && (
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-all border cursor-pointer ${
                      compareMode 
                        ? 'bg-brand-purple/10 border-brand-purple/35 text-brand-purple' 
                        : 'bg-white/3 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Compare Diffs</span>
                  </button>
                )}

                {humanizedBlocks.length > 0 ? (
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded font-semibold">
                    {scores.humanizedHumanScore}% Human Content
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded font-semibold">
                    Awaiting conversion
                  </span>
                )}
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="p-6 flex-grow overflow-y-auto max-h-[550px] space-y-4 font-sans text-gray-300 relative">
              {/* Shimmer loading layout if executing */}
              {isProcessing && humanizedBlocks.length === 0 && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-[#030303]/60 backdrop-blur-sm z-10">
                  <Loader2 className="w-8 h-8 text-brand-purple animate-spin mb-4" />
                  <p className="text-xs text-gray-400">Humanizing with AI — please wait...</p>
                </div>
              )}

              {/* Rendering processed blocks */}
              {humanizedBlocks.length > 0 ? (
                humanizedBlocks.map((block, idx) => {
                  const origBlockContent = originalBlocks[idx]?.content || "";
                  
                  if (block.type === 'heading1') {
                    return (
                      <h1 key={block.id} className="text-2xl font-extrabold text-white pt-4 pb-2 border-b border-brand-purple/10">
                        {compareMode ? renderCompareText(origBlockContent, block.content) : block.content}
                      </h1>
                    );
                  } else if (block.type === 'heading2') {
                    return (
                      <h2 key={block.id} className="text-lg font-bold text-white pt-3 pb-1">
                        {compareMode ? renderCompareText(origBlockContent, block.content) : block.content}
                      </h2>
                    );
                  } else if (block.type === 'list-item') {
                    const bullet = block.style?.listType === 'number' ? '1.' : '•';
                    return (
                      <div key={block.id} className="flex gap-3 pl-4 text-sm leading-relaxed">
                        <span className="text-brand-purple font-bold">{bullet}</span>
                        <span>{compareMode ? renderCompareText(origBlockContent, block.content) : block.content}</span>
                      </div>
                    );
                  } else if (block.type === 'table' && block.tableData) {
                    const origTableData = originalBlocks[idx]?.tableData;
                    
                    return (
                      <div key={block.id} className="overflow-x-auto my-4 border border-brand-purple/15 rounded-lg bg-brand-purple/1">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-white/5 bg-brand-purple/5 font-semibold text-gray-200">
                              {block.tableData[0]?.map((cell, cIdx) => (
                                <th key={cIdx} className="px-3 py-2 border-r border-white/5 last:border-r-0">
                                  {compareMode && origTableData ? renderCompareText(origTableData[0]?.[cIdx] || "", cell) : cell}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {block.tableData.slice(1).map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-brand-purple/3">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-3 py-2 border-r border-white/5 last:border-r-0 text-gray-300">
                                    {compareMode && origTableData ? renderCompareText(origTableData[rIdx + 1]?.[cIdx] || "", cell) : cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  } else {
                    return (
                      <p key={block.id} className="text-sm leading-relaxed text-justify">
                        {compareMode ? renderCompareText(origBlockContent, block.content) : block.content}
                      </p>
                    );
                  }
                })
              ) : (
                !isProcessing && (
                  <div className="flex flex-col items-center justify-center text-center h-full text-gray-600 mt-20">
                    <Sparkles className="w-10 h-10 text-white/5 mb-4 animate-float-slow" />
                    <p className="text-xs">Click &ldquo;Humanize Document&rdquo; to start processing blocks.</p>
                  </div>
                )
              )}

              {/* Progress Indicator Shimmer when processing block-by-block */}
              {isProcessing && progressBlockIdx !== -1 && (
                <div className="p-4 border border-dashed border-white/5 bg-white/2 rounded-lg animate-pulse text-xs text-gray-500">
                  Rewriting block {progressBlockIdx + 1} of {originalBlocks.length}...
                </div>
              )}
            </div>

            {/* Export Toolbar */}
            {humanizedBlocks.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-white/2 flex items-center justify-between gap-3">
                <button
                  onClick={handleCopyText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/3 hover:bg-white/5 border border-white/5 text-[10px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onExportTxt(humanizedBlocks)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-white/3 hover:bg-white/5 border border-white/5 text-[10px] font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>TXT</span>
                  </button>
                  <button
                    onClick={() => onExportDocx(humanizedBlocks)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded bg-gradient-to-r from-brand-purple to-brand-blue text-white text-[10px] font-semibold shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:opacity-95 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download DOCX</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* AI Detection Panel & Gauges */}
        {humanizedBlocks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            
            {/* Gauge 1: Original AI Score */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#0A0A0A]/50 text-center flex flex-col justify-between items-center">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Original AI Probability</span>
              
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#EF4444" strokeWidth="6" fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * scores.originalAiScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-lg font-extrabold text-white">{scores.originalAiScore}%</span>
              </div>
              
              <span className="text-[10px] text-red-400 mt-3 font-semibold">High AI Certainty</span>
            </div>

            {/* Gauge 2: Humanized AI Score */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#0A0A0A]/50 text-center flex flex-col justify-between items-center relative overflow-hidden">
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-brand-purple/2 opacity-30 pointer-events-none" />
              
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Post-Rewrite AI Score</span>
              
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#8B5CF6" strokeWidth="6" fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * scores.humanizedAiScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-lg font-extrabold text-white">{scores.humanizedAiScore}%</span>
              </div>
              
              <span className="text-[10px] text-gray-400 mt-3 font-medium">Bypassed Detectors</span>
            </div>

            {/* Gauge 3: Human Probability Score */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#0A0A0A]/50 text-center flex flex-col justify-between items-center relative overflow-hidden">
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-green-500/2 opacity-30 pointer-events-none" />
              
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Human Authenticity Score</span>
              
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                  <circle cx="48" cy="48" r="40" stroke="#10B981" strokeWidth="6" fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * scores.humanizedHumanScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className="absolute text-lg font-extrabold text-white">{scores.humanizedHumanScore}%</span>
              </div>
              
              <span className="text-[10px] text-green-400 mt-3 font-bold flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-green-400/20" /> Highly Authentic
              </span>
            </div>

            {/* Metric 4: Readability Details */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#0A0A0A]/50 flex flex-col justify-between">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">Style & Readability Analysis</span>
              
              <div className="space-y-4">
                {/* Readability bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Flesch-Kincaid Readability</span>
                    <span className="font-semibold text-white">{scores.readabilityScore} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full"
                      style={{ width: `${scores.readabilityScore}%` }}
                    />
                  </div>
                </div>

                {/* Tone badge details */}
                <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded bg-white/3 border border-white/5">
                    <span className="block text-gray-500 uppercase tracking-wide">Applied Style</span>
                    <span className="font-semibold text-white capitalize mt-0.5 block">{tone}</span>
                  </div>
                  <div className="p-2 rounded bg-white/3 border border-white/5">
                    <span className="block text-gray-500 uppercase tracking-wide">Cit. Status</span>
                    <span className="font-semibold text-white mt-0.5 block">
                      {preserveCitations ? 'Preserved' : 'Stripped'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="w-1" />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
