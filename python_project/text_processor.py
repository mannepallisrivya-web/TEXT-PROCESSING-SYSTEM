"""Text Processing System - Core Text Processing Logic.

Module: text_processor.py
Author: Capstone Project Team
Language: Python 3.10+
License: MIT
Description:
    Pure Python implementations for all text processing algorithms:
    1. First non-repeating character search
    2. Character category counter
    3. Word counter and average length calculation
    4. Word frequency analysis with punctuation stripping
    5. Text case conversions (Upper, Lower, Title, Sentence)
    6. String reversal
    7. Repeated character detection preserving original appearance order
    8. Rule-based sentence segmentation and counting
    9. Jaccard word-set similarity comparison
    10. UTF-8 file validation and decoding
"""

from collections import Counter
import re
import string
from typing import Any, Dict, List, Optional, Set, Tuple


def find_first_non_repeating_char(
    text: str,
    ignore_whitespace: bool = True,
    case_sensitive: bool = True,
    ignore_punctuation: bool = False,
) -> Dict[str, Any]:
    """Find the first character in the input text that occurs exactly once.

    Algorithm:
        1. Pre-filter candidate characters based on whitespace & punctuation flags.
        2. Perform First Pass: compute frequency of each candidate character
           using a dictionary / Counter.
        3. Perform Second Pass: iterate through the original sequence in left-to-right order.
           Return the first character whose computed frequency is exactly 1.

    Time Complexity: O(N) where N is the length of text.
    Space Complexity: O(U) where U is the number of unique characters (at most N).

    Returns:
        dict containing:
            - character: Optional[str]
            - index: Optional[int] (position in original text)
            - status: 'found' | 'all_repeating' | 'empty_input' | 'no_valid_characters'
            - message: human-readable explanation
            - frequencies: dict of character frequencies
    """
    if not text:
        return {
            "character": None,
            "index": None,
            "status": "empty_input",
            "message": "Input text is empty. Please enter text to analyze.",
            "frequencies": {},
        }

    # Helper function to check if a character should be considered
    def is_eligible(char: str) -> bool:
        if ignore_whitespace and char.isspace():
            return False
        if ignore_punctuation and char in string.punctuation:
            return False
        return True

    # Build sequence of eligible characters while keeping track of original indices
    eligible_items: List[Tuple[int, str]] = []
    for idx, char in enumerate(text):
        if is_eligible(char):
            key = char if case_sensitive else char.lower()
            eligible_items.append((idx, key))

    if not eligible_items:
        return {
            "character": None,
            "index": None,
            "status": "no_valid_characters",
            "message": "No eligible characters remained after filtering whitespace/punctuation.",
            "frequencies": {},
        }

    # Pass 1: Frequency map
    frequency_map: Counter[str] = Counter(key for _, key in eligible_items)

    # Pass 2: Left-to-right scan to find the first with frequency == 1
    for orig_idx, key in eligible_items:
        if frequency_map[key] == 1:
            # Preserve original casing from original text at orig_idx
            found_char = text[orig_idx]
            return {
                "character": found_char,
                "index": orig_idx,
                "status": "found",
                "message": f"First non-repeating character is '{found_char}' at position {orig_idx + 1}.",
                "frequencies": dict(frequency_map),
            }

    return {
        "character": None,
        "index": None,
        "status": "all_repeating",
        "message": "Every character repeats. No unique non-repeating character exists.",
        "frequencies": dict(frequency_map),
    }


def count_characters(text: str) -> Dict[str, Any]:
    """Analyze and categorize characters in the input text.

    Categories:
        - total: Total character count (len(text))
        - non_whitespace: Characters excluding whitespace (space, tab, newline)
        - alphabetic: Letters (a-z, A-Z and Unicode letters)
        - numeric: Digits (0-9)
        - whitespace: Spaces, newlines, tabs
        - punctuation: Standard punctuation characters (ASCII + common marks)
        - other: Any other characters (e.g. symbols, emojis)
    """
    total = len(text)
    whitespace = sum(1 for c in text if c.isspace())
    alphabetic = sum(1 for c in text if c.isalpha())
    numeric = sum(1 for c in text if c.isdigit())
    punctuation = sum(1 for c in text if c in string.punctuation)
    non_whitespace = total - whitespace
    other = total - (alphabetic + numeric + whitespace + punctuation)

    return {
        "total_characters": total,
        "characters_excluding_whitespace": non_whitespace,
        "alphabetic_characters": alphabetic,
        "numeric_characters": numeric,
        "whitespace_characters": whitespace,
        "punctuation_characters": punctuation,
        "other_characters": max(0, other),
    }


