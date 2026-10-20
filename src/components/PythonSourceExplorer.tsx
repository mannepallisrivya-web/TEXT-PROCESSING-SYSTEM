import React, { useState } from 'react';
import { PYTHON_PROJECT_FILES, PythonFileItem } from '../data/pythonSourceFiles';
import { FolderGit2, FileCode, Copy, Check, Download, ExternalLink, Terminal } from 'lucide-react';

export const PythonSourceExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<PythonFileItem>(PYTHON_PROJECT_FILES[1]); // default to text_processor.py
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        {/* Top header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-600" />
              Python Project Repository & Source Files
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete pure-Python and Streamlit project files for local execution in VS Code or desktop terminal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/text_processing_system.zip"
              download="text_processing_system.zip"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project .ZIP</span>
            </a>
          </div>
        </div>

        {/* File Browser Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* File sidebar list */}
          <div className="md:col-span-1 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Project Structure
            </div>
            {PYTHON_PROJECT_FILES.map(file => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="truncate">{file.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">{file.language === 'python' ? 'py' : 'txt'}</span>
                </button>
              );
            })}

            {/* Quick terminal tip */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                <Terminal className="w-3 h-3 text-indigo-600" />
                Local Execution:
              </span>
              <p className="text-[11px] font-mono text-slate-700 bg-white p-1.5 rounded border border-slate-200">
                streamlit run app.py
              </p>
              <p className="text-[10px] text-slate-500">
                Requires Python 3.10+ &amp; <code className="text-indigo-600">pip install -r requirements.txt</code>
              </p>
            </div>
          </div>

          {/* Active file code viewer */}
          <div className="md:col-span-3 border border-slate-200 rounded-lg overflow-hidden bg-slate-900 flex flex-col">
            <div className="bg-slate-800/90 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-200 font-medium">{selectedFile.path}</span>
                <span className="text-[10px] text-slate-400 font-mono">({selectedFile.content.split('\n').length} lines)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs flex items-center gap-1 transition-colors"
                  title="Copy file content"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs flex items-center gap-1 transition-colors"
                  title="Download file"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="p-2 bg-slate-800/40 text-[11px] text-slate-400 px-4 border-b border-slate-800">
              {selectedFile.description}
            </div>

            <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed select-all flex-1 max-h-[550px]">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
