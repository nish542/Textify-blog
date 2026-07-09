import React, { useState } from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import * as S from '../styles/editTextStyles';

// API Base URL - Change this to switch between local and production
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5001/api'
  : 'https://textify-blog.onrender.com/api';

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

  // Small helper so every button shares one shape; only the variant, class,
  // disabled/onClick, and label differ.
  const ActionButton = ({ variant, className, disabled, onClick, children }) => (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      style={S.buttonStyle(variant)}
      onMouseOver={S.onButtonHover(variant)}
      onMouseOut={S.onButtonOut(variant)}
    >
      <div style={S.shimmer} onMouseOver={S.onShimmerOver} />
      {children}
    </button>
  );

  // Copy-to-clipboard button shown in each result card header.
  const CopyButton = ({ value, copyKey }) => (
    <button
      className="btn btn-sm"
      style={S.copyButton}
      onClick={() => handleCopy(value, copyKey)}
      onMouseOver={S.onCopyHover}
      onMouseOut={S.onCopyOut}
      title="Copy to clipboard"
    >
      <i className={`fas ${copied === copyKey ? 'fa-check' : 'fa-copy'} me-1`}></i>
      {copied === copyKey ? 'Copied' : 'Copy'}
    </button>
  );

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h3 className="display-5 fw-bold enhanced-heading">{props.title}</h3>
        <p className="text-center" style={S.description(props.mode)}>
          Transform your text with our powerful tools
        </p>
      </div>

      <div className="mb-4">
        <textarea
          className="form-control my-2"
          rows="4"
          value={text}
          onChange={handleOnChange}
          placeholder="Enter your text here..."
          style={S.textarea(props.mode, text)}
          onFocus={S.onTextareaFocus}
          onBlur={S.onTextareaBlur}
        />
        <style>{S.pulseKeyframes}</style>
      </div>

      {/* Action Buttons */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <ActionButton variant="uppercase" className="btn btn-primary enhanced-btn" disabled={!text} onClick={handleUpClick}>
            <i className="fas fa-arrow-up me-1"></i> Uppercase
          </ActionButton>
          <ActionButton variant="lowercase" className="btn btn-primary enhanced-btn" disabled={!text} onClick={handleLoClick}>
            <i className="fas fa-arrow-down me-1"></i> Lowercase
          </ActionButton>
          <ActionButton variant="removeSpaces" className="btn btn-secondary enhanced-btn" disabled={!text} onClick={handleSpace}>
            <i className="fas fa-compress-alt me-1"></i> Remove Spaces
          </ActionButton>
          <ActionButton variant="clear" className="btn btn-secondary enhanced-btn" disabled={!text} onClick={handleClear}>
            <i className="fas fa-trash me-1"></i> Clear
          </ActionButton>
          <ActionButton variant="grammar" className="btn btn-success enhanced-btn" disabled={!text || loading} onClick={correctGrammar}>
            <i className={`fas fa-spell-check me-1 ${loading ? 'fa-spin' : ''}`}></i>
            {loading ? "Correcting..." : "Correct Grammar"}
          </ActionButton>
        </div>
      </div>

      {/* Translation Dropdown */}
      <div className="mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold">Select language to translate:</label>
            <select
              className="form-select"
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              style={S.languageSelect(props.mode)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6 text-md-end">
            <ActionButton
              variant="translate"
              className="btn btn-info w-100 w-md-auto enhanced-btn"
              disabled={!text || translating}
              onClick={handleTranslate}
            >
              <i className={`fas fa-language me-1 ${translating ? 'fa-spin' : ''}`}></i>
              {translating ? "Translating..." : "Translate"}
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="row g-4">
        {/* Original Text Section */}
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-lg border-0" style={S.resultCard}>
            <div className="card-header text-white py-3 d-flex justify-content-between align-items-center" style={S.cardHeader('original')}>
              <h4 className="mb-0">
                <i className="fas fa-file-alt me-2"></i>
                Original Text
              </h4>
              {text && <CopyButton value={text} copyKey="original" />}
            </div>
            <div className="card-body">
              <p className="card-text" style={S.cardText}>
                {text.length > 0 ? text : "Nothing to preview"}
              </p>
              <div className="text-muted mt-3">
                <small>
                  <i className="fas fa-font me-1"></i>
                  {text.split(/\s+/).filter(word => word.length !== 0).length} words
                </small>
                <small className="ms-3">
                  <i className="fas fa-text-width me-1"></i>
                  {text.length} characters
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Translation Section */}
        <div className="col-12 col-md-6">
          {translatedText && (
            <div className="card h-100 shadow-lg border-0" style={S.resultCard}>
              <div className="card-header text-white py-3 d-flex justify-content-between align-items-center" style={S.cardHeader('translation')}>
                <h4 className="mb-0">
                  <i className="fas fa-language me-2"></i>
                  Translation ({languages.find(lang => lang.code === toLang)?.name})
                </h4>
                <CopyButton value={translatedText} copyKey="translation" />
              </div>
              <div className="card-body">
                <p className="card-text" style={S.cardText}>{translatedText}</p>
                <div className="text-muted mt-3">
                  <small>
                    <i className="fas fa-font me-1"></i>
                    {translatedText.split(/\s+/).filter(word => word.length !== 0).length} words
                  </small>
                  <small className="ms-3">
                    <i className="fas fa-text-width me-1"></i>
                    {translatedText.length} characters
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grammar Correction Section */}
        {correctedText && (
          <div className="col-12 mt-4">
            <div className="card shadow-lg border-0" style={S.resultCard}>
              <div className="card-header text-white py-3 d-flex justify-content-between align-items-center" style={S.cardHeader('grammar')}>
                <h4 className="mb-0">
                  <i className="fas fa-spell-check me-2"></i>
                  Grammar Correction
                </h4>
                <CopyButton value={correctedText} copyKey="corrected" />
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <h5 className="text-muted mb-3">
                      <i className="fas fa-file-alt me-2"></i>
                      Original Text
                    </h5>
                    <p className="card-text" style={S.cardText}>{text}</p>
                  </div>
                  <div className="col-12 col-md-6">
                    <h5 className="text-muted mb-3">
                      <i className="fas fa-check-circle me-2"></i>
                      Corrected Text
                    </h5>
                    <p className="card-text" style={S.correctedText(props.mode)}>{correctedText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-danger mt-4 shadow-sm" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}
    </div>
  );
}
