'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import UploadZone from '../components/UploadZone';
import Workspace from '../components/Workspace';
import Dashboard, { HistoryRecord } from '../components/Dashboard';
import AuthModal from '../components/AuthModal';
import { DocBlock, exportToDocx, exportToTxt, triggerFileDownload } from '../utils/documentProcessor';

export default function Home() {
  const { data: session } = useSession();

  const user = session?.user
    ? {
        id: (session.user as { id?: string }).id ?? '',
        email: session.user.email ?? '',
        credits: (session.user as { credits?: number }).credits ?? 1000,
      }
    : null;

  const [history, setHistory] = React.useState<HistoryRecord[]>([]);
  const [view, setView] = React.useState<'landing' | 'workspace' | 'dashboard'>('landing');
  const [selectedFile, setSelectedFile] = React.useState<{ filename: string; blocks: DocBlock[] } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  const fetchHistory = async (userId: string) => {
    try {
      const res = await fetch(`/api/history?userId=${userId}`);
      if (res.ok) setHistory(await res.json());
    } catch (err) {
      console.error('Fetch history error:', err);
    }
  };

  React.useEffect(() => {
    if (user?.id) fetchHistory(user.id);
  }, [user?.id]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    setView('landing');
    setSelectedFile(null);
  };

  const handleCtaClick = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileParsed = (filename: string, blocks: DocBlock[]) => {
    setSelectedFile({ filename, blocks });
    setView('workspace');
  };

  const handleDeductCredits = (wordsUsed: number) => {
    // Credits managed server-side, local state just for display
    void wordsUsed;
  };

  const handleSaveHistory = async (
    filename: string,
    tone: string,
    originalAiScore: number,
    humanizedHumanScore: number,
    blocks: DocBlock[]
  ) => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, filename, tone, originalAiScore, humanizedHumanScore, blocks }),
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(prev => [data.record, ...prev]);
      }
    } catch (err) {
      console.error('Save history error:', err);
    }
  };

  const handleLoadRecord = (record: HistoryRecord) => {
    setSelectedFile({ filename: record.filename, blocks: record.blocks });
    setView('workspace');
  };

  const handleDownloadRecord = async (record: HistoryRecord) => {
    try {
      const blob = await exportToDocx(record.blocks, record.filename);
      triggerFileDownload(blob, `${record.filename.replace(/\.[^/.]+$/, '')}_humanized.docx`);
    } catch (error) {
      console.error('Export DOCX failed:', error);
    }
  };

  const handleExportDocx = async (blocks: DocBlock[]) => {
    if (!selectedFile) return;
    try {
      const blob = await exportToDocx(blocks, selectedFile.filename);
      triggerFileDownload(blob, `${selectedFile.filename.replace(/\.[^/.]+$/, '')}_humanized.docx`);
    } catch (error) {
      console.error('Export DOCX failed:', error);
    }
  };

  const handleExportTxt = (blocks: DocBlock[]) => {
    if (!selectedFile) return;
    const blob = new Blob([exportToTxt(blocks)], { type: 'text/plain;charset=utf-8' });
    triggerFileDownload(blob, `${selectedFile.filename.replace(/\.[^/.]+$/, '')}_humanized.txt`);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-white">
      <Navbar
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onScrollToSection={handleScrollToSection}
        onNavigateToDashboard={() => setView('dashboard')}
        onNavigateToWorkspace={() => setView(selectedFile ? 'workspace' : 'landing')}
        view={view}
      />

      {view === 'landing' && (
        <>
          <Hero onCtaClick={handleCtaClick} />
          <section id="upload-section" className="relative z-10 py-16 bg-[#030303] px-4 sm:px-6 lg:px-8 border-b border-white/5">
            <div className="max-w-4xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold text-white tracking-tight">Upload Your Document</h2>
              <p className="text-xs text-gray-500 mt-2">Structure preservation runs in the browser. Select or drop a file to edit.</p>
            </div>
            <UploadZone onFileParsed={handleFileParsed} />
          </section>
          <Features />
          <Pricing onSelectPlan={() => setIsAuthOpen(true)} />
          <Testimonials />
        </>
      )}

      {view === 'workspace' && selectedFile && (
        <Workspace
          filename={selectedFile.filename}
          initialBlocks={selectedFile.blocks}
          userCredits={user?.credits ?? 99999}
          onDeductCredits={handleDeductCredits}
          onSaveHistory={handleSaveHistory}
          onExportDocx={handleExportDocx}
          onExportTxt={handleExportTxt}
          onBackToUpload={() => { setSelectedFile(null); setView('landing'); }}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard
          user={user}
          history={history}
          onLoadRecord={handleLoadRecord}
          onDownloadRecord={handleDownloadRecord}
          onNavigateToWorkspace={() => setView(selectedFile ? 'workspace' : 'landing')}
        />
      )}

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
