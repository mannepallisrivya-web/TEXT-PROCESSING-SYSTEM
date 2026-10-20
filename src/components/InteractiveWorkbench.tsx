import React, { useState } from 'react';
import {
  findFirstNonRepeatingChar,
  countCharacters,
  countWords,
  analyzeWordFrequency,
  reverseText,
  detectRepeatedCharacters,
  countSentences,
  convertCase,
} from '../utils/textProcessor';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Type,
  Hash,
  AlignLeft,
  ArrowRightLeft,
  HelpCircle,
} from 'lucide-react';

interface InteractiveWorkbenchProps {
  inputText: string;
  setInputText: (text: string) => void;
}

const SAMPLE_TEXTS = [
  { label: 'swiss', desc: 'Classic non-repeating example', value: 'swiss' },
  { label: 'aabbcde', desc: 'Multiple duplicates before unique', value: 'aabbcde' },
  { label: 'aabb', desc: 'All characters repeat (None found)', value: 'aabb' },
  { label: 'banana', desc: 'Repeated characters frequency', value: 'banana' },
  {
    label: 'Python Sentence',
    desc: 'Python makes text processing easy and useful.',
    value: 'Python is easy and Python is useful. It is widely used in computer science! Do you agree?',
  },
];

export const InteractiveWorkbench: React.FC<InteractiveWorkbenchProps> = ({
  inputText,
  setInputText,
}) => {
  // Configuration states
  const [caseSensitive, setCaseSensitive] = useState<boolean>(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState<boolean>(false);

  // Transformation states
  const [caseMode, setCaseMode] = useState<'upper' | 'lower' | 'title' | 'sentence'>('upper');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Search in word frequency
  const [wordSearch, setWordSearch] = useState<string>('');

  // Run pure algorithms
  const fnrResult = findFirstNonRepeatingChar(inputText, {
    ignoreWhitespace,
    caseSensitive,
    ignorePunctuation,
  });

  const charStats = countCharacters(inputText);
  const wordStats = countWords(inputText);
  const wordFreqResult = analyzeWordFrequency(inputText);
  const repeatedChars = detectRepeatedCharacters(inputText, {
    ignoreWhitespace,
    caseSensitive,
    ignorePunctuation,
  });
  const sentenceStats = countSentences(inputText);
  const reversed = reverseText(inputText);
  const convertedText = convertCase(inputText, caseMode);

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const filteredFrequencies = wordFreqResult.frequencies.filter(item =>
    item.word.toLowerCase().includes(wordSearch.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Sample Loaders */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-600" />
              Input Text & Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter any string or select from pre-configured capstone verification benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Quick Samples:</span>
            {SAMPLE_TEXTS.map(sample => (
              <button
                key={sample.label}
                onClick={() => setInputText(sample.value)}
                className="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                title={sample.desc}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={4}
            placeholder="Type or paste text here to analyze..."
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 font-mono bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-y"
          />
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="absolute right-3 top-3 px-2 py-1 text-xs font-medium bg-white/90 border border-slate-200 rounded text-slate-600 hover:text-red-600 hover:border-red-300 transition-colors shadow-2xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Algorithmic Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-700">
          <span className="font-semibold text-slate-600 uppercase tracking-wider text-[11px]">
            Algorithm Rules:
          </span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={e => setCaseSensitive(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Case-sensitive ('S' ≠ 's')</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={e => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Ignore whitespace</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={ignorePunctuation}
              onChange={e => setIgnorePunctuation(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Ignore punctuation</span>
          </label>
        </div>
      </div>

      {/* FEATURE 1: FIRST NON-REPEATING CHARACTER (FLAGSHIP ALGORITHM) */}
      <div className="bg-white rounded-xl border border-indigo-100 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 border-b border-indigo-100 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-md bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Feature 1: First Non-Repeating Character
              </h3>
              <p className="text-xs text-slate-500">
                Two-Pass Hash Map Algorithm · <span className="font-mono font-semibold">O(N) Time Complexity</span>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
            Core Capstone Algorithm
          </span>
        </div>

        <div className="p-5">
          {!inputText ? (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Input text is empty. Enter or select a sample string above to find its first non-repeating character.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Result Badge */}
              <div className="md:col-span-1 bg-slate-50/80 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Detection Result
                  </span>
                  <div className="mt-2">
                    {fnrResult.character !== null ? (
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-extrabold text-indigo-700 font-mono bg-white px-3 py-1 rounded border border-indigo-200 shadow-2xs">
                          {fnrResult.character}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> First Unique
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Position #{fnrResult.index! + 1} (Index {fnrResult.index})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <span className="text-base font-bold text-slate-700 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          No unique character
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          {fnrResult.status === 'all_repeating'
                            ? 'Every character repeats in the evaluated string.'
                            : fnrResult.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Status message:</span> {fnrResult.message}
                </div>
              </div>

              {/* Execution Trace / Algorithmic Breakdown */}
              <div className="md:col-span-2 border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    How the 2-Pass Hash Map Found It:
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Unique keys: {Object.keys(fnrResult.frequencies).length}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 mb-3">
                  <p>
                    <strong>Pass 1 (Frequency Counting):</strong> Built frequency map table using <code className="px-1 py-0.5 bg-slate-100 rounded text-indigo-700 font-mono text-[11px]">dict/Counter</code> in <span className="font-mono">O(N)</span>.
                  </p>
                  <p>
                    <strong>Pass 2 (Sequential Scan):</strong> Scanned input from left to right. The first character encountered with frequency count == 1 was selected.
                  </p>
                </div>

                {/* Character pills with occurrence counts */}
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded">
                  {fnrResult.trace.map((item, idx) => {
                    const isWinner = fnrResult.character === item.char && fnrResult.index === item.index;
                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono transition-all ${
                          isWinner
                            ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-300 ring-offset-1'
                            : item.count === 1
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                        title={`Char: '${item.char}' at index ${item.index}, Frequency: ${item.count}`}
                      >
                        <span>{item.char === ' ' ? '␣' : item.char}</span>
                        <span className={`text-[10px] px-1 rounded ${isWinner ? 'bg-indigo-700' : 'bg-slate-200 text-slate-800'}`}>
                          {item.count}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FEATURE 2 & 3: CHARACTER COUNTER & WORD COUNTER METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Chars
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono mt-1">
            {charStats.totalCharacters}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">All bytes & spaces</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Excl. Space
          </div>
          <div className="text-xl font-bold text-indigo-600 font-mono mt-1">
            {charStats.charactersExcludingWhitespace}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Visible characters</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Alphabetic
          </div>
          <div className="text-xl font-bold text-emerald-600 font-mono mt-1">
            {charStats.alphabeticCharacters}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">a-z and A-Z</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Numeric
          </div>
          <div className="text-xl font-bold text-amber-600 font-mono mt-1">
            {charStats.numericCharacters}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Digits 0-9</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Words
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono mt-1">
            {wordStats.totalWords}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Whitespace-split</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Avg Word Len
          </div>
          <div className="text-xl font-bold text-purple-600 font-mono mt-1">
            {wordStats.averageWordLength}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Chars / total words</div>
        </div>
      </div>

      {/* FEATURE 4 & 9: WORD FREQUENCY & REPEATED CHARACTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature 4: Word Frequency Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlignLeft className="w-4 h-4 text-indigo-600" />
                Feature 4: Word Frequency Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Punctuation-stripped lowercase tokens
              </p>
            </div>
            {wordFreqResult.mostFrequentWords.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Top: {wordFreqResult.mostFrequentWords.join(', ')} ({wordFreqResult.maxFrequency}x)
              </span>
            )}
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Filter words..."
              value={wordSearch}
              onChange={e => setWordSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {filteredFrequencies.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No words match the analysis or filter criteria.
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Word</th>
                    <th className="py-2 px-3 text-right">Frequency</th>
                    <th className="py-2 px-3 text-right">% of Tokens</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFrequencies.map((item, idx) => {
                    const percentage = Math.round(
                      (item.frequency / wordFreqResult.totalTokens) * 100
                    );
                    const isTop = item.frequency === wordFreqResult.maxFrequency;
                    return (
                      <tr key={idx} className={isTop ? 'bg-indigo-50/40 font-medium' : 'hover:bg-slate-50'}>
                        <td className="py-2 px-3 font-mono text-slate-800">
                          {item.word}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-indigo-700">
                          {item.frequency}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-500">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Feature 9: Repeated Character Detection */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                Feature 9: Repeated Character Detection
              </h3>
              <p className="text-xs text-slate-500">
                Preserves order of first appearance (frequency &gt; 1)
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {repeatedChars.length} characters
            </span>
          </div>

          {repeatedChars.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              {inputText ? 'No characters repeat in this string.' : 'Enter text above to detect repeated characters.'}
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Order</th>
                    <th className="py-2 px-3">Character</th>
                    <th className="py-2 px-3 text-right">Repetition Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {repeatedChars.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-400 font-mono">#{idx + 1}</td>
                      <td className="py-2 px-3">
                        <span className="font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
                          {item.character === ' ' ? '[Space]' : item.character}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                        {item.frequency} times
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FEATURE 5 & 8: TEXT CASE CONVERSION & REVERSED TEXT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 5: Case Conversion */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-indigo-600" />
                Feature 5: Text Case Conversion
              </h3>
              <p className="text-xs text-slate-500">
                Transforms text format without altering original input
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {(
              [
                { id: 'upper', label: 'UPPERCASE' },
                { id: 'lower', label: 'lowercase' },
                { id: 'title', label: 'Title Case' },
                { id: 'sentence', label: 'Sentence case' },
              ] as const
            ).map(opt => (
              <button
                key={opt.id}
                onClick={() => setCaseMode(opt.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  caseMode === opt.id
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              readOnly
              rows={3}
              value={convertedText}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
            <button
              onClick={() => handleCopy(convertedText, 'converted')}
              className="absolute right-2 top-2 p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:text-indigo-600 shadow-2xs text-xs flex items-center gap-1"
              title="Copy converted text"
            >
              {copiedSection === 'converted' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'converted' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Feature 8: Reversed Text */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                Feature 8: Reverse Text
              </h3>
              <p className="text-xs text-slate-500">
                Python string slicing <code className="text-indigo-600 font-mono font-semibold">text[::-1]</code>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-2">
            Reverses sequence in <span className="font-mono">O(N)</span> while preserving whitespace, punctuation, and unicode symbols.
          </p>

          <div className="relative">
            <textarea
              readOnly
              rows={3}
              value={reversed}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
            <button
              onClick={() => handleCopy(reversed, 'reversed')}
              className="absolute right-2 top-2 p-1.5 bg-white border border-slate-200 rounded text-slate-600 hover:text-indigo-600 shadow-2xs text-xs flex items-center gap-1"
              title="Copy reversed text"
            >
              {copiedSection === 'reversed' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSection === 'reversed' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 10: SENTENCE COUNTER WITH DOCUMENTED LIMITATIONS */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-indigo-600" />
            Feature 10: Sentence Counter
          </h3>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            {sentenceStats.sentenceCount} Sentence{sentenceStats.sentenceCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p>
            <strong>Documented Rule:</strong> Sentences are segmented using terminal punctuation delimiters (<code className="px-1 py-0.2 bg-slate-100 rounded text-slate-800">.</code>, <code className="px-1 py-0.2 bg-slate-100 rounded text-slate-800">!</code>, <code className="px-1 py-0.2 bg-slate-100 rounded text-slate-800">?</code>). Consecutive marks (e.g. <code className="font-mono">...</code> or <code className="font-mono">?!</code>) are collapsed cleanly.
          </p>
          <p className="text-slate-500 italic bg-amber-50/60 p-2.5 rounded border border-amber-200/60">
            ⚠️ <strong>Academic Note / Known Limitation:</strong> Basic punctuation segmentation does not use machine learning disambiguation. Common abbreviations (such as 'Dr.', 'e.g.', 'U.S.A.') and decimal numbers ('3.14') are counted as punctuation delimiters.
          </p>
        </div>

        {sentenceStats.sentences.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Segmented Sentences:
            </span>
            <div className="space-y-1">
              {sentenceStats.sentences.map((sent, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 font-mono">
                  <span className="text-indigo-600 font-bold mr-2">[{idx + 1}]</span>
                  {sent}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
