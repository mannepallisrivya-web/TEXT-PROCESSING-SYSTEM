/**
 * @license
 * SPDX-License-Identifier: MIT
 * Text Processing System - Algorithm Engine (Mirroring Python implementation)
 */

export interface FirstNonRepeatingResult {
  character: string | null;
  index: number | null;
  status: 'found' | 'all_repeating' | 'empty_input' | 'no_valid_characters';
  message: string;
  frequencies: Record<string, number>;
  trace: Array<{ char: string; index: number; count: number }>;
}

export interface CharacterStats {
  totalCharacters: number;
  charactersExcludingWhitespace: number;
  alphabeticCharacters: number;
  numericCharacters: number;
  whitespaceCharacters: number;
  punctuationCharacters: number;
  otherCharacters: number;
}

export interface WordStats {
  totalWords: number;
  totalCharacters: number;
  averageWordLength: number;
  words: string[];
}

export interface WordFrequencyItem {
  word: string;
  frequency: number;
}

export interface WordFrequencyResult {
  frequencies: WordFrequencyItem[];
  mostFrequentWords: string[];
  maxFrequency: number;
  uniqueWordCount: number;
  totalTokens: number;
}

export interface RepeatedCharacterItem {
  character: string;
  frequency: number;
  normalizedKey: string;
}

export interface SentenceStats {
  sentenceCount: number;
  sentences: string[];
  note: string;
}

export interface JaccardSimilarityResult {
  similarityPercentage: number;
  score: number;
  set1Size: number;
  set2Size: number;
  intersectionSize: number;
  unionSize: number;
  commonWords: string[];
  set1OnlyWords: string[];
  set2OnlyWords: string[];
  message: string;
}

const PUNCTUATION_REGEX = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/;

export function findFirstNonRepeatingChar(
  text: string,
  options: {
    ignoreWhitespace?: boolean;
    caseSensitive?: boolean;
    ignorePunctuation?: boolean;
  } = {}
): FirstNonRepeatingResult {
  const {
    ignoreWhitespace = true,
    caseSensitive = true,
    ignorePunctuation = false,
  } = options;

  if (!text) {
    return {
      character: null,
      index: null,
      status: 'empty_input',
      message: 'Input text is empty. Please enter text to analyze.',
      frequencies: {},
      trace: [],
    };
  }

  const isEligible = (char: string): boolean => {
    if (ignoreWhitespace && /\s/.test(char)) return false;
    if (ignorePunctuation && PUNCTUATION_REGEX.test(char)) return false;
    return true;
  };

  const eligibleItems: Array<{ origIdx: number; char: string; key: string }> = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (isEligible(char)) {
      const key = caseSensitive ? char : char.toLowerCase();
      eligibleItems.push({ origIdx: i, char, key });
    }
  }

  if (eligibleItems.length === 0) {
    return {
      character: null,
      index: null,
      status: 'no_valid_characters',
      message: 'No eligible characters remained after filtering whitespace/punctuation.',
      frequencies: {},
      trace: [],
    };
  }

  // Pass 1: Build frequency map
  const frequencies: Record<string, number> = {};
  for (const item of eligibleItems) {
    frequencies[item.key] = (frequencies[item.key] || 0) + 1;
  }

  const trace = eligibleItems.map(item => ({
    char: item.char,
    index: item.origIdx,
    count: frequencies[item.key],
  }));

  // Pass 2: Left to right scan
  for (const item of eligibleItems) {
    if (frequencies[item.key] === 1) {
      return {
        character: text[item.origIdx],
        index: item.origIdx,
        status: 'found',
        message: `First non-repeating character is '${text[item.origIdx]}' at position ${item.origIdx + 1}.`,
        frequencies,
        trace,
      };
    }
  }

  return {
    character: null,
    index: null,
    status: 'all_repeating',
    message: 'Every character repeats. No unique non-repeating character exists.',
    frequencies,
    trace,
  };
}

