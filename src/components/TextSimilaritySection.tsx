import React, { useState } from 'react';
import { calculateJaccardSimilarity } from '../utils/textProcessor';
import { GitCompare, Layers, CheckCircle, Info } from 'lucide-react';

export const TextSimilaritySection: React.FC = () => {
  const [textA, setTextA] = useState<string>(
    'Python makes text processing simple and fast. It is widely used in data science.'
  );
  const [textB, setTextB] = useState<string>(
    'Python makes data analysis fast and efficient. It is popular in software engineering.'
  );

  const similarity = calculateJaccardSimilarity(textA, textB);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-indigo-600" />
                Feature 11: Text Similarity Checker (Jaccard Word-Set Formula)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculates set-theoretic lexical overlap between two texts without requiring neural models.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
              Set Theory: J(A, B) = |A ∩ B| / |A ∪ B|
            </span>
          </div>
        </div>

        {/* Text comparison inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Text Sample A:
            </label>
            <textarea
              value={textA}
              onChange={e => setTextA(e.target.value)}
              rows={4}
              placeholder="Enter first text snippet..."
              className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <div className="text-[11px] text-slate-400 mt-1">
              {similarity.set1Size} unique lowercase word{similarity.set1Size !== 1 ? 's' : ''}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Text Sample B:
            </label>
            <textarea
              value={textB}
              onChange={e => setTextB(e.target.value)}
              rows={4}
              placeholder="Enter second text snippet..."
              className="w-full p-3 font-mono text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <div className="text-[11px] text-slate-400 mt-1">
              {similarity.set2Size} unique lowercase word{similarity.set2Size !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3.5">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Jaccard Similarity
            </span>
            <div className="text-2xl font-black text-indigo-900 font-mono mt-1">
              {similarity.similarityPercentage}%
            </div>
            <div className="text-[11px] text-indigo-600 mt-0.5">
              Coefficient: {similarity.score}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Intersection |A ∩ B|
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
              {similarity.intersectionSize}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Shared unique tokens</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Union |A ∪ B|
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
              {similarity.unionSize}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Total distinct tokens</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Zero Protection
            </span>
            <div className="text-xs font-bold text-emerald-700 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Safeguarded union == 0</div>
          </div>
        </div>

        {/* Set breakdown */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Shared Words (Intersection Set - {similarity.commonWords.length}):
            </h4>
            {similarity.commonWords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 max-h-28 overflow-y-auto">
                {similarity.commonWords.map((word, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-mono text-xs rounded font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No shared words between the two texts.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-semibold text-slate-600 mb-1">
                Unique to Text A only ({similarity.set1OnlyWords.length}):
              </h5>
              <div className="flex flex-wrap gap-1 p-2 bg-slate-50 rounded border border-slate-200 min-h-12 max-h-28 overflow-y-auto">
                {similarity.set1OnlyWords.map((word, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 font-mono text-[11px] rounded">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-600 mb-1">
                Unique to Text B only ({similarity.set2OnlyWords.length}):
              </h5>
              <div className="flex flex-wrap gap-1 p-2 bg-slate-50 rounded border border-slate-200 min-h-12 max-h-28 overflow-y-auto">
                {similarity.set2OnlyWords.map((word, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 font-mono text-[11px] rounded">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Academic note */}
        <div className="mt-5 p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
          <div>
            <strong>Algorithmic Explanation:</strong> Jaccard Similarity measures the ratio of intersection size to union size of unique word sets: J(A, B) = |A ∩ B| / |A ∪ B|. Words are stripped of punctuation and lowercased. This is strict lexical token overlap; it does not perform semantic embeddings or sentiment classification.
          </div>
        </div>
      </div>
    </div>
  );
};
