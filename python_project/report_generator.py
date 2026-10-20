"""Text Processing System - Analysis Report Generator.

Module: report_generator.py
Author: Capstone Project Team
Language: Python 3.10+
License: MIT
Description:
    Generates a structured, clean, downloadable plain-text (.txt) analysis report
    summarizing all calculated statistics and transformations for the input text.
"""

from datetime import datetime
from typing import Any, Dict, List
import text_processor


def generate_text_report(
    original_text: str,
    ignore_whitespace: bool = True,
    case_sensitive: bool = True,
    ignore_punctuation: bool = False,
) -> str:
    """Generate a comprehensive plain-text analysis report with clear headings and calculated metrics."""
    char_stats = text_processor.count_characters(original_text)
    word_stats = text_processor.count_words(original_text)
    fnr_result = text_processor.find_first_non_repeating_char(
        original_text,
        ignore_whitespace=ignore_whitespace,
        case_sensitive=case_sensitive,
        ignore_punctuation=ignore_punctuation,
    )
    word_freq = text_processor.analyze_word_frequency(original_text)
    repeated_chars = text_processor.detect_repeated_characters(
        original_text,
        ignore_whitespace=ignore_whitespace,
        case_sensitive=case_sensitive,
        ignore_punctuation=ignore_punctuation,
    )
    sentence_stats = text_processor.count_sentences(original_text)
    reversed_str = text_processor.reverse_text(original_text)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    divider = "=" * 70
    section_divider = "-" * 70

    report_lines: List[str] = [
        divider,
        "TEXT PROCESSING SYSTEM - COMPREHENSIVE ANALYSIS REPORT",
        "BTech Computer Science Engineering Capstone Project",
        divider,
        f"Generated On       : {timestamp}",
        f"Total Input Length : {len(original_text)} characters",
        f"Case-Sensitive Mode: {case_sensitive}",
        f"Ignore Whitespace  : {ignore_whitespace}",
        f"Ignore Punctuation : {ignore_punctuation}",
        "",
        section_divider,
        "1. ORIGINAL INPUT TEXT",
        section_divider,
        original_text if original_text else "(Empty text input)",
        "",
        section_divider,
        "2. CHARACTER LEVEL STATISTICS",
        section_divider,
        f"  * Total Characters (all included) : {char_stats['total_characters']}",
        f"  * Characters Excluding Whitespace : {char_stats['characters_excluding_whitespace']}",
        f"  * Alphabetic Characters (a-z, A-Z): {char_stats['alphabetic_characters']}",
        f"  * Numeric Digits (0-9)            : {char_stats['numeric_characters']}",
        f"  * Whitespace Characters           : {char_stats['whitespace_characters']}",
        f"  * Punctuation Marks               : {char_stats['punctuation_characters']}",
        f"  * Other Characters (Symbols/Emoji): {char_stats['other_characters']}",
        "",
        section_divider,
        "3. WORD LEVEL STATISTICS",
        section_divider,
        f"  * Total Word Count       : {word_stats['total_words']}",
        f"  * Average Word Length    : {word_stats['average_word_length']} characters",
        f"  * Sentence Count (approx): {sentence_stats['sentence_count']}",
        "",
        section_divider,
        "4. FIRST NON-REPEATING CHARACTER (Core Feature)",
        section_divider,
    ]

    if fnr_result["character"] is not None:
        report_lines.extend([
            f"  * Character : '{fnr_result['character']}'",
            f"  * Position  : 1-based index {fnr_result['index'] + 1} (0-based index {fnr_result['index']})",
            f"  * Status    : {fnr_result['status'].upper()}",
            f"  * Note      : {fnr_result['message']}",
        ])
    else:
        report_lines.extend([
            "  * Character : NONE",
            f"  * Status    : {fnr_result['status'].upper()}",
            f"  * Note      : {fnr_result['message']}",
        ])

    report_lines.extend([
        "",
        section_divider,
        "5. REPEATED CHARACTERS DETECTION",
        section_divider,
    ])

    if repeated_chars:
        for item in repeated_chars:
            display_char = item["character"]
            if display_char == " ":
                display_char = "<SPACE>"
            elif display_char == "\t":
                display_char = "<TAB>"
            elif display_char == "\n":
                display_char = "<NEWLINE>"
            report_lines.append(f"  * Character '{display_char}' repeats {item['frequency']} times")
    else:
        report_lines.append("  * No repeating characters found.")

    report_lines.extend([
        "",
        section_divider,
        "6. WORD FREQUENCY ANALYSIS",
        section_divider,
    ])

    if word_freq["frequencies"]:
        top_words_str = ", ".join(f"'{w}'" for w in word_freq["most_frequent_words"])
        report_lines.append(f"  * Most Frequent Word(s): {top_words_str} (Count: {word_freq['max_frequency']})")
        report_lines.append(f"  * Unique Words Count   : {word_freq['unique_word_count']}")
        report_lines.append("")
        report_lines.append("  Token Breakdown (Sorted by Frequency Descending):")
        report_lines.append(f"  {'Word':<25} | {'Frequency':<10}")
        report_lines.append(f"  {'-'*25}-|-{'-'*10}")
        for item in word_freq["frequencies"]:
            report_lines.append(f"  {item['word']:<25} | {item['frequency']:<10}")
    else:
        report_lines.append("  * No words available for frequency analysis.")

    report_lines.extend([
        "",
        section_divider,
        "7. REVERSED TEXT",
        section_divider,
        reversed_str if reversed_str else "(Empty)",
        "",
        divider,
        "END OF REPORT - TEXT PROCESSING SYSTEM",
        divider,
    ])

    return "\n".join(report_lines)