export function countCharacters(text: string): CharacterStats {
  const total = text.length;
  let whitespace = 0;
  let alphabetic = 0;
  let numeric = 0;
  let punctuation = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/\s/.test(char)) {
      whitespace++;
    } else if (/[a-zA-Z]/.test(char)) {
      alphabetic++;
    } else if (/[0-9]/.test(char)) {
      numeric++;
    } else if (PUNCTUATION_REGEX.test(char)) {
      punctuation++;
    }
  }

  const nonWhitespace = total - whitespace;
  const other = Math.max(0, total - (alphabetic + numeric + whitespace + punctuation));

  return {
    totalCharacters: total,
    charactersExcludingWhitespace: nonWhitespace,
    alphabeticCharacters: alphabetic,
    numericCharacters: numeric,
    whitespaceCharacters: whitespace,
    punctuationCharacters: punctuation,
    otherCharacters: other,
  };
}

export function countWords(text: string): WordStats {
  if (!text || !text.trim()) {
    return {
      totalWords: 0,
      totalCharacters: text.length,
      averageWordLength: 0.0,
      words: [],
    };
  }

  const words = text.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const totalCharsInWords = words.reduce((sum, w) => sum + w.length, 0);
  const avg = totalWords > 0 ? Math.round((totalCharsInWords / totalWords) * 100) / 100 : 0.0;

  return {
    totalWords,
    totalCharacters: text.length,
    averageWordLength: avg,
    words,
  };
}

