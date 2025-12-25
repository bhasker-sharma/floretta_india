/**
 * Converts a string into a URL-friendly slug.
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
export const createSlug = (text) => {
  if (!text) return "";

  // 1. Remove HTML tags
  let stripped = text.toString().replace(/<[^>]*>/g, "");

  // 2. Decode HTML entities (basic)
  stripped = stripped
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "and")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "")
    .replace(/&#39;/g, "");

  return stripped
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

/**
 * Generates a SEO-friendly Blog URL.
 * @param {number|string} id - The blog ID (unused in URL, kept for interface compat)
 * @param {string} title - The blog title
 * @returns {string} - The formatted URL
 */
export const getBlogUrl = (id, title) => {
  const slug = createSlug(title);
  return `/blogs/${slug}`;
};

/**
 * Generates a SEO-friendly Product URL.
 * @param {number|string} id - The product ID (unused in URL)
 * @param {string} name - The product name
 * @returns {string} - The formatted URL
 */
export const getProductUrl = (id, name) => {
  const slug = createSlug(name);
  return `/product/${slug}`;
};

/**
 * Finds an item's ID by matching its slug against the URL slug.
 * @param {Array} items - List of items (products or blogs)
 * @param {string} slug - The slug from the URL
 * @param {string} key - The property name to slugify (title or name)
 * @returns {object|null} - The found item or null
 */
export const getItemBySlug = (items, slug, key = "title") => {
  if (!items || !slug) return null;
  return items.find((item) => createSlug(item[key]) === slug);
};
