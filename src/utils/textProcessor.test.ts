import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findFirstNonRepeatingChar,
  countCharacters,
  countWords,
  analyzeWordFrequency,
  reverseText,
  detectRepeatedCharacters,
  countSentences,
  calculateJaccardSimilarity,
  convertCase,
  generateReport,
} from './textProcessor';

test('first non-repeating character finds w in swiss', () => {
  const result = findFirstNonRepeatingChar('swiss');
  assert.equal(result.character, 'w');
  assert.equal(result.status, 'found');
  assert.equal(result.index, 1);
});

test('first non-repeating character finds c in aabbcde', () => {
  const result = findFirstNonRepeatingChar('aabbcde');
  assert.equal(result.character, 'c');
  assert.equal(result.status, 'found');
  assert.equal(result.index, 4);
});

test('first non-repeating character handles all repeating in aabb', () => {
  const result = findFirstNonRepeatingChar('aabb');
  assert.equal(result.character, null);
  assert.equal(result.status, 'all_repeating');
});

test('first non-repeating character handles empty text', () => {
  const result = findFirstNonRepeatingChar('');
  assert.equal(result.character, null);
  assert.equal(result.status, 'empty_input');
});

test('character and word counting on Hello World', () => {
  const charStats = countCharacters('Hello World');
  const wordStats = countWords('Hello World');

  assert.equal(wordStats.totalWords, 2);
  assert.equal(charStats.totalCharacters, 11);
  assert.equal(charStats.charactersExcludingWhitespace, 10);
  assert.equal(charStats.alphabeticCharacters, 10);
  assert.equal(charStats.whitespaceCharacters, 1);
  assert.equal(charStats.numericCharacters, 0);
  assert.equal(charStats.punctuationCharacters, 0);
});

test('word frequency analysis on cat dog cat', () => {
  const result = analyzeWordFrequency('cat dog cat');
  const cat = result.frequencies.find(f => f.word === 'cat');
  const dog = result.frequencies.find(f => f.word === 'dog');

  assert.equal(cat?.frequency, 2);
  assert.equal(dog?.frequency, 1);
  assert.deepEqual(result.mostFrequentWords, ['cat']);
});

test('text reversal on Python', () => {
  assert.equal(reverseText('Python'), 'nohtyP');
  assert.equal(reverseText('Hello, World!'), '!dlroW ,olleH');
});

test('repeated characters on banana', () => {
  const repeated = detectRepeatedCharacters('banana');
  const a = repeated.find(r => r.character === 'a');
  const n = repeated.find(r => r.character === 'n');

  assert.equal(a?.frequency, 3);
  assert.equal(n?.frequency, 2);
  assert.equal(repeated.length, 2);
  assert.equal(repeated[0].character, 'a');
  assert.equal(repeated[1].character, 'n');
});

test('sentence counter on Hello. How are you?', () => {
  const result = countSentences('Hello. How are you?');
  assert.equal(result.sentenceCount, 2);
});

test('jaccard similarity between cat dog and cat bird', () => {
  const result = calculateJaccardSimilarity('cat dog', 'cat bird');
  assert.equal(result.similarityPercentage, 33.33);
  assert.deepEqual(result.commonWords, ['cat']);
});

test('case conversions', () => {
  assert.equal(convertCase('python', 'upper'), 'PYTHON');
  assert.equal(convertCase('PYTHON', 'lower'), 'python');
  assert.equal(convertCase('hello world', 'title'), 'Hello World');
  assert.equal(convertCase('hello world. this is python.', 'sentence'), 'Hello world. This is python.');
});

test('report generator produces formatted string', () => {
  const report = generateReport('swiss');
  assert.match(report, /TEXT PROCESSING SYSTEM - COMPREHENSIVE ANALYSIS REPORT/);
  assert.match(report, /First non-repeating character is 'w'/);
});