export function cleanToken(token: string): string {
  // Strip punctuation from beginning and end
  return token.replace(/^[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+|[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/g, '').toLowerCase();
}

export function analyzeWordFrequency(text: string): WordFrequencyResult {
  if (!text || !text.trim()) {
    return {
      frequencies: [],
      mostFrequentWords: [],
      maxFrequency: 0,
      uniqueWordCount: 0,
      totalTokens: 0,
    };
  }

  const rawTokens = text.trim().split(/\s+/).filter(Boolean);
  const cleanedTokens: string[] = [];
  for (const token of rawTokens) {
    const c = cleanToken(token);
    if (c) cleanedTokens.push(c);
  }

  if (cleanedTokens.length === 0) {
    return {
      frequencies: [],
      mostFrequentWords: [],
      maxFrequency: 0,
      uniqueWordCount: 0,
      totalTokens: 0,
    };
  }

  const counts: Record<string, number> = {};
  for (const w of cleanedTokens) {
    counts[w] = (counts[w] || 0) + 1;
  }

  const sortedItems = Object.entries(counts).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  const maxFrequency = sortedItems.length > 0 ? sortedItems[0][1] : 0;
  const mostFrequentWords = sortedItems
    .filter(([_, count]) => count === maxFrequency)
    .map(([w]) => w);

  return {
    frequencies: sortedItems.map(([word, frequency]) => ({ word, frequency })),
    mostFrequentWords,
    maxFrequency,
    uniqueWordCount: Object.keys(counts).length,
    totalTokens: cleanedTokens.length,
  };
}

export function convertCase(text: string, mode: 'upper' | 'lower' | 'title' | 'sentence'): string {
  if (!text) return '';

  if (mode === 'upper') {
    return text.toUpperCase();
  }
  if (mode === 'lower') {
    return text.toLowerCase();
  }
  if (mode === 'title') {
    return text.replace(/\b\w+/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  }
  if (mode === 'sentence') {
    const lowered = text.toLowerCase();
    return lowered.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
  }

  return text;
}

export function reverseText(text: string): string {
  return Array.from(text).reverse().join('');
}

export function detectRepeatedCharacters(
  text: string,
  options: {
    ignoreWhitespace?: boolean;
    caseSensitive?: boolean;
    ignorePunctuation?: boolean;
  } = {}
): RepeatedCharacterItem[] {
  const {
    ignoreWhitespace = true,
    caseSensitive = true,
    ignorePunctuation = false,
  } = options;

  if (!text) return [];

  const isEligible = (char: string): boolean => {
    if (ignoreWhitespace && /\s/.test(char)) return false;
    if (ignorePunctuation && PUNCTUATION_REGEX.test(char)) return false;
    return true;
  };

  const eligibleChars: string[] = [];
  const displayMapping: Record<string, string> = {};

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (isEligible(char)) {
      const key = caseSensitive ? char : char.toLowerCase();
      if (!displayMapping[key]) {
        displayMapping[key] = char;
      }
      eligibleChars.push(key);
    }
  }

  const counts: Record<string, number> = {};
  for (const key of eligibleChars) {
    counts[key] = (counts[key] || 0) + 1;
  }

  const seen = new Set<string>();
  const repeated: RepeatedCharacterItem[] = [];

  for (const key of eligibleChars) {
    if (counts[key] > 1 && !seen.has(key)) {
      seen.add(key);
      repeated.push({
        character: displayMapping[key],
        frequency: counts[key],
        normalizedKey: key,
      });
    }
  }

  return repeated;
}

export function countSentences(text: string): SentenceStats {
  if (!text || !text.trim()) {
    return {
      sentenceCount: 0,
      sentences: [],
      note: 'Input is empty or whitespace-only.',
    };
  }

  const rawSegments = text.trim().split(/[.!?]+(?:\s+|$)/).filter(Boolean);
  const sentences = rawSegments.map(s => s.trim()).filter(Boolean);

  let count = sentences.length;
  if (count === 0 && text.trim().length > 0) {
    count = 1;
    sentences.push(text.trim());
  }

  return {
    sentenceCount: count,
    sentences,
    note: 'Punctuation-based sentence count. Does not disambiguate abbreviations or decimals.',
  };
}

export function calculateJaccardSimilarity(text1: string, text2: string): JaccardSimilarityResult {
  const extractWordSet = (text: string): Set<string> => {
    const words = new Set<string>();
    const tokens = text.split(/\s+/).filter(Boolean);
    for (const token of tokens) {
      const c = cleanToken(token);
      if (c) words.add(c);
    }
    return words;
  };

  const set1 = extractWordSet(text1);
  const set2 = extractWordSet(text2);

  const intersection = new Set<string>();
  for (const w of set1) {
    if (set2.has(w)) {
      intersection.add(w);
    }
  }

  const union = new Set<string>([...set1, ...set2]);

  if (union.size === 0) {
    return {
      similarityPercentage: 0.0,
      score: 0.0,
      set1Size: 0,
      set2Size: 0,
      intersectionSize: 0,
      unionSize: 0,
      commonWords: [],
      set1OnlyWords: [],
      set2OnlyWords: [],
      message: 'Both inputs contain no valid words to compare.',
    };
  }

  const score = intersection.size / union.size;
  const percentage = Math.round(score * 10000) / 100;

  const set1Only = [...set1].filter(w => !set2.has(w)).sort();
  const set2Only = [...set2].filter(w => !set1.has(w)).sort();

  return {
    similarityPercentage: percentage,
    score: Math.round(score * 10000) / 10000,
    set1Size: set1.size,
    set2Size: set2.size,
    intersectionSize: intersection.size,
    unionSize: union.size,
    commonWords: [...intersection].sort(),
    set1OnlyWords: set1Only,
    set2OnlyWords: set2Only,
    message: `Jaccard similarity calculated successfully: ${percentage}%.`,
  };
}

export function generateReport(
  originalText: string,
  options: {
    ignoreWhitespace?: boolean;
    caseSensitive?: boolean;
    ignorePunctuation?: boolean;
  } = {}
): string {
  const charStats = countCharacters(originalText);
  const wordStats = countWords(originalText);
  const fnr = findFirstNonRepeatingChar(originalText, options);
  const wordFreq = analyzeWordFrequency(originalText);
  const repeated = detectRepeatedCharacters(originalText, options);
  const sentenceStats = countSentences(originalText);
  const reversed = reverseText(originalText);

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const divider = '='.repeat(70);
  const sectionDivider = '-'.repeat(70);

  const lines: string[] = [
    divider,
    'TEXT PROCESSING SYSTEM - COMPREHENSIVE ANALYSIS REPORT',
    'BTech Computer Science Engineering Capstone Project',
    divider,
    `Generated On       : ${timestamp}`,
    `Total Input Length : ${originalText.length} characters`,
    `Case-Sensitive Mode: ${options.caseSensitive ?? true}`,
    `Ignore Whitespace  : ${options.ignoreWhitespace ?? true}`,
    `Ignore Punctuation : ${options.ignorePunctuation ?? false}`,
    '',
    sectionDivider,
    '1. ORIGINAL INPUT TEXT',
    sectionDivider,
    originalText || '(Empty text input)',
    '',
    sectionDivider,
    '2. CHARACTER LEVEL STATISTICS',
    sectionDivider,
    `  * Total Characters (all included) : ${charStats.totalCharacters}`,
    `  * Characters Excluding Whitespace : ${charStats.charactersExcludingWhitespace}`,
    `  * Alphabetic Characters (a-z, A-Z): ${charStats.alphabeticCharacters}`,
    `  * Numeric Digits (0-9)            : ${charStats.numericCharacters}`,
    `  * Whitespace Characters           : ${charStats.whitespaceCharacters}`,
    `  * Punctuation Marks               : ${charStats.punctuationCharacters}`,
    `  * Other Characters (Symbols/Emoji): ${charStats.otherCharacters}`,
    '',
    sectionDivider,
    '3. WORD LEVEL STATISTICS',
    sectionDivider,
    `  * Total Word Count       : ${wordStats.totalWords}`,
    `  * Average Word Length    : ${wordStats.averageWordLength} characters`,
    `  * Sentence Count (approx): ${sentenceStats.sentenceCount}`,
    '',
    sectionDivider,
    '4. FIRST NON-REPEATING CHARACTER (Core Feature)',
    sectionDivider,
  ];

  if (fnr.character !== null) {
    lines.push(
      `  * Character : '${fnr.character}'`,
      `  * Position  : 1-based index ${fnr.index! + 1} (0-based index ${fnr.index})`,
      `  * Status    : ${fnr.status.toUpperCase()}`,
      `  * Note      : ${fnr.message}`
    );
  } else {
    lines.push(
      '  * Character : NONE',
      `  * Status    : ${fnr.status.toUpperCase()}`,
      `  * Note      : ${fnr.message}`
    );
  }

  lines.push(
    '',
    sectionDivider,
    '5. REPEATED CHARACTERS DETECTION',
    sectionDivider
  );

  if (repeated.length > 0) {
    for (const item of repeated) {
      let displayChar = item.character;
      if (displayChar === ' ') displayChar = '<SPACE>';
      else if (displayChar === '\t') displayChar = '<TAB>';
      else if (displayChar === '\n') displayChar = '<NEWLINE>';
      lines.push(`  * Character '${displayChar}' repeats ${item.frequency} times`);
    }
  } else {
    lines.push('  * No repeating characters found.');
  }

  lines.push(
    '',
    sectionDivider,
    '6. WORD FREQUENCY ANALYSIS',
    sectionDivider
  );

  if (wordFreq.frequencies.length > 0) {
    const topWords = wordFreq.mostFrequentWords.map(w => `'${w}'`).join(', ');
    lines.push(
      `  * Most Frequent Word(s): ${topWords} (Count: ${wordFreq.maxFrequency})`,
      `  * Unique Words Count   : ${wordFreq.uniqueWordCount}`,
      '',
      '  Token Breakdown (Sorted by Frequency Descending):',
      `  ${'Word'.padEnd(25)} | ${'Frequency'.padEnd(10)}`,
      `  ${'-'.repeat(25)}-|-{'-'.repeat(10)}`
    );
    for (const item of wordFreq.frequencies) {
      lines.push(`  ${item.word.padEnd(25)} | ${String(item.frequency).padEnd(10)}`);
    }
  } else {
    lines.push('  * No words available for frequency analysis.');
  }

  lines.push(
    '',
    sectionDivider,
    '7. REVERSED TEXT',
    sectionDivider,
    reversed || '(Empty)',
    '',
    divider,
    'END OF REPORT - TEXT PROCESSING SYSTEM',
    divider
  );

  return lines.join('\n');
}
