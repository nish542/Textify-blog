import React, { useState } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../styles/editTextStyles.css';

// API Base URL - Change this to switch between local and production
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001/api'
  : 'https://textify-blog.onrender.com/api';

const wordCount = (value) =>
  value.split(/\s+/).filter(word => word.length !== 0).length;

export default function EditText(props) {
  useScrollToTop();
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [toLang, setToLang] = useState("hi"); // default to Hindi
  const [copied, setCopied] = useState(null); // which block was last copied

  // Language options
  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "ka", name: "Kannada"},
    { code: "bn", name: "Bengali" }
  ];

  const handleOnChange = (e) => {
    setText(e.target.value);
    setCorrectedText("");
    setTranslatedText("");
    setError(null);
  };

  const handleUpClick = () => setText(text.toUpperCase());
  const handleLoClick = () => setText(text.toLowerCase());
  const handleClear = () => {
    setText("");
    setCorrectedText("");
    setTranslatedText("");
    setError(null);
  };
  const handleSpace = () => setText(text.replace(/\s+/g, ' ').trim());

  const correctGrammar = async () => {
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      // Grammar correction runs on our backend, which calls GitHub Models
      // (gpt-4o-mini). The token stays server-side — no API key in the browser.
      const response = await fetch(`${API_BASE_URL}/correct-grammar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Grammar correction failed');
      }

      if (!data.correctedText) {
        throw new Error('Empty response from server');
      }

      setCorrectedText(data.correctedText);
    } catch (err) {
      console.error("Grammar correction error:", err);
      setError(err.message || "Grammar correction failed. Please try again.");
      setCorrectedText("");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!text || !toLang) return;
    setTranslating(true);
    setError(null);
    try {
      // Translation runs on our backend, which calls GitHub Models (gpt-4o-mini).
      const targetLanguage = languages.find(lang => lang.code === toLang)?.name || toLang;
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      if (!data.translatedText) {
        throw new Error('Empty response from server');
      }

      setTranslatedText(data.translatedText);
    } catch (err) {
      console.error("Translation error:", err);
      setError(err.message || "Translation failed. Please try again.");
      setTranslatedText("");
    } finally {
      setTranslating(false);
    }
  };

  const handleCopy = (value, key) => {
    if (!value) return;
    navigator.clipboard.writeText(value)
      .then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
      })
      .catch(() => setError("Failed to copy to clipboard."));
  };

  // Copy-to-clipboard button shown in each result card header.
  const CopyButton = ({ value, copyKey }) => (
    <button
      className={`copy-btn${copied === copyKey ? ' copied' : ''}`}
      onClick={() => handleCopy(value, copyKey)}
      title="Copy to clipboard"
    >
      <i className={`fas ${copied === copyKey ? 'fa-check' : 'fa-copy'}`}></i>
      {copied === copyKey ? 'Copied' : 'Copy'}
    </button>
  );

  return (
    <div className={`edit-page${props.mode === 'dark' ? ' dark' : ''}`}>
      <header className="edit-page__header">
        <h1 className="edit-page__title">{props.title}</h1>
        <p className="edit-page__subtitle">Transform your text with our powerful tools</p>
      </header>

      <textarea
        className="edit-input"
        rows="5"
        value={text}
        onChange={handleOnChange}
        placeholder="Enter your text here..."
      />

      {/* Action Buttons */}
      <div className="toolbar">
        <button className="tool-btn" disabled={!text} onClick={handleUpClick}>
          <i className="fas fa-arrow-up"></i> Uppercase
        </button>
        <button className="tool-btn" disabled={!text} onClick={handleLoClick}>
          <i className="fas fa-arrow-down"></i> Lowercase
        </button>
        <button className="tool-btn" disabled={!text} onClick={handleSpace}>
          <i className="fas fa-compress-alt"></i> Remove Spaces
        </button>
        <button className="tool-btn tool-btn--danger" disabled={!text} onClick={handleClear}>
          <i className="fas fa-trash"></i> Clear
        </button>
        <button className="tool-btn tool-btn--accent" disabled={!text || loading} onClick={correctGrammar}>
          <i className={`fas fa-spell-check ${loading ? 'fa-spin' : ''}`}></i>
          {loading ? "Correcting..." : "Correct Grammar"}
        </button>
      </div>

      {/* Translation Bar */}
      <div className="translate-bar">
        <span className="translate-bar__label">Translate to</span>
        <select
          className="lang-select"
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
        <button className="tool-btn tool-btn--teal" disabled={!text || translating} onClick={handleTranslate}>
          <i className={`fas fa-language ${translating ? 'fa-spin' : ''}`}></i>
          {translating ? "Translating..." : "Translate"}
        </button>
      </div>

      {/* Results */}
      <div className="results">
        {/* Original Text */}
        <div className="result-card result-card--original">
          <div className="result-card__header">
            <h4 className="result-card__title">
              <i className="fas fa-file-alt"></i> Original Text
            </h4>
            {text && <CopyButton value={text} copyKey="original" />}
          </div>
          <div className="result-card__body">
            <p className={`result-card__text${text ? '' : ' result-card__text--empty'}`}>
              {text.length > 0 ? text : "Nothing to preview"}
            </p>
            <div className="result-card__meta">
              <span><i className="fas fa-font"></i>{wordCount(text)} words</span>
              <span><i className="fas fa-text-width"></i>{text.length} characters</span>
            </div>
          </div>
        </div>

        {/* Translation */}
        {translatedText && (
          <div className="result-card result-card--translation">
            <div className="result-card__header">
              <h4 className="result-card__title">
                <i className="fas fa-language"></i>
                Translation ({languages.find(lang => lang.code === toLang)?.name})
              </h4>
              <CopyButton value={translatedText} copyKey="translation" />
            </div>
            <div className="result-card__body">
              <p className="result-card__text">{translatedText}</p>
              <div className="result-card__meta">
                <span><i className="fas fa-font"></i>{wordCount(translatedText)} words</span>
                <span><i className="fas fa-text-width"></i>{translatedText.length} characters</span>
              </div>
            </div>
          </div>
        )}

        {/* Grammar Correction */}
        {correctedText && (
          <div className="result-card result-card--grammar results__full">
            <div className="result-card__header">
              <h4 className="result-card__title">
                <i className="fas fa-spell-check"></i> Grammar Correction
              </h4>
              <CopyButton value={correctedText} copyKey="corrected" />
            </div>
            <div className="result-card__body">
              <div className="correction-grid">
                <div>
                  <div className="correction-label">
                    <i className="fas fa-file-alt"></i> Original
                  </div>
                  <p className="result-card__text">{text}</p>
                </div>
                <div>
                  <div className="correction-label">
                    <i className="fas fa-check-circle"></i> Corrected
                  </div>
                  <div className="correction-box">{correctedText}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="edit-error" role="alert">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
    </div>
  );
}
