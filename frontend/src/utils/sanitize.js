import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The unsanitized HTML string
 * @param {object} config - Optional DOMPurify configuration
 * @returns {string} - Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (dirty, config = {}) => {
  if (!dirty) return '';

  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  };

  return DOMPurify.sanitize(dirty, { ...defaultConfig, ...config });
};

/**
 * Sanitize user input for plain text (strips all HTML)
 * @param {string} dirty - The unsanitized string
 * @returns {string} - Plain text with all HTML removed
 */
export const sanitizeText = (dirty) => {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Sanitize URL to prevent javascript: and data: URL attacks
 * @param {string} url - The URL to sanitize
 * @returns {string} - Sanitized URL or empty string if dangerous
 */
export const sanitizeUrl = (url) => {
  if (!url) return '';

  const sanitized = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  // Block javascript: and data: URLs
  if (sanitized.match(/^(javascript|data|vbscript):/i)) {
    console.warn('Blocked potentially dangerous URL:', url);
    return '';
  }

  return sanitized;
};

/**
 * Sanitize HTML for rich text editors with more permissive rules
 * @param {string} dirty - The unsanitized HTML string
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeRichText = (dirty) => {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'b', 'i', 'em', 'strong', 'u', 's', 'strike',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'title', 'width', 'height',
      'class', 'id',
    ],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Hook for React components to sanitize HTML content
 * @param {string} html - The HTML content to sanitize
 * @param {object} config - Optional DOMPurify configuration
 * @returns {object} - Object with __html property for dangerouslySetInnerHTML
 */
export const useSanitizedHtml = (html, config = {}) => {
  return {
    __html: sanitizeHtml(html, config)
  };
};

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeRichText,
  useSanitizedHtml,
};
