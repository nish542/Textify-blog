import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useScrollToTop } from '../hooks/useScrollToTop';

export default function TextSpace(props) {
  useScrollToTop();
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [toLang, setToLang] = useState("hi"); // default to Hindi

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyC4sl5KpgV5nOfhz8ml6INI1yTPf8C8nZg';
  const genAI = new GoogleGenerativeAI(API_KEY);

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
      console.log('Initializing Gemini API...');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      
      const prompt = `You are a grammar correction expert. Please correct any grammatical errors in the following text. Return ONLY the corrected text without any explanations or additional text:

"${text}"`;

      console.log('Sending request to Gemini API...');
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }]}],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });
      
      console.log('Received response from Gemini API:', result);
      const response = await result.response;
      console.log('Response text:', response.text());
      
      const correction = response.text().trim();
      if (!correction) {
        throw new Error('Empty response from API');
      }
      
      console.log('Setting corrected text:', correction);
      setCorrectedText(correction);
      console.log('Grammar correction successful');
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
      console.log('Initializing Gemini API for translation...');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      
      const prompt = `You are a professional translator. Translate the following text to ${languages.find(lang => lang.code === toLang)?.name || toLang}. Return ONLY the translated text without any explanations or additional text:

"${text}"`;

      console.log('Sending translation request to Gemini API...');
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }]}],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });
      
      console.log('Received translation response:', result);
      const response = await result.response;
      console.log('Translation text:', response.text());
      
      const translation = response.text().trim();
      if (!translation) {
        throw new Error('Empty response from API');
      }
      
      setTranslatedText(translation);
      console.log('Translation successful');
    } catch (err) {
      console.error("Translation error:", err);
      setError(err.message || "Translation failed. Please try again.");
      setTranslatedText("");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h3 className="display-5 fw-bold text-primary">{props.title}</h3>
        <p className="text-center" style={{
          color: props.mode === 'dark' ? '#f5e6d3' : '#6c757d',
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
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
          style={{ 
            backgroundColor: props.mode === 'dark' ? 'rgb(204, 204, 236)' : 'rgba(255, 255, 255, 0.7)',
            border: '2px solid rgba(233, 236, 239, 0.5)',
            borderRadius: '10px',
            transition: 'all 0.3s ease',
            color: props.mode === 'dark' ? 'white' : 'black',
            backdropFilter: 'blur(5px)',
            transform: 'scale(1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            animation: text ? 'pulse 0.5s ease-in-out' : 'none'
          }}
          onFocus={e => {
            e.currentTarget.style.transform = 'scale(1.01)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = 'rgba(13, 110, 253, 0.5)';
          }}
          onBlur={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            e.currentTarget.style.borderColor = 'rgba(233, 236, 239, 0.5)';
          }}
        />
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.01); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </div>

      {/* Action Buttons */}
      <div className="mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <button 
            className="btn btn-primary" 
            disabled={!text} 
            onClick={handleUpClick}
            style={{ 
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}
            onMouseOver={e => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <i className="fas fa-arrow-up me-1"></i> Uppercase
          </button>
          <button 
            className="btn btn-primary" 
            disabled={!text} 
            onClick={handleLoClick}
            style={{ 
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <i className="fas fa-arrow-down me-1"></i> Lowercase
          </button>
          <button 
            className="btn btn-secondary" 
            disabled={!text} 
            onClick={handleSpace}
            style={{ 
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <i className="fas fa-compress-alt me-1"></i> Remove Spaces
          </button>
          <button 
            className="btn btn-secondary" 
            disabled={!text} 
            onClick={handleClear}
            style={{ 
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <i className="fas fa-trash me-1"></i> Clear
          </button>
          <button 
            className="btn btn-success" 
            disabled={!text || loading} 
            onClick={correctGrammar}
            style={{ 
              transition: 'all 0.3s ease',
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <i className="fas fa-spell-check me-1"></i>
            {loading ? "Correcting..." : "Correct Grammar"}
          </button>
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
              style={{ 
                backgroundColor: props.mode === 'dark' ? 'rgb(204, 204, 236)' : 'rgba(255, 255, 255, 0.7)',
                border: '2px solid rgba(233, 236, 239, 0.5)',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                color: props.mode === 'dark' ? '#4e4e59' : 'black',
                backdropFilter: 'blur(5px)'
              }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6 text-md-end">
            <button 
              className="btn btn-info w-100 w-md-auto" 
              disabled={!text || translating} 
              onClick={handleTranslate}
              style={{ 
                transition: 'all 0.3s ease',
                minWidth: '150px'
              }}
            >
              <i className="fas fa-language me-1"></i>
              {translating ? "Translating..." : "Translate"}
            </button>
          </div>
        </div>
      </div>

      {/* Results Container */}
      <div className="row g-4">
        {/* Original Text Section */}
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow-lg border-0">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0">
                <i className="fas fa-file-alt me-2"></i>
                Original Text
              </h4>
            </div>
            <div className="card-body">
              <p className="card-text" style={{ minHeight: '100px' }}>
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
            <div className="card h-100 shadow-lg border-0">
              <div className="card-header bg-info text-white py-3">
                <h4 className="mb-0">
                  <i className="fas fa-language me-2"></i>
                  Translation ({languages.find(lang => lang.code === toLang)?.name})
                </h4>
              </div>
              <div className="card-body">
                <p className="card-text" style={{ minHeight: '100px' }}>{translatedText}</p>
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
            <div className="card shadow-lg border-0">
              <div className="card-header bg-success text-white py-3">
                <h4 className="mb-0">
                  <i className="fas fa-spell-check me-2"></i>
                  Grammar Correction
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <h5 className="text-muted mb-3">
                      <i className="fas fa-file-alt me-2"></i>
                      Original Text
                    </h5>
                    <p className="card-text" style={{ minHeight: '100px' }}>{text}</p>
                  </div>
                  <div className="col-12 col-md-6">
                    <h5 className="text-muted mb-3">
                      <i className="fas fa-check-circle me-2"></i>
                      Corrected Text
                    </h5>
                    <p className="card-text" style={{ 
                      minHeight: '100px',
                      whiteSpace: 'pre-wrap',
                      backgroundColor: props.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(248, 249, 250, 0.1)',
                      padding: '15px',
                      borderRadius: '10px',
                      backdropFilter: 'blur(5px)',
                      color: props.mode === 'dark' ? 'black' : 'black'
                    }}>{correctedText}</p>
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