def count_words(text: str) -> Dict[str, Any]:
    """Count words and calculate average word length.

    Word tokenization uses standard whitespace splitting.
    Average word length = (sum of lengths of all words) / total words.
    Handles empty text gracefully.
    """
    if not text or not text.strip():
        return {
            "total_words": 0,
            "total_characters": len(text),
            "average_word_length": 0.0,
            "words": [],
        }

    raw_words = text.split()
    total_words = len(raw_words)
    total_word_chars = sum(len(w) for w in raw_words)
    avg_length = round(total_word_chars / total_words, 2) if total_words > 0 else 0.0

    return {
        "total_words": total_words,
        "total_characters": len(text),
        "average_word_length": avg_length,
        "words": raw_words,
    }


def clean_token(token: str) -> str:
    """Strip surrounding punctuation and lowercase a word token."""
    cleaned = token.strip(string.punctuation).lower()
    return cleaned


def analyze_word_frequency(text: str) -> Dict[str, Any]:
    """Count frequency of each word in the text.

    Requirements:
        - Convert words to lowercase.
        - Strip surrounding punctuation from tokens.
        - Handle ties in highest frequency.
        - Display sorted by frequency descending.
    """
    if not text or not text.strip():
        return {
            "frequencies": [],
            "most_frequent_words": [],
            "max_frequency": 0,
            "unique_word_count": 0,
            "total_tokens": 0,
        }

    raw_tokens = text.split()
    cleaned_tokens: List[str] = []
    for token in raw_tokens:
        c = clean_token(token)
        if c:
            cleaned_tokens.append(c)

    if not cleaned_tokens:
        return {
            "frequencies": [],
            "most_frequent_words": [],
            "max_frequency": 0,
            "unique_word_count": 0,
            "total_tokens": 0,
        }

    counter = Counter(cleaned_tokens)
    # Sort descending by frequency, then ascending alphabetically
    sorted_items = sorted(counter.items(), key=lambda item: (-item[1], item[0]))
    max_freq = sorted_items[0][1] if sorted_items else 0
    most_frequent = [word for word, count in sorted_items if count == max_freq]

    frequencies_list = [
        {"word": word, "frequency": count} for word, count in sorted_items
    ]

    return {
        "frequencies": frequencies_list,
        "most_frequent_words": most_frequent,
        "max_frequency": max_freq,
        "unique_word_count": len(counter),
        "total_tokens": len(cleaned_tokens),
    }


def convert_case(text: str, mode: str) -> str:
    """Convert text case without overwriting original input.

    Modes:
        - 'upper': UPPERCASE
        - 'lower': lowercase
        - 'title': Title Case
        - 'sentence': Sentence-style capitalization
    """
    if not text:
        return ""

    if mode == "upper":
        return text.upper()
    elif mode == "lower":
        return text.lower()
    elif mode == "title":
        return text.title()
    elif mode == "sentence":
        # Capitalize first letter of every sentence while preserving spacing & punctuation
        # Regex captures sentence starter after start of string or [.!?]+ followed by spaces
        def capitalize_sentence_match(match: re.Match) -> str:
            val = match.group(0)
            return val.upper()

        # Matches letter preceded by start of string or punctuation + spaces
        pattern = r"(^|[.!?]\s+)([a-z])"
        # First lowercase the overall text or apply smart sentence casing
        lowered = text.lower()
        result = re.sub(
            pattern,
            lambda m: m.group(1) + m.group(2).upper(),
            lowered,
        )
        return result
    else:
        raise ValueError(f"Unknown case conversion mode: {mode}")


def reverse_text(text: str) -> str:
    """Reverse the input text using Python string slicing text[::-1].

    Preserves all spaces, punctuation, linebreaks, and Unicode characters.
    """
    return text[::-1]


def detect_repeated_characters(
    text: str,
    ignore_whitespace: bool = True,
    case_sensitive: bool = True,
    ignore_punctuation: bool = False,
) -> List[Dict[str, Any]]:
    """Identify characters that appear more than once.

    Preserves the order of first appearance in the results.
    """
    if not text:
        return []

    def is_eligible(char: str) -> bool:
        if ignore_whitespace and char.isspace():
            return False
        if ignore_punctuation and char in string.punctuation:
            return False
        return True

    eligible_chars: List[str] = []
    display_mapping: Dict[str, str] = {}

    for char in text:
        if is_eligible(char):
            key = char if case_sensitive else char.lower()
            if key not in display_mapping:
                display_mapping[key] = char
            eligible_chars.append(key)

    counter = Counter(eligible_chars)

    # Preserve order of first appearance
    seen: Set[str] = set()
    repeated_list: List[Dict[str, Any]] = []

    for key in eligible_chars:
        if counter[key] > 1 and key not in seen:
            seen.add(key)
            repeated_list.append({
                "character": display_mapping[key],
                "frequency": counter[key],
                "normalized_key": key,
            })

    return repeated_list


