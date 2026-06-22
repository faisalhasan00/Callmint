import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://callmint.ai';
  
  // Base static routes
  const routes = [
    '',
    '/about',
    '/pricing',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Dynamic Platform Routes
  const platformRoutes = [
    'inbound', 'outbound', 'appointment', 'after-hours', 
    'order-confirmation', 'payment', 'lead-qualification',
    'sales', 'support', 'business'
  ].map((slug) => ({
    url: `${baseUrl}/platform/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic Industry Routes
  const industryRoutes = [
    'salons', 'supermarkets', 'real-estate', 'healthcare', 
    'ecommerce', 'education'
  ].map((slug) => ({
    url: `${baseUrl}/industries/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...platformRoutes, ...industryRoutes]
}
