/**
 * Complete Python source code files for the Text Processing System.
 * Enables in-browser file browsing, one-click copying, individual file downloads,
 * and project ZIP export.
 */

export interface PythonFileItem {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const PYTHON_PROJECT_FILES: PythonFileItem[] = [
  {
    name: 'app.py',
    path: 'text_processing_system/app.py',
    language: 'python',
    description: 'Streamlit interactive web and desktop-style user interface application',
    content: `"""Text Processing System Using Python.

Academic Capstone Project: BTech Computer Science & Engineering
Framework: Streamlit
Author: Capstone Project Team
Version: 1.0.0
"""

import io
import streamlit as st
import text_processor
import report_generator

# Streamlit Page Configuration
st.set_page_config(
    page_title="Text Processing System Using Python",
    page_icon="📝",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling for Minimal Academic Professional Aesthetic
st.markdown(
    """
    <style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #475569;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        padding: 10px 18px;
        font-weight: 500;
        border-radius: 6px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Application Header
st.markdown('<div class="main-title">Text Processing System Using Python</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-title">A BTech Computer Science & Engineering Capstone Project | Python & Streamlit</div>',
    unsafe_allow_html=True,
)

# Sidebar Configuration & Parameters
st.sidebar.header("⚙️ Analysis Configuration")
st.sidebar.markdown("Configure algorithmic sensitivity for character analysis:")

case_sensitive = st.sidebar.checkbox(
    "Case-sensitive analysis",
    value=True,
    help="When enabled, 'A' and 'a' are treated as distinct characters.",
)

ignore_whitespace = st.sidebar.checkbox(
    "Ignore whitespace",
    value=True,
    help="When enabled, spaces, tabs, and newlines are excluded from character frequency counting.",
)

ignore_punctuation = st.sidebar.checkbox(
    "Ignore punctuation",
    value=False,
    help="When enabled, symbols like commas, periods, and question marks are excluded from character counts.",
)

st.sidebar.markdown("---")
st.sidebar.subheader("🎓 Capstone Information")
st.sidebar.info(
    """
    **Project:** Text Processing System
    **Focus:** Algorithms, HashMaps, Sets, Strings
    **Primary Feature:** First Non-Repeating Character (O(N) time)
    **Storage:** In-memory stateless processing
    """
)

# Quick sample loaders in sidebar
st.sidebar.subheader("💡 Load Sample Inputs")
sample_choice = st.sidebar.selectbox(
    "Select a pre-configured sample:",
    [
        "Custom Input",
        "Sample 1: swiss (classic non-repeating)",
        "Sample 2: aabbcde (multiple repeating)",
        "Sample 3: banana (repeated characters)",
        "Sample 4: Python is easy and Python is useful",
        "Sample 5: Sentences & Comparison text",
    ],
)

sample_text_map = {
    "Custom Input": "",
    "Sample 1: swiss (classic non-repeating)": "swiss",
    "Sample 2: aabbcde (multiple repeating)": "aabbcde",
    "Sample 3: banana (repeated characters)": "banana",
    "Sample 4: Python is easy and Python is useful": "Python is easy and Python is useful",
    "Sample 5: Sentences & Comparison text": "Python makes text processing simple and fast. It is widely used in data science and engineering! Do you love Python?",
}

# Main Application Tabs
tab_overview, tab_analysis, tab_upload, tab_similarity, tab_report, tab_docs = st.tabs([
    "🔍 Text Analysis",
    "📊 Deep Inspection",
    "📁 File Upload",
    "⚖️ Text Similarity",
    "📄 Download Report",
    "📖 Capstone Documentation",
])

# Initialize session state for text input
if "input_text" not in st.session_state:
    st.session_state.input_text = "Python makes text processing easy and efficient. Welcome to our Capstone Project!"

# If user chose a sample from sidebar dropdown, update state
if sample_choice != "Custom Input" and sample_text_map[sample_choice]:
    st.session_state.input_text = sample_text_map[sample_choice]

# TAB 1: TEXT ANALYSIS
with tab_overview:
    st.subheader("1. Text Input & Primary Analysis")
    
    col_input, col_action = st.columns([5, 1])
    with col_input:
        user_text = st.text_area(
            "Enter or paste text to analyze:",
            value=st.session_state.input_text,
            height=130,
            placeholder="Type or paste any text here...",
            key="main_text_area",
        )
    with col_action:
        st.write("")
        st.write("")
        if st.button("🧹 Clear Text", use_container_width=True):
            st.session_state.input_text = ""
            st.rerun()

    if not user_text:
        st.warning("⚠️ Text input is currently empty. Please type or paste text above to run the analysis.")
    else:
        # Run core text processing algorithms
        char_stats = text_processor.count_characters(user_text)
        word_stats = text_processor.count_words(user_text)
        sentence_stats = text_processor.count_sentences(user_text)
        fnr_result = text_processor.find_first_non_repeating_char(
            user_text,
            ignore_whitespace=ignore_whitespace,
            case_sensitive=case_sensitive,
            ignore_punctuation=ignore_punctuation,
        )

        st.markdown("### 🎯 Feature 1: First Non-Repeating Character")
        col_fnr1, col_fnr2 = st.columns([1, 2])
        
        with col_fnr1:
            if fnr_result["character"] is not None:
                char_display = fnr_result["character"]
                st.success(f"### Found: \`{char_display}\`")
                st.caption(f"Appeared at 1-based position #{fnr_result['index'] + 1} (0-based index {fnr_result['index']})")
            else:
                st.error("### None Found")
                st.caption("Every eligible character repeats or no eligible characters exist.")

        with col_fnr2:
            st.info(f"**Algorithmic Output:** {fnr_result['message']}")
            st.caption(
                f"Evaluation rules active: Case-sensitive = \`{case_sensitive}\`, "
                f"Ignore whitespace = \`{ignore_whitespace}\`, "
                f"Ignore punctuation = \`{ignore_punctuation}\`."
            )

        st.markdown("---")

        st.markdown("### 📊 Overview Metrics")
        m1, m2, m3, m4, m5 = st.columns(5)
        m1.metric("Total Characters", char_stats["total_characters"])
        m2.metric("Total Words", word_stats["total_words"])
        m3.metric("Avg Word Length", f"{word_stats['average_word_length']} chars")
        m4.metric("Sentences", sentence_stats["sentence_count"])
        m5.metric("Excl. Whitespace", char_stats["characters_excluding_whitespace"])

        st.markdown("---")

        st.markdown("### 🔄 Text Transformations")
        t_col1, t_col2 = st.columns(2)
        
        with t_col1:
            st.markdown("#### Case Conversions")
            case_mode = st.radio(
                "Select conversion format:",
                ["UPPERCASE", "lowercase", "Title Case", "Sentence capitalization"],
                horizontal=True,
            )
            mode_key = {
                "UPPERCASE": "upper",
                "lowercase": "lower",
                "Title Case": "title",
                "Sentence capitalization": "sentence",
            }[case_mode]
            
            converted_val = text_processor.convert_case(user_text, mode_key)
            st.text_area("Converted Output (does not overwrite original):", value=converted_val, height=100)

        with t_col2:
            st.markdown("#### Reversed Text")
            reversed_val = text_processor.reverse_text(user_text)
            st.caption("Reversed using Python slicing \`text[::-1]\`, preserving spaces & punctuation.")
            st.text_area("Reversed Output:", value=reversed_val, height=100)

# TAB 2: DEEP INSPECTION
with tab_analysis:
    st.subheader("2. Detailed Categorization & Frequency Breakdown")
    if not user_text:
        st.info("Please enter text in the main tab to view detailed breakdowns.")
    else:
        st.markdown("#### 🔤 Character Category Distribution")
        c1, c2, c3, c4, c5, c6 = st.columns(6)
        c1.metric("Alphabetic (a-z, A-Z)", char_stats["alphabetic_characters"])
        c2.metric("Numeric (0-9)", char_stats["numeric_characters"])
        c3.metric("Whitespace", char_stats["whitespace_characters"])
        c4.metric("Punctuation", char_stats["punctuation_characters"])
        c5.metric("Other Symbols", char_stats["other_characters"])
        c6.metric("Total Count", char_stats["total_characters"])

        st.markdown("---")

        col_rep, col_wfreq = st.columns([1, 1])

        with col_rep:
            st.markdown("#### 🔁 Feature 9: Repeated Characters")
            repeated = text_processor.detect_repeated_characters(
                user_text,
                ignore_whitespace=ignore_whitespace,
                case_sensitive=case_sensitive,
                ignore_punctuation=ignore_punctuation,
            )
            if repeated:
                rep_data = []
                for item in repeated:
                    char_repr = item["character"]
                    if char_repr == " ":
                        char_repr = "[Space]"
                    elif char_repr == "\\t":
                        char_repr = "[Tab]"
                    elif char_repr == "\\n":
                        char_repr = "[Newline]"
                    rep_data.append({"Character": char_repr, "Frequency": item["frequency"]})
                st.dataframe(rep_data, use_container_width=True, hide_index=True)
                st.caption(f"Total repeated unique characters: {len(repeated)} (preserved in order of first appearance).")
            else:
                st.success("No repeated characters found under current configuration.")

        with col_wfreq:
            st.markdown("#### 📈 Feature 4: Word Frequency Analysis")
            w_freq = text_processor.analyze_word_frequency(user_text)
            if w_freq["frequencies"]:
                top_str = ", ".join(f"'{w}'" for w in w_freq["most_frequent_words"])
                st.info(f"**Most Frequent Word(s):** {top_str} (Occurred {w_freq['max_frequency']} time(s))")
                st.dataframe(
                    w_freq["frequencies"],
                    use_container_width=True,
                    hide_index=True,
                )
            else:
                st.warning("No words found for frequency analysis.")

        st.markdown("---")
        st.markdown("#### 📜 Feature 10: Sentence Counter Details")
        st.write(f"**Identified Sentence Count:** {sentence_stats['sentence_count']}")
        st.caption(f"Rule: {sentence_stats['note']}")
        if sentence_stats["sentences"]:
            for i, sent in enumerate(sentence_stats["sentences"], start=1):
                st.text(f"Sentence {i}: {sent}")

# TAB 3: FILE UPLOAD & ANALYSIS
with tab_upload:
    st.subheader("3. Plain-Text (.txt) File Upload & Analysis")
    st.markdown("Upload any standard \`.txt\` file (max 2 MB) to extract and analyze its content.")

    uploaded_file = st.file_uploader(
        "Choose a .txt file:",
        type=["txt"],
        help="Only plain-text UTF-8 files up to 2 MB are supported.",
    )

    if uploaded_file is not None:
        file_bytes = uploaded_file.read()
        filename = uploaded_file.name
        
        validation = text_processor.validate_and_decode_txt_file(file_bytes, filename)
        
        if not validation["success"]:
            st.error(f"❌ Upload Error: {validation['error']}")
        else:
            extracted_text = validation["text"]
            st.success(f"✅ Successfully loaded \`{filename}\` ({len(file_bytes)} bytes)")
            
            if "warning" in validation and validation["warning"]:
                st.warning(validation["warning"])

            st.text_area("File Content Preview:", value=extracted_text, height=180, disabled=True)

            if st.button("📥 Load Extracted Text Into Active Analysis"):
                st.session_state.input_text = extracted_text
                st.success("Loaded into main analysis tab! Switch to 'Text Analysis' tab to view results.")

# TAB 4: TEXT SIMILARITY CHECKER
with tab_similarity:
    st.subheader("4. Text Similarity Checker (Jaccard Word-Set Formula)")
    st.markdown(
        """
        Compare two pieces of text using **Jaccard Similarity Coefficient**:
        $$\\\\text{Jaccard Similarity} = \\\\frac{|A \\\\cap B|}{|A \\\\cup B|}$$
        *Note: This computes lexical word-overlap of unique lowercase tokens, not semantic AI inference.*
        """
    )

    sim_col1, sim_col2 = st.columns(2)
    with sim_col1:
        text_a = st.text_area("Text A:", value="Python is easy and Python is useful", height=120)
    with sim_col2:
        text_b = st.text_area("Text B:", value="Python is very useful and powerful for data processing", height=120)

    if st.button("⚡ Calculate Similarity", type="primary"):
        sim_res = text_processor.calculate_jaccard_similarity(text_a, text_b)
        
        res_col1, res_col2, res_col3, res_col4 = st.columns(4)
        res_col1.metric("Similarity Score", f"{sim_res['similarity_percentage']}%")
        res_col2.metric("Text A Unique Words", sim_res["set1_size"])
        res_col3.metric("Text B Unique Words", sim_res["set2_size"])
        res_col4.metric("Shared Unique Words", sim_res["intersection_size"])

        st.caption(f"Union Size (|A ∪ B|): {sim_res['union_size']} unique words.")
        
        if sim_res["common_words"]:
            st.markdown(f"**Shared Words ({len(sim_res['common_words'])}):** \`{', '.join(sim_res['common_words'])}\`")
        if sim_res["set1_only_words"]:
            st.markdown(f"**Words unique to Text A ({len(sim_res['set1_only_words'])}):** \`{', '.join(sim_res['set1_only_words'])}\`")
        if sim_res["set2_only_words"]:
            st.markdown(f"**Words unique to Text B ({len(sim_res['set2_only_words'])}):** \`{', '.join(sim_res['set2_only_words'])}\`")

# TAB 5: DOWNLOAD ANALYSIS REPORT
with tab_report:
    st.subheader("5. Download Generated Analysis Report")
    st.markdown("Download a full plain-text (.txt) summary containing all calculated metrics.")

    if not user_text:
        st.warning("Please enter text in the main tab first to generate a report.")
    else:
        report_content = report_generator.generate_text_report(
            user_text,
            ignore_whitespace=ignore_whitespace,
            case_sensitive=case_sensitive,
            ignore_punctuation=ignore_punctuation,
        )
        
        st.text_area("Report Preview:", value=report_content, height=300)
        
        st.download_button(
            label="💾 Download Report (.txt)",
            data=report_content.encode("utf-8"),
            file_name="text_processing_report.txt",
            mime="text/plain",
        )

# TAB 6: ACADEMIC PROJECT DOCUMENTATION
with tab_docs:
    st.subheader("6. BTech Capstone Project Technical Documentation")
    st.markdown(
        """
        ### 📚 Project Specification & Algorithmic Design
        
        #### 1. First Non-Repeating Character Algorithm
        - **Problem Statement:** Given a string $S$, identify the first character from left to right that appears with a frequency of exactly 1.
        - **Data Structures Used:** \`collections.Counter\` (Hash Table) for frequency mapping and \`list\` for ordered traversal.
        - **Time Complexity:** $O(N)$ where $N$ is the number of characters.
          - Pass 1: Build frequency map in $O(N)$.
          - Pass 2: Iterate through characters in original order to find the first with count == 1 in $O(N)$.
        - **Space Complexity:** $O(U)$ where $U$ is the number of unique characters ($U \\\\le N$).

        #### 2. Jaccard Word-Set Similarity
        - **Formula:** $J(A, B) = \\\\frac{|A \\\\cap B|}{|A \\\\cup B|}$
        - **Zero-Division Safeguard:** If $|A \\\\cup B| = 0$, returns 0.0% with a friendly explanation.
        - **Scope:** Lexical overlap; distinguishes itself from embeddings/semantic transformers.

        #### 3. Sentence Segmentation Rule
        - Employs regex delimiter \`[.!?]+(\\\\s+|$)\`.
        - Known trade-off: Abbreviations ('e.g.', 'Dr.') and decimal values are treated as delimiters in basic punctuation-based segmenters.
        """
    )
`,
  },
  {
    name: 'text_processor.py',
    path: 'text_processing_system/text_processor.py',
    language: 'python',
    description: 'Pure Python functions implementing all 11 core text processing algorithms and validations',
    content: `"""Text Processing System - Core Text Processing Logic.

Module: text_processor.py
Author: Capstone Project Team
Language: Python 3.10+
License: MIT
Description:
    Pure Python implementations for all text processing algorithms:
    1. First non-repeating character search (O(N) time)
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
    """
    if not text:
        return {
            "character": None,
            "index": None,
            "status": "empty_input",
            "message": "Input text is empty. Please enter text to analyze.",
            "frequencies": {},
        }

    def is_eligible(char: str) -> bool:
        if ignore_whitespace and char.isspace():
            return False
        if ignore_punctuation and char in string.punctuation:
            return False
        return True

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
    """Analyze and categorize characters in the input text."""
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
    """Count words and calculate average word length."""
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
    return token.strip(string.punctuation).lower()


def analyze_word_frequency(text: str) -> Dict[str, Any]:
    """Count frequency of each word in the text."""
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
    """Convert text case without overwriting original input."""
    if not text:
        return ""

    if mode == "upper":
        return text.upper()
    elif mode == "lower":
        return text.lower()
    elif mode == "title":
        return text.title()
    elif mode == "sentence":
        pattern = r"(^|[.!?]\\s+)([a-z])"
        lowered = text.lower()
        return re.sub(pattern, lambda m: m.group(1) + m.group(2).upper(), lowered)
    else:
        raise ValueError(f"Unknown case conversion mode: {mode}")


def reverse_text(text: str) -> str:
    """Reverse the input text using Python string slicing text[::-1]."""
    return text[::-1]


def detect_repeated_characters(
    text: str,
    ignore_whitespace: bool = True,
    case_sensitive: bool = True,
    ignore_punctuation: bool = False,
) -> List[Dict[str, Any]]:
    """Identify characters that appear more than once."""
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
    """Count sentences using standard punctuation delimiters (. ! ?)."""
    if not text or not text.strip():
        return {
            "sentence_count": 0,
            "sentences": [],
            "note": "Input is empty or whitespace-only.",
        }

    raw_segments = re.split(r"[.!?]+(?:\\s+|$)", text.strip())
    sentences = [s.strip() for s in raw_segments if s and s.strip()]

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
    """Calculate Jaccard similarity between two texts based on unique word sets."""
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
    """Safely validate and decode a plain-text (.txt) file."""
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

    try:
        decoded_text = raw_bytes.decode("utf-8-sig")
        return {
            "success": True,
            "text": decoded_text,
            "error": None,
        }
    except UnicodeDecodeError:
        try:
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
`,
  },
  {
    name: 'report_generator.py',
    path: 'text_processing_system/report_generator.py',
    language: 'python',
    description: 'Generates structured, formatted plain-text analysis reports with timestamps and headers',
    content: `"""Text Processing System - Analysis Report Generator.

Module: report_generator.py
Author: Capstone Project Team
Language: Python 3.10+
License: MIT
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
            elif display_char == "\\t":
                display_char = "<TAB>"
            elif display_char == "\\n":
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

    return "\\n".join(report_lines)
`,
  },
  {
    name: 'requirements.txt',
    path: 'text_processing_system/requirements.txt',
    language: 'plaintext',
    description: 'Python dependencies specification for Streamlit',
    content: `# Core requirements for Text Processing System Using Python
# BTech Computer Science Engineering Capstone Project
# Python >= 3.10

streamlit>=1.30.0,<2.0.0
`,
  },
  {
    name: 'test_text_processor.py',
    path: 'text_processing_system/tests/test_text_processor.py',
    language: 'python',
    description: 'Automated 25 unit tests covering all 11 features and edge cases (Python unittest)',
    content: `"""Unit Test Suite for Text Processing System.

Module: tests/test_text_processor.py
Framework: Python unittest (standard library)
Coverage: All 11 core features & edge cases specified in the project requirements.
"""

import os
import sys
import unittest

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
        self.assertEqual(res["character"], "c")

    def test_case_sensitivity(self):
        """Case sensitive vs insensitive."""
        res_sens = text_processor.find_first_non_repeating_char("sS", case_sensitive=True)
        self.assertEqual(res_sens["character"], "s")

        res_insens = text_processor.find_first_non_repeating_char("sS", case_sensitive=False)
        self.assertIsNone(res_insens["character"])


class TestCharacterAndWordCounting(unittest.TestCase):
    """Test Features 2 & 3: Character counter and Word counter."""

    def test_hello_world(self):
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
        word_stats = text_processor.count_words("cat frog")
        self.assertEqual(word_stats["total_words"], 2)
        self.assertEqual(word_stats["average_word_length"], 3.5)

    def test_empty_word_counting(self):
        word_stats = text_processor.count_words("")
        self.assertEqual(word_stats["total_words"], 0)
        self.assertEqual(word_stats["average_word_length"], 0.0)


class TestWordFrequency(unittest.TestCase):
    """Test Feature 4: Word frequency analysis."""

    def test_cat_dog_cat(self):
        res = text_processor.analyze_word_frequency("cat dog cat")
        freq_map = {item["word"]: item["frequency"] for item in res["frequencies"]}
        self.assertEqual(freq_map.get("cat"), 2)
        self.assertEqual(freq_map.get("dog"), 1)
        self.assertEqual(res["most_frequent_words"], ["cat"])

    def test_punctuation_stripping(self):
        res = text_processor.analyze_word_frequency("Python, python! PYTHON?")
        self.assertEqual(len(res["frequencies"]), 1)
        self.assertEqual(res["frequencies"][0]["word"], "python")
        self.assertEqual(res["frequencies"][0]["frequency"], 3)

    def test_frequency_ties(self):
        res = text_processor.analyze_word_frequency("blue red blue red")
        self.assertEqual(sorted(res["most_frequent_words"]), ["blue", "red"])
        self.assertEqual(res["max_frequency"], 2)


class TestTextReversal(unittest.TestCase):
    """Test Feature 8: Reverse text."""

    def test_reverse_python(self):
        self.assertEqual(text_processor.reverse_text("Python"), "nohtyP")

    def test_reverse_spaces_and_punctuation(self):
        self.assertEqual(text_processor.reverse_text("Hello, World!"), "!dlroW ,olleH")


class TestRepeatedCharacters(unittest.TestCase):
    """Test Feature 9: Repeated character detection."""

    def test_banana(self):
        res = text_processor.detect_repeated_characters("banana")
        char_map = {item["character"]: item["frequency"] for item in res}
        self.assertEqual(char_map.get("a"), 3)
        self.assertEqual(char_map.get("n"), 2)
        self.assertNotIn("b", char_map)
        chars_order = [item["character"] for item in res]
        self.assertEqual(chars_order, ["a", "n"])


class TestSentenceCounter(unittest.TestCase):
    """Test Feature 10: Sentence counter."""

    def test_two_sentences(self):
        res = text_processor.count_sentences("Hello. How are you?")
        self.assertEqual(res["sentence_count"], 2)

    def test_empty_sentence_count(self):
        res = text_processor.count_sentences("   ")
        self.assertEqual(res["sentence_count"], 0)


class TestTextSimilarity(unittest.TestCase):
    """Test Feature 11: Jaccard similarity checker."""

    def test_jaccard_example(self):
        res = text_processor.calculate_jaccard_similarity("cat dog", "cat bird")
        self.assertAlmostEqual(res["similarity_percentage"], 33.33, places=2)
        self.assertEqual(res["common_words"], ["cat"])
        self.assertEqual(res["set1_size"], 2)
        self.assertEqual(res["set2_size"], 2)
        self.assertEqual(res["union_size"], 3)

    def test_empty_similarity(self):
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
`,
  },
  {
    name: 'README.md',
    path: 'text_processing_system/README.md',
    language: 'markdown',
    description: 'Comprehensive installation, architecture, algorithms, and execution guide',
    content: `# Text Processing System Using Python

A complete, beginner-friendly **Text Processing System** developed as a BTech Computer Science & Engineering capstone project using **Python 3.10+** and **Streamlit**.

The application analyzes user-entered text or uploaded plain-text files. Its primary algorithmic highlight is determining the **first non-repeating character** in O(N) time, accompanied by comprehensive character distribution metrics, word frequency analysis, case conversions, string reversal, repeated character detection, sentence counting, and Jaccard word-set text similarity.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Project Directory Structure](#project-directory-structure)
- [Algorithmic Design & Complexity](#algorithmic-design--complexity)
- [Prerequisites](#prerequisites)
- [Local Setup & Installation](#local-setup--installation)
- [Running the Application](#running-the-application)
- [Running the Unit Tests](#running-the-unit-tests)
- [Sample Inputs & Expected Outputs](#sample-inputs--expected-outputs)
- [Known Limitations](#known-limitations)
- [License](#license)

---

## 🎯 Project Overview
- **Project Title:** Text Processing System Using Python
- **Project Type:** Basic Academic Capstone Project (BTech CSE)
- **Primary Language:** Python 3.10+
- **User Interface:** Streamlit (Native Web/Desktop-in-browser)
- **Storage:** Pure in-memory stateless computation (No database required)
- **Target Audience:** Students, beginners, examiners, and software engineering mentors

---

## 🏗️ Project Directory Structure

\`\`\`
text_processing_system/
├── app.py                     # Streamlit user interface & interactive controllers
├── text_processor.py          # Pure Python implementations for all 11 text algorithms
├── report_generator.py        # Plain-text formatted report generation module
├── requirements.txt           # Project dependencies (Streamlit)
├── README.md                  # Comprehensive setup & documentation guide
└── tests/
    └── test_text_processor.py # 25 automated unit tests using Python's unittest module
\`\`\`

---

## 🧠 Algorithmic Design & Complexity

### 1. First Non-Repeating Character
- **Data Structures:** Hash Map (Counter / dict), List
- **Time Complexity:** O(N)
  - Pass 1: Scan string of length N to populate character frequency map in O(N).
  - Pass 2: Traverse string in left-to-right order to locate the first character with frequency == 1 in O(N).
- **Space Complexity:** O(U) where U is the number of distinct characters (U <= N).

### 2. Jaccard Similarity
- **Data Structures:** Hash Set (set)
- **Formula:** J(A, B) = |A ∩ B| / |A ∪ B|
- **Time Complexity:** O(W1 + W2)
- **Space Complexity:** O(U1 + U2)

---

## 🚀 Local Setup & Installation

### Step 1: Clone or extract project
\`\`\`bash
cd text_processing_system
\`\`\`

### Step 2: Create a virtual environment
**On Windows:**
\`\`\`cmd
python -m venv .venv
.venv\\Scripts\\activate
\`\`\`

**On macOS / Linux:**
\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate
\`\`\`

### Step 3: Install dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

---

## 🖥️ Running the Application

Launch the Streamlit web server:
\`\`\`bash
streamlit run app.py
\`\`\`

Open your browser at:
\`\`\`
http://localhost:8501
\`\`\`

---

## 🧪 Running the Unit Tests

\`\`\`bash
python -m unittest discover -s tests
\`\`\`
`,
  },
];