def count_sentences(text: str) -> Dict[str, Any]:
    """Count sentences using standard punctuation delimiters (. ! ?).

    Documentation & Limitations:
        - Segments sentences based on terminal punctuation marks [.!?].
        - Ignores consecutive terminal punctuation (e.g., '...', '?!').
        - Limitations: Abbreviations (e.g. 'e.g.', 'Dr.', 'U.S.A.') and decimal
          numbers (e.g. '3.14') may be counted as sentence boundaries.
        - Does not claim natural-language syntactic segmentation.
    """
    if not text or not text.strip():
        return {
            "sentence_count": 0,
            "sentences": [],
            "note": "Input is empty or whitespace-only.",
        }

    # Split on sequence of sentence-ending punctuation followed by whitespace or end of string
    raw_segments = re.split(r"[.!?]+(?:\s+|$)", text.strip())
    # Filter out empty or whitespace-only segments
    sentences = [s.strip() for s in raw_segments if s and s.strip()]

    # If the text has no terminal punctuation but contains words, it's 1 sentence
    count = len(sentences)
    if count == 0 and text.strip():
        count = 1
        sentences = [text.strip()]

    return {
        "sentence_count": count,
        "sentences": sentences,
        "note": "Punctuation-based sentence count. Does not disambiguate abbreviations or decimals.",
    }


def calculate_jaccard_similarity(text1: str, text2: str) -> Dict[str, Any]:
    """Calculate Jaccard similarity between two texts based on unique word sets.

    Formula:
        Jaccard Similarity = |Intersection(A, B)| / |Union(A, B)|

    Requirements:
        - Normalize words to lowercase.
        - Remove surrounding punctuation.
        - Handle empty inputs safely without division by zero.
        - Word-overlap similarity only (not AI/semantic).
    """
    def extract_word_set(text: str) -> Set[str]:
        words = set()
        for token in text.split():
            cleaned = clean_token(token)
            if cleaned:
                words.add(cleaned)
        return words

    set1 = extract_word_set(text1)
    set2 = extract_word_set(text2)

    intersection = set1.intersection(set2)
    union = set1.union(set2)

    if not union:
        return {
            "similarity_percentage": 0.0,
            "score": 0.0,
            "set1_size": 0,
            "set2_size": 0,
            "intersection_size": 0,
            "union_size": 0,
            "common_words": [],
            "set1_only_words": [],
            "set2_only_words": [],
            "message": "Both inputs contain no valid words to compare.",
        }

    score = len(intersection) / len(union)
    percentage = round(score * 100, 2)

    return {
        "similarity_percentage": percentage,
        "score": round(score, 4),
        "set1_size": len(set1),
        "set2_size": len(set2),
        "intersection_size": len(intersection),
        "union_size": len(union),
        "common_words": sorted(list(intersection)),
        "set1_only_words": sorted(list(set1 - set2)),
        "set2_only_words": sorted(list(set2 - set1)),
        "message": f"Jaccard similarity calculated successfully: {percentage}%.",
    }


def validate_and_decode_txt_file(
    raw_bytes: bytes,
    filename: str,
    max_size_bytes: int = 2 * 1024 * 1024,
) -> Dict[str, Any]:
    """Safely validate and decode a plain-text (.txt) file.

    Features:
        - File extension check (.txt)
        - Max file size check (default 2 MB)
        - Safe UTF-8 decoding with BOM detection (utf-8-sig)
        - Fallback gracefully on encoding failure
    """
    if not filename.lower().endswith(".txt"):
        return {
            "success": False,
            "text": "",
            "error": f"Invalid file format: '{filename}'. Only plain-text (.txt) files are supported.",
        }

    if len(raw_bytes) > max_size_bytes:
        size_mb = round(len(raw_bytes) / (1024 * 1024), 2)
        return {
            "success": False,
            "text": "",
            "error": f"File size ({size_mb} MB) exceeds maximum allowed limit of 2 MB.",
        }

    if len(raw_bytes) == 0:
        return {
            "success": False,
            "text": "",
            "error": "The uploaded file is empty (0 bytes).",
        }

    # Attempt utf-8-sig (handles UTF-8 with or without BOM)
    try:
        decoded_text = raw_bytes.decode("utf-8-sig")
        return {
            "success": True,
            "text": decoded_text,
            "error": None,
        }
    except UnicodeDecodeError:
        try:
            # Fallback to latin-1 if non-UTF8 text file
            decoded_text = raw_bytes.decode("latin-1")
            return {
                "success": True,
                "text": decoded_text,
                "error": None,
                "warning": "File was decoded using ISO-8859-1 (Latin-1) fallback.",
            }
        except Exception as e:
            return {
                "success": False,
                "text": "",
                "error": f"Could not decode text file: {str(e)}",
            }
