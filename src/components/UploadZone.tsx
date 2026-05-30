'use client';

import React from 'react';
import { UploadCloud, CheckCircle, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { parseDocument, DocBlock } from '../utils/documentProcessor';

interface UploadZoneProps {
  onFileParsed: (filename: string, blocks: DocBlock[]) => void;
}

export default function UploadZone({ onFileParsed }: UploadZoneProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = React.useState(0);
  const [currentTask, setCurrentTask] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [fileDetails, setFileDetails] = React.useState<{ name: string; size: string } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'pdf', 'docx'].includes(ext || '')) {
      setErrorMsg('Unsupported format. Please upload .txt, .pdf, or .docx files.');
      setStatus('error');
      return;
    }

    setStatus('parsing');
    setErrorMsg('');
    setFileDetails({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    });

    // Simulate structured progress
    const steps = [
      { prg: 20, task: 'Reading binary stream...' },
      { prg: 45, task: 'Decoding structure block components...' },
      { prg: 75, task: 'Extracting paragraphs, list structures, and tables...' },
      { prg: 100, task: 'Document extraction successful.' }
    ];

    for (const step of steps) {
      setCurrentTask(step.task);
      setProgress(step.prg);
      await new Promise(r => setTimeout(r, step.prg === 100 ? 500 : 700));
    }

    try {
      const blocks = await parseDocument(file);
      setStatus('success');
      setTimeout(() => {
        onFileParsed(file.name, blocks);
        setStatus('idle');
        setProgress(0);
        setFileDetails(null);
      }, 800);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error occurred while decoding document structural nodes.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const loadSampleDocument = () => {
    const sampleBlocks: DocBlock[] = [
      {
        id: 's-1',
        type: 'heading1',
        content: 'AI IMPLEMENTATION STRATEGY REPORT'
      },
      {
        id: 's-2',
        type: 'paragraph',
        content: 'Furthermore, it is highly crucial to utilize standardized machine learning frameworks to foster cross-team collaborations. Consequently, building custom infrastructure is a testament to technical complexity, but it does not always yield optimal ROI.'
      },
      {
        id: 's-3',
        type: 'heading2',
        content: 'Core Advantages of Preserving Formatting'
      },
      {
        id: 's-4',
        type: 'list-item',
        content: 'In conclusion, manual re-formatting consumes substantial engineering bandwidth.',
        style: { listType: 'bullet' }
      },
      {
        id: 's-5',
        type: 'list-item',
        content: 'Additionally, layout anomalies in documents convey a lack of professional details.',
        style: { listType: 'bullet' }
      },
      {
        id: 's-6',
        type: 'heading2',
        content: 'Expected Performance Output'
      },
      {
        id: 's-7',
        type: 'table',
        content: '[Table comparing system speeds]',
        tableData: [
          ['System Version', 'Word Count Capacity', 'Average Processing Time'],
          ['Legacy Humanizer', '1,000 words', '2.5 seconds'],
          ['HumanDoc AI Engine', '10,000 words', '0.4 seconds']
        ]
      },
      {
        id: 's-8',
        type: 'paragraph',
        content: 'To sum up, our evaluation demonstrates that streamlining file processing results in 6x gains. Therefore, stakeholders must evaluate these benchmarks prior to licensing commercial modules.'
      }
    ];

    onFileParsed('sample_document.docx', sampleBlocks);
  };

  const handlePasteTextClick = () => {
    onFileParsed('pasted_document.txt', [
      {
        id: 'paste-1',
        type: 'paragraph',
        content: 'Type or paste your raw text here...'
      }
    ]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative p-10 rounded-2xl border border-dashed transition-all ${
          dragActive 
            ? 'border-brand-purple bg-brand-purple/5 shadow-[0_0_30px_rgba(139,92,246,0.1)]' 
            : 'border-white/10 bg-[#0A0A0A]/50 hover:bg-[#0A0A0A]/80 hover:border-brand-purple/20'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept=".txt,.pdf,.docx"
          onChange={handleFileInput}
          className="hidden"
        />

        {status === 'idle' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/3 flex items-center justify-center mb-6 border border-white/5 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
              <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-white" />
            </div>
            
            <h3 className="text-base font-bold text-white mb-2">Drag and drop your file here</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-sm leading-relaxed">
              Supports <span className="text-gray-300 font-semibold">PDF, Word (DOCX)</span>, and <span className="text-gray-300 font-semibold">Plain Text (TXT)</span> files. Maximum file size is 10 MB.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label
                htmlFor="file-upload"
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold border border-white/5 hover:border-white/10 transition-all cursor-pointer inline-block"
              >
                Browse Files
              </label>
              
              <button
                onClick={loadSampleDocument}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-white/5 border border-white/5 text-gray-300 hover:text-white text-xs font-semibold rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                <span>Try Sample</span>
              </button>

              <button
                onClick={handlePasteTextClick}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 border border-brand-purple/20 text-brand-purple text-xs font-semibold rounded-lg hover:from-brand-purple/20 hover:to-brand-blue/20 transition-all cursor-pointer"
              >
                <span>Paste Text Directly</span>
              </button>
            </div>
          </div>
        )}

        {status === 'parsing' && (
          <div className="flex flex-col items-center text-center py-6">
            <Loader2 className="w-10 h-10 text-brand-purple animate-spin mb-6" />
            <h3 className="text-sm font-bold text-white mb-1.5">Parsing document structure...</h3>
            <p className="text-xs text-gray-500 mb-4">{currentTask}</p>
            
            <div className="w-64">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-blue transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-500 mt-2 block">{progress}%</span>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Parsed successfully!</h3>
            <p className="text-xs text-gray-400">{fileDetails?.name} ({fileDetails?.size})</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Error uploading file</h3>
            <p className="text-xs text-red-400 max-w-sm mb-6">{errorMsg}</p>
            
            <button
              onClick={() => setStatus('idle')}
              className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
