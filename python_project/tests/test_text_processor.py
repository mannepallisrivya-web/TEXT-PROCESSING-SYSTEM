"""Unit Test Suite for Text Processing System.

Module: tests/test_text_processor.py
Framework: Python unittest (standard library)
Coverage: All 11 core features & edge cases specified in the project requirements.
"""

import os
import sys
import unittest

# Ensure the parent directory is in sys.path so we can import text_processor and report_generator
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import text_processor
import report_generator


class TestFirstNonRepeatingChar(unittest.TestCase):
    """Test Feature 1: First Non-Repeating Character Algorithm."""

    def test_example_swiss(self):
        """Input 'swiss' -> Expected 'w'."""
        res = text_processor.find_first_non_repeating_char("swiss")
        self.assertEqual(res["character"], "w")
        self.assertEqual(res["status"], "found")
        self.assertEqual(res["index"], 1)

    def test_example_aabbcde(self):
        """Input 'aabbcde' -> Expected 'c'."""
        res = text_processor.find_first_non_repeating_char("aabbcde")
        self.assertEqual(res["character"], "c")
        self.assertEqual(res["status"], "found")
        self.assertEqual(res["index"], 4)

    def test_all_repeating_aabb(self):
        """Input 'aabb' -> Expected no unique character."""
        res = text_processor.find_first_non_repeating_char("aabb")
        self.assertIsNone(res["character"])
        self.assertEqual(res["status"], "all_repeating")

    def test_empty_string(self):
        """Input '' -> Expected no unique character / empty_input."""
        res = text_processor.find_first_non_repeating_char("")
        self.assertIsNone(res["character"])
        self.assertEqual(res["status"], "empty_input")

    def test_whitespace_ignoring(self):
        """Whitespace should be ignored by default when searching."""
        res = text_processor.find_first_non_repeating_char("a a b", ignore_whitespace=True)
        self.assertEqual(res["character"], "b")

    def test_whitespace_included_option(self):
        """When whitespace is included, single space can be the non-repeating character."""
        res = text_processor.find_first_non_repeating_char("a a b b c", ignore_whitespace=False)
        # In 'a a b b c', spaces repeat 4 times, but 'c' occurs once
        self.assertEqual(res["character"], "c")

    def test_case_sensitivity(self):
        """Case sensitive vs insensitive."""
        # Case sensitive: 'S' and 's' are distinct
        res_sens = text_processor.find_first_non_repeating_char("sS", case_sensitive=True)
        self.assertEqual(res_sens["character"], "s")

        # Case insensitive: 's' and 'S' repeat
        res_insens = text_processor.find_first_non_repeating_char("sS", case_sensitive=False)
        self.assertIsNone(res_insens["character"])


class TestCharacterAndWordCounting(unittest.TestCase):
    """Test Features 2 & 3: Character counter and Word counter."""

    def test_hello_world(self):
        """Input 'Hello World' -> Expected word count: 2, total char count: 11."""
        char_stats = text_processor.count_characters("Hello World")
        word_stats = text_processor.count_words("Hello World")

        self.assertEqual(word_stats["total_words"], 2)
        self.assertEqual(char_stats["total_characters"], 11)
        self.assertEqual(char_stats["characters_excluding_whitespace"], 10)
        self.assertEqual(char_stats["alphabetic_characters"], 10)
        self.assertEqual(char_stats["whitespace_characters"], 1)
        self.assertEqual(char_stats["numeric_characters"], 0)
        self.assertEqual(char_stats["punctuation_characters"], 0)

    def test_average_word_length(self):
        """Input 'cat frog' -> (3 + 4) / 2 = 3.5."""
        word_stats = text_processor.count_words("cat frog")
        self.assertEqual(word_stats["total_words"], 2)
        self.assertEqual(word_stats["average_word_length"], 3.5)

    def test_empty_word_counting(self):
        """Empty input handles cleanly."""
        word_stats = text_processor.count_words("")
        self.assertEqual(word_stats["total_words"], 0)
        self.assertEqual(word_stats["average_word_length"], 0.0)


class TestWordFrequency(unittest.TestCase):
    """Test Feature 4: Word frequency analysis."""

    def test_cat_dog_cat(self):
        """Input 'cat dog cat' -> cat: 2, dog: 1."""
        res = text_processor.analyze_word_frequency("cat dog cat")
        freq_map = {item["word"]: item["frequency"] for item in res["frequencies"]}
        self.assertEqual(freq_map.get("cat"), 2)
        self.assertEqual(freq_map.get("dog"), 1)
        self.assertEqual(res["most_frequent_words"], ["cat"])

    def test_punctuation_stripping(self):
        """Punctuation surrounding words should be removed."""
        res = text_processor.analyze_word_frequency("Python, python! PYTHON?")
        self.assertEqual(len(res["frequencies"]), 1)
        self.assertEqual(res["frequencies"][0]["word"], "python")
        self.assertEqual(res["frequencies"][0]["frequency"], 3)

    def test_frequency_ties(self):
        """Ties should be reported in most_frequent_words."""
        res = text_processor.analyze_word_frequency("blue red blue red")
        self.assertEqual(sorted(res["most_frequent_words"]), ["blue", "red"])
        self.assertEqual(res["max_frequency"], 2)


