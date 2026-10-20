# Text Processing System Using Python

A complete, beginner-friendly **Text Processing System** developed as a BTech Computer Science & Engineering capstone project using **Python 3.10+** and **Streamlit**.

The application analyzes user-entered text or uploaded plain-text files. Its primary algorithmic highlight is determining the **first non-repeating character** in $O(N)$ time, accompanied by comprehensive character distribution metrics, word frequency analysis, case conversions, string reversal, repeated character detection, sentence counting, and Jaccard word-set text similarity.

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

## ✨ Key Features

1. **First Non-Repeating Character (Core Feature):**
   - Efficient two-pass hash map algorithm ($O(N)$ time complexity).
   - Preserves original left-to-right character order.
   - Configurable options: Case sensitivity, ignore whitespace, ignore punctuation.
   - Distinct feedback when every character repeats.

2. **Character Counter:**
   - Total characters (including spaces and punctuation).
   - Characters excluding whitespace.
   - Alphabetic characters (a-z, A-Z).
   - Numeric digits (0-9).
   - Whitespace characters (spaces, tabs, newlines).
   - Punctuation characters.
   - Other Unicode symbols/emojis.

3. **Word Counter:**
   - Total word count based on whitespace tokenization.
   - Total characters.
   - Average word length ($L_{avg} = \frac{\sum |w_i|}{N_{words}}$), rounded to 2 decimal places.

4. **Word Frequency Analysis:**
   - Strips surrounding punctuation from tokens.
   - Normalizes to lowercase.
   - Displays full token frequency table sorted by occurrence descending.
   - Accurately detects and displays top words and ties.

5. **Text Case Conversion:**
   - UPPERCASE (`str.upper()`)
   - lowercase (`str.lower()`)
   - Title Case (`str.title()`)
   - Sentence-style capitalization (capitalizes sentence starters while preserving spacing and structure).
   - Output displayed without overwriting original input.

6. **Plain-Text File Upload & Validation:**
   - Supports `.txt` files up to 2 MB.
   - Safe UTF-8 decoding with automatic Byte Order Mark (BOM) handling (`utf-8-sig`).
   - Graceful fallback to Latin-1 encoding with informative user notice.
   - Strict extension and file size validation.

7. **Downloadable Analysis Report:**
   - Generates a structured `.txt` report containing real dynamically computed results.
   - Headings, timestamps, original text, and all 11 metrics formatted cleanly.

8. **Text Reversal:**
   - Fast Python string slicing (`text[::-1]`), preserving whitespace and punctuation.

9. **Repeated Character Detection:**
   - Identifies characters appearing $> 1$ time.
   - Preserves order of first appearance.
   - Respects case sensitivity and whitespace toggles.

10. **Sentence Counter:**
    - Documented delimiter rule using `[.!?]`.
    - Handles consecutive punctuation (`...`, `?!`).
    - Explains real-world edge cases (abbreviations, decimal numbers).

11. **Text Similarity Checker:**
    - Jaccard Similarity Coefficient based on unique lowercase word sets:
      $$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
    - Displays similarity percentage, unique words in Text A, unique words in Text B, and shared intersection set.
    - Protected against division-by-zero when both inputs are empty.

---

## 🏗️ Project Directory Structure

```
text_processing_system/
├── app.py                     # Streamlit user interface & interactive controllers
├── text_processor.py          # Pure Python implementations for all 11 text algorithms
├── report_generator.py        # Plain-text formatted report generation module
├── requirements.txt           # Project dependencies (Streamlit)
├── README.md                  # Comprehensive setup & documentation guide
└── tests/
    └── test_text_processor.py # 25 automated unit tests using Python's unittest module
```

---

## 🧠 Algorithmic Design & Complexity

