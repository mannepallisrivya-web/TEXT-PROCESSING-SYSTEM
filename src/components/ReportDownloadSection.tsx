import React, { useState } from 'react';
import { generateReport } from '../utils/textProcessor';
import { FileDown, Copy, Check, Download } from 'lucide-react';

interface ReportDownloadSectionProps {
  inputText: string;
}

export const ReportDownloadSection: React.FC<ReportDownloadSectionProps> = ({ inputText }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const reportText = generateReport(inputText, {
    ignoreWhitespace: true,
    caseSensitive: true,
    ignorePunctuation: false,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text_processing_analysis_report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-indigo-600" />
              Feature 7: Download Analysis Report (.txt)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates a structured, clean, dynamically calculated report of all 11 text analysis features.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt Report</span>
            </button>
          </div>
        </div>

        {/* Report Content Preview Box */}
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-900 text-slate-100 font-mono text-xs">
          <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
            <span>text_processing_analysis_report.txt (UTF-8)</span>
            <span>{reportText.length} characters</span>
          </div>
          <pre className="p-4 overflow-x-auto max-h-[500px] leading-relaxed select-all">
            {reportText}
          </pre>
        </div>
      </div>
    </div>
  );
};
