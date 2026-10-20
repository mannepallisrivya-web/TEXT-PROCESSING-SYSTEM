/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, TabId } from './components/Navbar';
import { InteractiveWorkbench } from './components/InteractiveWorkbench';
import { FileUploadSection } from './components/FileUploadSection';
import { TextSimilaritySection } from './components/TextSimilaritySection';
import { ReportDownloadSection } from './components/ReportDownloadSection';
import { PythonSourceExplorer } from './components/PythonSourceExplorer';
import { CapstoneDocsAndTests } from './components/CapstoneDocsAndTests';
import { Download, ExternalLink, Github, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('workbench');
  const [inputText, setInputText] = useState<string>(
    'Python makes text processing easy and efficient. Welcome to our Capstone Project!'
  );

  const handleLoadTextFromUpload = (text: string) => {
    setInputText(text);
    setActiveTab('workbench');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'workbench' && (
          <InteractiveWorkbench inputText={inputText} setInputText={setInputText} />
        )}

        {activeTab === 'upload' && (
          <FileUploadSection onLoadTextToWorkbench={handleLoadTextFromUpload} />
        )}

        {activeTab === 'similarity' && <TextSimilaritySection />}

        {activeTab === 'report' && <ReportDownloadSection inputText={inputText} />}

        {activeTab === 'source' && <PythonSourceExplorer />}

        {activeTab === 'capstone' && <CapstoneDocsAndTests />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Text Processing System Using Python</span>
            <span>·</span>
            <span>BTech Computer Science Engineering Capstone</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <a
              href="/text_processing_system.zip"
              download="text_processing_system.zip"
              className="hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project .ZIP</span>
            </a>
            <button
              onClick={() => setActiveTab('source')}
              className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Source Files</span>
            </button>
            <button
              onClick={() => setActiveTab('capstone')}
              className="hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <span>Viva Guide &amp; Tests</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
