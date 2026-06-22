import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/settings/', '/customers/', '/call-logs/'],
    },
    sitemap: 'https://callmint.ai/sitemap.xml',
  }
}
