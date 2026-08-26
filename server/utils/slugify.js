export const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const uniqueSlugSuffix = () =>
  Math.random().toString(36).slice(2, 7);
