import React, { useState } from 'react';
import { UploadCloud, FileCheck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FileUploadSectionProps {
  onLoadTextToWorkbench: (text: string) => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onLoadTextToWorkbench,
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [hasBOM, setHasBOM] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessNotice(null);
    setFileContent('');
    setFileName('');
    setFileSize(0);
    setHasBOM(false);

    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    // Feature 6 validations:
    // 1. Extension check (.txt)
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setErrorMessage(`Invalid file format '${file.name}'. Only plain-text (.txt) files are supported.`);
      return;
    }

    // 2. Size limit: 2 MB
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(`File size (${sizeMB} MB) exceeds maximum allowed limit of 2.0 MB.`);
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The uploaded file is empty (0 bytes). Please upload a valid text file.');
      return;
    }

    // 3. Read and decode safely with UTF-8 and BOM check
    const reader = new FileReader();
    reader.onload = event => {
      try {
        let text = (event.target?.result as string) || '';
        // Check for UTF-8 BOM (\uFEFF)
        if (text.charCodeAt(0) === 0xfeff) {
          setHasBOM(true);
          text = text.substring(1);
        }
        setFileContent(text);
        setSuccessNotice(`Successfully parsed and decoded '${file.name}' (${text.length} characters).`);
      } catch (err) {
        setErrorMessage(`Failed to decode file contents: ${String(err)}`);
      }
    };

    reader.onerror = () => {
      setErrorMessage('An unexpected error occurred while reading the file.');
    };

    reader.readAsText(file, 'utf-8');
  };

  const handleSendToWorkbench = () => {
    if (!fileContent) return;
    onLoadTextToWorkbench(fileContent);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-600" />
            Feature 6: Text File Upload & Analysis (.txt)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload any standard plain-text file up to 2 MB with automatic UTF-8 decoding and BOM handling.
          </p>
        </div>

        {/* Drag/Drop Uploader Input */}
        <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-colors rounded-xl p-8 text-center bg-slate-50/50">
          <input
            type="file"
            id="file-upload"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <span className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                Click to browse file
              </span>{' '}
              <span className="text-xs text-slate-500">or drag and drop</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Supported format: Plain-text (.txt) up to 2.0 MB · UTF-8 / UTF-8-BOM safe
            </p>
          </label>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success message */}
        {successNotice && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
              {hasBOM && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  UTF-8 BOM stripped safely
                </span>
              )}
            </div>
            <button
              onClick={handleSendToWorkbench}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Load into Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* File Content Preview */}
        {fileContent && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Preview: {fileName} ({(fileSize / 1024).toFixed(1)} KB)
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {fileContent.length} characters · {fileContent.split(/\r\n|\r|\n/).length} lines
              </span>
            </div>

            <textarea
              readOnly
              rows={8}
              value={fileContent}
              className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};
