export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    sitemap: 'https://aquahaulktym.space/sitemap.xml',
    host: 'https://aquahaulktym.space',
  };
}
