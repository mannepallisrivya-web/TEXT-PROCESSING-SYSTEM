"""Text Processing System Using Python.

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

# ==============================================================================
# TAB 1: TEXT ANALYSIS (Core Features: First Non-Repeating, Counter, Words, Reverse)
# ==============================================================================
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

        # Highlight Feature 1: First Non-Repeating Character
        st.markdown("### 🎯 Feature 1: First Non-Repeating Character")
        col_fnr1, col_fnr2 = st.columns([1, 2])
        
        with col_fnr1:
            if fnr_result["character"] is not None:
                char_display = fnr_result["character"]
                st.success(f"### Found: `{char_display}`")
                st.caption(f"Appeared at 1-based position #{fnr_result['index'] + 1} (0-based index {fnr_result['index']})")
            else:
                st.error("### None Found")
                st.caption("Every eligible character repeats or no eligible characters exist.")

        with col_fnr2:
            st.info(f"**Algorithmic Output:** {fnr_result['message']}")
            st.caption(
                f"Evaluation rules active: Case-sensitive = `{case_sensitive}`, "
                f"Ignore whitespace = `{ignore_whitespace}`, "
                f"Ignore punctuation = `{ignore_punctuation}`."
            )

        st.markdown("---")

        # Feature 2 & 3: High-Level Character and Word Metrics
        st.markdown("### 📊 Overview Metrics")
        m1, m2, m3, m4, m5 = st.columns(5)
        m1.metric("Total Characters", char_stats["total_characters"])
        m2.metric("Total Words", word_stats["total_words"])
        m3.metric("Avg Word Length", f"{word_stats['average_word_length']} chars")
        m4.metric("Sentences", sentence_stats["sentence_count"])
        m5.metric("Excl. Whitespace", char_stats["characters_excluding_whitespace"])

        st.markdown("---")

        # Feature 5: Text Case Conversion & Feature 8: Reversed Text
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
            st.caption("Reversed using Python slicing `text[::-1]`, preserving spaces & punctuation.")
            st.text_area("Reversed Output:", value=reversed_val, height=100)

# ==============================================================================
# TAB 2: DEEP INSPECTION (Character Breakdown, Word Frequencies, Repeated Chars)
# ==============================================================================
with tab_analysis:
    st.subheader("2. Detailed Categorization & Frequency Breakdown")
    if not user_text:
        st.info("Please enter text in the main tab to view detailed breakdowns.")
    else:
        # Character Breakdown Table
        st.markdown("#### 🔤 Character Category Distribution")
        c1, c2, c3, c4, c5, c6 = st.columns(6)
        c1.metric("Alphabetic (a-z, A-Z)", char_stats["alphabetic_characters"])
        c2.metric("Numeric (0-9)", char_stats["numeric_characters"])
        c3.metric("Whitespace", char_stats["whitespace_characters"])
        c4.metric("Punctuation", char_stats["punctuation_characters"])
        c5.metric("Other Symbols", char_stats["other_characters"])
        c6.metric("Total Count", char_stats["total_characters"])

        st.markdown("---")

        # Repeated Characters & Word Frequency
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
                    elif char_repr == "\t":
                        char_repr = "[Tab]"
                    elif char_repr == "\n":
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

        # Sentence Breakdown
        st.markdown("---")
        st.markdown("#### 📜 Feature 10: Sentence Counter Details")
        st.write(f"**Identified Sentence Count:** {sentence_stats['sentence_count']}")
        st.caption(f"Rule: {sentence_stats['note']}")
        if sentence_stats["sentences"]:
            for i, sent in enumerate(sentence_stats["sentences"], start=1):
                st.text(f"Sentence {i}: {sent}")

# ==============================================================================
# TAB 3: FILE UPLOAD & ANALYSIS (Feature 6)
# ==============================================================================
with tab_upload:
    st.subheader("3. Plain-Text (.txt) File Upload & Analysis")
    st.markdown("Upload any standard `.txt` file (max 2 MB) to extract and analyze its content.")

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
            st.success(f"✅ Successfully loaded `{filename}` ({len(file_bytes)} bytes)")
            
            if "warning" in validation and validation["warning"]:
                st.warning(validation["warning"])

            st.text_area("File Content Preview:", value=extracted_text, height=180, disabled=True)

            if st.button("📥 Load Extracted Text Into Active Analysis"):
                st.session_state.input_text = extracted_text
                st.success("Loaded into main analysis tab! Switch to 'Text Analysis' tab to view results.")

# ==============================================================================
# TAB 4: TEXT SIMILARITY CHECKER (Feature 11)
# ==============================================================================
with tab_similarity:
    st.subheader("4. Text Similarity Checker (Jaccard Word-Set Formula)")
    st.markdown(
        """
        Compare two pieces of text using **Jaccard Similarity Coefficient**:
        $$\\text{Jaccard Similarity} = \\frac{|A \\cap B|}{|A \\cup B|}$$
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
            st.markdown(f"**Shared Words ({len(sim_res['common_words'])}):** `{', '.join(sim_res['common_words'])}`")
        if sim_res["set1_only_words"]:
            st.markdown(f"**Words unique to Text A ({len(sim_res['set1_only_words'])}):** `{', '.join(sim_res['set1_only_words'])}`")
        if sim_res["set2_only_words"]:
            st.markdown(f"**Words unique to Text B ({len(sim_res['set2_only_words'])}):** `{', '.join(sim_res['set2_only_words'])}`")

# ==============================================================================
# TAB 5: DOWNLOAD ANALYSIS REPORT (Feature 7)
# ==============================================================================
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

# ==============================================================================
# TAB 6: ACADEMIC PROJECT DOCUMENTATION & ALGORITHMS (BTech Capstone)
# ==============================================================================
with tab_docs:
    st.subheader("6. BTech Capstone Project Technical Documentation")
    st.markdown(
        """
        ### 📚 Project Specification & Algorithmic Design
        
        #### 1. First Non-Repeating Character Algorithm
        - **Problem Statement:** Given a string $S$, identify the first character from left to right that appears with a frequency of exactly 1.
        - **Data Structures Used:** `collections.Counter` (Hash Table) for frequency mapping and `list` for ordered traversal.
        - **Time Complexity:** $O(N)$ where $N$ is the number of characters.
          - Pass 1: Build frequency map in $O(N)$.
          - Pass 2: Iterate through characters in original order to find the first with count == 1 in $O(N)$.
        - **Space Complexity:** $O(U)$ where $U$ is the number of unique characters ($U \\le N$).

        #### 2. Jaccard Word-Set Similarity
        - **Formula:** $J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}$
        - **Zero-Division Safeguard:** If $|A \\cup B| = 0$, returns 0.0% with a friendly explanation.
        - **Scope:** Lexical overlap; distinguishes itself from embeddings/semantic transformers.

        #### 3. Sentence Segmentation Rule
        - Employs regex delimiter `[.!?]+(\\s+|$)`.
        - Known trade-off: Abbreviations ('e.g.', 'Dr.') and decimal values are treated as delimiters in basic punctuation-based segmenters.
        """
    )