### 1. First Non-Repeating Character
- **Data Structures:** Hash Map (`collections.Counter` / `dict`), Array / List (`list`)
- **Time Complexity:** $O(N)$
  - *Pass 1:* Scan string of length $N$ to populate character frequency map in $O(N)$.
  - *Pass 2:* Traverse string in left-to-right order to locate the first character with frequency $== 1$ in $O(N)$.
- **Space Complexity:** $O(U)$ where $U$ is the number of distinct characters ($U \le N$, at most 256 for standard ASCII or bounded for Unicode).

### 2. Jaccard Similarity
- **Data Structures:** Hash Set (`set`)
- **Time Complexity:** $O(W_1 + W_2)$ where $W_1$ and $W_2$ are token counts of the two texts.
- **Space Complexity:** $O(U_1 + U_2)$ for the unique word sets.
- **Edge Case Protection:** When $U_1 \cup U_2 = \emptyset$, returns 0.0% instead of `ZeroDivisionError`.

---

## 💻 Prerequisites

- **Python:** Version 3.10, 3.11, or 3.12
- **Editor:** Visual Studio Code, PyCharm, or any text editor
- **Terminal:** Command Prompt / PowerShell (Windows), Terminal (macOS / Linux)

---

## 🚀 Local Setup & Installation

### Step 1: Open a terminal in the project directory
```bash
cd text_processing_system
```

### Step 2: Create a Python virtual environment
**On Windows:**
```cmd
python -m venv .venv
.venv\Scripts\activate
```

**On macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install required dependencies
```bash
pip install -r requirements.txt
```

---

## 🖥️ Running the Application

Launch the Streamlit web server:
```bash
streamlit run app.py
```

Streamlit will automatically launch your default web browser at:
```
http://localhost:8501
```

If it does not open automatically, copy the URL displayed in your terminal into Chrome, Firefox, Edge, or Safari.

---

## 🧪 Running the Unit Tests

Execute the automated test suite using Python's built-in `unittest` runner:
```bash
python -m unittest discover -s tests
```

Expected output:
```text
.........................
----------------------------------------------------------------------
Ran 25 tests in 0.011s

OK
```

All 25 tests run cleanly in milliseconds with no external testing dependencies needed.

---

## 📊 Sample Inputs & Expected Outputs

| Feature | Input | Expected Output |
| :--- | :--- | :--- |
| **First Non-Repeating** | `swiss` | `'w'` (Position 2) |
| **First Non-Repeating** | `aabbcde` | `'c'` (Position 5) |
| **First Non-Repeating** | `aabb` | No unique character |
| **Character Count** | `Hello World` | Total: 11, Excl. Whitespace: 10, Letters: 10 |
| **Word Count** | `Python makes text processing easy` | Total words: 5, Total chars: 34, Avg length: 5.8 |
| **Word Frequency** | `cat dog cat` | `cat`: 2, `dog`: 1 |
| **Text Reversal** | `Python` | `nohtyP` |
| **Repeated Chars** | `banana` | `a`: 3, `n`: 2 |
| **Sentence Count** | `Hello. How are you?` | 2 sentences |
| **Text Similarity** | Text 1: `cat dog`<br>Text 2: `cat bird` | 33.33% (1 shared word: 'cat', union of 3 words) |

---

## ⚠️ Known Limitations

1. **Sentence Counter:** Employs terminal punctuation (`.`, `!`, `?`). Abbreviations such as `Dr.` or `e.g.` and decimal values such as `3.14` are parsed as boundary marks in basic regex segmenters.
2. **Text Similarity:** Based on lexical Jaccard word sets, which measures exact token overlap. Synonyms (e.g. `car` vs `automobile`) are treated as different words since this project does not use heavy NLP neural networks or external APIs.
3. **File Types:** Restricted to plain-text `.txt` files up to 2 MB. Binary documents such as `.docx` or `.pdf` are purposefully omitted to keep the project lightweight and standard-library focused.

---

## 📜 License
MIT License - Created for educational and academic capstone demonstration purposes.