class TestTextReversal(unittest.TestCase):
    """Test Feature 8: Reverse text."""

    def test_reverse_python(self):
        """Input 'Python' -> Expected 'nohtyP'."""
        self.assertEqual(text_processor.reverse_text("Python"), "nohtyP")

    def test_reverse_spaces_and_punctuation(self):
        """Preserves spaces and punctuation."""
        self.assertEqual(text_processor.reverse_text("Hello, World!"), "!dlroW ,olleH")


class TestRepeatedCharacters(unittest.TestCase):
    """Test Feature 9: Repeated character detection."""

    def test_banana(self):
        """Input 'banana' -> Expected repeated: a: 3, n: 2."""
        res = text_processor.detect_repeated_characters("banana")
        char_map = {item["character"]: item["frequency"] for item in res}
        self.assertEqual(char_map.get("a"), 3)
        self.assertEqual(char_map.get("n"), 2)
        self.assertNotIn("b", char_map)
        # Verify order of appearance: 'a' appears before 'n'
        chars_order = [item["character"] for item in res]
        self.assertEqual(chars_order, ["a", "n"])


class TestSentenceCounter(unittest.TestCase):
    """Test Feature 10: Sentence counter."""

    def test_two_sentences(self):
        """Input 'Hello. How are you?' -> Expected 2."""
        res = text_processor.count_sentences("Hello. How are you?")
        self.assertEqual(res["sentence_count"], 2)

    def test_empty_sentence_count(self):
        """Empty input -> 0 sentences."""
        res = text_processor.count_sentences("   ")
        self.assertEqual(res["sentence_count"], 0)


class TestTextSimilarity(unittest.TestCase):
    """Test Feature 11: Jaccard similarity checker."""

    def test_jaccard_example(self):
        """First text: 'cat dog', Second text: 'cat bird' -> 1 / 3 = 33.33%."""
        res = text_processor.calculate_jaccard_similarity("cat dog", "cat bird")
        self.assertAlmostEqual(res["similarity_percentage"], 33.33, places=2)
        self.assertEqual(res["common_words"], ["cat"])
        self.assertEqual(res["set1_size"], 2)
        self.assertEqual(res["set2_size"], 2)
        self.assertEqual(res["union_size"], 3)

    def test_empty_similarity(self):
        """Both empty sets should return 0.0 without division by zero error."""
        res = text_processor.calculate_jaccard_similarity("", "")
        self.assertEqual(res["similarity_percentage"], 0.0)
        self.assertEqual(res["union_size"], 0)


class TestCaseConversion(unittest.TestCase):
    """Test Feature 5: Case conversions."""

    def test_case_modes(self):
        text = "hello world. this is python."
        self.assertEqual(text_processor.convert_case("test", "upper"), "TEST")
        self.assertEqual(text_processor.convert_case("TEST", "lower"), "test")
        self.assertEqual(text_processor.convert_case("hello world", "title"), "Hello World")
        self.assertEqual(
            text_processor.convert_case(text, "sentence"),
            "Hello world. This is python.",
        )


class TestFileValidation(unittest.TestCase):
    """Test Feature 6: Plain-text file validation and UTF-8 decoding."""

    def test_valid_txt(self):
        raw = b"Hello from text file!"
        res = text_processor.validate_and_decode_txt_file(raw, "sample.txt")
        self.assertTrue(res["success"])
        self.assertEqual(res["text"], "Hello from text file!")

    def test_invalid_extension(self):
        raw = b"some binary data"
        res = text_processor.validate_and_decode_txt_file(raw, "document.pdf")
        self.assertFalse(res["success"])
        self.assertIn("Invalid file format", res["error"])

    def test_empty_file(self):
        raw = b""
        res = text_processor.validate_and_decode_txt_file(raw, "empty.txt")
        self.assertFalse(res["success"])
        self.assertIn("empty", res["error"])


class TestReportGenerator(unittest.TestCase):
    """Test Feature 7: Downloadable report generator."""

    def test_report_generation(self):
        report = report_generator.generate_text_report("swiss")
        self.assertIn("TEXT PROCESSING SYSTEM - COMPREHENSIVE ANALYSIS REPORT", report)
        self.assertIn("First non-repeating character is 'w'", report)
        self.assertIn("swiss", report)


if __name__ == "__main__":
    unittest.main()
