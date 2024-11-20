import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = 'https://remcostoeten.com' // Replace with your domain

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1
		},
		{
			url: `${baseUrl}/docs`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8
		}
		// Add more routes as needed
	]
}
