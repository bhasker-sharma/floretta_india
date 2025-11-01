import React, { useState } from 'react';
import { sanitizeHtml, sanitizeText, sanitizeUrl, useSanitizedHtml } from '../utils/sanitize';

/**
 * Example component demonstrating XSS protection using DOMPurify
 * This component shows safe and unsafe rendering patterns
 */
const XSSProtectionExample = () => {
  const [userInput, setUserInput] = useState('');
  const [htmlInput, setHtmlInput] = useState('');

  // Example of potentially malicious inputs
  const xssExamples = [
    {
      name: 'Script Injection',
      input: '<img src=x onerror="alert(\'XSS Attack!\')">',
      description: 'Attempts to execute JavaScript via onerror event'
    },
    {
      name: 'JavaScript URL',
      input: '<a href="javascript:alert(\'XSS!\')">Click me</a>',
      description: 'Attempts to execute JavaScript via href'
    },
    {
      name: 'Iframe Injection',
      input: '<iframe src="javascript:alert(\'XSS!\')"></iframe>',
      description: 'Attempts to load malicious content in iframe'
    },
    {
      name: 'Event Handler',
      input: '<div onmouseover="alert(\'XSS!\')">Hover me</div>',
      description: 'Attempts to execute JavaScript on mouse hover'
    },
    {
      name: 'Safe HTML',
      input: '<p>This is <b>safe</b> HTML with <a href="https://example.com">a link</a></p>',
      description: 'Safe HTML that will be rendered correctly'
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>XSS Protection Examples</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        This component demonstrates how DOMPurify sanitizes user input to prevent XSS attacks.
      </p>

      {/* Example 1: Text Input Sanitization */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Example 1: Text Input Sanitization</h2>
        <p>All HTML tags are stripped from text input:</p>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Try entering HTML like <script>alert('xss')</script>"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <div style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
          <strong>Sanitized output:</strong> {sanitizeText(userInput)}
        </div>
      </div>

      {/* Example 2: HTML Content Sanitization */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Example 2: HTML Content Sanitization</h2>
        <p>Safe HTML tags are allowed, dangerous ones are stripped:</p>
        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          placeholder="Try entering HTML with script tags"
          rows="3"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <div style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
          <strong>Sanitized HTML:</strong>
          <div dangerouslySetInnerHTML={useSanitizedHtml(htmlInput)} />
        </div>
      </div>

      {/* Example 3: XSS Attack Demonstrations */}
      <div style={{ marginBottom: '40px' }}>
        <h2>Example 3: XSS Attack Prevention</h2>
        <p>Click on each example to see how malicious inputs are sanitized:</p>
        {xssExamples.map((example, index) => (
          <div
            key={index}
            style={{
              marginBottom: '20px',
              padding: '15px',
              background: example.name === 'Safe HTML' ? '#e8f5e9' : '#fff3e0',
              borderRadius: '8px',
              border: '1px solid ' + (example.name === 'Safe HTML' ? '#4caf50' : '#ff9800')
            }}
          >
            <h3 style={{ marginTop: 0 }}>{example.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{example.description}</p>

            <div style={{ marginBottom: '10px' }}>
              <strong>Original Input:</strong>
              <pre style={{ background: 'white', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
                {example.input}
              </pre>
            </div>

            <div>
              <strong>Sanitized Output:</strong>
              <div
                style={{ background: 'white', padding: '10px', borderRadius: '4px', minHeight: '40px' }}
                dangerouslySetInnerHTML={useSanitizedHtml(example.input)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Example 4: URL Sanitization */}
      <div style={{ marginBottom: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Example 4: URL Sanitization</h2>
        <p>Dangerous URLs (javascript:, data:) are blocked:</p>
        <div style={{ display: 'grid', gap: '10px' }}>
          {[
            { url: 'https://example.com', safe: true },
            { url: 'javascript:alert("XSS")', safe: false },
            { url: 'data:text/html,<script>alert("XSS")</script>', safe: false },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '10px',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid ' + (item.safe ? '#4caf50' : '#f44336')
              }}
            >
              <div><strong>Input:</strong> {item.url}</div>
              <div><strong>Sanitized:</strong> {sanitizeUrl(item.url) || '(blocked)'}</div>
              <div style={{ fontSize: '12px', color: item.safe ? '#4caf50' : '#f44336' }}>
                {item.safe ? '✓ Safe URL' : '✗ Dangerous URL Blocked'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h2>Usage Guidelines</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><code>sanitizeText()</code> - Use for plain text that should have all HTML stripped</li>
          <li><code>sanitizeHtml()</code> - Use for user-generated HTML with basic formatting</li>
          <li><code>sanitizeRichText()</code> - Use for rich text editors with more HTML tags allowed</li>
          <li><code>sanitizeUrl()</code> - Use for validating URLs before setting href or src attributes</li>
          <li><code>useSanitizedHtml()</code> - React hook for use with dangerouslySetInnerHTML</li>
        </ul>
      </div>
    </div>
  );
};

export default XSSProtectionExample;
