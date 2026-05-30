'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

export default function Hero({ onCtaClick }: HeroProps) {
  const [showDemo, setShowDemo] = React.useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#030303]">
      {/* Mesh Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Floating Ambient Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-purple/10 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-blue/10 blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand-pink/5 blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-xs text-brand-purple mb-8 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-wide uppercase">Powered by Next-Gen Humanizer-4</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight sm:leading-none"
        >
          Humanize AI Documents <br className="hidden sm:inline" />
          <span className="gradient-text-purple-blue">Without Breaking Formatting</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-12 leading-relaxed"
        >
          Upload PDFs, Word files, or TXT documents and convert robotic AI text into natural human writing while preserving headings, spacing, layout, bullets, and tables.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto px-8 py-4 font-semibold text-white bg-gradient-to-r from-brand-purple via-brand-purple to-brand-blue rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all transform hover:-translate-y-0.5 duration-200 cursor-pointer"
          >
            Humanize Now
          </button>
          
          <button
            onClick={() => setShowDemo(true)}
            className="w-full sm:w-auto px-8 py-4 font-semibold text-gray-300 hover:text-white glass-panel hover:bg-white/5 rounded-xl border border-white/5 hover:border-brand-purple/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-brand-purple fill-brand-purple/20" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Mini Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative max-w-4xl mx-auto p-2.5 rounded-2xl border border-white/5 bg-[#030303]/60 backdrop-blur-2xl shadow-[0_30px_100px_rgba(139,92,246,0.1)] group"
        >
          {/* Glowing frame */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative rounded-xl border border-white/5 bg-[#0A0A0A] overflow-hidden aspect-[16/9]">
            <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 bg-[#0D0D0D] flex items-center px-4 justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/30" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                <div className="w-3 h-3 rounded-full bg-green-500/30" />
              </div>
              <div className="text-xs text-gray-500 font-mono">humandoc-workspace.html</div>
              <div className="w-16" />
            </div>

            <div className="pt-14 px-6 pb-6 h-full grid grid-cols-2 gap-4 text-left">
              {/* Left Column Mock */}
              <div className="border border-white/5 bg-[#030303] rounded-lg p-4 flex flex-col h-full opacity-60">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><FileText className="w-3 h-3 text-red-400" /> contract_ai.pdf</span>
                  <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">94% AI</span>
                </div>
                <div className="space-y-2 flex-grow overflow-hidden font-mono text-[9px] text-gray-400 leading-normal">
                  <div className="font-bold text-gray-300">SECTION 1. PURPOSE</div>
                  <div>Furthermore, it is critical to utilize standard methodologies in order to foster cross-team collaborations...</div>
                  <div className="font-bold text-gray-300">SECTION 2. SCOPE</div>
                  <div>Consequently, this contract is a testament to the fact that both entities agree to streamline...</div>
                </div>
              </div>

              {/* Right Column Mock */}
              <div className="border border-brand-purple/20 bg-[#05050C] rounded-lg p-4 flex flex-col h-full relative">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-purple to-brand-blue" />
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <span className="text-[10px] text-gray-300 font-mono flex items-center gap-1"><FileText className="w-3 h-3 text-brand-purple animate-pulse" /> contract_human.pdf</span>
                  <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 98% Human</span>
                </div>
                <div className="space-y-2 flex-grow overflow-hidden font-mono text-[9px] text-gray-300 leading-normal">
                  <div className="font-bold text-brand-purple">SECTION 1. PURPOSE</div>
                  <div><span className="text-green-400 bg-green-500/5">Additionally</span>, it is <span className="text-green-400 bg-green-500/5">essential</span> to <span className="text-green-400 bg-green-500/5">use</span> standard practices to <span className="text-green-400 bg-green-500/5">encourage</span> team cooperation...</div>
                  <div className="font-bold text-brand-purple">SECTION 2. SCOPE</div>
                  <div><span className="text-green-400 bg-green-500/5">Therefore</span>, this agreement <span className="text-green-400 bg-green-500/5">proves</span> that both sides agree to <span className="text-green-400 bg-green-500/5">simplify</span>...</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Demo Video Modal Popup */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#030303]/90 backdrop-blur-xl">
          <div className="absolute inset-0" onClick={() => setShowDemo(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl z-10"
          >
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0D0D0D]">
              <span className="text-sm font-semibold text-white">How it Works: HumanDoc AI Demo</span>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-xs text-gray-400 hover:text-white bg-white/5 px-2.5 py-1 rounded hover:bg-white/10 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
            {/* Mock Demo Presentation */}
            <div className="aspect-[16/9] flex flex-col justify-center items-center text-center p-8 bg-[#030303] text-gray-300">
              <div className="w-16 h-16 rounded-full bg-brand-purple/20 flex items-center justify-center mb-6 animate-bounce">
                <Sparkles className="w-8 h-8 text-brand-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Simulated Interactive Workspace Demonstration</h3>
              <p className="text-sm text-gray-400 max-w-md mb-8">
                Learn how document block extraction decomposes DOCX headers and XML nodes, rewrites the underlying strings page-by-page, and stitches them back together seamlessly.
              </p>
              <button
                onClick={() => {
                  setShowDemo(false);
                  onCtaClick();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all cursor-pointer"
              >
                Start Humanizing Your File Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
