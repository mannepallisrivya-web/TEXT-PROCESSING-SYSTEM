import React from 'react';
import {
  FileText,
  Sliders,
  FolderGit2,
  GitCompare,
  FileDown,
  GraduationCap,
  Download,
} from 'lucide-react';

export type TabId = 'workbench' | 'upload' | 'similarity' | 'report' | 'source' | 'capstone';

interface NavbarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'workbench' as TabId, label: 'Text Analysis Workbench', icon: Sliders },
    { id: 'upload' as TabId, label: 'File Upload (.txt)', icon: FileText },
    { id: 'similarity' as TabId, label: 'Text Similarity', icon: GitCompare },
    { id: 'report' as TabId, label: 'Download Report', icon: FileDown },
    { id: 'source' as TabId, label: 'Python Source Files', icon: FolderGit2 },
    { id: 'capstone' as TabId, label: 'Capstone Docs & Tests', icon: GraduationCap },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  Text Processing System Using Python
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  BTech Computer Science Engineering Capstone Project · Streamlit & Python 3.10+
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/text_processing_system.zip"
              download="text_processing_system.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
              title="Download entire Python project archive with tests and Streamlit app"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project .ZIP</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1 scrollbar-none border-t border-slate-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
